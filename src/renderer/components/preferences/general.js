import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { ipcRenderer as ipc } from 'electron';
import { isOSX } from '../../../shared/utils/platform';

import { languages } from '../../../shared/i18n';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

import { Grid, LabelWrapper, Checkbox, Input, Select } from './ui-elements';

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
    isAutoloadingIconsDisabled: PropTypes.any,
    setIsAutoloadingIconsDisabled: PropTypes.func,
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
      isAutoloadingIconsDisabled,
      setIsAutoloadingIconsDisabled,
      menubarAutoHide,
      setMenubarAutoHide,
      updateOnStartDisabled,
      setUpdateOnStartDisabled
    } = this.props;

    return (
      <div>
        <h3>{t('preferences.general')}</h3>

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
        <div>
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
          <Checkbox
            type="checkbox"
            onChange={setIsAutoloadingIconsDisabled}
            checked={isAutoloadingIconsDisabled}
            title={t('preferences.disable-autoloading-icons')}
          />
        </div>
        <LabelWrapper>
          {t('preferences.seconds-until-clear-clipboard')}{' '}
          {secondsUntilClearClipboard !== DEFAULT_CLIPBOARD_CLEAR_SECONDS ? (
            <span
              onClick={e =>
                setSecondsUntilClearClipboard(DEFAULT_CLIPBOARD_CLEAR_SECONDS)}
            >
              {t('preferences.reset')}
            </span>
          ) : (
            ''
          )}
          <Input
            type="number"
            min="0"
            onChange={e => setSecondsUntilClearClipboard(e.target.value)}
            onBlur={e => setSecondsUntilClearClipboard(e.target.value || '0')}
            value={secondsUntilClearClipboard}
          />
        </LabelWrapper>

        <LabelWrapper>
          {t('preferences.seconds-until-archive-should-close')}{' '}
          {autolockSeconds !== DEFAULT_ARCHIVE_CLOSE_SECONDS ? (
            <span
              onClick={e => setAutolockSeconds(DEFAULT_ARCHIVE_CLOSE_SECONDS)}
            >
              {t('preferences.reset')}
            </span>
          ) : (
            ''
          )}
          <Input
            type="number"
            min="0"
            onChange={e => setAutolockSeconds(e.target.value)}
            onBlur={e => setAutolockSeconds(e.target.value || '0')}
            value={autolockSeconds}
          />
        </LabelWrapper>
        <Grid single>
          <Checkbox
            type="checkbox"
            onChange={setLockArchiveOnFocusout}
            checked={lockArchiveOnFocusout}
            title={t('preferences.lock-archive-onfocusout')}
          />
        </Grid>

        <LabelWrapper>
          {t('app-menu.view.language')}
          <Select
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
    isAutoloadingIconsDisabled: getSetting(state, 'isAutoloadingIconsDisabled'),
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
      setIsAutoloadingIconsDisabled: payload =>
        dispatch(setSetting('isAutoloadingIconsDisabled', payload)),
      setMenubarAutoHide: payload =>
        dispatch(setSetting('menubarAutoHide', payload)),
      setUpdateOnStartDisabled: payload =>
        dispatch(setSetting('updateOnStartDisabled', payload))
    };
  }
)(General, 'General');
