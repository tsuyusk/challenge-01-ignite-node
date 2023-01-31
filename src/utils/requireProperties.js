export function requireProperties(object, requiredProperties) {
  for (const requiredProperty of requiredProperties) {
    if (!Boolean(object[requiredProperty])) {
      throw new Error(`Missing a required property: ${requiredProperty}`)
    }
  }
}
