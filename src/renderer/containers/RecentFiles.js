import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { removeRecent, clearRecent } from '../redux/modules/recents';

const RecentFile = ({
  filename,
  onClick
}) => (
  <li>
    {filename}
    <button onClick={onClick}>&times;</button>
  </li>
);

RecentFile.propTypes = {
  filename: PropTypes.string,
  onClick: PropTypes.func
};

class ArchiveHistory extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onClearClick}>Clear Recents</button>
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
  onRemoveClick: PropTypes.func,
  onClearClick: PropTypes.func
};

const mapStateToProps = state => ({
  recentFiles: state.recentFiles
});

const mapDispatchToProps = dispatch => ({
  onRemoveClick: filename => dispatch(removeRecent(filename)),
  onClearClick: () => dispatch(clearRecent())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveHistory);
