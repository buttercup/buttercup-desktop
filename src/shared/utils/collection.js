import { sortBy, at } from 'lodash';
import i18n from '../i18n';

export function sortByKey(list, sortKey) {
  const [key, order] = sortKey.split('-');
  if (!key || !order) {
    return list;
  }
  const sorted = sortBy(list, o => at(o, key).map(item => item.toLowerCase()));
  return order === 'asc' ? sorted : sorted.reverse();
}

export function sortByLastAccessed(list) {
  return sortBy(list, o => o.lastAccessed).reverse();
}

export function sortDeepByKey(list, sortKey, childrenKey) {
  if (!sortKey || !childrenKey) {
    throw new Error(i18n.t('error.insufficient-data-provided'));
  }
  return sortByKey(list, sortKey).map(item => {
    return {
      ...item,
      [childrenKey]: sortDeepByKey(item[childrenKey], sortKey, childrenKey)
    };
  });
}
