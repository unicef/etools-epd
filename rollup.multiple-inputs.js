/* eslint-disable max-len */
/**
 * The goal is to preserve the paths by specifying specific outputs (for the dyamic imports)
 * Issues
 * 1. app-shell has to be in src/components/app-shell to math path for imports specified in app.js
 * 2. It doesn't work:Failed to execute 'define' on 'CustomElementRegistry': the name "dom-module" has already been used with this registry.
 * Components are being duplicated in each output and the bundle size is greater than the one done with polymer build
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
    {src: 'assets', dest: 'rollup-inputs'},
    {src: 'index.html', dest: 'rollup-inputs'}
  ]
};

const configs = [
  {
    input: ['src/components/app-shell/app-shell.js'],
    output: {
      dir: 'rollup-inputs/src/components/app-shell',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve(), copy(copyConfig)],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/not-found.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/not-found.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-list.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-list.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-tabs.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-metadata/intervention-metadata.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-progress/intervention-progress.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-strategy/intervention-strategy.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-workplan/intervention-workplan.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: [
      'src/components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
    ],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
    preserveEntrySignatures: false
  },
  {
    input: ['src/components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'],
    output: {
      file: 'rollup-inputs/src/components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js',
      format: 'es'
    },
    plugins: [minifyHTML(), resolve()],
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
