import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Input as BaseInput } from '@buttercup/ui';
import { ipcRenderer as ipc } from 'electron';

import { languages } from '../../../shared/i18n';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

const Grid = styled.section`
  display: grid;
  grid-template-columns: ${props => (props.single ? '1fr' : '1fr 1fr')};
  margin-bottom: 20px;
`;
const Input = styled(BaseInput)`
  font-weight: 300;
  display: inline-block;
  padding: 0 12px;
  border: 2px solid #e4e9f2;
`;
const Checkbox = styled(Input)`
  -webkit-appearance: none;
  background-color: #fafafa;
  border: 1px solid #cacece;
  width: 20px;
  height: 20px;
  padding: 9px;
  border-radius: 3px;
  display: inline-block;
  margin: 0 8px -5px 0;
  position: relative;

  &:checked {
    border: 1px solid #00b7ac;
    background-color: #00b7ac;
    &:after {
      content: '\\2714';
      font-size: 14px;
      position: absolute;
      top: -2px;
      left: 3px;
      color: #fff;
    }
  }
`;

const Select = styled.select`
  font-weight: 300;
  height: auto;
  height: 43px;
  background-color: #fff;
  border: 2px solid #e4e9f2;
  padding: 0 12px;
  border-radius: 4px;
  display: inline-block;
  width: 100%;
  &:focus {
    border-color: #00b7ac;
  }
`;

const LabelWrapper = styled.label`
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  padding: 0;
  text-transform: ${props => (props.checkbox ? 'none' : 'uppercase')};
  font-weight: ${props => (props.checkbox ? 'normal' : 'bold')};
  font-size: 0.75em;
  margin: 0 0 ${props => (props.checkbox ? '0' : '20px')};
  input,
  select {
    margin-top: 4px;
    &[type='text'],
    &[type='number'] {
      display: block;
    }
  }
  span {
    cursor: pointer;
    text-transform: none;
    font-weight: normal;
    margin-left: 10px;
    color: #999;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Content = styled.div`
  height: 100%;
`;

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
    setIsAutoloadingIconsDisabled: PropTypes.func
  };

  state = {
    language: 'en'
  };

  changeInput = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
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
      setIsAutoloadingIconsDisabled
    } = this.props;

    return (
      <Content>
        <h3>{t('preferences.general')}</h3>
        <Grid>
          <div>
            <LabelWrapper checkbox>
              <label>
                <Checkbox
                  type="checkbox"
                  onChange={e => setIsTrayIconEnabled(e.target.checked)}
                  checked={isTrayIconEnabled}
                />
                {t('app-menu.view.enable-tray-icon')}
              </label>
            </LabelWrapper>
          </div>
          <div>
            <LabelWrapper checkbox>
              <label>
                <Checkbox
                  type="checkbox"
                  onChange={e => setCondencedSidebar(e.target.checked)}
                  checked={condencedSidebar}
                />
                {t('app-menu.view.condensed-sidebar')}
              </label>
            </LabelWrapper>
          </div>
          <div>
            <LabelWrapper checkbox>
              <label>
                <Checkbox
                  type="checkbox"
                  onChange={e => setLockArchiveOnMinimize(e.target.checked)}
                  checked={lockArchiveOnMinimize}
                />
                {t('preferences.lock-archive-on-minimize')}
              </label>
            </LabelWrapper>
          </div>
          <div>
            <LabelWrapper checkbox>
              <label>
                <Checkbox
                  type="checkbox"
                  onChange={e =>
                    setIsAutoloadingIconsDisabled(e.target.checked)}
                  checked={isAutoloadingIconsDisabled}
                />
                {t('preferences.disable-autloading-icons')}
              </label>
            </LabelWrapper>
          </div>
        </Grid>
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
            value={autolockSeconds}
          />
        </LabelWrapper>
        <Grid single>
          <LabelWrapper checkbox>
            <label>
              <Checkbox
                type="checkbox"
                onChange={e => setLockArchiveOnFocusout(e.target.checked)}
                checked={lockArchiveOnFocusout}
              />
              {t('preferences.lock-archive-onfocusout')}
            </label>
          </LabelWrapper>
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
      </Content>
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
    lockArchiveOnMinimize: getSetting(state, 'lockArchiveOnMinimize')
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
        dispatch(setSetting('isAutoloadingIconsDisabled', payload))
    };
  }
)(General, 'General');
