import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

  ${props =>
    props.selected
      ? `    background-color: #00b7ac;
    color: #fff;
    p {
      color: #fff;
    }`
      : ''};

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

const EntryFolder = styled.p`
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
    getArchive: PropTypes.func,
    currentArchive: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    selectArchiveGroupAndEntry: PropTypes.func,
    setIsArchiveSearchVisible: PropTypes.func,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      archive: null,
      entries: [],
      searchTerm: '',
      selectedItem: -1
    };

    this.changeInput = this.changeInput.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.highlightSearchResult = this.highlightSearchResult.bind(this);
    this.onInputKeyDownOrDown = this.onInputKeyDownOrDown.bind(this);
    this.openEntry = this.openEntry.bind(this);
  }

  closeSearch() {
    this.props.setIsArchiveSearchVisible(false);
  }

  changeInput(e) {
    this.setState(
      {
        searchTerm: e.target.value,
        selectedItem: -1
      },
      () =>
        getMatchingEntriesForSearchTerm(this.state.searchTerm).then(entries => {
          this.setState({
            entries: this.state.searchTerm ? entries : []
          });
        })
    );
  }

  highlightSearchResult(word) {
    const regex = new RegExp('(' + this.state.searchTerm + ')', 'ig');
    return word.replace(regex, '<mark>$1</mark>');
  }

  onInputKeyDownOrDown(e) {
    const { entries, selectedItem } = this.state;

    if (e.keyCode === 38 && selectedItem !== -1) {
      this.setState(state => ({
        selectedItem: state.selectedItem - 1
      }));
    }

    if (e.keyCode === 40 && selectedItem < entries.length - 1) {
      this.setState(state => ({
        selectedItem: state.selectedItem + 1
      }));
    }

    if (e.keyCode === 13) {
      if (entries.length > 0 && entries[selectedItem]) {
        const result = entries[selectedItem];
        this.openEntry(result.sourceID, result.entry);
      }
    }

    if (e.keyCode === 27) {
      this.closeSearch();
    }
  }

  openEntry(sourceID, entry) {
    this.props.selectArchiveGroupAndEntry(sourceID, entry);

    this.closeSearch();
  }

  componentDidMount() {
    const { getArchive, currentArchive } = this.props;

    if (currentArchive) {
      const archive = getArchive(currentArchive.id);

      this.setState(state => ({
        archive
      }));
    }
    this._input.focus();
    this._input.select();
  }

  render() {
    const { entries, searchTerm, selectedItem } = this.state;
    const { t } = this.props;

    return (
      <SearchWrapper>
        <SearchOverlay onClick={this.closeSearch} />
        <Search flexColumn>
          <Input
            bordered
            onKeyDown={this.onInputKeyDownOrDown}
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
          <Choose>
            <When condition={entries.length > 0}>
              <EntryList flexAuto>
                <Scrollbars autoHeight autoHeightMax={300}>
                  {entries.map(({ entry, sourceID, groupID, icon }, index) => (
                    <ListItem
                      selected={selectedItem === index}
                      key={index}
                      onClick={() => this.openEntry(sourceID, entry)}
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
            </When>

            <When condition={entries.length === 0 && searchTerm !== ''}>
              <NothingFound>{t('archive-search.nothing-found')}</NothingFound>
            </When>
          </Choose>
        </Search>
      </SearchWrapper>
    );
  }
}

export default translate()(ArchiveSearch);
