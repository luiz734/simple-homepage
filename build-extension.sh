#!/bin/bash
set -e

get_last_commit_tag() {
    local tags
    tags=$(git tag --points-at HEAD)

    if [ -z "$tags" ]; then
        echo "Error: No tag found on the current commit." >&2
        return 1
    fi

    if [ $(echo "$tags" | wc -l) -gt 1 ]; then
        echo "$tags" | fzf --prompt="Select tag: "
    else
        echo "$tags"
    fi
}

check_repository_state() {
    if [ -n "$(git status --porcelain)" ]; then
        echo "Warning: Uncommitted changes detected."
        echo "These changes will NOT be included in the source archive."
        read -r -p "Proceed anyway? [y/N] " response
        if [[ ! "$response" =~ ^[yY]$ ]]; then
            echo "Operation aborted."
            exit 1
        fi
        printf "\n"
    fi
}

TAG=$(get_last_commit_tag)

# Execute repository check before creating build paths
check_repository_state

PROJECT_NAME="mookbark-$TAG"
BUILD_PATH="/tmp/$PROJECT_NAME"

mkdir -p "$BUILD_PATH/source"
mkdir -p "$BUILD_PATH/extension"

read -r -p "Run npm build? [y/N] " build_response
if [[ "$build_response" =~ ^[yY]$ ]]; then
    npm run build
fi
printf "\n"
cp -r ./dist/* "$BUILD_PATH/extension"

MANIFEST_VERSION=$(grep "\"version" "$BUILD_PATH/extension/manifest.json")
echo "Manifest: $MANIFEST_VERSION"
echo "Git tag: $TAG"

read -r -p "Proceed with build? [y/N] " response
if [[ ! "$response" =~ ^[yY]$ ]]; then
    echo "Operation aborted."
    exit 1
fi
printf "\n"

git archive HEAD | tar -x -C "$BUILD_PATH/source"

(cd "$BUILD_PATH/source" && zip -qr "$BUILD_PATH/source.zip" .) && echo "Source code zipped successfully"
(cd "$BUILD_PATH/extension" && zip -qr "$BUILD_PATH/extension.zip" .) && echo "Extension zipped successfully"