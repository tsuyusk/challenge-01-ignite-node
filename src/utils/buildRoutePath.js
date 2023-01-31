// path: '/users/:id',

export function buildRoutePath(path) {
  const routeParamsRegex = /:([a-zA-Z]+)/g;

  // ?<$1> creates a name for the group
  const pathWithParams = path.replaceAll(
    routeParamsRegex,
    '(?<$1>[a-z0-9A-Z\-_]+)'
  )

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}
