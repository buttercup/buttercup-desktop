import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import LabelEditor from './tree-label-edit';

const Node = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

class TreeLabel extends Component {
  static propTypes = {
    node: PropTypes.object,
    onDismissClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onRightClick: PropTypes.func
  };

  handleSave = title => {
    const { isNew, parentId, id } = this.props.node;
    this.props.onSaveClick(
      isNew,
      isNew ? parentId : id,
      title
    );
  }

  handleDismiss = () => {
    this.props.onDismissClick();
  }

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
        {(title.trim() || <i>Untitled</i>)}
      </Node>
    );
  }
}

export default TreeLabel;
