import { sortBy, at } from 'lodash';
import Fuse from 'fuse.js';
import i18n from '../i18n';

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
    throw new Error(i18n.t('insufficient-data-provided-error'));
  }
  return sortByKey(list, sortKey).map(item => {
    return {
      ...item,
      [childrenKey]: sortDeepByKey(item[childrenKey], sortKey, childrenKey)
    };
  });
}
