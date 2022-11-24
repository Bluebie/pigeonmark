/**
 * HTML codec, transforms JsonML format in to compact HTML, and vice versa
 */
export const handles = ['text/html']
export const extensions = ['html', 'htm']

export { default as decode } from "./decode.js"
export { default as encode } from "./encode.js"
