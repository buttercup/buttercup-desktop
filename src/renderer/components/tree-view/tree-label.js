import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Translate } from '../../../shared/i18n';
import LabelEditor from './tree-label-edit';

const Node = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

class TreeLabel extends PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
    onDismissClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onCreateNew: PropTypes.func,
    onRightClick: PropTypes.func
  };

  handleSave = title => {
    const { isNew, parentId, id } = this.props.node;
    if (isNew) {
      this.props.onCreateNew(parentId, id, title);
    } else {
      this.props.onSaveClick(id, title);
    }
  };

  handleDismiss = () => {
    this.props.onDismissClick();
  };

  render() {
    const { node, onRightClick } = this.props;
    const { title, isNew, isRenaming } = node;

    if (isNew || isRenaming) {
      return (
        <Node>
          <LabelEditor
            node={node}
            onSave={this.handleSave}
            onDismiss={this.handleDismiss}
          />
        </Node>
      );
    }

    return (
      <Node onContextMenu={onRightClick}>
        {title.trim() || (
          <i>
            {' '}
            <Translate i18nKey="group.untitled" parent="span" />
          </i>
        )}
      </Node>
    );
  }
}

export default TreeLabel;
