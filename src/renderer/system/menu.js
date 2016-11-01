import { remote } from 'electron';

const { Menu, MenuItem } = remote;
const currentWindow = remote.getCurrentWindow();

export function createMenu(items = []) {
  const menu = new Menu();
  const menuItems = items.map(item => new MenuItem(item));
  menuItems.forEach(item => {
    menu.append(item);
  });
  return menu;
}

export function showContextMenu(items = []) {
  const menu = createMenu(items);
  menu.popup(currentWindow);
}

export function createMenuFromGroups(groups = [], currentGroup, fn) {
  return createMenu(groups.filter(group => !group.isTrash).map(group => {
    if (group.type) {
      return group;
    }
    return {
      label: group.title,
      enabled: group.id !== currentGroup,
      click: () => fn(group.id),
      submenu: group.groups.length > 0 ?
        createMenuFromGroups(
          [{
            ...group,
            title: `Move to ${group.title}`,
            groups: []
          }, {
            type: 'separator'
          }]
          .concat(group.groups), currentGroup, fn) :
        null
    };
  }));
}
