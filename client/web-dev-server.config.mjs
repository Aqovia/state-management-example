// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import { fromRollup, rollupAdapter } from "@web/dev-server-rollup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from '@rollup/plugin-replace';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/',
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
    browser: true
  },
  
  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex: './index.html',

  plugins: [
    rollupAdapter(json()),
    fromRollup(commonjs)({
      ignoreDynamicRequires: true,
      requireReturnsDefault: true
    }),
    fromRollup(replace)({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'globalThis.process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  mimeTypes: {
    // serve all json files as js
    '**/*.json': 'js',
  },

  // See documentation for all available options
  port: 4004
});
