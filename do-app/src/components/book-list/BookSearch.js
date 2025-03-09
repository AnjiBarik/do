import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import SortCart from './SortCart';
import './BookSearch.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';

const BookSearch = () => {

  const { books, fieldState, setPromoBookSlider, glsearch, setSearch,searchOptions, setSearchOptions } = useContext(BooksContext);
  const { upmenu, search, cancel } = useIcons();
  const [filteredResults, setFilteredResults] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [selectedKey, setSelectedKey] = useState('all');
  const [showTotalResults, setShowTotalResults] = useState(true);  
  const searchInputRef = useRef(null);

   const debouncedSearch = useDebounce(glsearch, 300);
 
  useEffect(() => {
    if (debouncedSearch) {
      try {
        const visibleBooks = books.filter((book) => book.Visibility !== '0');
        const results = {};

        Object.keys(searchOptions).forEach((key) => {
          if (searchOptions[key]) {
            let matches = [];

            if (key === 'tags') {
              matches = visibleBooks.filter((book) =>
                ['tags1', 'tags2', 'tags3', 'tags4', 'tags5', 'tags6', 'tags7', 'tags8', 'size', 'color']
                  .some(tagKey => book[tagKey] && book[tagKey].toString().toLowerCase().includes(debouncedSearch.toLowerCase()))
              );
            } else {
              matches = visibleBooks.filter((book) =>
                book[key] && book[key].toString().toLowerCase().includes(debouncedSearch.toLowerCase())
              );
            }

            if (matches.length > 0) {
              results[key] = matches;
            }
          }
        });

        setFilteredResults(results);
        setShowOptions(Object.keys(results).length > 0); 
      } catch (error) {
        console.error('Error during search:', error);
      }
    } else {
      setFilteredResults({});
      setShowOptions(false); 
    }
  }, [debouncedSearch, searchOptions, books]);

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setSearchOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked
    }));
  };

  const getTotalMatches = () => {
    return Object.values(filteredResults).reduce((total, matches) => total + matches.length, 0);
  };

  const getTotalMatchesArray = useCallback(() => {
    const allMatches = Object.values(filteredResults).flat();
    const uniqueMatches = Array.from(new Set(allMatches.map(book => book.id)))
      .map(id => allMatches.find(book => book.id === id));
    return uniqueMatches;
  }, [filteredResults]);

  const handleLinkClick = (key) => {
    setSelectedKey(key);
    setShowTotalResults(key === 'all');
  };

  const resetSearch = () => {
    setSearch('');
  };

  const imageStyle = {
    transform: showOptions ? 'none' : 'rotate(180deg)',
  };

  useEffect(() => {
    const totalMatchesArray = getTotalMatchesArray();
    setPromoBookSlider(prevState => ({
      ...prevState,
      Search: totalMatchesArray.slice(0, 5).map(book => book.id)
    }));
  }, [getTotalMatchesArray, setPromoBookSlider]);

  return (
    <div className='search-filters'>
      <div className="search-bar">
        <img className="cancel-button select" onClick={() => {
          // Focus the input element when the image is clicked
          searchInputRef.current.focus();
        }} src={search} alt="search" />
        <input
          id="search-input"
          className='search-input'          
          type="text"
          value={glsearch}
          onChange={(e) => setSearch(e.target.value)}
          title="Search by id name author..."
          placeholder="Search by ..."
          ref={searchInputRef} // Assign the ref to the input element
        />
        {glsearch && glsearch !== '' && (
          <img
            className="cancel-button select"
            onClick={() => resetSearch()}
            src={cancel}
            alt="cancel"
          />
        )}
        <button className="selected-button" onClick={() => setShowOptions(!showOptions)}>
          <img className="cancel-button select" src={upmenu} alt="upmenu" style={imageStyle} />
        </button>
        {!getTotalMatches() > 0 && glsearch !== '' && <p className='sort-button'> Oops, nothing found...</p>}
      </div>

      {showOptions && (
        <>
          <div className="search-options">
            {Object.keys(searchOptions).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={searchOptions[key]}
                  onChange={handleOptionChange}
                />
                {fieldState[key] && fieldState[key] !== "" ? fieldState[key] : key}
              </label>
            ))}
          </div>

          {Object.keys(filteredResults).length > 0 && (
            <div className="search-results-container">
              <div className="search-results">
                {Object.keys(filteredResults).map((key) => (
                  <p
                    key={key}
                    className={`search-link ${selectedKey === key ? 'active' : ''}`}
                    onClick={() => handleLinkClick(key)}
                  >
                    {fieldState[key] && fieldState[key] !== "" ? fieldState[key] : key} : {filteredResults[key].length} matches
                  </p>
                ))}
                <p                  
                  className={`search-link ${selectedKey === 'all' ? 'active' : ''}`}
                  onClick={() => handleLinkClick('all')}
                >
                  Total matches across all keys: {getTotalMatches()} 
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    quantity: {getTotalMatchesArray().length}
                  </span>
                </p>
              </div>

              {getTotalMatches() > 0 && (
                <div className="search-results-content">
                  {showTotalResults ? (
                    <SortCart props={getTotalMatchesArray()} componentName="Search" />
                  ) : (
                    selectedKey !== 'all' && <SortCart props={filteredResults[selectedKey]} componentName="Search" />
                  )}
                </div>
              )}
            </div>         
          )}
        </>
      )}
    </div>
  );
};

export default BookSearch;