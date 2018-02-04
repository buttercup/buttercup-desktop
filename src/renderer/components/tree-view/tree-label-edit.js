import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';

const Input = styled.input`
  border: none;
  outline: none;
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
  color: #222;
`;

class LabelEditor extends PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
    onDismiss: PropTypes.func,
    onSave: PropTypes.func,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      title: this.props.t('group.untitled')
    };
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
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
    const { node, t } = this.props;
    const { isNew, title } = node;

    this.setState(
      {
        title: isNew ? t('group.untitled') : title
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

export default translate()(LabelEditor);
