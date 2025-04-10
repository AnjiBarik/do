import React, { useEffect, useState, useContext, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './bookList.css';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import { applyFilters } from '../functional/applyFilters';
import SortCart from './SortCart';
import SliderSection from '../utils/SliderSection';
import BookSearch from './BookSearch';
import Slider from './Slider';
import { FilterSection } from './FilterSection';
import PriceFilter from './SortPrice';
import FloatingShareButton from './FloatingShareButton';
import { useRatings } from "../hooks/useRatings";
const PromoBookSlider = lazy(() => import('../utils/PromoBookSlider'));




export default function BookList() {
  const {    
    theme,
    books,
    selectedSection,
    setSelectedSection,
    selectedSubsection,
    setSelectedSubsection,
    input,
    setInput,
    selectedTags1,
    setSelectedTags1,
    selectedTags2,
    setSelectedTags2,
    selectedTags3,
    setSelectedTags3,
    selectedTags4, 
    setSelectedTags4,
    selectedSizes,
    setSelectedSizes,
    selectedColor,
    setSelectedColor,
    selectedAuthors,
    setSelectedAuthors,
    fieldState,
    showSections, 
    setShowSections,
    setPromoBookSlider,
    rangePrice, setRangePrice,
    itemId, setItemId, setSpecificBook 
  } = useContext(BooksContext);

  const {    
    category,
    cancel,
    upmenu,
    filter,   
    filterremove,
    burger  } = useIcons();
    
    const location = useLocation();
    const firstSubmit = location.state?.firstSubmit || false;  
    const { loadingRatings } = useRatings(firstSubmit);
  
  const [uniqueTags1, setUniqueTags1] = useState([]);
  const [uniqueTags2, setUniqueTags2] = useState([]);
  const [uniqueTags3, setUniqueTags3] = useState([]); 
  const [uniqueTags4, setUniqueTags4] = useState([]); 
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);   


  const [sortedBooks, setSortedBooks] = useState(() => {
    const filteredBooks = books.filter((book) => book.Visibility !== '0');
    return filteredBooks;
  });

  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState({});  

  const navigate = useNavigate();    

  useEffect(() => {
    if (!loadingRatings && itemId && books.length > 0) {        
      const foundItem = books.find(item => item.id === itemId);
      
      if (foundItem) { 
        window.history.pushState({ from: location.pathname }, '', '/BookList');              
        setSpecificBook({ id: itemId }); 
        navigate(`/SpecificBook`, { replace: true });  
      } else {                
        console.log('notfound ID');
      }
  
      setItemId(null); 
    }
  }, [itemId, books, loadingRatings, setItemId, setSpecificBook, navigate, location.pathname ]);


  const [visibility, setVisibility] = useState({
    Size: false,
    Color: false,
    Author: false,
    Tags1: false,
    Tags2: false,
    Tags3: false,
    Tags4: false,
  });
 
  const toggleSections = (sectionName) => {
    setShowSections(prevState => ({
      ...prevState,
      [sectionName]: !prevState[sectionName]
    }));
  };



  const handleSelection = useCallback(
    (item, setSelectedItems) => {
      setSelectedItems((prevItems) =>
        prevItems.includes(item)
          ? prevItems.filter((selectedItem) => selectedItem !== item)
          : [...prevItems, item]
      );
    },
    []
  );

  const toggleVisibility = (section) => {   
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [section]: !prevVisibility[section],
    }));
  };  

  const findBook = useCallback(() => {
  
    const filters = {
      selectedSection,
      selectedSubsection,
      selectedTags1,
      selectedTags2,
      selectedTags3,
      selectedTags4,
      selectedSizes,
      selectedColor,
      selectedAuthors,     
      input,
      rangePrice
    };

    let filteredBooks = applyFilters(books, filters);

    setSortedBooks(filteredBooks);
  }, [ books, input, selectedSizes, selectedColor, selectedAuthors, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedSection, selectedSubsection, rangePrice]);

  const findUniqueValues = useCallback(() => {
    const uniqueTags1Set = new Set();
    const uniqueTags2Set = new Set();
    const uniqueTags3Set = new Set();
    const uniqueTags4Set = new Set();
    const uniqueSizesSet = new Set();
    const uniqueColorSet = new Set();
    const uniqueAuthorsSet = new Set();  
    
    const filteredBooks = books.filter((book) => book.Visibility !== '0');  
    
    const getFilteredArray = (set, key, selectedValues) => {
      filteredBooks.forEach((book) => {
        if (book[key] !== null && book[key] !== undefined && book[key].toString().trim() !== '') {
          set.add(book[key]);
        }
      });  
     
      return selectedValues.length > 0 ? Array.from(set) : Array.from(set);
    };
  
    setUniqueTags1(getFilteredArray(uniqueTags1Set, 'tags1', selectedTags1));
    setUniqueTags2(getFilteredArray(uniqueTags2Set, 'tags2', selectedTags2));
    setUniqueTags3(getFilteredArray(uniqueTags3Set, 'tags3', selectedTags3));
    setUniqueTags4(getFilteredArray(uniqueTags4Set, 'tags4', selectedTags4));
    setUniqueSizes(getFilteredArray(uniqueSizesSet, 'size', selectedSizes));
    setUniqueColor(getFilteredArray(uniqueColorSet, 'color', selectedColor));
    setUniqueAuthors(getFilteredArray(uniqueAuthorsSet, 'author', selectedAuthors));
  
  }, [books, selectedTags1, selectedTags2, selectedTags3, selectedTags4, selectedSizes, selectedColor, selectedAuthors]);   
  

  useEffect(() => {
    findBook();
    findUniqueValues();  
  }, [findBook, findUniqueValues]); 


  useEffect(() => {
    if (showSections.Filter === null) {
      setShowSections(prevState => ({ ...prevState, Filter: false }));
    }
    if (showSections.BookList === null) {
      setShowSections(prevState => ({ ...prevState, BookList: false }));
    }
  }, [showSections, setShowSections]);

  useEffect(() => {
    // Set the first 5 IDs from sortedBooks into promoBookSlider for BookList
    const bookIds = sortedBooks.slice(0, 5).map(book => book.id);
    setPromoBookSlider(prevState => ({ ...prevState, Filter: bookIds }));
  }, [sortedBooks, setPromoBookSlider]);

 // Populate sections and subsections from books
 useEffect(() => {
  if (books.length > 0) {
    const uniqueSections = ['Show all', ...new Set(books.map(book => book.section))];
    setSections(uniqueSections);

    const subs = {};
    books.forEach(book => {
      if (!subs[book.section]) subs[book.section] = new Set();
      if (book.partition) {
        subs[book.section].add(book.partition);
      }
    });
    setSubsections(subs);
  }
}, [books]); 


  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books, navigate]);

  if (books.length === 0) {
    return null;
  }

  const handleStateChange = (key, value) => {
    if (key === 'input') {
      setInput(value);
    }
  };


  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setSelectedSubsection(null);   
  };

  const handleSubsectionClick = (subsection) => {
    setSelectedSubsection(subsection);    
  };

  const handleResetRangePrice = () => {
    setRangePrice([]);    
  };

   const resetFilters = () => {
    setInput('');     
    setSelectedTags1([]);
    setSelectedTags2([]);
    setSelectedTags3([]); 
    setSelectedTags4([]); 
    setSelectedSizes([]);
    setSelectedColor([]);
    setSelectedAuthors([]);
    setSortedBooks(books.filter((book) => book.Visibility !== '0'));
    setRangePrice([]); 
  };   

  const renderSelectedButton = (label, value, onClick, field, colorBlock) => {    
    const colorRGB = colorBlock
      ? colorBlock
          .split(';')
          .map(colorItem => colorItem.split(':'))
          .reduce(
            (acc, [colorName, rgb]) => ({
              ...acc,
              [colorName.trim()]: rgb.trim().slice(1, -1),
            }),
            {}
          )
      : {};
  
    return (
      <button className="selected-button active" key={value} onClick={onClick}>
        {label === "Section" || label === "Subsection" ? (
          <img className="cancel-button select" src={category} alt="Product sections" />
        ) : (
          <img className="cancel-button select" src={filter} alt="Filter" />
        )}
  
        {field && field !== "" ? `${field} ` : `${label}: `}  
        
        {label === "Color" && colorRGB[value.trim()] && (
          <span
            className="circle"
            style={{
              backgroundColor: `rgb(${colorRGB[value.trim()]})`,
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              marginRight: '5px',
              verticalAlign: 'middle',
              border: '1px solid #000',
            }}
          ></span>
        )}
  
        {value}
  
        <img className="cancel-button select" src={cancel} alt="cancel" />
      </button>
    );
  };  

  const hasActiveFilters = (includeSections = false) => {
    return (
      (includeSections && selectedSection && selectedSection !== "Show all") ||
      (includeSections && selectedSubsection) ||
      rangePrice.length > 0 ||
      input ||
      selectedSizes.length > 0 ||
      selectedColor.length > 0 ||
      selectedAuthors.length > 0 ||
      selectedTags1.length > 0 ||
      selectedTags2.length > 0 ||
      selectedTags3.length > 0 ||
      selectedTags4.length > 0
    );
  };
  
  

  
  const hasBanners = fieldState && Object.keys(fieldState).some(key => key.startsWith("baner"));

  return (
    <>
      <section className={theme}>
        <BookSearch />
        {hasBanners && (
        <Suspense fallback={<div>Loading...</div>}>
          <Slider />
        </Suspense>
      )}
        {/* Render PromoBookSlider for BookList */}
        <Suspense fallback={<div>Loading...</div>}>
          <PromoBookSlider prompt="BookList" />
        </Suspense>        
        <SliderSection />
  
        <section className="filters betwin">
          <button className='sort-button'>
            {!showSections.BookList ? (
              <div className='filters-slider-text' onClick={() => toggleSections("BookList")}>
              <img
                className="back-button select"
                src={category}                
                alt="Product sections"
              /><p>Catalog</p>
              </div>
            ) : (
              <div onClick={() => toggleSections("BookList")}>
                <img className="back-button select active-border" src={category} alt="Product sections" />
                <img className="cancel-button select" src={upmenu} alt="Cancel Product sections" />
              </div>
            )}
          </button>
          <button className='sort-button'>
            {!showSections.Filter ? (
              <div className='filters-slider-text' onClick={() => toggleSections("Filter")}>
                <p>Filters</p>
              <img
                className="back-button select"
                src={filter}                
                alt='filter'
              />
              </div>
            ) : (
              <div onClick={() => toggleSections("Filter")}>
                <img className="back-button select active-border" src={filter} alt="Filter" />
                <img className="cancel-button select" src={upmenu} alt="Cancel Filter" />
              </div>
            )}
          </button>
        </section>
  
        <section className="filters" key={`${selectedSection}-${selectedSubsection}`}>
          <div className="selected-tags">
            <span className="selected-button">
            {hasActiveFilters(true) && (
              <img
              className="social-icon select"
              src={filterremove}
              alt="filterremove"
              onClick={() => {
               handleSectionClick("Show all");
               resetFilters();
              }}
              />
            )}

              Found: <strong>{sortedBooks.length}</strong>
            </span>
  
            {selectedSection && renderSelectedButton(
              "Section",
              selectedSection,
              () => handleSectionClick('Show all')
            )}
  
            {selectedSubsection && renderSelectedButton(
              "Subsection",
              selectedSubsection,
              () => handleSubsectionClick(null)
            )}

            {rangePrice.length>0 && renderSelectedButton(
              "Filter by Price",
             `${rangePrice[0]}${fieldState.payment ? fieldState.payment : ""} >< ${rangePrice[1]}${fieldState.payment ? fieldState.payment : ""}`,
              () => handleResetRangePrice()
            )}
  
            {input && renderSelectedButton(
              "Filter by",
              input,
              () => handleStateChange('input', '')
            )}
  
            {selectedSizes.map(size =>
              renderSelectedButton(
                "Size",
                size,
                () => handleSelection(size, setSelectedSizes),
                fieldState.size
              )
            )}
  
            {selectedColor.map(color =>
              renderSelectedButton(
                "Color",
                color,
                () => handleSelection(color, setSelectedColor),
                fieldState.color,
                fieldState.colorblock || "" // Pass colorBlock only for color
              )
            )}
  
            {selectedAuthors.map(author =>
              renderSelectedButton(
                "Author",
                author,
                () => handleSelection(author, setSelectedAuthors),
                fieldState.author
              )
            )}
  
            {selectedTags1.map(tag =>
              renderSelectedButton(
                "Tags 1",
                tag,
                () => handleSelection(tag, setSelectedTags1),
                fieldState.tags1
              )
            )}
  
            {selectedTags2.map(tag =>
              renderSelectedButton(
                "Tags 2",
                tag,
                () => handleSelection(tag, setSelectedTags2),
                fieldState.tags2
              )
            )}
  
            {selectedTags3.map(tag =>
              renderSelectedButton(
                "Tags 3",
                tag,
                () => handleSelection(tag, setSelectedTags3),
                fieldState.tags3
              )
            )}
  
            {selectedTags4.map(tag =>
              renderSelectedButton(
                "Tags 4",
                tag,
                () => handleSelection(tag, setSelectedTags4),
                fieldState.tags4
              )
            )}
          </div>
        </section>
  <section className='container'>
        {/* Sections and subsections list */}
        <section className='sectionGrup'>
        {showSections.BookList && (
  <div id="container-section" className='container-section'>
    <div className="filters">
      <img className="social-icon select" src={category} alt="catalog" />
      <h2>Categories</h2>
    </div>

    <div className="sections-wrapper">
      <ul id="section-list" className="section-list no-markers">        
        <div 
          className={`section-sections ${selectedSection === "Show all" ? "active-border" : ""}`}
          onClick={() => handleSectionClick("Show all")}
        >
          <h3>Show all</h3>
        </div>
       
        {sections.map((section, index) => (
          section !== "Show all" && subsections[section] && subsections[section].size > 0 && (
            <div key={index} className="section-container">
              <div
                onClick={() => handleSectionClick(section)}
                className={`section-sections ${selectedSection === section ? "active-border" : ""}`}
              >
                <h3>
                  <img 
                    className="cancel-button select" 
                    src={fieldState[`section:${section}`] || burger} 
                    alt="Section Icon" 
                    onError={(e) => e.target.src = burger} 
                  />
                  {section}
                  <img
                    className={`toggle-icon social-icon select ${selectedSection === section ? "rotated" : ""}`}
                    src={upmenu}
                    alt="Toggle Filter"
                  />
                </h3>
              </div>

              {selectedSection === section && (
                <div className="partition-list-container">
                  <ul className="partition-list no-markers">
                    {Array.from(subsections[selectedSection] || []).map((subsection, subIndex) => (
                      <li
                        key={subIndex}
                        onClick={() => handleSubsectionClick(subsection)}
                        className={selectedSubsection === subsection ? "active" : ""}
                      >
                        {subsection}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        ))}
      </ul>
    </div>

    <section className="filters">
      <button className='sort-button' onClick={() => toggleSections("BookList")}>
        <img className="back-button select" src={upmenu} alt="Cancel" />
      </button>
    </section>   
  </div>
)}
  
        {showSections.Filter && (
          <div id="sectionFilter" className='sectionFilter'>
           <div className="filters betwin">
           <div className="filters">
            <img className="social-icon select" src={filter} alt="Filters" />
            <h2>Filters</h2>
           </div>
           <button className='sort-button' onClick={resetFilters} disabled={!hasActiveFilters(false)}>
             Reset
            <img className='social-icon select' src={filterremove} alt='filterremove' />
           </button>
          </div>
            
  <PriceFilter prompt={sortedBooks} />
  
            <section className="filters">
              <input
                onChange={(e) => handleStateChange('input', e.target.value)}
                type="search"
                className='form-input'                
                title="Filter by id name author"
                placeholder="Filter by id name author..."
                value={input}
              />             
            </section>
  
            <section className="filters">
              <div className="section-list">
                <h3>Filter by #Tags</h3>
  
                <FilterSection
                  title="Size"
                  uniqueItems={uniqueSizes}
                  selectedItems={selectedSizes}
                  field={fieldState.size}
                  visibilityKey={visibility.Size}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedSizes}
                />
  
                <FilterSection
                  title="Color"
                  uniqueItems={uniqueColor}
                  selectedItems={selectedColor}
                  field={fieldState.color}
                  visibilityKey={visibility.Color}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedColor}
                  colorBlock={fieldState.colorblock} // Передаем только сюда
                />
  
                <FilterSection
                  title="Author"
                  uniqueItems={uniqueAuthors}
                  selectedItems={selectedAuthors}
                  field={fieldState.author}
                  visibilityKey={visibility.Author}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedAuthors}
                />
  
                <FilterSection
                  title="Tags1"
                  uniqueItems={uniqueTags1}
                  selectedItems={selectedTags1}
                  field={fieldState.tags1}
                  visibilityKey={visibility.Tags1}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedTags1}
                />
  
                <FilterSection
                  title="Tags2"
                  uniqueItems={uniqueTags2}
                  selectedItems={selectedTags2}
                  field={fieldState.tags2}
                  visibilityKey={visibility.Tags2}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedTags2}
                />
  
                <FilterSection
                  title="Tags3"
                  uniqueItems={uniqueTags3}
                  selectedItems={selectedTags3}
                  field={fieldState.tags3}
                  visibilityKey={visibility.Tags3}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedTags3}
                />
  
                <FilterSection
                  title="Tags4"
                  uniqueItems={uniqueTags4}
                  selectedItems={selectedTags4}
                  field={fieldState.tags4}
                  visibilityKey={visibility.Tags4}
                  toggleVisibility={toggleVisibility}
                  handleSelection={handleSelection}
                  setSelectedItems={setSelectedTags4}
                />
              </div>
            </section>
         
      
          <section className="filters">
            <button className='sort-button'>
              <img className="back-button select" src={upmenu} onClick={() => toggleSections("Filter")} alt="Cancel" />
            </button>
          </section>
          </div>
        )}
        </section>  
       <section className="container-book">
       {loadingRatings && 
      //  <p>⭐⭐⭐⭐⭐</p>
       <div style={{ 
        width: '100%', 
        height: '50px', 
        position: 'relative',     
        borderRadius: '25px', 
        overflow: 'hidden',
        marginTop: '20px'
      }}>
        <div className="progress" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '0%',       
          borderRadius: '25px',
          textAlign: 'center',     
          lineHeight: '50px',
          color: '#ffd700',
          fontSize: '1.5rem',
          animation: 'fill 2s linear forwards'
        }}>
          ★★★★★ 
        </div>
        <style>
          {`
            @keyframes fill {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}
        </style>
      </div>
       }
        <SortCart props={sortedBooks} componentName="Filter" />
       </section>
  </section>  
  <FloatingShareButton />
    </section>
    </>    
  );  
}  