import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { openFile, createNewFile } from '../redux/modules/files'; 
import { showOpenDialog, showSaveDialog } from '../system/dialog';

class FileOpener extends Component {
  render() {
    return (
      <div>
        <FlatButton
          onClick={this.props.onOpenClick}
          label="Open..."
          primary
          />
        <FlatButton onClick={this.props.onNewClick} label="Create a new archive..."/>
      </div>
    );
  }
}

FileOpener.propTypes = {
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  onOpenClick: () => {
    showOpenDialog(filename => dispatch(openFile(filename)));
  },
  onNewClick: () => {
    showSaveDialog(filename => dispatch(createNewFile(filename)));
  }
});

export default connect(
    null,
    mapDispatchToProps
)(FileOpener);
