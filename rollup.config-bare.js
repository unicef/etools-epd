// https://lit-element.polymer-project.org/guide/build

import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';

const copyConfig = {
  targets: [
    {src: 'node_modules/@webcomponents/shadycss', dest: 'rollup-bare/node_modules/@webcomponents'},
    {
      src: 'node_modules/web-animations-js/web-animations-next-lite.min.js',
      dest: 'rollup-bare/node_modules/web-animations-js'
    },
    {src: 'node_modules/dayjs/dayjs.min.js', dest: 'rollup-bare/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/utc.js', dest: 'rollup-bare/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/isBetween.js', dest: 'rollup-bare/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/isSameOrBefore.js', dest: 'rollup-bare/node_modules/dayjs'},
    {
      src: 'src/components/pages/interventions/intervention-tab-pages/assets/i18n',
      dest: 'rollup-bare/src/components/pages/interventions/intervention-tab-pages/assets'
    },
    {src: 'images', dest: 'rollup-bare'},
    {src: 'assets', dest: 'rollup-bare'},
    {src: 'index.html', dest: 'rollup-bare'}
  ]
};

// The main JavaScript bundle for modern browsers that support
// JavaScript modules and other ES2015+ features.
const config = {
  input: './src/components/app-shell/app-shell.js',
  output: {
    dir: 'rollup-bare',
    format: 'es'
  },
  plugins: [minifyHTML(), copy(copyConfig), resolve(), terser()],
  preserveEntrySignatures: false
};

// if (process.env.NODE_ENV !== 'development') {
//   config.plugins.push(terser());
// }

export default config;
