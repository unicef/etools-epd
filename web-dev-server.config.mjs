/** Use Hot Module replacement by adding --hmr to the start command */
//import proxy from 'koa-proxies';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  nodeResolve: true,
  port: 8080,
  /** Set appIndex to enable SPA routing */
  appIndex: 'index.html',
  basePath: '/epd'
});
