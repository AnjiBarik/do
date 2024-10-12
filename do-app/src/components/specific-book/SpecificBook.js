import React, { useState, useEffect, useContext } from 'react';
import './specificBook.css';
import PriceBlock from './PriceBlock';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import { Link, useNavigate } from 'react-router-dom';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import InfoModal from '../utils/InfoModal';
import SpecificBookSlider from '../utils/SpecificBookSlider';
import getPublicUrl from '../functional/getPublicUrl';

export default function SpecificBook() {
  const { books, specificBook, theme, fieldState } = useContext(BooksContext);

  const {    
    notFound,
    discont,
    newcart, 
    popular,     
    back,    
    carticon,    
    zoomout,
    zoomin, } = useIcons();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate(); 
  const { id } = specificBook;  

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(() => books.find(book => book.id === id));
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorRGB, setColorRGB] = useState({}); 
  const folder = 'img';
  
  useEffect(() => {
    setSelectedBook(books.find(book => book.id === id));
  }, [id, books]);

  useEffect(() => {
    const processImages = () => {
        if (selectedBook) {
            let imageUrls = [];

            if (selectedBook.imageblockpublic && selectedBook.imageblockpublic !== '') {
                imageUrls = selectedBook.imageblockpublic.split(',').map(element =>
                    getPublicUrl({ folder, filename: element })
                );
            } else if (selectedBook.imageblock && selectedBook.imageblock !== '') {
                imageUrls = selectedBook.imageblock.split(',');
            }

            setImages(imageUrls);
        } else {
            setImages([]); // Handle the case where there are no image sources
        }
    };

    processImages();
}, [selectedBook]); 

  useEffect(() => {
    if (selectedBook && selectedBook.length !== 0) {
      const parseBlock = (block) => {
        if (!block || block === "") {
          return [];
        }

        const pairs = block.split(',').map(pair => {
          const [itemIds, value] = pair.trim().split(':');
          return { itemIds: itemIds.split(';').map(id => id.trim()), value };
        }).filter(pair => pair.itemIds.length > 0 && pair.value);

        const selectedPairs = pairs.filter(pair => pair.itemIds.includes(selectedBook.id));
        const otherPairs = pairs.filter(pair => !pair.itemIds.includes(selectedBook.id));

        return [...selectedPairs, ...otherPairs];
      };

      const sizesOrdered = parseBlock(selectedBook.sizeblock);
      const colorsOrdered = parseBlock(selectedBook.colorblock);

      setSizes(sizesOrdered);
      setColors(colorsOrdered);
    }
  }, [selectedBook]);

  const handleSizeClick = (itemId) => {   
    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  const handleColorClick = (itemId) => {    
    setCurrentImageIndex(0);
    const newSelectedBook = books.find(book => book.id === itemId);
    setSelectedBook(newSelectedBook);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  useEffect(() => {
    const parseColorBlock = (colorblock) => {
      if (!colorblock) {
        return {};
      }

      return colorblock.split(';')
        .map(colorItem => colorItem.split(':'))
        .reduce((acc, [colorName, rgb]) => ({
          ...acc,
          [colorName.trim()]: rgb.trim().slice(1, -1),
        }), {});
    };

    setColorRGB(parseColorBlock(fieldState.colorblock));
  }, [fieldState.colorblock]);

  useEffect(() => {
    if (books.length === 0 || specificBook.length === 0) {
      navigate('/');
    }
  }, [books, specificBook, navigate]);

  if (books.length === 0) {
    return null;
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Function to handle display of additional tags
  const renderTagRow = (tagKey, selectedBook, fieldState) => {
  
   const selectedTag = selectedBook?.[tagKey] ?? ''; 
   const fieldTag = fieldState?.[tagKey] ?? ''; 
  
   let sectionField = null;
   let sectionValue = selectedTag;

  // We check whether fieldTag is a string and whether it contains delimiters ";"
   if (typeof fieldTag === 'string' && fieldTag.includes(';')) {
    try {
      // We split the string into “section~value” pairs
      const tagPairs = fieldTag.split(';').map(pair => pair.split('~').map(s => s.trim()));
      
      const matchingPair = tagPairs.find(([sectionName]) => sectionName === selectedBook?.section);

      if (matchingPair) {
        sectionField = matchingPair[1]; 
      }
    } catch (error) {
      console.error(`Error parsing tag ${tagKey}: ${error}`);
    }
   }

   return (
    selectedTag && (
      <tr key={tagKey}>
        <td>
          <b>
            {/* If we found the field name for the section, use it, otherwise the standard field name */}
            {sectionField || (fieldTag && fieldTag !== "" ? fieldTag : `Tags ${tagKey.replace('tags', '')}:`)}
          </b>
        </td>
        <td>{sectionValue}</td>
      </tr>
    )
   );
  };

  return (
    <section className={theme}>
      <section className="filters">
        <div onClick={() => navigate(-1)}>
          <img src={back} className="back-button select" alt="Back to main page" />
        </div>
        <Link to="/cart">
          <img src={carticon} className="back-button select" alt="Go to cart" />
        </Link>
      </section>
      {selectedBook && (
        <section className="book-page">
          <section className="about"> 
            <div className="book-text">
              <b>{fieldState.id && fieldState.id !== "" ? fieldState.id : "id:"}</b>
              <span translate="no"><strong>{selectedBook.id}</strong></span>
              <div className={isFullscreen ? 'fullscreen-overlay' : 'img-conteiner'}>
                {selectedBook.sorted === 'new' &&
                  <img src={newcart} className="art-icon" alt="New" />
                }
                {selectedBook.sorted === 'sale' &&
                  <img src={discont} className="art-icon" alt="Discount" />
                }
                {selectedBook.sorted === 'popular' &&
                  <img src={popular} className="art-icon" alt="Popular" />
                }  
                <img               
                  src={images[currentImageIndex]}
                  alt={selectedBook.title}
                  onError={(e) => { e.target.src = notFound; }}
                  onClick={!isFullscreen? openFullscreen:closeFullscreen}
                  className={isFullscreen ? 'fullscreen-image' : (selectedBook.art === "width" ? 'artwidth' : 'art')}
                />
                {!isFullscreen && (
                  <div onClick={openFullscreen} className="zoom-button">
                    <img src={zoomin} alt="Zoom" className='zoom-img' />
                  </div>
                )}
                {isFullscreen && (
                  <div onClick={closeFullscreen} className="close-button">
                    <img src={zoomout} alt="Zoom Out" className='zoom-img' />
                  </div>
                )}
              </div>
            </div>
            <div className="book-buttons">            
              {selectedBook.imageblock.split(',').length > 1 &&
                selectedBook.imageblock.split(',').map((_, index) => (
                  <div className={`img-icon ${currentImageIndex === index ? 'selected-img-icon' : ''}`} key={index} onClick={() => handleImageClick(index)}>
                    <img
                      src={images[index]}
                      className='artmini-specific'
                      alt={selectedBook.title}
                      onError={(e) => {
                        e.target.src = notFound;
                      }}
                    />
                  </div>
                ))}
            </div>
            <div className="size-buttons" >
              {selectedBook.sizeblock !== undefined && selectedBook.size !== '' && (<b>{fieldState.size && fieldState.size !== "" ? fieldState.size : "Size:"}</b>)}
              {selectedBook.size !== '' && sizes.length > 0 &&
                sizes.map(({ itemIds, value }) => (
                  <div
                    key={itemIds.join(';')}
                    className={`size-button ${itemIds.includes(selectedBook.id) ? 'active-border' : ''}`}
                    onClick={() => handleSizeClick(itemIds[0])} // Handle selecting the first itemId for now
                  >
                  {value}
                  </div>
                ))}
              {selectedBook.sizeblock === "" && selectedBook.size !== '' &&  (<b className="size-button">{selectedBook.size}</b>)}
              {selectedBook.sizeblock !== undefined && selectedBook.size !== '' && fieldState.sizeblockinfo && fieldState.sizeblockinfo !== "" && (<InfoModal infotext={fieldState.sizeblockinfo}  />)}
            </div>
            <div className="size-buttons">
              {selectedBook.colorblock !== undefined && selectedBook.color !== '' && (<b>{fieldState.color && fieldState.color !== "" ? fieldState.color : "Color:"}</b>)}
              {selectedBook.color !== '' && colors.length > 0 &&
                colors.map(({ itemIds, value }) => (
                  <div
                    key={itemIds.join(';')}
                    className={`size-button ${itemIds.includes(selectedBook.id) ? 'active-border' : ''}`}
                    onClick={() => handleColorClick(itemIds[0])} // Handle selecting the first itemId for now
                  >
                    {value}
                    {colorRGB[value.trim()] && (
                        <span
                        className='circle' 
                        style={{ backgroundColor: `rgb(${colorRGB[value.trim()]})` }}
                      ></span>
                      )}
                  </div>
                ))}
              {selectedBook.colorblock === "" && selectedBook.color!=="" && (<b className="size-button" >
               {selectedBook.color}
               {colorRGB[selectedBook.color.trim()] && (
               <span
               className='circle'
               style={{ backgroundColor: `rgb(${colorRGB[selectedBook.color.trim()]})` }}
               ></span>
               )}
               </b>
              )}
            </div>
            <p className='cart-text'>
              <b>{fieldState.title && fieldState.title !== "" ? fieldState.title : "Product Name:"}</b>
              {selectedBook.title}
            </p>
            <PriceBlock showPrice={true} id={selectedBook.id} />
          
           </section>
          <section className="about">
            {selectedBook.author !== undefined && selectedBook.author !== "" && (
              <p>
                <b>{fieldState.author && fieldState.author !== "" ? fieldState.author : "Author:"}</b>
                <span>{selectedBook.author}</span>
              </p>
            )}
            {selectedBook.tags1 !== undefined && selectedBook.tags1 !== "" && (
              <p>
                <b>{fieldState.tags1 && fieldState.tags1 !== "" ? fieldState.tags1 : "Tags 1:"}</b>
                <span>{selectedBook.tags1}</span>
              </p>
            )}
            {selectedBook.tags2 !== undefined && selectedBook.tags2 !== "" && (
              <p>
                <b>{fieldState.tags2 && fieldState.tags2 !== "" ? fieldState.tags2 : "Tags 2:"}</b>
                <span>{selectedBook.tags2}</span>
              </p>
            )}
            {selectedBook.tags3 !== undefined && selectedBook.tags3 !== "" && (
              <p>
                <b>{fieldState.tags3 && fieldState.tags3 !== "" ? fieldState.tags3 : "Tags 3:"}</b>
                <span>{selectedBook.tags3}</span>
              </p>
            )}
            {selectedBook.tags4 !== undefined && selectedBook.tags4 !== "" && (
              <p>
                <b>{fieldState.tags4 && fieldState.tags4 !== "" ? fieldState.tags4 : "Tags 4:"}</b>
                <span>{selectedBook.tags4}</span>
              </p>
            )}

            {selectedBook.shortDescription !== undefined && selectedBook.shortDescription !== "" && (
              <p className='cart-text'>
                <b> {fieldState.shortDescription && fieldState.shortDescription !== "" ? fieldState.shortDescription : "shortDescription:"} </b>
                <span>{selectedBook.shortDescription}</span>
              </p>
            )}
          {(selectedBook.tags5 || selectedBook.tags6 || selectedBook.tags7 || selectedBook.tags8) && (
            <section className="about">
             <div className='size-buttons'>
              <b>{fieldState.additionalTags && fieldState.additionalTags !== "" ? fieldState.additionalTags : "Additional Tags:"}</b>
              {fieldState.additionalTagsinfo && fieldState.additionalTagsinfo !== "" && (<InfoModal infotext={fieldState.additionalTagsinfo} />)}
             </div>
            <table>
            <tbody>
              {['tags5', 'tags6', 'tags7', 'tags8'].map(tagKey => renderTagRow(tagKey, selectedBook, fieldState))}
            </tbody>
            </table>
            </section>
          )}  
        </section >        
          {selectedBook.description !== undefined && selectedBook.description !== "" && (
            <section className="about">
              <p className='cart-text'>
                <b>{fieldState.description && fieldState.description !== "" ? fieldState.description : "Description:"} </b>
                <span>{selectedBook.description}</span>
              </p>
            </section>         
          )}
          {selectedBook.Tip !== undefined && selectedBook.Tip !== "" && (
            
             <SpecificBookSlider />
                   
          )}
        </section>
      )}
      <ScrollToTopButton /> 
      
    </section>
  );
}