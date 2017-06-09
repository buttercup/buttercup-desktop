import { sortBy, at } from 'lodash';
import Fuse from 'fuse.js';

export function filterByText(list, filterText) {
  if (filterText === '' || !filterText) {
    return list;
  }

  const fuse = new Fuse(list, {
    keys: ['properties.title', 'properties.username']
  });
  return fuse.search(filterText);
}

export function sortByKey(list, sortKey) {
  const [key, order] = sortKey.split('-');
  if (!key || !order) {
    return list;
  }
  const sorted = sortBy(list, o => at(o, key));
  return order === 'asc' ? sorted : sorted.reverse();
}

export function sortByLastAccessed(list) {
  return sortBy(list, o => o.lastAccessed).reverse();
}

export function sortDeepByKey(list, sortKey, childrenKey) {
  if (!sortKey || !childrenKey) {
    throw new Error('Insufficient data provided for sorting');
  }
  return sortByKey(list, sortKey).map(item => {
    return {
      ...item,
      [childrenKey]: sortDeepByKey(item[childrenKey], sortKey, childrenKey)
    };
  });
}

export function deepFilter(list, key, fn) {
  return list
    .filter(fn)
    .map(item => ({
      ...item,
      [key]: deepFilter(item[key], key, fn)
    }));
}

export function deepMap(list, key, fn) {
  return list
    .map(fn)
    .map(item => ({
      ...item,
      [key]: deepMap(item[key], key, fn)
    }));
}

export function deepAdd(list, id, key, newItem) {
  if (id === null) {
    return [
      newItem,
      ...list
    ];
  }
  return list.map(item => {
    return {
      ...item,
      [key]: (item.id === id)
        ? [newItem, ...item[key]]
        : deepAdd(item[key], id, key, newItem)
    };
  });
}

export function deepFindById(list, id, key) {
  if (!Array.isArray(list)) {
    return null;
  }

  for (const item of list) {
    if (item.id === id) {
      return item;
    }
    const resultInChild = deepFindById(item[key], id, key);
    if (resultInChild !== null) {
      return resultInChild;
    }
  }
  return null;
}
