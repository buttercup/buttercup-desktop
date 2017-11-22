import React from 'react';
import PropTypes from 'prop-types';
import i18n from './index';

const Translate = props => {
  // init props
  const {
    html,
    i18nKey,
    defaultText,
    parent: Parent = 'span',
    values = {}
  } = props;

  // search translation and pass values
  const translatedText = i18n.t(i18nKey, values);

  // replace all found words
  const interpolation = (str, values) => {
    return str.replace(/\{\{(.*?)\}\}/g, (a, b) => values[b] || '');
  };

  // get translation or key or default text
  const getContent = () => {
    if (defaultText) {
      return translatedText === i18nKey
        ? interpolation(defaultText, values)
        : translatedText;
    } else {
      return i18nKey;
    }
  };

  // return html or plain text
  return html ? (
    <Parent dangerouslySetInnerHTML={{ __html: getContent() }} />
  ) : (
    <Parent>{getContent()}</Parent>
  );
};

Translate.propTypes = {
  i18nKey: PropTypes.string,
  parent: PropTypes.string,
  defaultText: PropTypes.string,
  values: PropTypes.object,
  html: PropTypes.bool
};

export default Translate;
