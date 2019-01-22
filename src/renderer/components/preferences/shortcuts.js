import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { ipcRenderer as ipc } from 'electron';
import { setGlobalShortcut } from '../../../shared/actions/settings';
import { DEFAULT_GLOBAL_SHORTCUTS } from '../../../shared/utils/global-shortcuts';
import { getSetting } from '../../../shared/selectors';
import { Grid, LabelWrapper, Input } from './ui-elements';

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

  componentDidMount() {
    const { setGlobalShortcut } = this.props;

    ipc.on('register-global-shortcut', (e, { valid, name, accelerator }) => {
      if (valid) {
        setGlobalShortcut({
          name,
          accelerator
        });
      } else {
        alert('already taken');

        this.setState({
          [name]: this.props.globalShortcuts[name]
        });
      }
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('register-global-shortcut');
  }

  changeInput = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <h3>{t('preferences.shortcuts')}</h3>
        <Grid>
          <div>
            {Object.keys(DEFAULT_GLOBAL_SHORTCUTS).map(shortcutName => (
              <LabelWrapper key={shortcutName}>
                {t(shortcutName)}
                <span
                  onClick={e =>
                    this.setState(
                      {
                        [shortcutName]: DEFAULT_GLOBAL_SHORTCUTS[shortcutName]
                      },
                      () => {
                        setGlobalShortcut({
                          name: shortcutName,
                          accelerator: DEFAULT_GLOBAL_SHORTCUTS[shortcutName]
                        });
                      }
                    )}
                >
                  {t('preferences.reset')}
                </span>

                <Input
                  type="text"
                  name={shortcutName}
                  onChange={e => this.changeInput(e)}
                  onBlur={e =>
                    ipc.send('register-global-shortcut', {
                      name: shortcutName,
                      accelerator: e.target.value
                    })}
                  value={this.state[shortcutName]}
                />
              </LabelWrapper>
            ))}
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
