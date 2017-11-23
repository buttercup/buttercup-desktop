import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import i18n from './index';

const Translate = props => {
  // init props
  const {
    html,
    i18nKey,
    t,
    text,
    children,
    parent: Parent = 'span',
    values = {}
  } = props;

  console.log(props);

  // search translation and pass values
  const translatedText = t(i18nKey, values);
  let foundComponents = false;
  const concatedChildren = [];

  // replace all found words
  const interpolation = (str, values) => {
    const replaceStr = s => s.replace(/%\((.+?)\)/g, (a, b) => values[b] || a);

    if (typeof str === 'object') {
      if (Array.isArray(str)) {
        str.forEach(child => {
          if (typeof child === 'string') {
            concatedChildren.push(replaceStr(child));
          } else {
            concatedChildren.push(interpolation(child, values));
          }
        });
      } else {
        return str;
      }
      return concatedChildren;
    }
    return replaceStr(str);
  };

  // get translation or key or text text
  const getContent = () => {
    if (text || children) {
      return translatedText === i18nKey
        ? interpolation(text || children, values)
        : translatedText;
    } else {
      return i18nKey;
    }
  };

  console.log(concatedChildren);

  // return html or plain text
  return foundComponents ? (
    <Parent dangerouslySetInnerHTML={{ __html: getContent() }} />
  ) : (
    <Parent>{getContent()}</Parent>
  );
};

Translate.propTypes = {
  i18nKey: PropTypes.string,
  parent: PropTypes.string,
  text: PropTypes.string,
  values: PropTypes.object,
  html: PropTypes.bool,
  t: PropTypes.func
};

export default translate()(Translate);
