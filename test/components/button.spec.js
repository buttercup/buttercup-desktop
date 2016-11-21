import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../src/renderer/components/button';

describe('Button Component', () => {
  it('should render normal content', () => {
    const component = shallow(<Button>Test</Button>);
    expect(component.find('button').text()).to.equal('Test');
  });

  it('should handle click event', () => {
    const onButtonClick = spy();
    const wrapper = shallow(<Button onClick={onButtonClick}>Test</Button>);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
