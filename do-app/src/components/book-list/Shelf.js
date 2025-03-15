import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../utils/LazyImage';
import PriceBlock from '../specific-book/PriceBlock';
import getPublicUrl from '../functional/getPublicUrl';
import { BooksContext } from '../../BooksContext';
import { useIcons } from '../../IconContext';
import RatingDisplay from './RatingDisplay';

export default function Shelf(props) {
  const { setSpecificBook, fieldState, ratingData, uiMain } = useContext(BooksContext);  
  const {
    discont,
    newcart, 
    popular,  } = useIcons();
  const currentImageIndex = 0
  
  const folder = 'img';

  const shelf = props.book.map((el, index) => {
  
    const imagespublic = el.imageblockpublic && el.imageblockpublic !== ""
    ? el.imageblockpublic.split(',').map(element =>
        getPublicUrl({ folder, filename: element })
    )
    : el.imageblock.split(',');

    // Determine the source of the image
    const imageSource = el.imagepublic && el.imagepublic !== ""
    ? getPublicUrl({ folder, filename: el.imagepublic })
    : el.image && el.image !== ''
        ? el.image
        : imagespublic[currentImageIndex];

    const colorRGB = fieldState.colorblock
      ? fieldState.colorblock
          .split(';')
          .map(colorItem => colorItem.split(':'))
          .reduce((acc, [colorName, rgb]) => ({ ...acc, [colorName.trim()]: rgb.trim().slice(1, -1) }), {})
      : {};

    return (
      <section key={el.id} className='shelf-element'>
        <div         
          id={el.id}
          className={`book custom-element ${props.widhtblock === 1 ? 'widhtblock' : 'widhtblock1'}`}
        >
          <div className='img-container'>
         
          <div className='img-conteiner'>  
          <Link
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit'  }}
              to='/specificbook'
              onClick={() => bookInfo(el.id)}
          >
            <p className='book-id'>
              <b translate="no">{fieldState.id && fieldState.id !== '' ? fieldState.id : 'id:'}</b>
              <span translate="no"><strong>{el.id}</strong></span>
              {uiMain.Review && ( <RatingDisplay idPrice={fieldState.idprice} idProduct={el.id} ratingData={ratingData} /> )}  
            </p> 
            {el.sorted === 'new' && <img src={newcart} className='art-icon' alt='New Cart' />}
            {el.sorted === 'sale' && <img src={discont} className='art-icon' alt='Discount Cart' />}
            {el.sorted === 'popular' && <img src={popular} className='art-icon' alt='Popular Cart' />}
           
            {el.size !== undefined && el.size !== '' && (
             
                <div className='book-text'>
                  <b className='book-size'>
                    {fieldState.size && fieldState.size !== '' ? fieldState.size : 'Size'}
                    {el.sizeblock && el.sizeblock !== '' ? 
                     <>
                     <div className='sizecolor noborderleft'><b>{el.size}</b></div>
                     <div className='sizecolor noborderright'>&nbsp;</div>
                     </>
                      : <b>&nbsp;{el.size}</b>
                      }
                  </b>
                </div>
            
            )}
            {el.color !== undefined && el.color !== '' && (
             
                <div className='book-text'>
                  <b className='book-size color-size'>
                    {fieldState.color && fieldState.color !== '' ? fieldState.color : 'Color '}
                    {el.colorblock && el.colorblock !== '' ? (
                      <>
                      <div className='sizecolor noborderleft'>                        
                        <b>{el.color}</b>
                        {colorRGB[el.color.trim()] && (
                           <span
                           className='circle' 
                           style={{ backgroundColor: `rgb(${colorRGB[el.color.trim()]})` }}
                         ></span>
                        )} 
                      </div> 
                      <div className='sizecolor noborderright'>&nbsp;</div>
                      </>
                    ) : (
                      <>
                      <b>&nbsp;{el.color}</b>
                      {colorRGB[el.color.trim()] && (
                        <span
                        className='circle' 
                        style={{ backgroundColor: `rgb(${colorRGB[el.color.trim()]})` }}
                      ></span>
                      )}
                      </>
                    )}
                  </b>
                </div>              
            )}
           
            <LazyImage
                  src={imageSource}
                  alt={el.title}                 
                  className={
                    props.widhtblock === 1
                      ? el.art === 'width'
                        ? 'widthartwidth lazy-img'
                        : 'widthart lazy-img'
                      : el.art === 'width'
                        ? 'artwidth lazy-img'
                        : 'art lazy-img'
                  }
                />                          
          </Link>
          </div>
         
          <div className={
            props.widhtblock === 1
            ? el.art === 'width'
            ? 'widthname-block-width'
            : 'widthname-block'
            : el.art === 'width'
            ? 'name-block-width'
            : 'name-block'
          }>
             <Link
                style={{ cursor: 'pointer' }}
                to='/specificbook'
                onClick={() => bookInfo(el.id)}
              >

            <p className='book-name'>              
              {el.title.length >= 24 ? el.title.slice(0, 26) + '...' : el.title}
            </p>
            </Link>            
          </div>
        </div>
        {props.widhtblock === 1 && (
          <div className={el.art === 'width' ? 'book-conteiner-width' : 'book-conteiner'}>
            {el.shortDescription !== undefined && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>
                  {fieldState.shortDescription && fieldState.shortDescription !== ''
                    ? fieldState.shortDescription
                    : 'shortDescription:'}
                </b>{' '}
                {el.shortDescription.length >= 24  ? el.shortDescription.slice(0, 46) + '...' : el.shortDescription}
              </p>
            )}
            {el.author !== undefined && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.author && fieldState.author !== '' ? fieldState.author : 'Author:'}</b> {el.author}
              </p>
            )}
            {el.tags1 !== undefined && el.tags1 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags1 && fieldState.tags1 !== '' ? fieldState.tags1 : 'Tags 1:'}</b> {el.tags1}
              </p>
            )}
            {el.tags2 !== undefined && el.tags2 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags2 && fieldState.tags2 !== '' ? fieldState.tags2 : 'Tags 2:'}</b> {el.tags2}
              </p>
            )}
            {el.tags3 !== undefined && el.tags3 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags3 && fieldState.tags3 !== '' ? fieldState.tags3 : 'Tags 3:'}</b> {el.tags3}
              </p>
            )}
            {el.tags4 !== undefined && el.tags4 !== '' && props.widhtblock === 1 && (
              <p className='book-text'>
                <b>{fieldState.tags4 && fieldState.tags4 !== '' ? fieldState.tags4 : 'Tags 4:'}</b> {el.tags4}
              </p>
            )}
          </div>
        )}
        
       {!props.nopriceblock && (
        <div className='book-price'>         
          <PriceBlock showPrice={true} id={el.id} />
        </div>
       )} 
        </div>
      </section>
    );
  });


  const bookInfo = (id) => {    
    setSpecificBook({id});   
  };

  return <section id='shelf-book-list' className='book-list'>{shelf}</section>;
}