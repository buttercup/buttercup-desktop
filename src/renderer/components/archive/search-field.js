import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import SearchIcon from 'react-icons/lib/md/search';
import styles from '../../styles/search-field';

class SearchField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    filter: PropTypes.string,
    t: PropTypes.func
  };

  handleClearClick() {
    if (this.textInput) {
      this.textInput.value = '';
      this.props.onChange('');
    }
  }

  handleKeyUp(e) {
    if (e.which === 27) {
      this.handleClearClick();
      e.target.blur();
    }
  }

  render() {
    const { filter, onChange, t } = this.props;
    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          value={filter}
          onChange={e => onChange(e.target.value)}
          onKeyUp={e => this.handleKeyUp(e)}
          className={styles.field}
          placeholder={t('search.search') + '...'}
          ref={input => {
            this.textInput = input;
          }}
        />
        <span className={styles.icon}>
          <SearchIcon />
        </span>
        {filter !== '' && (
          <span
            className={styles.clear}
            onClick={() => this.handleClearClick()}
          />
        )}
      </div>
    );
  }
}

export default translate()(SearchField);
