import type { PMXMLPI } from '../types'

export function xmlpi (name: string, attributes: object): PMXMLPI {
  return [`?${name}`, { ...attributes }]
}

export default xmlpi