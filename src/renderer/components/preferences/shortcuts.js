import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { ipcRenderer as ipc } from 'electron';
import { setGlobalShortcut } from '../../../shared/actions/settings';
import { DEFAULT_GLOBAL_SHORTCUTS } from '../../../shared/utils/global-shortcuts';
import { getSetting } from '../../../shared/selectors';
import { Grid } from './elements/ui-elements';
import ShortcutInput, {
  createShortcutObjectFromString,
  createShortcutStringFromObject
} from './elements/shortcut-input';
import * as eva from 'eva-icons';

class Items extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    list: PropTypes.array,
    globalShortcuts: PropTypes.object,
    changeInput: PropTypes.func
  };

  render() {
    const { list, t, changeInput, globalShortcuts } = this.props;

    return list.map(shortcutName => {
      return (
        <ShortcutInput
          key={shortcutName}
          defaultShortcut={createShortcutObjectFromString(
            DEFAULT_GLOBAL_SHORTCUTS[shortcutName]
          )}
          shortcut={createShortcutObjectFromString(
            globalShortcuts[shortcutName]
          )}
          title={t(shortcutName) + ' - ' + globalShortcuts[shortcutName]}
          onBlur={shortcut => {
            ipc.send('register-global-shortcut', {
              name: shortcutName,
              accelerator: createShortcutStringFromObject(shortcut)
            });

            changeInput(shortcut, createShortcutStringFromObject(shortcut));
          }}
          onReset={shortcut => {
            ipc.send('register-global-shortcut', {
              name: shortcutName,
              accelerator: DEFAULT_GLOBAL_SHORTCUTS[shortcutName]
            });

            changeInput(shortcut, createShortcutStringFromObject(shortcut));
          }}
        />
      );
    });
  }
}

class Shortcuts extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    globalShortcuts: PropTypes.object,
    setGlobalShortcut: PropTypes.func
  };

  state = {
    ...DEFAULT_GLOBAL_SHORTCUTS,
    ...this.props.globalShortcuts
  };

  changeInput = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  componentDidMount() {
    const { t, setGlobalShortcut } = this.props;

    ipc.on(
      'register-global-shortcut',
      (e, { valid, name, accelerator: acc }) => {
        let accelerator = acc;
        if (valid) {
          setGlobalShortcut({
            name,
            accelerator
          });
        } else {
          accelerator = this.props.globalShortcuts[name];

          alert(t('preferences.shortcut-already-taken'));
        }

        this.setState({
          [name]: accelerator
        });
      }
    );

    eva.replace();
  }

  componentWillUnmount() {
    ipc.removeAllListeners('register-global-shortcut');
  }

  render() {
    const { t } = this.props;
    const { preferences, menu, others } = Object.keys(
      DEFAULT_GLOBAL_SHORTCUTS
    ).reduce(
      (pre, current) => {
        if (current.startsWith('app-menu.')) {
          pre.menu = pre.menu.concat(current);
        } else if (current.startsWith('preferences.')) {
          pre.preferences = pre.preferences.concat(current);
        } else {
          pre.others = pre.others.concat(current);
        }
        return pre;
      },
      {
        preferences: [],
        menu: [],
        others: []
      }
    );

    return (
      <div>
        <Grid gap={20}>
          <div>
            <h3>
              <i data-eva="globe-2-outline" width="24" />
              {t('preferences.shortcuts-global')}
            </h3>
            <Items
              list={preferences}
              t={t}
              globalShortcuts={this.state}
              changeInput={this.changeInput}
            />

            <h3>
              <i data-eva="compass-outline" width="24" />
              {t('preferences.shortcuts-others')}
            </h3>
            <Items
              list={others}
              t={t}
              globalShortcuts={this.state}
              changeInput={this.changeInput}
            />
          </div>

          <div>
            <h3>
              <i data-eva="menu-arrow-outline" width="24" />
              {t('preferences.shortcuts-menu')}
            </h3>
            <Items
              list={menu}
              t={t}
              globalShortcuts={this.state}
              changeInput={this.changeInput}
            />
          </div>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => ({
    globalShortcuts: getSetting(state, 'globalShortcuts')
  }),
  {
    setGlobalShortcut
  }
)(Shortcuts, 'Shortcuts');
