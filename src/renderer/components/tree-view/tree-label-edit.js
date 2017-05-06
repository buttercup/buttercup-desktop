import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  border: none;
  outline: none;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, .2);
  box-sizing: border-box;
  color: #fff;
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
    if (e.keyCode === 13) {
      this.props.onSave(this.state.title);
    } else if (e.keyCode === 27) {
      this.props.onDismiss();
    }
  }

  componentDidMount() {
    const { isNew, title } = this.props.node;

    this.setState({
      title: isNew ? 'Untitled' : title
    }, () => {
      if (this._input) {
        this._input.focus();
        this._input.select();
      }
    });
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
