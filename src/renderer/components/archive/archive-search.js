import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { getArchiveToSearch } from '../../../shared/buttercup/entries.js';
import { Translate } from '../../../shared/i18n';

const SearchWrapper = styled('div')`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 3;
  left: 0;
`;

const SearchOverlay = styled('div')`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: ${props => (props.visible ? 'block' : 'none')};
`;

const Search = styled('div')`
  background-color: #ececec;
  padding: var(--spacing-two);
  position: absolute;
  z-index: 9;
  top: 0;
  left: 50%;
  width: 50vw;
  border-radius: 0 0 3px 3px;
  transition: transform 0.3s;
  transform: translate(-50%, ${props => (props.visible ? '0' : '-100%')});
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const SearchInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #999',
  margin: 0
};

const Headline = styled('h3')`
  margin: 0 0 15px;
`;

const EntryList = styled('ul')`
  margin: 15px 0 0 0;
  padding: 0;
  max-height: 350px;
  overflow: auto;
  list-style: none;
`;

const ListItem = styled('li')`
  margin: 0;
  padding: 15px;
  cursor: pointer;

  &:hover {
    background-color: #00b7ac;
  }
`;

class ArchiveSearch extends PureComponent {
  static propTypes = {
    onSelectEntry: PropTypes.func,
    onGroupSelect: PropTypes.func,
    currentArchive: PropTypes.obj
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      archive: null,
      entries: [],
      searchTerm: ''
    };
    this.changeInput = this.changeInput.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.searchListener = this.searchListener.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('open-archive-search', this.searchListener);
  }

  searchListener() {
    const { currentArchive } = this.props;

    if (currentArchive) {
      const archive = getArchiveToSearch(currentArchive.id);

      this.setState(state => ({
        visible: !state.visible,
        archive
      }));

      this.searchInputRef.focus();
    }
  }

  changeInput(e) {
    const value = e.target.value;
    const entries = value
      ? this.state.archive.findEntriesByProperty('title', value)
      : [];

    this.setState({
      searchTerm: e.target.value,
      entries
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('open-archive-search', this.searchListener);
  }

  closeSearch() {
    this.setState({
      visible: false
    });
  }

  render() {
    const { entries } = this.state;
    const { onSelectEntry, onGroupSelect } = this.props;

    return (
      <SearchWrapper>
        <SearchOverlay
          visible={this.state.visible}
          onClick={this.closeSearch}
        />
        <Search visible={this.state.visible} flexAuto>
          <Headline>Search</Headline>
          <input
            style={SearchInputStyle}
            ref={input => {
              this.searchInputRef = input;
            }}
            onChange={this.changeInput}
            value={this.state.searchTerm}
          />

          {entries.length > 0 ? (
            <EntryList>
              {entries.map((entry, index) => (
                <ListItem
                  key={index}
                  onClick={() => {
                    this.props.onGroupSelect(entry.getGroup().getID());
                    this.props.onSelectEntry(entry.getID());

                    this.closeSearch();
                  }}
                >
                  {entry.getGroup().getTitle()} -> {entry.getProperty('title')}
                </ListItem>
              ))}
            </EntryList>
          ) : (
            ''
          )}
        </Search>
      </SearchWrapper>
    );
  }
}

export default translate()(ArchiveSearch);
