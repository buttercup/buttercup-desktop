import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultIcon from '../../styles/img/ic-lock-48px.svg';

const EntryIcon = styled.div`
  height: ${props => (props.big ? '50px' : '30px')}
  width: ${props => (props.big ? '50px' : '30px')}
  
  border-radius: 50%;
  background-color: white;
  border: 3px solid white;
  
  background-image: ${props => `url(${props.icon ? props.icon : defaultIcon})`}
  background-size: 85%;   
  background-repeat: no-repeat;
  background-position: center;
`;

EntryIcon.propTypes = {
  big: PropTypes.bool,
  icon: PropTypes.string
};

export default EntryIcon;
