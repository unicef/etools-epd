// INFO
// - it works only if the dynamic imports are specified statically
// - generates 11 chunks : app-shell and the ones listed in manualChunks,
// - the bundle is smaller than in the other tries: 1.20MB
// - everything is perfectly minified without errors(like the case of using open-wc/rollup-build)
// - all chunks are loaded on accessing the app (lazy-loading has dissappeared somehow)
// - THERE ARE SOME STYLE ISSUES and some translations that don't work!!!

/* eslint-disable max-len */
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser'; // Plugin to minify generated es bundle
import minifyHTML from 'rollup-plugin-minify-html-literals'; // Minify HTML, CSS inside Javascript template literal strings
import html from '@open-wc/rollup-plugin-html';

export default {
  input: './index.html', // './src/components/app-shell/app-shell.js',
  output: {
    dir: 'rollup-manualChunks',
    format: 'es',
    manualChunks: {
      'intervention-list': ['./src/components/pages/interventions/intervention-list.js'],
      'page-not-found': ['./src/components/pages/page-not-found.js'],
      'intervention-tabs': ['./src/components/pages/interventions/intervention-tab-pages/intervention-tabs.js'],
      'intervention-details': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-details/intervention-details.js'
      ],
      'intervention-results': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-results/intervention-results.js'
      ],
      'intervention-timing': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js'
      ],
      'intervention-management': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-management/intervention-management.js'
      ],
      'intervention-attachments': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js'
      ],
      'intervention-review': [
        './src/components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'
      ]
    }
  },
  plugins: [html(), resolve(), minifyHTML(), terser()]
};
