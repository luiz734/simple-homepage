#!/bin/bash

git clone https://github.com/luiz734/simple-homepage
cd simple-homepage || exit
npm install && npm run build
echo 'Built in /dist'
