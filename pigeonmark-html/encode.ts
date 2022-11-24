import { PMNode } from "pigeonmark-utils"
import { any as build } from "./build-html.js"

/**
 * Given a JsonML element, or a string, render it to a HTML string, suitably escaped and structured
 */
export default function encode (element: PMNode) {
  return [...build(element)].join('')
}
