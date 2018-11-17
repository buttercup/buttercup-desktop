import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Input as BaseInput } from '@buttercup/ui';
import { languages } from '../../../shared/i18n';
import { ipcRenderer as ipc } from 'electron';

const Input = styled(BaseInput)`
  font-weight: 300;
  display: inline-block;
  padding: 0 12px;
`;

const Select = styled.select`
  font-weight: 300;
  height: auto;
  height: 43px;
  background-color: #fff;
  border: 2px solid #e4e9f2;
  padding: 0 12px;
  border-radius: 4px;
  display: inline-block;
  width: 100%;
  &:focus {
    border-color: #00b7ac;
  }
`;

const LabelWrapper = styled.label`
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75em;
  margin: 0 0 20px;
  input,
  select {
    margin-top: 4px;
  }
`;

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
        <h3>{t('preferences.general')}</h3>

        <LabelWrapper>
          font size
          <Input
            bordered
            onChange={e => this.changeInput(e, 'fontSize')}
            value={fontSize}
            placeholder={t('archive-search.searchterm')}
            type="number"
            searchTerm={fontSize}
          />
        </LabelWrapper>

        <LabelWrapper>
          language
          <Select
            onChange={e => {
              ipc.send('change-locale-main', e.target.value);
            }}
          >
            {Object.keys(languages).map(key => (
              <option key={key} value={key}>
                {languages[key].name}
              </option>
            ))}
          </Select>
        </LabelWrapper>
      </Content>
    );
  }
}

export default General;
