import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

class Shortcuts extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <h3>{t('preferences.shortcuts')}</h3>
        shortcuts
      </div>
    );
  }
}

export default connect()(Shortcuts, 'Shortcuts');
