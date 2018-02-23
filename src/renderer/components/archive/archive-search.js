import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { Input as BaseInput } from '@buttercup/ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Flex, Box } from 'styled-flexbox';
import EntryIcon from './entry-icon';
import {
  getMatchingEntriesForSearchTerm,
  getNameForSource
} from '../../../shared/actions/entries';

const SearchWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 3;
  left: 0;
  display: ${props => (props.visible ? 'block' : 'none')};
`;

const SearchOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Search = styled(Flex)`
  background-color: #fff;
  padding: var(--spacing-two);
  position: absolute;
  border-radius: 5px;
  z-index: 4;
  top: 10%;
  left: 50%;
  width: 50vw;
  max-width: 400px;
  transition: transform 0.3s;
  transform: translate(-50%, 0);
  width: 100%;
`;

const Input = styled(BaseInput)`
  padding: 20px 10px;
  margin: ${props =>
    props.entries.length > 0 || props.searchTerm !== '' ? '0 0 20px 0' : 0};
`;

/**
	* Entry-List
	*/
const EntryList = styled(Box)`
  border: 0;
  margin: 0;
  width: 100%;
  border-radius: 6px;
  position: relative;
`;

const NothingFound = styled(EntryList)`
  color: #999;
  text-align: center;
  font-size: 14px;
`;

const ListItem = styled.div`
  margin: 0;
  font-size: 14px;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:last-child {
    border: 0;
  }

  &:hover {
    background-color: #00b7ac;
    color: #fff;
    p {
      color: #fff;
    }
  }
`;

const EntryData = styled.div`
  display: inline-block;
  margin: -5px 0 0 0;
`;

const EntryFolder = styled('p')`
  font-size: 12px;
  color: #999;
  margin: 0;
`;

const Icon = styled.div`
  float: left;
  margin: 0 10px 0 0;
`;

class ArchiveSearch extends PureComponent {
  static propTypes = {
    onSelectEntry: PropTypes.func,
    getArchive: PropTypes.func,
    currentArchive: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onGroupSelect: PropTypes.func,
    switchArchive: PropTypes.func,
    t: PropTypes.func
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
    this.highlightSearchResult = this.highlightSearchResult.bind(this);
    this.getAllMatchingEntries = this.getAllMatchingEntries.bind(this);
  }

  searchListener() {
    const { getArchive, currentArchive } = this.props;

    if (currentArchive) {
      const archive = getArchive(currentArchive.id);

      this.setState(state => ({
        visible: !state.visible,
        archive
      }));

      this._input.focus();
      this._input.select();
    }
  }

  closeSearch() {
    this.setState({
      visible: false
    });
  }

  changeInput(e) {
    this.setState({
      searchTerm: e.target.value
    });

    this.getAllMatchingEntries();
  }

  getAllMatchingEntries() {
    getMatchingEntriesForSearchTerm(this.state.searchTerm).then(entries => {
      this.setState({
        entries: this.state.searchTerm ? entries : []
      });
    });
  }

  highlightSearchResult(word) {
    const regex = new RegExp('(' + this.state.searchTerm + ')', 'g');
    return word.replace(regex, '<mark>$1</mark>');
  }

  componentDidMount() {
    ipcRenderer.on('open-archive-search', this.searchListener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('open-archive-search', this.searchListener);
  }

  render() {
    const { entries, searchTerm } = this.state;
    const { switchArchive, onSelectEntry, onGroupSelect, t } = this.props;

    return (
      <SearchWrapper visible={this.state.visible}>
        <SearchOverlay onClick={this.closeSearch} />
        <Search flexColumn>
          <Input
            bordered
            innerRef={input => {
              this._input = input;
            }}
            onChange={this.changeInput}
            value={this.state.searchTerm}
            placeholder={t('archive-search.searchterm')}
            type="text"
            entries={this.state.entries}
            searchTerm={this.state.searchTerm}
          />

          {entries.length > 0 ? (
            <EntryList flexAuto>
              <Scrollbars autoHeight autoHeightMax={300}>
                {entries.map(({ entry, sourceID, groupID, icon }, index) => (
                  <ListItem
                    key={index}
                    onClick={() => {
                      switchArchive(sourceID);
                      onGroupSelect(entry.getGroup().getID());
                      onSelectEntry(entry.getID());

                      this.closeSearch();
                    }}
                  >
                    <Icon>
                      <EntryIcon icon={icon} />
                    </Icon>
                    <EntryData>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: entry.getProperty('title')
                            ? this.highlightSearchResult(
                                entry.getProperty('title')
                              )
                            : '-'
                        }}
                      />
                      <EntryFolder>{getNameForSource(sourceID)}</EntryFolder>
                    </EntryData>
                  </ListItem>
                ))}
              </Scrollbars>
            </EntryList>
          ) : searchTerm !== '' ? (
            <NothingFound>{t('archive-search.nothing-found')}</NothingFound>
          ) : (
            ''
          )}
        </Search>
      </SearchWrapper>
    );
  }
}

export default translate()(ArchiveSearch);
