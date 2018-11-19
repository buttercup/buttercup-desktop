import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { PureComponent } from 'react';

const Content = styled.div`
  height: 100%;
`;

class General extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  state = {
    fontSize: 13,
    language: 'en'
  };

  changeInput = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };

  render() {
    const { t } = this.props;
    const { fontSize } = this.state;

    return (
      <Content>
        <h3>{t('preferences.appereance')}</h3>
      </Content>
    );
  }
}

export default General;
