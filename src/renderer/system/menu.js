import path from 'path';
import { remote } from 'electron';
import capitalize from 'lodash/capitalize';
import { copyToClipboard, openUrl } from './utils';
import i18n from '../../shared/i18n';

const { Menu } = remote;
const currentWindow = remote.getCurrentWindow();

export function createMenu(items = []) {
  return Menu.buildFromTemplate(
    items.map(item => ({
      ...item,
      icon: item.icon
        ? path.resolve(__dirname, `../resources/icons/${item.icon}.png`)
        : null
    }))
  );
}

export function showContextMenu(menu = [], async = true) {
  if (Array.isArray(menu)) {
    menu = createMenu(menu);
  }
  menu.popup(currentWindow, {
    async
  });
}

export function createMenuFromGroups(
  groups = [],
  currentGroup,
  fn,
  allowMoveToSelf = true
) {
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
          enabled: group.id !== currentGroup || group.groups.length > 0,
          click: () => fn(group.id),
          submenu:
            group.groups.length > 0
              ? createMenuFromGroups(
                  [
                    {
                      ...group,
                      title: i18n.t('group-menu.move-to-group-custom', {
                        title: group.title
                      }),
                      groups: []
                    },
                    {
                      type: 'separator'
                    }
                  ].concat(group.groups),
                  currentGroup,
                  fn,
                  allowMoveToSelf
                )
              : null
        };
      })
  );
}

export function createSortMenu(sortDefinition = [], currentMode, onChange) {
  if (sortDefinition.length === 0) {
    throw new Error(i18n.t('error.sort-definition-not-found'));
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
        enabled: typeof sort.enabled === 'undefined' ? true : sort.enabled,
        icon: sort.icon,
        click: () => onChange(sort.mode)
      })),
      { type: 'separator' }
    );
  }, []);
}

export function createCopyMenu(entry, currentEntry) {
  const showKeys = currentEntry && currentEntry.id === entry.id;
  const url = entry.meta.find(meta => /^url$/i.test(meta.key));
  const meta = entry.meta.filter(meta => meta !== url);
  const props = [
    {
      label: i18n.t('entry-menu.username'),
      accelerator: showKeys ? 'CmdOrCtrl+B' : null,
      click: () => copyToClipboard(entry.properties.username)
    },
    {
      label: i18n.t('entry-menu.password'),
      accelerator: showKeys ? 'CmdOrCtrl+C' : null,
      click: () => copyToClipboard(entry.properties.password)
    }
  ];

  // If URL is found, include it
  if (url) {
    props.push({
      label: 'URL',
      click: () => copyToClipboard(url.value)
    });
  }

  const menu = [
    {
      label: i18n.t('entry-menu.copy-to-clipboard'),
      submenu: [
        ...props,
        { type: 'separator' },
        ...meta.map(meta => ({
          label: capitalize(meta.key),
          click: () => copyToClipboard(meta.value)
        }))
      ]
    }
  ];

  if (url) {
    menu.push({
      label: i18n.t('entry-menu.open-url-in-browser'),
      click: () => openUrl(url.value)
    });
  }

  return menu;
}
