import path from 'path';
import { remote } from 'electron';

const { Menu } = remote;
const currentWindow = remote.getCurrentWindow();

export function createMenu(items = []) {
  return Menu.buildFromTemplate(items.map(item => ({
    ...item,
    icon: item.icon ? path.resolve(__dirname, `../resources/icons/${item.icon}.png`) : null
  })));
}

export function showContextMenu(menu = []) {
  if (Array.isArray(menu)) {
    menu = createMenu(menu);
  }
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

export function createSortMenu(sortDefinition = [], currentMode, onChange) {
  if (sortDefinition.length === 0) {
    throw new Error('Sort definition not found');
  }

  if (!Array.isArray(sortDefinition[0])) {
    sortDefinition = [sortDefinition];
  }

  return sortDefinition.reduce((prev, curr) => {
    return prev.concat(
      curr.map(sort => ({
        type: 'checkbox',
        checked: currentMode === sort.mode,
        label: sort.label,
        enabled: (typeof sort.enabled === 'undefined') ? true : sort.enabled,
        icon: sort.icon,
        click: () => onChange(sort.mode)
      })),
      {
        type: 'separator'
      }
    );
  }, []);
}
