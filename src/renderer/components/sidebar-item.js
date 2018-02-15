import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import LockOpen from 'react-icons/lib/md/lock-open';
import LockClosed from 'react-icons/lib/md/lock-outline';
import { TwitterPicker } from 'react-color';
import { PortalWithState } from 'react-portal';
import { translate } from 'react-i18next';
import { SortableElement } from 'react-sortable-hoc';
import { brands } from '../../shared/buttercup/brands';
import { ImportTypeInfo } from '../../shared/buttercup/types';
import { getTextColor, COLORS } from '../../shared/utils/colors';
import { showContextMenu } from '../system/menu';

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  color: #fff;
  background-color: ${props =>
    props.active ? 'rgba(255, 255, 255, .1)' : 'transparent'};
  padding: var(--spacing-half) var(--spacing-one);
  cursor: ${props => (props.locked ? 'pointer' : 'default')} !important;

  .status {
    font-weight: 300;
    font-size: 0.75em;
    color: ${props => (props.locked ? 'var(--red)' : 'var(--gray-dark)')};
    text-transform: uppercase;
    display: block;
    margin-top: 0.3em;

    svg {
      vertical-align: -2px !important;
      margin-right: 3px;
      height: 12px;
      width: 12px;
    }
  }

  section {
    font-size: 0.9em;
    flex: 1;
    min-width: 0;
    padding-left: var(--spacing-one);

    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-color: ${props => props.color};
  color: ${props => getTextColor(props.color)};
  font-weight: 400;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:after {
    content: '';
    display: ${props => (props.locked ? 'none' : 'block')};
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: -10px;
    top: 50%;
    margin-top: -2px;
  }
`;

const Icon = styled.figure`
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
  width: 18px;
  height: 18px;
  transform: translate(20%, 20%);

  img {
    width: 14px;
    display: block;
  }
`;

const PickerWrapper = styled.div`
  position: fixed;
  top: ${props => props.top + 20}px;
  left: ${props => props.left + 5}px;
`;

class SidebarItem extends PureComponent {
  static propTypes = {
    archive: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    condenced: PropTypes.bool.isRequired,
    order: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    onLockArchive: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
    onChangeColour: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    showImportDialog: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    isPickerOpen: false,
    top: 0,
    left: 0
  };

  handleContextMenu = () => {
    const { t, archive } = this.props;
    const { status, name, id } = archive;
    const label = (key, options) => t(`archive-menu.${key}`, options);

    showContextMenu([
      {
        label: `${status === 'locked'
          ? label('unlock')
          : label('open')} ${name}`,
        accelerator: `CmdOrCtrl+${this.props.order + 1}`,
        click: this.props.onClick
      },
      ...(status === 'unlocked'
        ? [
            {
              label: label('lock'),
              accelerator: this.props.active ? 'CmdOrCtrl+l' : null,
              click: this.props.onLockArchive
            },
            {
              label: label('change-password'),
              click: this.props.onChangePassword
            }
          ]
        : []),
      {
        label: label('change-color'),
        click: this.showColorPopup
      },
      {
        type: 'separator'
      },
      {
        label: label('import'),
        submenu: Object.entries(ImportTypeInfo).map(([type, typeInfo]) => ({
          label: label('import-from-type', {
            name: typeInfo.name,
            extension: typeInfo.extension
          }),
          enabled: status === 'unlocked',
          click: () =>
            this.props.showImportDialog({
              type,
              archiveId: id
            })
        }))
      },
      {
        type: 'separator'
      },
      {
        label: label('archive-remove-with-name', {
          name
        }),
        click: this.props.onRemoveClick
      }
    ]);
  };

  showColorPopup = () => {
    const el = this.avatarRef;
    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = el.getBoundingClientRect();
    this.setState({
      isPickerOpen: true,
      top: targetRect.top - bodyRect.top + el.clientHeight - 10,
      left: targetRect.left - bodyRect.left
    });
  };

  handlePickerClose = () => {
    this.setState({ isPickerOpen: false });
  };

  handleColorChange = (color, e) => {
    e.stopPropagation();
    this.props.onChangeColour({
      archiveId: this.props.archive.id,
      colour: color.hex
    });
  };

  render() {
    const { archive, onClick, active, condenced } = this.props;
    const { name, colour, status, type } = archive;
    const locked = status === 'locked';

    const formattedName = capitalize(name.replace('.bcup', ''));
    const briefName = capitalize(name.substring(0, 2));

    return (
      <Wrapper
        locked={locked}
        active={active}
        onContextMenu={this.handleContextMenu}
        onClick={onClick}
      >
        <Avatar
          color={colour}
          locked={locked}
          innerRef={ref => {
            this.avatarRef = ref;
          }}
        >
          <span>{briefName}</span>
          <If condition={condenced && brands[type] && brands[type].remote}>
            <Icon>
              <img src={brands[type].icon} alt={brands[type].name} />
            </Icon>
          </If>
          <If condition={this.state.isPickerOpen}>
            <PortalWithState
              closeOnEsc
              closeOnOutsideClick
              defaultOpen
              onClose={this.handlePickerClose}
            >
              {({ portal }) => [
                portal(
                  <PickerWrapper left={this.state.left} top={this.state.top}>
                    <TwitterPicker
                      colors={COLORS}
                      triangle="top-left"
                      onChange={this.handleColorChange}
                    />
                  </PickerWrapper>
                )
              ]}
            </PortalWithState>
          </If>
        </Avatar>
        <If condition={!condenced}>
          <section>
            <div>{formattedName}</div>
            <span className="status">
              {locked ? <LockClosed /> : <LockOpen />}
              {brands[type] && brands[type].name}
            </span>
          </section>
        </If>
      </Wrapper>
    );
  }
}

export default translate()(SortableElement(SidebarItem));
