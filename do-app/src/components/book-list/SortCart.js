import React, { useEffect, useState, useContext } from 'react';
import Shelf from './Shelf';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import ScrollToTopButton from '../utils/ScrollToTopButton';

export default function SortCart({ props, componentName }) {
  const {
    theme,
    uiMain,
    sortStates,
    setSortStates
  } = useContext(BooksContext);

  const {
    discont,
    newcart,
    popular,
    down_sort,
    up_sort,
    list_icon,
    comfy_icon
  } = useIcons();

  const [widthBlock, setWidthBlock] = useState(sortStates[componentName].view === 'list' ? 1 : 0);
  const [sortBooks, setSortBooks] = useState([]);
  const [selectedSort, setSelectedSort] = useState(sortStates[componentName].type);
  const [selectedDirection, setSelectedDirection] = useState(sortStates[componentName].direction);
  const [selectedWidth, setSelectedWidth] = useState(sortStates[componentName].view);
  const [priceblock, setPriceblock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(5);
      } else if (width < 1200) {
        setItemsPerPage(9);
      } else {
        setItemsPerPage(20);
      }
    };

    updateItemsPerPage(); 
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);
  
  const totalPages = Math.ceil(sortBooks.length / itemsPerPage);

  useEffect(() => {
    if (uiMain && uiMain.nopriceblock) {
      setPriceblock(true); // Price block is not displayed
    }
  }, [uiMain, uiMain.nopriceblock]);

  useEffect(() => {
    if (props) {
      setSortBooks(props);
    }
  }, [props]);

  useEffect(() => {
    setSelectedSort(sortStates[componentName].type);
    setSelectedDirection(sortStates[componentName].direction);
    setSelectedWidth(sortStates[componentName].view);

    if (props) {
      let sortedBooksCopy = [...props];
      if (sortStates[componentName].direction === 'lowPrice') {
        sortedBooksCopy.sort((a, b) => a.price - b.price);
      } else if (sortStates[componentName].direction === 'highPrice') {
        sortedBooksCopy.sort((a, b) => b.price - a.price);
      }
      if (sortStates[componentName].type) {
        sortedBooksCopy.sort((a, b) => (a.sorted === sortStates[componentName].type && b.sorted !== sortStates[componentName].type ? -1 : 1));
      }
      setSortBooks(sortedBooksCopy);
    }
  }, [sortStates, componentName, props]);

  const updateSortStates = (newState) => {
    setSortStates(prevStates => {
      const currentComponentState = prevStates[componentName];
      const updatedState = { ...currentComponentState, ...newState };

      // Check if the state actually changed
      if (JSON.stringify(currentComponentState) !== JSON.stringify(updatedState)) {
        return {
          ...prevStates,
          [componentName]: updatedState
        };
      }

      // Return the same state if nothing changed
      return prevStates;
    });
  };

  const sortBy = (type) => {
    if (selectedSort === type) return;
    let sortedBooksCopy = [...sortBooks];
    sortedBooksCopy.sort((a, b) => (a.sorted === type && b.sorted !== type ? -1 : 1));
    setSelectedSort(type);
    setSortBooks(sortedBooksCopy);
    setCurrentPage(1); // Reset to first page
    updateSortStates({ type });
  };

  const sortLowPrice = () => {
    if (selectedDirection === 'lowPrice') return;
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => a.price - b.price));
    setSelectedDirection('lowPrice');
    setCurrentPage(1); // Reset to first page
    updateSortStates({ direction: 'lowPrice' });
  };

  const sortHighPrice = () => {
    if (selectedDirection === 'highPrice') return;
    setSortBooks(prevBooks => [...prevBooks].sort((a, b) => b.price - a.price));
    setSelectedDirection('highPrice');
    setCurrentPage(1); // Reset to first page
    updateSortStates({ direction: 'highPrice' });
  };

  const list = () => {
    if (selectedWidth === 'list') return;
    setWidthBlock(1);
    setSelectedWidth('list');
    setCurrentPage(1); // Reset to first page
    updateSortStates({ view: 'list' });
  };

  const comfy = () => {
    if (selectedWidth === 'comfy') return;
    setWidthBlock(0);
    setSelectedWidth('comfy');
    setCurrentPage(1); // Reset to first page
    updateSortStates({ view: 'comfy' });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedBooks = sortBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className={theme}>
      <section className="filters">
        {sortBooks.length > 0 && (
          <div className="filters">
            <button className={`sort-button ${selectedWidth === 'list' && 'active'}`} onClick={list}>             
              <img className = 'back-button select'  src={list_icon} alt='List view' onClick={list} />
            </button>
            <button className={`sort-button ${selectedWidth === 'comfy' && 'active'}`} onClick={comfy}>              
              <img className = 'back-button select' src={comfy_icon} alt='Comfortable view' onClick={comfy} />
            </button>
            <button className={`sort-button ${selectedDirection === 'lowPrice' && 'active'}`} onClick={sortLowPrice}>             
              <img className = 'back-button select' src={up_sort} alt='price up' onClick={sortLowPrice} />
            </button>
            <button className={`sort-button ${selectedDirection === 'highPrice' && 'active'}`} onClick={sortHighPrice}>             
              <img className = 'back-button select' src={down_sort} alt='price down' onClick={sortHighPrice} />
            </button>

            {sortBooks.some(book => book.sorted === 'new') && (
              <button className={`sort-button ${selectedSort === 'new' && 'active'}`} onClick={() => sortBy('new')}>               
                <img src={newcart} className = 'back-button select' onClick={() => sortBy('new')} alt='newcart' />
              </button>
            )}
            {sortBooks.some(book => book.sorted === 'popular') && (
              <button className={`sort-button ${selectedSort === 'popular' && 'active'}`} onClick={() => sortBy('popular')}>                
                <img src={popular} className = 'back-button select' onClick={() => sortBy('popular')} alt='popular' />
              </button>
            )}
            {sortBooks.some(book => book.sorted === 'sale') && (
              <button className={`sort-button ${selectedSort === 'sale' && 'active'}`} onClick={() => sortBy('sale')}>                
                <img src={discont} className = 'back-button select' onClick={() => sortBy('sale')} alt='discont' />
              </button>
            )}
          </div>
        )}
      </section>
      {sortBooks.length === 0 && (
        <div className='no-found'> Oops found 0 try again </div>
      )}
      <ScrollToTopButton />
      <Shelf book={paginatedBooks} widhtblock={widthBlock} nopriceblock={priceblock} />

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (           
            <div
              key={index + 1}              
              className={`page-button  ${currentPage === index + 1 ? 'active-page' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}            
            </div>
          ))}
        </div>
      )}
    </section>
  );
}