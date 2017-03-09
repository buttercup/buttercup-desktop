import { remote } from 'electron';

const { Menu } = remote;
const currentWindow = remote.getCurrentWindow();

export function createMenu(items = []) {
  return Menu.buildFromTemplate(items);
}

export function showContextMenu(items = []) {
  const menu = createMenu(items);
  menu.popup(currentWindow);
}

export function createMenuFromGroups(groups = [], currentGroup, fn, allowMoveToSelf = true) {
  return createMenu(
    groups
      .filter(group => {
        if (group.id === currentGroup && allowMoveToSelf === false) {
          return false;
        }
        return !group.isTrash;
      })
      .map(group => {
        if (group.type) {
          return group;
        }
        return {
          label: group.title,
          enabled: (group.id !== currentGroup || group.groups.length > 0),
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
              .concat(group.groups), currentGroup, fn, allowMoveToSelf) :
            null
        };
      })
  );
}
