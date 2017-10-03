import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  border: none;
  outline: none;
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
  color: #222;
`;

export default class LabelEditor extends Component {
  static propTypes = {
    node: PropTypes.object,
    onDismiss: PropTypes.func,
    onSave: PropTypes.func
  };

  state = {
    title: 'Untitled'
  };

  handleBlur() {
    this.props.onDismiss();
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleKeyUp(e) {
    const title = this.state.title.trim();
    if (e.keyCode === 13 && title !== '') {
      this.props.onSave(title);
    } else if (e.keyCode === 27) {
      this.props.onDismiss();
    }
  }

  componentDidMount() {
    const { isNew, title } = this.props.node;

    this.setState(
      {
        title: isNew ? 'Untitled' : title
      },
      () => {
        if (this._input) {
          this._input.focus();
          this._input.select();
        }
      }
    );
  }

  render() {
    return (
      <Input
        value={this.state.title}
        onChange={e => this.handleChange(e)}
        onKeyUp={e => this.handleKeyUp(e)}
        onBlur={e => this.handleBlur(e)}
        innerRef={c => {
          this._input = c;
        }}
      />
    );
  }
}
