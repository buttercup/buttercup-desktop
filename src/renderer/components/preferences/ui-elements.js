import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input as BaseInput } from '@buttercup/ui';
import { isOSX } from '../../../shared/utils/platform';

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 150px 1fr;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
`;

export const Menu = styled.div`
  background-color: var(--entries-bg);
  display: grid;
  grid-template-rows: 1fr auto;
`;

export const MenuInner = styled.div`
  padding: 0;
  margin-top: ${!isOSX() ? 0 : 40}px;
  a {
    list-style: none;
    color: #fff;
    text-decoration: none;
    padding: 12px 20px;
    font-size: 13px;
    display: block;
    position: relative;
    border: 0;
    transition: all 0.2s;
    &:hover {
      background-color: #383d46;
    }
    &.active {
      background-color: var(--brand-primary);
      color: #fff;
    }
  }
`;

export const Content = styled.div`
  margin: 20px;
  h3 {
    margin: 0 0 15px;
  }
`;

export const Seperator = styled.div`
  display: block;
  font-size: 12px;
  color: #999;
  position: relative;
  padding: 0 20px 0;
  box-sizing: border-box;
  margin: 5px 0;
  &:before {
    border-top: 1px solid #c1c1c1;
    content: '';
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    width: 90%;
  }
  span {
    background-color: #eee;
    position: relative;
    padding: 0 10px;
    z-index: 2;
    margin-left: -15px;

    &:empty {
      padding: 0;
      &:before {
        display: none;
      }
    }
  }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: ${props => (props.single ? '1fr' : '1fr 1fr')};
  margin-bottom: 20px;
  grid-gap: ${props => (props.gap ? props.gap : 0)}px;
`;
export const Input = styled(BaseInput)`
  font-weight: 300;
  display: inline-block;
  padding: 0 12px;
  border: 2px solid #e4e9f2;
`;

const CheckboxStyle = styled.input`
  -webkit-appearance: none;
  position: absolute;
  left: 5px;
  top: -1px;
  cursor: pointer;
  &:after {
    content: '';
    border-radius: 100%;
    font-size: 14px;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    color: #fff;
    background-color: #eee;
    transition: all 0.3s;
  }
  &:checked {
    &:after {
      content: '\\2714';
      padding: 0 0 0 5px;
      color: #fff;
      background-color: var(--brand-primary-darker);
    }
    & + label {
      background-color: var(--brand-primary);
      border: 1px solid var(--brand-primary);
      color: #fff;
    }
  }
  & + label {
    cursor: pointer;
    transition: all 0.3s;
    padding: 4px 12px 5px 30px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 14px;
  }
`;

export const Select = styled.select`
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
    border-color: var(--brand-primary);
  }
`;

export const LabelWrapper = styled.div`
  position: relative;
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: ${props => (props.checkbox ? 'inline-block' : 'block')};
  padding: 0;
  text-transform: ${props => (props.checkbox ? 'none' : 'uppercase')};
  font-weight: ${props => (props.checkbox ? 'normal' : 'bold')};
  font-size: 0.75em;
  margin: 0 ${props => (props.checkbox ? 5 : 0)}px
    ${props => (props.checkbox ? '0' : '20px')};
  input,
  select {
    margin-top: 4px;
    &[type='checkbox'] {
      margin-top: 0;
    }
    &[type='text'],
    &[type='number'] {
      display: block;
    }
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

export const Range = styled(BaseInput)`
  display: inline-block;
  padding: 0;
`;

export const Checkbox = ({ title, onChange, checked }) => {
  const name = title && title.toLowerCase().replace(/\s/g, '');
  return (
    <LabelWrapper checkbox>
      <CheckboxStyle
        type="checkbox"
        id={name}
        onChange={e => onChange(e.target.checked)}
        checked={checked}
      />
      <label htmlFor={name}>{title}</label>
    </LabelWrapper>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.any,
  title: PropTypes.string
};
