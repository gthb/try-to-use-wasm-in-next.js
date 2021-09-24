# Getting a Rust-compiled WebAssembly module from wasm-pack working in Next.JS

## Bootstrap a Next app

Run `npx create-next-app` and enter the directory it creates.

## Enable WebAssembly support

Add this in the module exports in `next.config.js`:

```
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
    }
    return config;
  },
```

## Introduce hello-wasm-pack

`yarn add hello-wasm-pack` and try to call it in `index.js`.

Result: an error page with two errors (and corresponding output in `yarn dev`):

```
1 of 2 unhandled errors:

Unhandled Runtime Error

ChunkLoadError: Loading chunk node_modules_next_dist_client_dev_noop_js failed.
(error: http://localhost:3000/_next/static/chunks/fallback/node_modules_next_dist_client_dev_noop_js.js)
Call Stack
__webpack_require__.f.j
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/static/chunks/webpack.js (824:29)
__webpack_require__.e/<
/_next/static/chunks/webpack.js (229:40)
__webpack_require__.e
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/static/chunks/webpack.js (228:67)
createRequire/fn.e
/_next/static/chunks/webpack.js (463:50)
<unknown>
node_modules/next/dist/client/next-dev.js (20:0)
./node_modules/next/dist/client/next-dev.js
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/static/chunks/main.js (589:1)
options.factory
/_next/static/chunks/webpack.js (774:31)
__webpack_require__
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/static/chunks/webpack.js (37:33)
__webpack_exec__
/_next/static/chunks/main.js (1399:61)
<unknown>
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/static/chunks/main.js (1400:53)
<unknown>
webpackJsonpCallback@http://localhost:3000/_next/static/chunks/webpack.js?ts=1632327165178 (1357:46)
<unknown>
/_next/static/chunks/main.js (9:61)
```

```
2 of 2 unhandled errors:

Server Error

SyntaxError: Cannot use import statement outside a module
This error happened while generating the page. Any console logs will be displayed in the terminal window.
Call Stack
<unknown>
file:/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js (2)
wrapSafe
internal/modules/cjs/loader.js (988:16)
Module._compile
internal/modules/cjs/loader.js (1036:27)
Object.Module._extensions..js
internal/modules/cjs/loader.js (1101:10)
Module.load
internal/modules/cjs/loader.js (937:32)
Function.Module._load
internal/modules/cjs/loader.js (778:12)
Module.require
internal/modules/cjs/loader.js (961:19)
require
internal/modules/cjs/helpers.js (92:18)
Object.hello-wasm-pack
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js (86:18)
__webpack_require__
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js (33:42)
eval
webpack-internal:///./pages/index.js (11:73)
```

## Suspect caching error and wipe and retry

`rm -rf .next` locally, as suggested in https://stackoverflow.com/questions/67652612/chunkloaderror-loading-chunk-node-modules-next-dist-client-dev-noop-js-failed for the problem "ChunkLoadError: Loading chunk node_modules_next_dist_client_dev_noop_js failed"

That made the first error go away, but the `Cannot use import statement outside a module` remains.

Output of `yarn dev`:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
event - compiled successfully
error - /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js:2
import * as wasm from './hello_wasm_pack_bg';
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at wrapSafe (internal/modules/cjs/loader.js:988:16)
    at Module._compile (internal/modules/cjs/loader.js:1036:27)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1101:10)
    at Module.load (internal/modules/cjs/loader.js:937:32)
    at Function.Module._load (internal/modules/cjs/loader.js:778:12)
    at Module.require (internal/modules/cjs/loader.js:961:19)
    at require (internal/modules/cjs/helpers.js:92:18)
    at Object.hello-wasm-pack (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js:86:18)
    at __webpack_require__ (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///./pages/index.js:11:73) {
  page: '/'
}
```

Error shown in browser:

```
1 of 1 unhandled error
Server Error

SyntaxError: Cannot use import statement outside a module
This error happened while generating the page. Any console logs will be displayed in the terminal window.
Call Stack
<unknown>
file:/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js (2)
wrapSafe
internal/modules/cjs/loader.js (988:16)
Module._compile
internal/modules/cjs/loader.js (1036:27)
Object.Module._extensions..js
internal/modules/cjs/loader.js (1101:10)
Module.load
internal/modules/cjs/loader.js (937:32)
Function.Module._load
internal/modules/cjs/loader.js (778:12)
Module.require
internal/modules/cjs/loader.js (961:19)
require
internal/modules/cjs/helpers.js (92:18)
Object.hello-wasm-pack
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js (86:18)
__webpack_require__
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js (33:42)
eval
webpack-internal:///./pages/index.js (11:73)
```

## Make hello-wasm-pack say it's an ES module

Manually edit `node_modules/hello-wasm-pack/package.json` to add `"type": "module"`.

Output of `yarn dev`:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
event - compiled successfully
error - Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js
require() of ES modules is not supported.
require() of /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js from /Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js is an ES module file as it is a .js file whose nearest parent p>
Instead rename hello_wasm_pack.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/package.json.

    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1089:13)
    at Module.load (internal/modules/cjs/loader.js:937:32)
    at Function.Module._load (internal/modules/cjs/loader.js:778:12)
    at Module.require (internal/modules/cjs/loader.js:961:19)
    at require (internal/modules/cjs/helpers.js:92:18)
    at Object.hello-wasm-pack (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js:86:18)
    at __webpack_require__ (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///./pages/index.js:11:73)
    at Object../pages/index.js (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js:55:1)
    at __webpack_require__ (/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js:33:42) {
  code: 'ERR_REQUIRE_ESM',
  page: '/'
}
```

