/**
 * Platform-aware loader.
 * - navigator: uses NativeModules.LexborModule via JNI
 * - Node.js (Windows X64): uses koffi FFI to load lexbor.dll
 */

let load: (html: string) => any

if (typeof navigator !== 'undefined') {
  ;({ load } = require('cheerio'))
} else {
  // Node.js / Windows X64 - use koffi FFI
  ;({ load } = require('../lib/lexbor/lexbor-wrap'))
}

export default { load }
