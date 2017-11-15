import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const Input = styled.input`
  border: none;
  outline: none;
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
  color: #222;
`;

class LabelEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.intl.formatMessage({
        id: 'untitled',
        defaultMessage: 'Untitled'
      })
    };
  }

  handleChange(e) {
    this.setState({ title: e.target.value.trim() });
  }

  handleBlur() {
    const { title } = this.state;
    if (title) {
      this.props.onSave(title);
    } else {
      this.props.onDismiss();
    }
  }

  handleKeyUp(e) {
    const { title } = this.state;
    if (e.keyCode === 13 && title) {
      this.props.onSave(title);
    } else if (e.keyCode === 27) {
      this.props.onDismiss();
    }
  }

  componentDidMount() {
    const { node, intl } = this.props;
    const { isNew, title } = node;

    this.setState(
      {
        title: isNew
          ? intl.formatMessage({
              id: 'untitled',
              defaultMessage: 'Untitled'
            })
          : title
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

LabelEditor.propTypes = {
  node: PropTypes.object,
  onDismiss: PropTypes.func,
  onSave: PropTypes.func,
  intl: intlShape.isRequired
};

export default injectIntl(LabelEditor);
