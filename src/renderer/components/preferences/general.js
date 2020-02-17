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
} from './components/ui-elements';

// to prevent large repetitive code blocks
const generalData = {
  fields: [
    'isTrayIconEnabled',
    'condencedSidebar',
    'secondsUntilClearClipboard',
    'autolockSeconds',
    'lockArchiveOnMinimize',
    'lockArchiveOnFocusout',
    'menubarAutoHide',
    'updateOnStartDisabled'
  ],
  generateFnName: name => 'set' + name.charAt(0).toUpperCase() + name.slice(1),
  get propTypes() {
    return this.fields.reduce(
      (prev, current) => ({
        ...prev,
        [current]: PropTypes.any,
        [this.generateFnName(current)]: PropTypes.func
      }),
      {}
    );
  },
  mapStateToProps(state) {
    return this.fields.reduce(
      (prev, current) => ({
        ...prev,
        [current]: getSetting(state, current)
      }),
      {}
    );
  },
  mapDispatchToProps(dispatch) {
    return this.fields.reduce(
      (prev, current) => ({
        ...prev,
        [this.generateFnName(current)]: payload =>
          dispatch(setSetting(current, payload))
      }),
      {}
    );
  }
};

class General extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    locale: PropTypes.string,
    // generate propTypes
    ...generalData.propTypes
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
        <div style={{ marginBottom: 15 }}>
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
          defaultValue={15}
          onChange={e =>
            setSecondsUntilClearClipboard(parseInt(e.target.value, 10))
          }
          value={secondsUntilClearClipboard}
          title={t('preferences.seconds-until-clear-clipboard')}
        />

        <Input
          type="number"
          min="0"
          defaultValue={0}
          onChange={e => setAutolockSeconds(parseInt(e.target.value, 10))}
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
    // generate props from array
    ...generalData.mapStateToProps(state)
  }),
  dispatch => {
    return {
      // generate prop functions from array
      ...generalData.mapDispatchToProps(dispatch)
    };
  }
)(General, 'General');