Error shown in browser:

```
1 of 1 unhandled error
Server Error

Error: Must use import to load ES Module: /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js
require() of ES modules is not supported.
require() of /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js from /Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js is an ES module file as it is a .js file whose nearest parent p>
Instead rename hello_wasm_pack.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/package.json.
This error happened while generating the page. Any console logs will be displayed in the terminal window.
Call Stack
Object.Module._extensions..js
internal/modules/cjs/loader.js (1089:13)
Module.load
internal/modules/cjs/loader.js (937:32)
Function.Module._load
internal/modules/cjs/loader.js (778:12)
Module.require
internal/modules/cjs/loader.js (961:19)
require
internal/modules/cjs/helpers.js (92:18)
Object.hello-wasm-pack
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js (86:18)
__webpack_require__
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js (33:42)
eval
webpack-internal:///./pages/index.js (11:73)
Object../pages/index.js
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/pages/index.js (55:1)
__webpack_require__
file:/Users/gthb/git/try-to-use-wasm-in-next.js/.next/server/webpack-runtime.js (33:42)
```

## Enable `experimental.esmExternals`

Resolve that last error by telling Next to import the ESM module as an ESM module, with `experimental: { esmExternals: true }` in `next.config.js`

Output of `yarn dev`:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
Failed to parse source map: TypeError: Cannot read property 'line' of undefined
    at Object.getNotFoundError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/parseNotFoundError.js:69:29)
    at Object.getModuleBuildError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/webpackModuleError.js:74:58)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:14:80
    at Array.map (<anonymous>)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:12:79
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:8:17)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33634:14)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:45256:38
    at eval (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:15:1)
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:6:1)
error - ./node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
Module not found: Can't resolve './hello_wasm_pack' in '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack'
Did you mean 'hello_wasm_pack.js'?
BREAKING CHANGE: The request './hello_wasm_pack' failed to resolve only because it was resolved as fully specified
(probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').
The extension in the request is mandatory for it to be fully specified.
Add the extension to the request.
error - unhandledRejection: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg' imported from /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hel>
    at finalizeResolution (internal/modules/esm/resolve.js:285:11)
    at moduleResolve (internal/modules/esm/resolve.js:708:10)
    at Loader.defaultResolve [as _resolve] (internal/modules/esm/resolve.js:819:11)
    at Loader.resolve (internal/modules/esm/loader.js:89:40)
    at Loader.getModuleJob (internal/modules/esm/loader.js:242:28)
    at ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:73:40)
    at link (internal/modules/esm/module_job.js:72:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}
error - Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg' imported from /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_w>
    at finalizeResolution (internal/modules/esm/resolve.js:285:11)
    at moduleResolve (internal/modules/esm/resolve.js:708:10)
    at Loader.defaultResolve [as _resolve] (internal/modules/esm/resolve.js:819:11)
    at Loader.resolve (internal/modules/esm/loader.js:89:40)
    at Loader.getModuleJob (internal/modules/esm/loader.js:242:28)
    at ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:73:40)
    at link (internal/modules/esm/module_job.js:72:36) {
  code: 'ERR_MODULE_NOT_FOUND',
  page: '/'
}
```

## Add `.wasm` extension to the import in `hello_wasm_pack.js`

Manually edit `node_modules/hello-wasm-pack/hello_wasm_pack.js` to add the `.wasm` extension to the import specifier.

Output of `yarn dev`

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
Failed to parse source map: TypeError: Cannot read property 'line' of undefined
    at Object.getNotFoundError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/parseNotFoundError.js:69:29)
    at Object.getModuleBuildError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/webpackModuleError.js:74:58)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:14:80
    at Array.map (<anonymous>)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:12:79
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:8:17)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33634:14)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:45256:38
    at eval (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:15:1)
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:6:1)
error - ./node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
Module not found: Can't resolve './hello_wasm_pack' in '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack'
Did you mean 'hello_wasm_pack.js'?
BREAKING CHANGE: The request './hello_wasm_pack' failed to resolve only because it was resolved as fully specified
(probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').
The extension in the request is mandatory for it to be fully specified.
Add the extension to the request.
error - unhandledRejection: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".wasm" for /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
    at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15)
    at Loader.getFormat (internal/modules/esm/loader.js:105:42)
    at Loader.getModuleJob (internal/modules/esm/loader.js:243:31)
    at async ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:75:21)
    at async Promise.all (index 0)
    at async link (internal/modules/esm/module_job.js:80:9) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
error - TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".wasm" for /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
    at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15)
    at Loader.getFormat (internal/modules/esm/loader.js:105:42)
    at Loader.getModuleJob (internal/modules/esm/loader.js:243:31)
    at async ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:75:21)
    at async Promise.all (index 0)
    at async link (internal/modules/esm/module_job.js:80:9) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION',
  page: '/'
}
```

