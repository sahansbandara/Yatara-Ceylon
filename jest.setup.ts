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

// Polyfill HTMLFormElement.prototype.requestSubmit for jsdom
if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function (submitter?: HTMLElement) {
        if (submitter) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
            this.dispatchEvent(submitEvent)
        } else {
            this.submit()
        }
    }
}
