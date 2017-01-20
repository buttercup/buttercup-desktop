import React, { Component, PropTypes } from 'react';
import MagicIcon from 'react-icons/lib/fa/magic';
import { generate, generateWords } from 'buttercup-generator';
import Popover from 'react-popover';
import cx from 'classnames';
import { selectElementContents } from '../system/utils';
import styles from '../styles/generator';
import Button from './button';

class Generator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      type: 'characters',
      length: 30,
      symbols: true,
      numbers: true,
      letters: true,
      memorable: false,
      currentPassword: ''
    };
  }

  componentDidMount() {
    this.generatePassword();
  }

  generatePassword() {
    let password;
    if (this.state.type === 'words') {
      password = generateWords();
    } else {
      password = generate(this.state.length, {
        symbols: this.state.symbols,
        letters: this.state.letters,
        numbers: this.state.numbers,
        memorable: this.state.memorable
      });
    }
    this.setState({
      currentPassword: password
    });
  }

  toggleOption(propName) {
    this.setState({[propName]: !this.state[propName]}, () => {
      this.generatePassword();
    });
  }

  changeLength(e) {
    this.setState({length: parseInt(e.target.value, 10)}, () => {
      this.generatePassword();
    });
  }

  changeType(type) {
    this.setState({type}, () => {
      this.generatePassword();
    });
  }

  onGenerate() {
    const { onGenerate, autoClose = true } = this.props;
    if (onGenerate) {
      onGenerate(this.state.currentPassword);
    }
    if (autoClose) {
      this.setState({
        isOpen: false
      });
    }
  }

  renderBody() {
    return (
      <div className={styles.wrapper}>
        <pre
          className={styles.password}
          role="content"
          onClick={e => selectElementContents(e.target)}
          >{this.state.currentPassword}</pre>
        <div className={styles.types}>
          <label>
            <input
              type="radio"
              checked={this.state.type === 'characters'}
              onChange={() => this.changeType('characters')}
              /> Characters <small>(Recommended)</small>
          </label>
          <label>
            <input
              type="radio"
              checked={this.state.type === 'words'}
              onChange={() => this.changeType('words')}
              /> Words
          </label>
        </div>
        {this.state.type === 'characters' && <fieldset className={styles.set}>
          <legend>Options</legend>
          <label className={styles.rangeLabel}>
            <input
              type="range"
              value={this.state.length}
              min="10"
              max="50"
              onChange={e => this.changeLength(e)}
              />
            <span>{this.state.length}</span>
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.letters}
              onChange={() => this.toggleOption('letters')}
              /> Letters
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.numbers}
              onChange={() => this.toggleOption('numbers')}
              /> Numbers
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.state.memorable}
              checked={this.state.symbols}
              onChange={() => this.toggleOption('symbols')}
              /> Symbols
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.memorable}
              onChange={() => this.toggleOption('memorable')}
              /> Memorable
          </label>
        </fieldset>}
        <div className={styles.buttons}>
          <Button onClick={() => this.generatePassword()} primary>Generate</Button>
          <Button onClick={() => this.onGenerate()} dark>Use This</Button>
        </div>
      </div>
    );
  }

  render() {
    const { className, activeClassName } = this.props;
    return (
      <Popover isOpen={this.state.isOpen} body={this.renderBody()} preferPlace="below">
        <div
          className={cx(className, this.state.isOpen ? activeClassName : null)}
          onClick={() => {
            this.setState({
              isOpen: !this.state.isOpen
            });
          }}
          >
          <MagicIcon/>
        </div>
      </Popover>
    );
  }
}

Generator.propTypes = {
  children: PropTypes.node,
  onGenerate: PropTypes.func.isRequired,
  autoClose: PropTypes.bool,
  className: PropTypes.any,
  activeClassName: PropTypes.any
};

export default Generator;
