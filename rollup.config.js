/**
 * Code changed to use Static paths for dynamic imports => rollup should do the code splitting automatically
 * Time: 14s; Size 2.86 MB
 */
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
// import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';
import path from 'path';
import { generateSW } from 'rollup-plugin-workbox';
import { workboxConfig } from './workbox-config.js';

// Files to remove before doing new src
const deleteConfig = {
  targets: ['src/*']
};

// Extra files to copy in src directory ./src
const copyConfig = {
  targets: [
    { src: 'manifest.json', dest: 'src' },
    { src: 'version.json', dest: 'src' },
    { src: 'node_modules/@webcomponents/webcomponentsjs/**', dest: 'src/node_modules/@webcomponents/webcomponentsjs' },
    { src: 'node_modules/@webcomponents/shadycss', dest: 'src/node_modules/@webcomponents' },
    {
      src: 'node_modules/web-animations-js/web-animations-next-lite.min.js',
      dest: 'src/node_modules/web-animations-js'
    },
    { src: 'node_modules/leaflet/dist/leaflet.js', dest: 'src/node_modules/leaflet/dist' },
    { src: 'node_modules/esri-leaflet/dist/esri-leaflet.js', dest: 'src/node_modules/esri-leaflet/dist' },
    {
      src: 'node_modules/@mapbox/leaflet-omnivore/leaflet-omnivore.min.js',
      dest: 'src/node_modules/@mapbox/leaflet-omnivore/'
    },
    { src: 'node_modules/leaflet/dist/leaflet.css', dest: 'src/node_modules/leaflet/dist' },
    { src: 'node_modules/leaflet/dist/images/marker-icon.png', dest: 'src/node_modules/leaflet/dist/images' },
    {
      src: 'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
      dest: 'src/node_modules/leaflet.markercluster/dist'
    },
    {
      src: 'node_modules/focus-visible/dist/focus-visible.min.js',
      dest: 'src/node_modules/focus-visible/dist'
    },
    { src: 'node_modules/dayjs/dayjs.min.js', dest: 'src/node_modules/dayjs' },
    { src: 'node_modules/dayjs/plugin/utc.js', dest: 'src/node_modules/dayjs/plugin' },
    { src: 'node_modules/dayjs/plugin/isBetween.js', dest: 'src/node_modules/dayjs/plugin' },
    { src: 'node_modules/dayjs/plugin/isSameOrBefore.js', dest: 'src/node_modules/dayjs/plugin' },
    { src: 'node_modules/dayjs/plugin/isSameOrAfter.js', dest: 'src/node_modules/dayjs/plugin' },
    {
      src: 'src_ts/components/pages/interventions/intervention-tab-pages/assets/i18n',
      dest: 'src/src/components/pages/interventions/intervention-tab-pages/assets'
    },
    {
      src: 'node_modules/@unicef-polymer/etools-unicef/src/etools-icons/icons/**',
      dest: 'src/node_modules/@unicef-polymer/etools-unicef/src/etools-icons/icons'
    },
    { src: 'images', dest: 'src' },
    { src: 'assets', dest: 'src' },
    { src: 'index.html', dest: 'src' }
  ]
};

// Extract license comments in separate file LICENSE.txt
const licenseConfig = {
  thirdParty: {
    output: path.join(__dirname, 'src', 'LICENSE.txt'),
    includePrivate: true,
  },
};

// Used for minify JS
const terserConfig = {
  format: {
    comments: false
  }
};

const typescriptConfig = {
  compilerOptions: {
    outDir: "src/src"
  }
};

const importMetaUrlCurrentModulePlugin = () => {
  return {
    name: 'import-meta-url-current-module',
    resolveImportMeta(property, { moduleId }) {
      if (property === 'url') {
        return `new URL('${path.relative(
          process.cwd(),
          moduleId
        )}', document.baseURI).href`;
      }
      return null;
    }
  };
}

const config = {
  input: 'src_ts/app-shell.ts',
  output: {
    dir: 'src/src',
    format: 'es'
  },
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  plugins: [
    importMetaUrlCurrentModulePlugin(),
    del(deleteConfig),
    resolve(),
    typescript(typescriptConfig),
    license(licenseConfig),
    terser(terserConfig),
    copy(copyConfig),
    generateSW(workboxConfig)
  ],
  preserveEntrySignatures: false
};

export default config;
