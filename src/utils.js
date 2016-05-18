import _ from 'lodash';

const EXIT = {};

export function walk(obj, func) {
  if (_.isArray(obj)) {
    for (const item of obj) {
      if (func(obj, item) === EXIT) {
        return item;
      }
    }

    const results = [];

    for (const item of obj) {
      results.push(walk(item, func));
    }

    return results;
  } else if (_.isObject(obj)) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (func(obj, key, value) === EXIT) {
        return obj;
      }
    }

    const results = [];

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      results.push(walk(value, func));
    }

    return results;
  }

  if (func(obj) === EXIT) {
    return obj;
  }

  return null;
}

export function first(obj, func) {
  return walk(obj, (object, key, value) => {
    if (func(object, key, value)) {
      return EXIT;
    }

    return null;
  });
}

export function all(obj, func) {
  const results = [];

  walk(obj, (object, key, value) => {
    if (func(object, key, value)) {
      return results.push(object);
    }

    return null;
  });

  return results;
}

export function tables(query) {
  return all(query, (obj, key, value) => {
    return key === 'RangeVar';
  });
}

export function byType(query, type) {
  return all(query, (object, key, value) => {
    return key === type;
  });
}

export function clean(tree) {
  walk(tree, (object, key, value) => {
    if (_.isArray(object)) {
      return;
    }

    if (key === 'location') {
      delete object.location;
    }
  });

  return tree;
}
