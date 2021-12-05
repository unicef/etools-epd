/* eslint-disable max-len */
/**
 * Done in 8s
 * Bundle size 2.74 MB
 * Issues:
 * 1. After build app-shell.js path changes and is not updated in index.html => Used @web/rollup-plugin-html to fix this and added index.html as entrypoint.
 * Possible issue with node_modules import from index.html being re-writen and the files imported moved to assets folder with hash in their name.
 * webcomponent-loader without other scrips.
 * 2. Issues with the NON-static paths for dynamicallly imported components(part of the code splitting/lazy loading functionality).
 * This code becomes defunct because the folder structure doesn't exist anymore after build. All files are at the same level.
 * 3. Code doesn't seem to be entirelly there, missing code
 * 4. Minification not working in this case
 */

import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import html from '@web/rollup-plugin-html';

const copyConfig = {
  targets: [
    {src: 'node_modules/@webcomponents/shadycss', dest: 'rollup-inputs/node_modules/@webcomponents'},
    {
      src: 'node_modules/web-animations-js/web-animations-next-lite.min.js',
      dest: 'rollup-inputs/node_modules/web-animations-js'
    },
    {src: 'node_modules/leaflet/dist/leaflet.js', dest: 'rollup-inputs/node_modules/leaflet/dist'},
    {src: 'node_modules/leaflet/dist/leaflet.css', dest: 'rollup-inputs/node_modules/leaflet/dist'},
    {src: 'node_modules/leaflet/dist/images/marker-icon.png', dest: 'rollup-inputs/node_modules/leaflet/dist/images'},
    {
      src: 'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
      dest: 'rollup-inputs/node_modules/leaflet.markercluster/dist'
    },
    {
      src: 'node_modules/focus-visible/dist/focus-visible.min.js',
      dest: 'rollup-inputs/node_modules/focus-visible/dist'
    },
    {src: 'node_modules/dayjs/dayjs.min.js', dest: 'rollup-inputs/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/utc.js', dest: 'rollup-inputs/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/isBetween.js', dest: 'rollup-inputs/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/isSameOrBefore.js', dest: 'rollup-inputs/node_modules/dayjs'},
    {
      src: 'src/components/pages/interventions/intervention-tab-pages/assets/i18n',
      dest: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/assets'
    },
    {src: 'images', dest: 'rollup-inputs'},
    {src: 'assets', dest: 'rollup-inputs'}
  ]
};

const configs = [
  {
    input: [
      'index.html',
      'src/components/pages/not-found.js',
      'src/components/pages/interventions/intervention-list.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js',
      'src/components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'
    ],
    output: {
      dir: 'rollup-inputs',
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      format: 'es'
    },
    plugins: [html(), minifyHTML(), resolve(), copy(copyConfig)],
    preserveEntrySignatures: false
  }
];

for (const config of configs) {
  if (process.env.NODE_ENV !== 'development') {
    config.plugins.push(terser());
  }
  config.plugins.push(filesize());
}

export default configs;
