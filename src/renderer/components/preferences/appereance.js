import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Input as BaseInput } from '@buttercup/ui';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

const Range = styled(BaseInput)`
  display: inline-block;
  padding: 0;
`;

const LabelWrapper = styled.label`
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  text-transform: uppercase;
  font-weight: bold;
  padding: 0;
  font-size: 0.75em;
  margin: 0 0 20px;
  input,
  select {
    margin-top: 4px;
  }
  span {
    cursor: pointer;
    text-transform: none;
    font-weight: normal;
    margin-left: 10px;
    color: #999;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Content = styled.div`
  height: 100%;
`;

class Appereance extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    referenceFontSize: PropTypes.string,
    setReferenceFontSize: PropTypes.func
  };

  render() {
    const { t, referenceFontSize, setReferenceFontSize } = this.props;
    const DEFAULT_FONT_SIZE = '1';

    return (
      <Content>
        <h3>{t('preferences.appereance')}</h3>

        <LabelWrapper>
          {t('preferences.font-size')}{' '}
          {referenceFontSize !== DEFAULT_FONT_SIZE ? (
            <span onClick={e => setReferenceFontSize(DEFAULT_FONT_SIZE)}>
              {t('preferences.reset')}
            </span>
          ) : (
            ''
          )}
          <Range
            className="range-slider"
            bordered
            min="0.5"
            step="0.1"
            max="2"
            onChange={e => setReferenceFontSize(e.target.value)}
            value={referenceFontSize}
            placeholder={t('archive-search.searchterm')}
            type="range"
          />
        </LabelWrapper>
      </Content>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setReferenceFontSize: payload => {
      dispatch(setSetting('referenceFontSize', payload));
    }
  };
};

export default connect(
  state => ({
    referenceFontSize: getSetting(state, 'referenceFontSize')
  }),
  mapDispatchToProps
)(Appereance, 'Appereance');
