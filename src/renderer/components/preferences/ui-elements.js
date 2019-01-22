import styled from 'styled-components';
import { Input as BaseInput } from '@buttercup/ui';

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  background-color: #fff;
`;

export const Menu = styled.div`
  background-color: #eee;
  display: grid;
  grid-template-rows: 1fr auto;
`;

export const MenuInner = styled.div`
  padding: 20px 20px 0;
  a {
    list-style: none;
    color: #999;
    text-decoration: none;
    padding: 20px;
    font-size: 13px;
    display: inline-block;
    position: relative;
    &.active {
      border-bottom: 2px solid #00b7ac;
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
  grid-gap: 20px;
`;
export const Input = styled(BaseInput)`
  font-weight: 300;
  display: inline-block;
  padding: 0 12px;
  border: 2px solid #e4e9f2;
`;
export const Checkbox = styled(Input)`
  -webkit-appearance: none;
  background-color: #fafafa;
  border: 1px solid #cacece;
  width: 20px;
  height: 20px;
  padding: 9px;
  border-radius: 3px;
  display: inline-block;
  margin: 0 8px -5px 0;
  position: relative;

  &:checked {
    border: 1px solid #00b7ac;
    background-color: #00b7ac;
    &:after {
      content: '\\2714';
      font-size: 14px;
      position: absolute;
      top: -2px;
      left: 3px;
      color: #fff;
    }
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
    border-color: #00b7ac;
  }
`;

export const LabelWrapper = styled.label`
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  padding: 0;
  text-transform: ${props => (props.checkbox ? 'none' : 'uppercase')};
  font-weight: ${props => (props.checkbox ? 'normal' : 'bold')};
  font-size: 0.75em;
  margin: 0 0 ${props => (props.checkbox ? '0' : '20px')};
  input,
  select {
    margin-top: 4px;
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
