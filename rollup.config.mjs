import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import {createSpaConfig} from '@open-wc/building-rollup';

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: [
    './src/components/app-shell/app-shell.js',
    './src/components/pages/interventions/intervention-list.js',
    './src/components/pages/page-not-found.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-tabs.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-details/intervention-details.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-results/intervention-results.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-timing/intervention-timing.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-management/intervention-management.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-attachments/intervention-attachments.js',
    './src/components/pages/interventions/intervention-tab-pages/intervention-review/intervention-review.js'
  ]

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});