Error shown in browser:

```
Failed to compile

./node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
Module not found: Can't resolve './hello_wasm_pack' in '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack'
Did you mean 'hello_wasm_pack.js'?
BREAKING CHANGE: The request './hello_wasm_pack' failed to resolve only because it was resolved as fully specified
(probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').
The extension in the request is mandatory for it to be fully specified.
Add the extension to the request.

This error occurred during the build process and can only be dismissed by fixing the error.
```

## Add `.js` extension to the import instruction in `hello_wasm_pack_bg.wasm`

Modify the wasm file locally:

```
wasm2wat node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm \
  | sed 's#"./hello_wasm_pack"#"./hello_wasm_pack.js"#' \
  | wat2wasm - -o tmp.wasm
mv tmp.wasm node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
```

Output of `yarn dev`:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
Failed to parse source map: TypeError: Cannot read property 'line' of undefined
    at Object.getNotFoundError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/parseNotFoundError.js:69:29)
    at Object.getModuleBuildError (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/webpackModuleError.js:74:58)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:14:80
    at Array.map (<anonymous>)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/build/webpack/plugins/wellknown-errors-plugin/index.js:12:79
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:8:17)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33634:14)
    at /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:45256:38
    at eval (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:15:1)
    at Hook.eval [as callAsync] (eval at create (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/compiled/webpack/bundle5.js:33832:10), <anonymous>:6:1)
error - ./node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
Module not found: Can't resolve './hello_wasm_pack' in '/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack'
Did you mean 'hello_wasm_pack.js'?
BREAKING CHANGE: The request './hello_wasm_pack' failed to resolve only because it was resolved as fully specified
(probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').
The extension in the request is mandatory for it to be fully specified.
Add the extension to the request.
error - unhandledRejection: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".wasm" for /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
    at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15)
    at Loader.getFormat (internal/modules/esm/loader.js:105:42)
    at Loader.getModuleJob (internal/modules/esm/loader.js:243:31)
    at async ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:75:21)
    at async Promise.all (index 0)
    at async link (internal/modules/esm/module_job.js:80:9) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
```

## Suspect a caching bug and wipe `.next` again

Looks like Next.js did not update the wasm chunk under `.next` so now `rm -rf .next` again.
    
Sure enough, like Jason Mendoza, now I had a different problem. Output of `yarn dev` is now:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
event - compiled successfully
error - unhandledRejection: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".wasm" for /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
    at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15)
    at Loader.getFormat (internal/modules/esm/loader.js:105:42)
    at Loader.getModuleJob (internal/modules/esm/loader.js:243:31)
    at async ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:75:21)
    at async Promise.all (index 0)
    at async link (internal/modules/esm/module_job.js:80:9) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
error - TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".wasm" for /Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack_bg.wasm
    at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15)
    at Loader.getFormat (internal/modules/esm/loader.js:105:42)
    at Loader.getModuleJob (internal/modules/esm/loader.js:243:31)
    at async ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:75:21)
    at async Promise.all (index 0)
    at async link (internal/modules/esm/module_job.js:80:9) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION',
  page: '/'
}
```

## Enable experimental wasm module loading in Node.js

That last error is Node.js refusing to load WASM modules by default, so now try:

```
NODE_OPTIONS=--experimental-wasm-modules yarn dev
```

That outputs:

```
yarn run v1.22.11
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
event - build page: /
wait  - compiling...
event - compiled successfully
(node:67542) ExperimentalWarning: Importing Web Assembly modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
error - ReferenceError: alert is not defined
    at __wbg_alert_955be295a438967b (file:///Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js:20:5)
    at greet (<anonymous>:wasm-function[1]:0xcd)
    at greet (file:///Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/hello-wasm-pack/hello_wasm_pack.js:26:17)
    at Home (webpack-internal:///./pages/index.js:24:57)
    at processChild (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/react-dom/cjs/react-dom-server.node.development.js:3353:14)
    at resolve (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/react-dom/cjs/react-dom-server.node.development.js:3270:5)
    at ReactDOMServerRenderer.render (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/react-dom/cjs/react-dom-server.node.development.js:3753:22)
    at ReactDOMServerRenderer.read (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/react-dom/cjs/react-dom-server.node.development.js:3690:29)
    at Object.renderToString (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/react-dom/cjs/react-dom-server.node.development.js:4298:27)
    at Object.renderPage (/Users/gthb/git/try-to-use-wasm-in-next.js/node_modules/next/dist/server/render.js:596:45) {
  page: '/'
}
```

## Avoid trying to call `alert` on the server side

The `hello-wasm-pack` example uses `alert` 😢 so make it do `console.log` instead when run in Next's SSR, by manually editing `hello_wasm_pack.js` to replace the `alert` line with:

```
(typeof alert !== 'undefined' ? alert : console.log)(varg0);
```

And now I get the message console-logged from SSR and alerted (twice, because React) in the browser.
