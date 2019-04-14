import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input as BaseInput } from '@buttercup/ui';
import { isOSX } from '../../../../shared/utils/platform';
import { Translate } from '../../../../shared/i18n';

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 110px 1fr;
  grid-template-columns: 1fr;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
`;

export const Menu = styled.div`
  background-color: var(--brand-primary);
  border-radius: 10px;
  margin: ${!isOSX() ? 18 : 38}px 25px 0;
  box-sizing: border-box;
  align-self: center;
`;

export const LabelWrapper = styled.div`
  position: relative;
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  padding: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75em;
  margin: 0 5px 20px 0;
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
  label {
    font-size: 0.9em;
    color: #999;
    font-weight: 100;
  }
`;

export const MenuInner = styled.div`
  padding: 0;
  align-self: center;
  a {
    list-style: none;
    color: #fff;
    text-decoration: none;
    padding: 12px 20px;
    font-size: 12px;
    display: inline-block;
    position: relative;
    border: 0;
    transition: all 0.2s;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
    text-align: center;
    svg {
      transition: all 0.2s;
      opacity: 0.5;
    }
    &.active,
    &:hover {
      color: #fff;
      svg {
        opacity: 1;
      }
    }
  }
`;

export const Content = styled.div`
  margin: 40px;
  h3 {
    font-size: 0.9em;
    margin: 0 0 15px;
    position: relative;
    line-height: 0.9em;
    svg {
      top: 6px;
      margin: 0 7px 0 0;
      position: relative;
      display: inline-block;
    }
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

const CheckboxWrapper = styled(LabelWrapper)`
  position: relative;
  display: block;
  text-transform: none;
  font-weight: normal;
  margin: 0 5px 0 0;
  label {
    font-size: 1em;
    font-weight: 500;
  }
  span {
    display: block;
    position: absolute;
    top: 4px;
    left: 3px;
    width: 12px;
    height: 7px;
    border-radius: 3px;
    transform: rotate(-45deg);
    border-width: 0 0 3px 3px;
    z-index: 1;
    border-color: ${props => (props.isChecked ? '#fff' : '#cecece')};
    border-style: solid;
    transition: all 0.3s;
  }
  &:hover {
    span {
      border-color: ${props => (props.isChecked ? '#fff' : '#a9a9a9')};
    }
  }
`;
const CheckboxStyle = styled.input`
  -webkit-appearance: none;
  position: absolute;
  left: -4px;
  top: -1px;
  cursor: pointer;
  &:after {
    content: '';
    border-radius: 5px;
    font-size: 14px;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    color: #fff;
    transition: all 0.3s;
    border: 1px solid #cecece;
  }
  &:hover {
    border-color: #cecece;
    &:before {
      content: '';
    }
    &:after {
      content: '';
      padding: 0 0 0 5px;
      border: 1px solid #999;
      color: #fff;
    }
    & + label {
      color: #999;
    }
  }
  &:checked {
    &:before {
      content: '';
    }
    &:after {
      content: '';
      padding: 0 0 0 5px;
      color: #fff;
      border-color: var(--brand-primary);
      background-color: var(--brand-primary);
    }
    & + label {
      /* font-weight: 600; */
      color: #999;
    }
    &:hover {
      background-color: var(--brand-primary);
    }
  }
  & + label {
    cursor: pointer;
    transition: all 0.3s;
    padding: 0 0 0 25px;
    background-color: #fff;
    color: #a9a9a9;
    border-radius: 14px;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  font-weight: 300;
  display: inline-block;
  padding: 7px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #e4e9f2;
  height: 33px;
  width: 100%;
  background-color: transparent;
  border-radius: 0;
  &:focus {
    border-color: var(--brand-primary);
  }
`;

export const Range = styled(BaseInput)`
  display: inline-block;
  padding: 0;
`;

const InputStyle = styled.input`
  font-weight: 300;
  display: inline-block;
  padding: 7px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #e4e9f2;
  width: 100%;
  &:focus {
    border-color: var(--brand-primary);
  }
`;

export const ResetButton = styled.span`
  position: absolute;
  right: 0;
  font-size: 0.9em;
  bottom: 9px;
  cursor: pointer;
  text-transform: none;
  font-weight: normal;
  margin-left: 10px;
  color: #999;
  &:hover {
    text-decoration: underline;
  }
`;

export const Input = ({
  min,
  max,
  title,
  name,
  onChange,
  onBlur,
  onReset,
  value,
  defaultValue,
  type = 'text'
}) => {
  const computedName =
    name || (title && title.toLowerCase().replace(/\s/g, ''));
  return (
    <LabelWrapper>
      <label htmlFor={computedName}>{title}</label>

      {value !== defaultValue ? (
        <ResetButton
          onClick={
            onReset ||
            (e =>
              onChange({
                ...e,
                target: {
                  ...e.target,
                  name,
                  value: defaultValue
                }
              }))
          }
        >
          <Translate i18nKey="preferences.reset" />
        </ResetButton>
      ) : (
        ''
      )}
      <InputStyle
        type={type}
        name={name}
        min={min}
        max={max}
        id={computedName}
        value={value}
        onChange={onChange}
        onBlur={onBlur || (e => onChange(e))}
      />
    </LabelWrapper>
  );
};

Input.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onReset: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.any
};

export const Checkbox = ({ title, onChange, checked }) => {
  const name = title && title.toLowerCase().replace(/\s/g, '');
  return (
    <CheckboxWrapper isChecked={checked}>
      <span />
      <CheckboxStyle
        type="checkbox"
        id={name}
        onChange={e => onChange(e.target.checked)}
        checked={checked}
      />
      <label htmlFor={name}>{title}</label>
    </CheckboxWrapper>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.any,
  title: PropTypes.string
};
