import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { openArchive, newArchive } from '../redux/modules/files'; 

class FileOpener extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onOpenClick}>Open...</button>
        <button onClick={this.props.onNewClick}>Create a new archive...</button>
      </div>
    );
  }
}

FileOpener.propTypes = {
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func
};

export default connect(
  null,
  {
    onOpenClick: openArchive,
    onNewClick: newArchive  
  }
)(FileOpener);
