import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addRecent, clearRecent, removeRecent } from '../redux/modules/recentFiles';

const RecentFile = ({
  filename,
  onClick
}) => (
  <li onClick={onClick}>{filename}</li>
);

RecentFile.propTypes = {
  filename: PropTypes.number,
  onClick: PropTypes.func
};

class ArchiveHistory extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onAddClick}>Add</button>
        <button onClick={this.props.onClearClick}>Clear</button><br/>
        <ul>
          {this.props.recentFiles.map(filename =>
            <RecentFile
              filename={filename}
              key={filename}
              onClick={() => this.props.onRemoveClick(filename)}
              />
          )}
        </ul>
      </div>
    );
  }
}

ArchiveHistory.propTypes = {
  recentFiles: PropTypes.array,
  onAddClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

const mapStateToProps = state => ({
  recentFiles: state.recentFiles
});

const mapDispatchToProps = dispatch => ({
  onAddClick: () => {
    dispatch(addRecent(Math.random().toPrecision(1).toString()));
  },
  onClearClick: () => {
    dispatch(clearRecent());
  },
  onRemoveClick: filename => {
    dispatch(removeRecent(filename));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveHistory);
