import PropTypes from 'prop-types';
import React from 'react';
import { throttle } from 'lodash';
import SplitPane from 'react-split-pane';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';
import '../../styles/split-pane.global';

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
