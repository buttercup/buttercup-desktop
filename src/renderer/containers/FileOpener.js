import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { openFile, createNewFile } from '../redux/modules/files'; 

class FileOpener extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onAddClick}>Open...</button>
        <button onClick={this.props.onNewClick}>Create a new archive...</button>
      </div>
    );
  }
}

FileOpener.propTypes = {
  onAddClick: PropTypes.func,
  onNewClick: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  onAddClick: () => dispatch(openFile()),
  onNewClick: () => dispatch(createNewFile())
});

export default connect(
    null,
    mapDispatchToProps
)(FileOpener);
