export default function(logPrefix) {
  return {
    debug: msg => console.log(`DEBUG: ${logPrefix ? `[${logPrefix}] ` : ''}${msg}`),
    info: msg => console.log(`INFO: ${logPrefix ? `[${logPrefix}] ` : ''}${msg}`),
    error: msg => console.log(`ERROR: ${logPrefix ? `[${logPrefix}] ` : ''}${msg}`),
  }
}
