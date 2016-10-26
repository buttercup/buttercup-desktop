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
