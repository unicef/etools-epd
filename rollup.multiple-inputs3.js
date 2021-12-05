/* eslint-disable max-len */
/**
 * Time: 20s
 * Size: 3.60MB
 * Closest to working - issue with paths not being preserved clashed with the dymanc imports code that we have in place
 */

import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';

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
      'src/components/app-shell/app-shell.js',
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
    plugins: [minifyHTML(), resolve(), copy(copyConfig)],
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
