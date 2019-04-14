// thanks to kap
// https://github.com/wulkano/kap/blob/master/renderer/components/preferences/shortcut-input.js
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { LabelWrapper, ResetButton } from './ui-elements';
import { isOSX } from '../../../../shared/utils/platform';
import { Translate } from '../../../../shared/i18n';

const Span = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #dddddd;
  height: 20px;
  min-width: 20px;
  padding: 0 4px;
  fomt-weight: 300;
  margin-right: 2px;
  box-sizing: border-box;
`;

const ShortcutInputWrapper = styled(LabelWrapper)`
  display: block;
  label {
    display: block;
  }
  input {
    display: inline-block;
    width: 1px;
    outline: none !important;
    border: none;
    background: transparent;
  }
  .invalid:focus-within {
    border-color: red;
  }
`;

const Box = styled.div`
  position: relative;
  padding: 1px 1px;
  border: 1px solid #ddd;
  height: 33px;
  cursor: text;
  display: flex;
  box-sizing: border-box;

  font-weight: 300;
  padding: 7px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #e4e9f2;
  width: 100%;
  &:focus-within {
    border-color: var(--brand-primary);
  }
`;

const Key = ({ children }) => <Span>{children}</Span>;

Key.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

/**
 * create a shortcut object from a shortcut string to use it with the shortcut input fied
 * @param {string} shortcutStr
 */
export const createShortcutObjectFromString = shortcutStr => {
  try {
    const splittedShortcut = shortcutStr.toLowerCase().split('+');

    const inArray = str => splittedShortcut.indexOf(str) !== -1;

    const shortcutObj = {
      metaKey: inArray('cmd') || false,
      altKey: inArray('alt') || false,
      ctrlKey: inArray('ctrl') || false,
      shiftKey: inArray('shift') || false,
      character: splittedShortcut[splittedShortcut.length - 1] || ''
    };

    // check if two commands are set and use cmd on mac and control on windows and linux
    if (inArray('cmdorctrl') || inArray('commandorcontrol')) {
      shortcutObj[isOSX() ? 'metaKey' : 'ctrlKey'] = true;
    }

    return shortcutObj;
  } catch (e) {
    return {
      metaKey: false,
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      character: ''
    };
  }
};

/**
 * create a shortcut string from a shortcut object to use it in libs like mousetrap
 * @param {object} shortcutObj
 */
export const createShortcutStringFromObject = shortcutObj => {
  const shortcutArr = [];

  if (!shortcutObj) {
    return '';
  }

  if (shortcutObj.metaKey) {
    shortcutArr.push('Cmd');
  }
  if (shortcutObj.altKey) {
    shortcutArr.push('Alt');
  }
  if (shortcutObj.ctrlKey) {
    shortcutArr.push('Ctrl');
  }
  if (shortcutObj.shiftKey) {
    shortcutArr.push('Shift');
  }
  if (shortcutObj.character) {
    shortcutArr.push(shortcutObj.character);
  }

  return shortcutArr.join('+');
};

export default class ShortcutInput extends React.Component {
  state = {
    metaKey: (this.props.shortcut && this.props.shortcut.metaKey) || false,
    altKey: (this.props.shortcut && this.props.shortcut.altKey) || false,
    ctrlKey: (this.props.shortcut && this.props.shortcut.ctrlKey) || false,
    shiftKey: (this.props.shortcut && this.props.shortcut.shiftKey) || false,
    character: (this.props.shortcut && this.props.shortcut.character) || ''
  };

  handleKeyDown = event => {
    event.preventDefault();

    if (event.keyCode === 9) {
      return;
    }

    const CORRECT_KEYS = {
      188: 44, // comma
      190: 46 // dot
    };

    const { metaKey, altKey, ctrlKey, shiftKey, keyCode } = event;
    const correctKeyCode = CORRECT_KEYS[keyCode] || keyCode;

    const INVALID_KEYS = [17, 16, 91, 8, 18];
    const character = INVALID_KEYS.includes(correctKeyCode)
      ? ''
      : String.fromCharCode(correctKeyCode);
    this.setState({ metaKey, altKey, ctrlKey, shiftKey, character });
  };

  get isValid() {
    const { metaKey, altKey, ctrlKey, shiftKey, character } = this.state;

    if (
      ![metaKey, altKey, ctrlKey, shiftKey].includes(true) ||
      character.length === 0
    ) {
      return false;
    }

    return true;
  }

  get isEmpty() {
    const { metaKey, altKey, ctrlKey, shiftKey, character } = this.state;

    return ![metaKey, altKey, ctrlKey, shiftKey, character].some(Boolean);
  }

  store = event => {
    if (event.keyCode === 9) {
      return;
    }

    if (this.isValid) {
      this.props.onBlur(this.state);
    }
  };

  renderKeys = () => {
    const { metaKey, altKey, ctrlKey, shiftKey, character } = this.state;
    const keys = [
      metaKey && (isOSX() ? '⌘' : '⊞'),
      altKey && (isOSX() ? '⌥' : 'Alt'),
      ctrlKey && (isOSX() ? '⌃' : 'Ctrl'),
      shiftKey && '⇧',
      character
    ].filter(Boolean);

    return keys.map(key => <Key key={key}>{key}</Key>);
  };

  clearShortcut = () => {
    this.setState(
      this.props.defaultShortcut || {
        metaKey: false,
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        character: ''
      }
    );
    this.props.onReset(this.props.defaultShortcut);
  };

  handleBlur = () => {
    if (!this.isValid) {
      this.clearShortcut();
    } else {
      this.props.onBlur(this.state);
    }
  };

  inputRef = React.createRef();

  render() {
    const { tabIndex, title, onChange, defaultShortcut, shortcut } = this.props;
    const className = classNames('box', {
      invalid: !this.isEmpty && !this.isValid
    });

    return (
      <ShortcutInputWrapper>
        <label>{title}</label>
        <Box
          className={className}
          onClick={() => this.inputRef.current.focus()}
        >
          {this.renderKeys()}
          <input
            ref={this.inputRef}
            tabIndex={tabIndex}
            onKeyUp={this.store}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur || (e => onChange(e))}
            onChange={onChange}
          />
        </Box>
        {createShortcutStringFromObject(defaultShortcut) !==
        createShortcutStringFromObject(shortcut) ? (
          <ResetButton
            type="button"
            tabIndex={tabIndex}
            onClick={this.clearShortcut}
          >
            <Translate i18nKey="preferences.reset" />
          </ResetButton>
        ) : (
          ''
        )}
      </ShortcutInputWrapper>
    );
  }
}

ShortcutInput.propTypes = {
  shortcut: PropTypes.object,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onBlur: PropTypes.func,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  defaultShortcut: PropTypes.object
};
