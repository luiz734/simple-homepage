import * as tailwindPlugin from "prettier-plugin-tailwindcss";
import * as sveltePlugin from "prettier-plugin-svelte";

/** @type {import('prettier').Config} */
export default {
  plugins: [{ ...sveltePlugin }, { ...tailwindPlugin }],
};
