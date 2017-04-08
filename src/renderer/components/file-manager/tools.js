import { PropTypes } from 'react';
import styled from 'styled-components';

function buildStyle(props) {
  const output = {};

  if (props.align) {
    output['align-items'] = props.align;
  }
  if (props.justify) {
    output['justify-content'] = props.justify;
  }
  if (props.flexAuto) {
    output.flex = '1 1 auto';
  }
  if (props.flexColumn) {
    output['flex-direction'] = 'column';
  }
  if (props.wrap) {
    output['flex-wrap'] = 'wrap';
  }
  if (props.width) {
    output.width = props.width;
  }

  const res = Object.keys(output).reduce((str, key) => {
    return str + `${key}: ${output[key]};`;
  }, '');
  return res;
}

export const Flex = styled.div`
  display: flex;
  ${props => buildStyle(props)}
`;

export const Box = styled.div`
  ${props => buildStyle(props)}
`;

Flex.propTypes = Box.propTypes = {
  flexAuto: PropTypes.bool,
  flexColumn: PropTypes.bool,
  wrap: PropTypes.bool,
  align: PropTypes.oneOf([
    'stretch',
    'center',
    'baseline',
    'flex-start',
    'flex-end'
  ]),
  justify: PropTypes.oneOf([
    'center',
    'space-around',
    'space-between',
    'flex-start',
    'flex-end'
  ])
};
