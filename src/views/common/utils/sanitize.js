export function sanitize(params, lookup = ["All", "", null, undefined]) {
  return Object.keys(params).reduce((acc, key) => {
    const value = params[key];

    if (lookup.includes(value)) {
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}
