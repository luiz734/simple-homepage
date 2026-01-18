import * as tailwindPlugin from "prettier-plugin-tailwindcss";
import * as sveltePlugin from "prettier-plugin-svelte";

/** @type {import('prettier').Config} */
export default {
    tabWidth: 4,
    plugins: [{ ...sveltePlugin }, { ...tailwindPlugin }],
};
