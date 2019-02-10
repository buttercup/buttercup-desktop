import PropTypes from 'prop-types';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Icomoon from '../styles/font/icomoon.woff';

export const IconStyles = createGlobalStyle`
  @font-face {
    font-family: 'icomoon';
    src: url(${Icomoon}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;

const icons = {
  'document-file-bcup': '\\e943',
  document: '\\e900',
  folder: '\\e901',
  'document-file-numbers': '\\e902',
  'document-file-pages': '\\e903',
  'document-file-app': '\\e904',
  'document-file-png': '\\e905',
  'document-file-pdf': '\\e906',
  'document-file-mp3': '\\e907',
  'document-file-mp4': '\\e908',
  'document-file-mov': '\\e909',
  'document-file-jpg': '\\e90a',
  'document-file-key': '\\e90b',
  'document-file-html': '\\e90c',
  'document-file-css': '\\e90d',
  'document-file-java': '\\e90e',
  'document-file-psd': '\\e90f',
  'document-file-ai': '\\e910',
  'document-file-bmp': '\\e911',
  'document-file-dwg': '\\e912',
  'document-file-eps': '\\e913',
  'document-file-tiff': '\\e914',
  'document-file-ots': '\\e915',
  'document-file-php': '\\e916',
  'document-file-py': '\\e917',
  'document-file-c': '\\e918',
  'document-file-sql': '\\e919',
  'document-file-rb': '\\e91a',
  'document-file-cpp': '\\e91b',
  'document-file-tga': '\\e91c',
  'document-file-dxf': '\\e91d',
  'document-file-doc': '\\e91e',
  'document-file-odt': '\\e91f',
  'document-file-xls': '\\e920',
  'document-file-docx': '\\e921',
  'document-file-ppt': '\\e922',
  'document-file-asp': '\\e923',
  'document-file-ics': '\\e924',
  'document-file-dat': '\\e925',
  'document-file-xml': '\\e926',
  'document-file-yml': '\\e927',
  'document-file-h': '\\e928',
  'document-file-exe': '\\e929',
  'document-file-avi': '\\e92a',
  'document-file-odp': '\\e92b',
  'document-file-dotx': '\\e92c',
  'document-file-xlsx': '\\e92d',
  'document-file-ods': '\\e92e',
  'document-file-pps': '\\e92f',
  'document-file-dot': '\\e930',
  'document-file-txt': '\\e931',
  'document-file-rtf': '\\e932',
  'document-file-m4v': '\\e933',
  'document-file-flv': '\\e934',
  'document-file-mpg': '\\e935',
  'document-file-qt': '\\e936',
  'document-file-mid': '\\e937',
  'document-file-3gp': '\\e938',
  'document-file-aiff': '\\e939',
  'document-file-aac': '\\e93a',
  'document-file-wav': '\\e93b',
  'document-file-zip': '\\e93c',
  'document-file-ott': '\\e93d',
  'document-file-tgz': '\\e93e',
  'document-file-dmg': '\\e93f',
  'document-file-iso': '\\e940',
  'document-file-rar': '\\e941',
  'document-file-gif': '\\e942'
};

const IconWrapper = styled.i`
  font-family: 'icomoon' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:before {
    content: '${p => p.code}'
  }
`;

const Icon = ({ name, size = 32 }) => {
  if (!(name in icons)) {
    name = document;
  }

  return <IconWrapper code={icons[name]} style={{ fontSize: `${size}px` }} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Icon;
