/**
 * Code changed to use Static paths for dynamic imports => rollup should do the code splitting automatically
 * Time: 14s; Size 2.86 MB
 */
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';

const copyConfig = {
  targets: [
    {src: 'manifest.json', dest: 'rollup'},
    {src: 'version.json', dest: 'rollup'},
    {src: 'node_modules/@webcomponents/webcomponentsjs/**', dest: 'rollup/node_modules/@webcomponents/webcomponentsjs'},
    {src: 'node_modules/@webcomponents/shadycss', dest: 'rollup/node_modules/@webcomponents'},
    {
      src: 'node_modules/web-animations-js/web-animations-next-lite.min.js',
      dest: 'rollup/node_modules/web-animations-js'
    },
    {src: 'node_modules/leaflet/dist/leaflet.js', dest: 'rollup/node_modules/leaflet/dist'},
    {src: 'node_modules/esri-leaflet/dist/esri-leaflet.js', dest: 'rollup/node_modules/esri-leaflet/dist'},
    {
      src: 'node_modules/@mapbox/leaflet-omnivore/leaflet-omnivore.min.js',
      dest: 'rollup/node_modules/@mapbox/leaflet-omnivore/'
    },
    {src: 'node_modules/leaflet/dist/leaflet.css', dest: 'rollup/node_modules/leaflet/dist'},
    {src: 'node_modules/leaflet/dist/images/marker-icon.png', dest: 'rollup/node_modules/leaflet/dist/images'},
    {
      src: 'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
      dest: 'rollup/node_modules/leaflet.markercluster/dist'
    },
    {
      src: 'node_modules/focus-visible/dist/focus-visible.min.js',
      dest: 'rollup/node_modules/focus-visible/dist'
    },
    {src: 'node_modules/dayjs/dayjs.min.js', dest: 'rollup/node_modules/dayjs'},
    {src: 'node_modules/dayjs/plugin/utc.js', dest: 'rollup/node_modules/dayjs/plugin'},
    {src: 'node_modules/dayjs/plugin/isBetween.js', dest: 'rollup/node_modules/dayjs/plugin'},
    {src: 'node_modules/dayjs/plugin/isSameOrBefore.js', dest: 'rollup/node_modules/dayjs/plugin'},
    {src: 'node_modules/dayjs/plugin/isSameOrAfter.js', dest: 'rollup/node_modules/dayjs/plugin'},
    {
      src: 'src/components/pages/interventions/intervention-tab-pages/assets/i18n',
      dest: 'rollup/src/components/pages/interventions/intervention-tab-pages/assets'
    },
    {
      src: 'node_modules/@unicef-polymer/etools-unicef/src/etools-icons/icons/**',
      dest: 'rollup/src/icons'
    },
    {src: 'images', dest: 'rollup'},
    {src: 'assets', dest: 'rollup'},
    {src: 'index.html', dest: 'rollup'}
  ]
};

const config = {
  input: 'src/app-shell.js',
  output: {
    dir: 'rollup/src',
    format: 'es'
  },
  plugins: [minifyHTML(), copy(copyConfig), resolve()],
  preserveEntrySignatures: false
};

if (process.env.NODE_ENV !== 'development') {
  config.plugins.push(terser());
}

export default config;
