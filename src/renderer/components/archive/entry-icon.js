import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import extractDomain from 'extract-domain';
import { getIconFilename } from '@buttercup/iconographer';
import defaultIcon from '../../styles/img/no-icon.svg';
import { getEntryURL } from '../../../shared/buttercup/entries';

const IconWrapper = styled.div`
  height: ${props => (props.big ? '45px' : '32px')};
  width: ${props => (props.big ? '45px' : '32px')};
  flex: 0 0 ${props => (props.big ? '45px' : '32px')};

  border-radius: 3px;
  background-color: #fff;
  padding: 2px;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 2px;
  }
`;

class EntryIcon extends PureComponent {
  static propTypes = {
    big: PropTypes.bool,
    entry: PropTypes.object
  };

  state = {
    icon: null
  };

  componentDidMount() {
    const { entry } = this.props;
    if (!entry) {
      return;
    }
    const url = getEntryURL(entry);
    const domain = url ? extractDomain(url) : null;
    this.setState({
      icon: getIconFilename(domain)
    });
  }

  render() {
    const { big } = this.props;
    const { icon } = this.state;
    return (
      <IconWrapper big={big}>
        <img src={icon || defaultIcon} />
      </IconWrapper>
    );
  }
}

export default EntryIcon;
