export function extractQueryParams(query) {
  return query
    ?.substr(1)
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')

      acc[key] = value

      return acc
    }, {})
}