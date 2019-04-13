import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { ipcRenderer as ipc } from 'electron';
import { isOSX } from '../../../shared/utils/platform';

import { languages } from '../../../shared/i18n';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

import {
  Grid,
  LabelWrapper,
  Checkbox,
  Input,
  Select
} from './elements/ui-elements';

const DEFAULT_CLIPBOARD_CLEAR_SECONDS = '15';
const DEFAULT_ARCHIVE_CLOSE_SECONDS = '0';

class General extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    locale: PropTypes.string,
    isTrayIconEnabled: PropTypes.any,
    setIsTrayIconEnabled: PropTypes.func,
    condencedSidebar: PropTypes.any,
    setCondencedSidebar: PropTypes.func,
    secondsUntilClearClipboard: PropTypes.any,
    setSecondsUntilClearClipboard: PropTypes.func,
    autolockSeconds: PropTypes.any,
    setAutolockSeconds: PropTypes.func,
    lockArchiveOnMinimize: PropTypes.any,
    setLockArchiveOnMinimize: PropTypes.func,
    lockArchiveOnFocusout: PropTypes.any,
    setLockArchiveOnFocusout: PropTypes.func,
    menubarAutoHide: PropTypes.any,
    setMenubarAutoHide: PropTypes.func,
    updateOnStartDisabled: PropTypes.any,
    setUpdateOnStartDisabled: PropTypes.func
  };

  state = {
    language: 'en'
  };

  render() {
    const {
      t,
      locale,
      isTrayIconEnabled,
      setIsTrayIconEnabled,
      condencedSidebar,
      setCondencedSidebar,
      secondsUntilClearClipboard,
      setSecondsUntilClearClipboard,
      autolockSeconds,
      setAutolockSeconds,
      lockArchiveOnMinimize,
      setLockArchiveOnMinimize,
      lockArchiveOnFocusout,
      setLockArchiveOnFocusout,
      menubarAutoHide,
      setMenubarAutoHide,
      updateOnStartDisabled,
      setUpdateOnStartDisabled
    } = this.props;

    return (
      <div>
        {!isOSX() ? (
          <div>
            <Checkbox
              type="checkbox"
              onChange={setMenubarAutoHide}
              checked={menubarAutoHide}
              title={t('app-menu.view.auto-hide-menubar')}
            />
          </div>
        ) : (
          ''
        )}
        <div style={{ marginBottom: 20 }}>
          <Checkbox
            onChange={setUpdateOnStartDisabled}
            checked={updateOnStartDisabled}
            title={t('preferences.disable-update-on-start')}
          />
          <Checkbox
            onChange={setIsTrayIconEnabled}
            checked={isTrayIconEnabled}
            title={t('app-menu.view.enable-tray-icon')}
          />
          <Checkbox
            type="checkbox"
            onChange={setCondencedSidebar}
            checked={condencedSidebar}
            title={t('app-menu.view.condensed-sidebar')}
          />
          <Checkbox
            type="checkbox"
            onChange={setLockArchiveOnMinimize}
            checked={lockArchiveOnMinimize}
            title={t('preferences.lock-archive-on-minimize')}
          />
        </div>

        <Input
          type="number"
          min="0"
          defaultValue={DEFAULT_CLIPBOARD_CLEAR_SECONDS}
          onChange={e => setSecondsUntilClearClipboard(e.target.value)}
          value={secondsUntilClearClipboard}
          title={t('preferences.seconds-until-clear-clipboard')}
        />

        <Input
          type="number"
          min="0"
          defaultValue={DEFAULT_ARCHIVE_CLOSE_SECONDS}
          onChange={e => setAutolockSeconds(e.target.value)}
          value={autolockSeconds}
          title={t('preferences.seconds-until-archive-should-close')}
        />

        <Grid single>
          <Checkbox
            type="checkbox"
            onChange={setLockArchiveOnFocusout}
            checked={lockArchiveOnFocusout}
            title={t('preferences.lock-archive-onfocusout')}
          />
        </Grid>

        <LabelWrapper>
          <label htmlFor="language">{t('app-menu.view.language')}</label>
          <Select
            id="language"
            value={locale}
            onChange={e => {
              ipc.send('change-locale-main', e.target.value);
              // quick fix to update tray icon translation
              if (isTrayIconEnabled) {
                setIsTrayIconEnabled(!isTrayIconEnabled);
                setIsTrayIconEnabled(isTrayIconEnabled);
              }
            }}
          >
            {Object.keys(languages).map(key => (
              <option key={key} value={key}>
                {languages[key].name}
              </option>
            ))}
          </Select>
        </LabelWrapper>
      </div>
    );
  }
}

export default connect(
  state => ({
    locale: getSetting(state, 'locale'),
    isTrayIconEnabled: getSetting(state, 'isTrayIconEnabled'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    lockArchiveOnFocusout: getSetting(state, 'lockArchiveOnFocusout'),
    secondsUntilClearClipboard: getSetting(state, 'secondsUntilClearClipboard'),
    autolockSeconds: getSetting(state, 'autolockSeconds'),
    lockArchiveOnMinimize: getSetting(state, 'lockArchiveOnMinimize'),
    menubarAutoHide: getSetting(state, 'menubarAutoHide'),
    updateOnStartDisabled: getSetting(state, 'updateOnStartDisabled')
  }),
  dispatch => {
    return {
      setIsTrayIconEnabled: payload =>
        dispatch(setSetting('isTrayIconEnabled', payload)),
      setCondencedSidebar: payload =>
        dispatch(setSetting('condencedSidebar', payload)),
      setSecondsUntilClearClipboard: payload =>
        dispatch(setSetting('secondsUntilClearClipboard', payload)),
      setAutolockSeconds: payload =>
        dispatch(setSetting('autolockSeconds', payload)),
      setLockArchiveOnMinimize: payload =>
        dispatch(setSetting('lockArchiveOnMinimize', payload)),
      setLockArchiveOnFocusout: payload =>
        dispatch(setSetting('lockArchiveOnFocusout', payload)),
      setMenubarAutoHide: payload =>
        dispatch(setSetting('menubarAutoHide', payload)),
      setUpdateOnStartDisabled: payload =>
        dispatch(setSetting('updateOnStartDisabled', payload))
    };
  }
)(General, 'General');
