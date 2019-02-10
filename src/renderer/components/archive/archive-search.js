import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { Input as BaseInput } from '@buttercup/ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Flex, Box } from 'styled-flexbox';
import EntryIcon from './entry-icon';

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
  box-shadow: 0 0 5px var(--black-20);
  background-color: #fff;
  padding: var(--spacing-one);
  position: absolute;
  border-radius: 5px;
  z-index: 4;
  top: 10%;
  left: 50%;
  max-width: 50vw;
  min-width: 400px;
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
  margin-bottom: var(--spacing-one);
`;

const ListItem = styled.div`
  margin: 0;
  font-size: 14px;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  border-radius: 3px;

  &:last-child {
    border: 0;
  }

  background-color: ${props =>
    props.selected ? 'var(--brand-primary) !important' : 'transparent'};
  color: ${props => (props.selected ? '#fff' : '')};

  p {
    color: ${props => (props.selected ? '#fff' : '')};
  }

  &:hover {
    background-color: var(--gray-light);
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
  searchEntryList = null; // search entry list reference

  static propTypes = {
    getArchive: PropTypes.func,
    currentArchive: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    selectArchiveGroupAndEntry: PropTypes.func,
    setIsArchiveSearchVisible: PropTypes.func,
    findEntryByTerm: PropTypes.func,
    t: PropTypes.func
  };

  /**
   * Creates an instance of ArchiveSearch
   * @param {*} props
   * @memberof ArchiveSearch
   */
  constructor(props) {
    super(props);

    this.state = {
      archive: null,
      entries: [],
      searchTerm: '',
      selectedItemIndex: -1
    };
  }

  /**
   * Close search popup
   * @memberof ArchiveSearch
   */
  closeSearch = () => {
    this.props.setIsArchiveSearchVisible(false);
  };

  /**
   * Update search entry on input
   * @param {object} e
   * @memberof ArchiveSearch
   */
  changeSearchtermInput = e => {
    this.setState(
      {
        searchTerm: e.target.value,
        selectedItemIndex: -1
      },
      () =>
        this.props.findEntryByTerm(this.state.searchTerm).then(entries => {
          this.setState(
            {
              entries: this.state.searchTerm ? entries : []
            },
            // check entries and select first one
            () => this.state.entries.length && this.selectListItem()
          );
        })
    );
  };

  /**
   * Wrap text with <mark> tag
   * @param {string} text
   * @memberof ArchiveSearch
   */
  highlightSearchResult = text => {
    const startIndex = text
      .toLowerCase()
      .indexOf(this.state.searchTerm.toLowerCase());
    if (startIndex >= 0) {
      const endIndex = startIndex + this.state.searchTerm.length;
      return (
        text.substring(0, startIndex) +
        '<mark>' +
        text.substring(startIndex, endIndex) +
        '</mark>' +
        text.substring(endIndex)
      );
    }
    return text;
  };

  /**
   * Select list item by index
   * @param {number} selectedItemIndex
   * @memberof ArchiveSearch
   */
  selectListItem = (selectedItemIndex = 0) => {
    this.setState(
      {
        selectedItemIndex
      },
      () => {
        const { view, scrollTop } = this.searchEntryList;
        const selectedItem = view.childNodes[selectedItemIndex];
        let searchListScrollTop = view.scrollTop;

        if (selectedItem) {
          if (
            selectedItem.offsetTop +
              selectedItem.offsetHeight * 2 -
              view.scrollTop >
            view.clientHeight
          ) {
            searchListScrollTop += selectedItem.offsetHeight;
          } else {
            searchListScrollTop -= selectedItem.offsetHeight;
          }

          scrollTop(searchListScrollTop);
        }
      }
    );
  };

  /**
   * Handle up/down/esc and enter keys
   * @param {object} e
   * @memberof ArchiveSearch
   */
  onInputKeyUpOrDown = e => {
    const { entries, selectedItemIndex } = this.state;

    // up
    if (e.keyCode === 38 && selectedItemIndex !== -1) {
      this.selectListItem(selectedItemIndex - 1);
    }

    // down
    if (e.keyCode === 40 && selectedItemIndex < entries.length - 1) {
      this.selectListItem(selectedItemIndex + 1);
    }

    // enter
    if (e.keyCode === 13) {
      if (entries.length > 0 && entries[selectedItemIndex]) {
        const result = entries[selectedItemIndex];
        this.openEntry(result.sourceID, result.entry);
      }
    }

    if (e.keyCode === 27) {
      this.closeSearch();
    }
  };

  /**
   * Open archive entry
   * @param {number} sourceID
   * @param {object} entry
   * @memberof ArchiveSearch
   */
  openEntry = (sourceID, entry) => {
    this.props.selectArchiveGroupAndEntry(sourceID, entry);

    this.closeSearch();
  };

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
    const { entries, searchTerm, selectedItemIndex } = this.state;
    const { t } = this.props;

    return (
      <SearchWrapper>
        <SearchOverlay onClick={this.closeSearch} />
        <Search flexColumn>
          <Input
            bordered
            onKeyDown={this.onInputKeyUpOrDown}
            ref={input => {
              this._input = input;
            }}
            onChange={this.changeSearchtermInput}
            value={this.state.searchTerm}
            placeholder={t('archive-search.searchterm')}
            type="text"
            entries={this.state.entries}
            searchTerm={this.state.searchTerm}
          />
          <Choose>
            <When condition={entries.length > 0}>
              <EntryList flexAuto>
                <Scrollbars
                  ref={el => (this.searchEntryList = el)}
                  autoHeight
                  autoHeightMax={300}
                >
                  {entries.map(
                    ({ entry, sourceID, groupID, path }, entryIndex) => (
                      <ListItem
                        selected={selectedItemIndex === entryIndex}
                        key={entryIndex}
                        onClick={() => this.openEntry(sourceID, entry)}
                      >
                        <Icon>
                          <EntryIcon entry={entry} />
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
                          <EntryFolder>
                            <For each="group" index="groupIndex" of={path}>
                              <If condition={groupIndex > 0}> › </If>
                              {group}
                            </For>
                          </EntryFolder>
                        </EntryData>
                      </ListItem>
                    )
                  )}
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
