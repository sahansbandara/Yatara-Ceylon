import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'util'

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
    // @ts-ignore
    global.TextDecoder = TextDecoder
}

// Ensure Request/Response are available
if (typeof global.Request === 'undefined') {
    // whatwg-fetch should load them, but let's be explicit if needed
}
