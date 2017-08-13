export function noop() {}

export function pick(o, ...props) {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
}

export function encrypt(abc) {
  return new Promise((res, rej) => {
    res(String(abc));
  });
}
