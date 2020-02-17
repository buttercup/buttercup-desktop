import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

const Translate = props => {
  // init props
  const { html, i18nKey, t, text, children, parent, values = {} } = props;

  let Parent = parent;

  // search translation and pass values
  const translatedText = t(i18nKey, values);

  // replace all found words
  const interpolation = (str, values) => {
    const replaceStr = (s, isChildProp) =>
      s.replace(
        isChildProp ? /%\((.+?)\)/g : /\{\{(.+?)\}\}/g,
        (a, b) => values[b] || a
      );

    if (typeof str === 'object') {
      const concatedChildren = [];
      if (Array.isArray(str)) {
        str.forEach(child => {
          if (typeof child === 'string') {
            concatedChildren.push(replaceStr(child, true));
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
      return translatedText;
    }
  };

  // return html or plain text
  if (html) {
    if (!Parent) {
      Parent = 'span';
    }
    return <Parent dangerouslySetInnerHTML={{ __html: getContent() }} />;
  } else if (Parent) {
    return <Parent>{getContent()}</Parent>;
  }
  return getContent();
};

Translate.propTypes = {
  i18nKey: PropTypes.string,
  parent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ render: PropTypes.func.isRequired })
  ]),
  text: PropTypes.string,
  values: PropTypes.object,
  html: PropTypes.bool,
  t: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array
  ])
};

export default translate()(Translate);
