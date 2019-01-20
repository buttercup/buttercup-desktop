import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

import { Range, LabelWrapper } from './ui-elements';

class Appearance extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    referenceFontSize: PropTypes.string,
    setReferenceFontSize: PropTypes.func
  };

  render() {
    const { t, referenceFontSize, setReferenceFontSize } = this.props;
    const DEFAULT_FONT_SIZE = '1';

    return (
      <div>
        <h3>{t('preferences.appearance')}</h3>

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
      </div>
    );
  }
}

export default connect(
  state => ({
    referenceFontSize: getSetting(state, 'referenceFontSize')
  }),
  dispatch => {
    return {
      setReferenceFontSize: payload => {
        dispatch(setSetting('referenceFontSize', payload));
      }
    };
  }
)(Appearance, 'Appearance');
