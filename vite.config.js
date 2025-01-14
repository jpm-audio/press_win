// https://vite.dev/config/

import packageJson from './package.json';

/** @type {import('vite').UserConfig} */
export default {
  // root: './',
  base: '',
  // publicDir: './public',
  // cacheDir: "node_modules/.vite",
  // envDir: "./",
  mode: 'development', // 'development' | 'production'
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  // plugins: [],
  resolve: {
    alias: {
      '@': '/src',
    },
    // deduple:[],
    // conditions:[],
    // mainFields:[],
    // extensions:[],
    // preserveSymlinks:false
  },
  css: {
    // modules:{},
    // postcss:{},
    // preprocessorOptions: {},
    // preprocessorMaxWorkers: 0
    devSourcemap: true,
    // transformer: 'postcss', //'postcss' | 'lightningcss'
  },
  json: {
    // namedExports:true
    // stringify:false
  },
  // esbuild:{},
  // assetsInclude:['**/*.gltf'],
  // logLevel: 'info', //'info' | 'warn' | 'error' | 'silent'
  // customLogger:{},
  // clearScreen: true,
  // envPrefix:'VITE_',
  // appType: 'spa',
  server: {
    host: 'localhost',
    port: 5173,
    // origin: 'http://127.0.0.1:5173', // Defines the origin of the generated asset URLs during development.
    // strictPort: false,
    // https: false,
    // open: true, // [boolean | string] URL's pathname / process.env.BROWSER (e.g. firefox) / process.env.BROWSER_ARGS (e.g. --incognito)
    // proxy: {},
    // cors:true, // This is enabled by default and allows any origin
    // headers: OutgoingHttpHeaders // Specify server response headers
    // hmr: true,
    // warmup: {
    //  clientFiles:[],
    //  ssrFiles:[],
    // },
    // watch:null,
    // middlewareMode: false,
    fs: {
      stric: true, // Restrict serving files outside of workspace root.
      //vallow: ['..'], // e.g. Allow serving files from one level up to the project root
      // deny: [], // Blocklist for sensitive files being restricted to be served
      // cachedChecks: false, // Caches filenames of accessed directories to avoid repeated filesystem operations.
    },
    // sourcemapIgnoreList:(sourcePath, sourcemapPath) {
    // return sourcePath.includes('node_modules')
    // },
  },
  build: {
    // target:'modules',
    // modulePreload: { polyfill: true },
    // polyfillModulePreload: true,
    outDir: 'dist', // Specify the output directory (relative to project root).
    assetsDir: 'assets', // Specify the directory to nest generated assets under (relative to build.outDir. This is not used in Library Mode).
    assetsInlineLimit: 4096, // Imported or referenced assets that are smaller than this threshold will be inlined as base64 URLs to avoid extra http requests. Set to 0 to disable inlining altogether.
    cssCodeSplit: false, // Enable CSS code splitting. If disabled, all CSS in the entire project will be extracted into a single CSS file.
    // cssTarget: 'module', // This option allows users to set a different browser target for CSS minification from the one used for JavaScript transpilation.
    //cssMinify: 'esbuild', // This option allows users to override CSS minification. Default: the same as build.minify
    // sourcemap: false, // boolean | 'inline' | 'hidden'
    rollupOptions: {},
    // commonjsOptions: {},
    // dynamicImportVarsOptions: {},
    // lib: {},
    // manifest: false,
    // ssrManifest: false,
    // ssr: false,
    // ssrEmitAssets: false,
    minify: 'esbuild', //false, // Set to false to disable minification, or specify the minifier to use.
    // terserOptions: {},
    // write: true,
    emptyOutDir: true, // Vite will empty the outDir on build if it is inside project root.
    // copyPublicDir: true, // Vite will copy files from the publicDir into the outDir on build.
    reportCompressedSize: true, // Enable/disable gzip-compressed size reporting.
    // chunkSizeWarningLimit: 500 // Limit for chunk size warnings (in kB).
    // watch: null // Set to {} to enable rollup watcher.
  },
  preview: {
    // host: 'localhost', // Default to server.host
    // port: 4173,
    // strictPort: false. // Default to server.strictPort
    // https: false, // Default to server.https
    // open: true, // Default to server.open
    // proxy: {}, // Default to server.proxy
    // cors: true, // Default to server.cors
    // headers: OutgoingHttpHeaders // Specify server response headers.
  },
  optimizeDeps: {
    entries: [], // Vite will crawl all your .html files to detect dependencies that need to be pre-bundled.
    //exclude: [], // Dependencies to exclude from pre-bundling.
    //include: [], // By default, linked packages not inside node_modules are not pre-bundled. Use this option to force a linked package to be pre-bundled.
    esbuildOptions: {
      minify: true,
      keepNames: true,
    }, // Options to pass to esbuild during the dep scanning and optimization.
    //force: false, // Set to true to force dependency pre-bundling, ignoring previously cached optimized dependencies.
    //holdUntilCrawlEnd: true, // When enabled, it will hold the first optimized deps results until all static imports are crawled on cold start.
    //needsInterop: [], // Forces ESM interop when importing these dependencies.
  },
};
