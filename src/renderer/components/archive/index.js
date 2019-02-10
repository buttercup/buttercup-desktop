import PropTypes from 'prop-types';
import React from 'react';
import { throttle } from 'lodash';
import Pane from 'react-split-pane';
import styled from 'styled-components';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';

const SplitPane = styled(Pane)`
  .Pane {
    display: flex;
  }

  .Resizer {
    background: #000;
    opacity: 0.1;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
    -webkit-app-region: no-drag;

    &:hover {
      transition: all 2s ease;
    }

    &.vertical {
      width: 0px;
      margin: 0 -5px;
      border-left: 5px solid rgba(255, 255, 255, 0);
      border-right: 5px solid rgba(255, 255, 255, 0);
      cursor: col-resize;
    }
  }
`;

const Archive = ({ onColumnSizeChange, columnSizes }) => (
  <SplitPane
    split="vertical"
    minSize={150}
    maxSize={500}
    defaultSize={columnSizes ? columnSizes.tree : 230}
    onChange={throttle(
      size => onColumnSizeChange({ name: 'tree', size }),
      1000
    )}
  >
    <TreeView />
    <SplitPane
      split="vertical"
      minSize={150}
      maxSize={500}
      defaultSize={columnSizes ? columnSizes.entries : 230}
      onChange={throttle(
        size => onColumnSizeChange({ name: 'entries', size }),
        1000
      )}
    >
      <Entries />
      <Entry />
    </SplitPane>
  </SplitPane>
);

Archive.propTypes = {
  columnSizes: PropTypes.object,
  onColumnSizeChange: PropTypes.func
};

export default Archive;
