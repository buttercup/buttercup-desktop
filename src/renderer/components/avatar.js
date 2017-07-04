import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import { GithubPicker } from 'react-color';
import Portal from 'react-portal';
import CogIcon from 'react-icons/lib/md/brush';

const Picker = styled.div`
  position: fixed;
  top: ${props => props.top + 20}px;
  left: ${props => props.left + 5}px;
`;

const CogButton = styled.div`
  color: #fff;
  position: absolute;
  left: -5px;
  top: calc(100% - 5px);
  display: none;

  svg {
    width: 12px;
    height: 12px;
    display: block;
  }
`;

class Avatar extends Component {
  state = {
    isPickerOpen: false,
    top: 0,
    left: 0
  };

  static propTypes = {
    archive: PropTypes.object,
    className: PropTypes.string,
    onUpdate: PropTypes.func
  };

  handleClick = e => {
    e.stopPropagation();
    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = e.target.getBoundingClientRect();
    this.setState({
      isPickerOpen: true,
      top: targetRect.top - bodyRect.top,
      left: targetRect.left - bodyRect.left
    });
  }

  handlePickerClose = () => {
    this.setState({ isPickerOpen: false });
  }

  handleColorChange = color => {
    this.props.onUpdate({
      ...this.props.archive,
      color: color.hex
    });
  }

  render() {
    const { archive, className } = this.props;
    return (
      <div className={className} style={{backgroundColor: archive.color || '#000000'}}>
        <span className="name">
          {capitalize(archive.name.substring(0, 2))}
        </span>
        <CogButton className="cog" onClick={this.handleClick}>
          <CogIcon />
        </CogButton>
        <Portal
          closeOnOutsideClick
          isOpened={this.state.isPickerOpen}
          onClose={this.handlePickerClose}
          >
          <Picker left={this.state.left} top={this.state.top}>
            <GithubPicker triangle="top-left" onChange={this.handleColorChange} />
          </Picker>
        </Portal>
      </div>
    );
  }
}

export default styled(Avatar)`
  width: 3rem;
  height: 3rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, .2);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    .cog {
      display: block;
    }
  }
`;
