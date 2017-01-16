import React, { Component, PropTypes } from 'react';
import { generate, generateWords } from 'buttercup-generator';
import Popover from 'react-popover';
// import cx from 'classnames';
import styles from '../styles/generator';
import Button from './button';

class Generator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      type: 'characters',
      length: 20,
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
        <pre className={styles.password}>{this.state.currentPassword}</pre>
        <input type="radio" checked={this.state.type === 'characters'} onChange={() => this.changeType('characters')}/> Characters<br/>
        <input type="radio" checked={this.state.type === 'words'} onChange={() => this.changeType('words')}/> Words<br/>
        {this.state.type === 'characters' && <fieldset className={styles.set}>
          <legend>Options</legend>
          <input type="range" value={this.state.length} min="10" max="30" onChange={e => this.changeLength(e)}/><br/>
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
    return (
      <Popover isOpen={this.state.isOpen} body={this.renderBody()} preferPlace="below">
        <div onClick={() => {
          this.setState({isOpen: !this.state.isOpen});
        }}>
          {this.props.children}
        </div>
      </Popover>
    );
  }
}

Generator.propTypes = {
  children: PropTypes.node,
  onGenerate: PropTypes.func.isRequired,
  autoClose: PropTypes.bool
};

export default Generator;
