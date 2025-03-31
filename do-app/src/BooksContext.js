import React, { createContext, useState } from 'react';

const BooksContext = createContext();

const BooksProvider = ({ children }) => { 
  const [books, setBooks] = useState([]); 
  const [specificBook, setSpecificBook] = useState({});
  const [fieldState, setFieldState] = useState({});
  const [uiState, setUiState] = useState([]);
  const [selectUiState, setSelectUiState] = useState([]);//
  const [uiMain, setUiMain] = useState([]);
  const [idLoudPrice, setIdLoudPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]); 
  const [theme, setTheme] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState('');
  const [promo, setPromo] = useState('');
  const [order, setOrder] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);  
  const [savedLogin, setSavedLogin] = useState('');
  const [savedPassword, setSavedPassword] = useState(''); 
  const [verificationCode, setVerificationCode] = useState(''); 
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState(null);  
  const [input, setInput] = useState('');
  const [selectedTags1, setSelectedTags1] = useState([]);
  const [selectedTags2, setSelectedTags2] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedTags3, setSelectedTags3] = useState([]);
  const [selectedTags4, setSelectedTags4] = useState([]);
  const [glsearch, setSearch] = useState('');
  const [searchOptions, setSearchOptions] = useState({
    section: true,
    partition: true,
    id: true,
    title: true,
    author: true,
    tags: false,
    description: false,
  }); 

const [showRegistrationForm, setShowRegistrationForm] = useState(false);
const [showSections, setShowSections] = useState({
  BookList: null,
  Search: null,
  Filter: null,
});

const [promoBookSlider, setPromoBookSlider] = useState({  
  Search: [],
  Filter: [],
});

const [sortStates, setSortStates] = useState({
  BookList: { type: '', direction: '', view: '' },
  Search: { type: '', direction: '', view: '' },
  Filter: { type: '', direction: '', view: '' },
});

const [rangePrice, setRangePrice] = useState([]);
const [userName, setUserName] = useState('');
const [userImg, setUserImg] = useState('');
const [ratingData, setRatingData] = useState([]);
const [productReviews, setProductReviews] = useState({});
const [itemId, setItemId] = useState(null);
const [currentPageContext, setCurrentPageContext] = useState(1);

  const contextValue = {
    message, setMessage, promo, setPromo, order, setOrder, loggedIn, setLoggedIn, savedLogin, setSavedLogin, savedPassword, setSavedPassword,
    totalPrice, setTotalPrice, cartItems, setCartItems, theme, setTheme, totalCount, setTotalCount, books, setBooks,
    specificBook, setSpecificBook, selectedSection, setSelectedSection,
    selectedSubsection, setSelectedSubsection, input, setInput, selectedTags1, setSelectedTags1, selectedTags2, setSelectedTags2,
    selectedAuthors, setSelectedAuthors, selectedSizes, setSelectedSizes, selectedColor, setSelectedColor, glsearch, setSearch, searchOptions, setSearchOptions,
    uiState, setUiState, uiMain, setUiMain, fieldState, setFieldState, idLoudPrice, setIdLoudPrice, selectedTags3, setSelectedTags3,
    selectedTags4, setSelectedTags4, showRegistrationForm, setShowRegistrationForm, selectUiState, setSelectUiState, sortStates, setSortStates,showSections, setShowSections,
    promoBookSlider, setPromoBookSlider,verificationCode, setVerificationCode, rangePrice, setRangePrice,userName, setUserName,userImg, setUserImg, ratingData, setRatingData,
    productReviews, setProductReviews, itemId, setItemId, currentPageContext, setCurrentPageContext
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};

export { BooksContext, BooksProvider };