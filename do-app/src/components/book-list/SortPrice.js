import React, { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../../BooksContext';
import './PriceFilter.css'; 

const PriceFilter = ({ prompt }) => {
  const { rangePrice, setRangePrice, fieldState } = useContext(BooksContext);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [range, setRange] = useState([0, 0]);

  const [tempMin, setTempMin] = useState('0'); 
  const [tempMax, setTempMax] = useState('0'); 

  useEffect(() => {
    if (prompt.length > 0) {
      const prices = prompt.map(book => book.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);

      if (rangePrice && rangePrice.length > 0) {
        setRange(rangePrice);
        setTempMin(String(rangePrice[0]));
        setTempMax(String(rangePrice[1]));
      } else {
        setRange([min, max]);
        setTempMin(String(min));
        setTempMax(String(max));
      }
    }
  }, [prompt, rangePrice]);
  
  const validateInput = (value) => {
    return value === '' || /^[0-9]*\.?[0-9]*$/.test(value); // Numbers and period
  };
  
  const handleMinChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setTempMin(value); 
    }
  };
  
  const handleMaxChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setTempMax(value); 
    }
  };
 
  const handleMinBlur = () => {
    const parsedValue = parseFloat(tempMin); 
    if (isNaN(parsedValue) || parsedValue < minPrice) {
      setRange([minPrice, range[1]]); 
      setTempMin(String(minPrice));   
    } else if (parsedValue > range[1]) {
      setRange([range[1], range[1]]); 
      setTempMin(String(range[1]));
    } else {
      setRange([parsedValue, range[1]]);
    }
  };
  
  const handleMaxBlur = () => {
    const parsedValue = parseFloat(tempMax); 
    if (isNaN(parsedValue) || parsedValue > maxPrice) {
      setRange([range[0], maxPrice]); 
      setTempMax(String(maxPrice));   
    } else if (parsedValue < range[0]) {
      setRange([range[0], range[0]]); 
      setTempMax(String(range[0]));
    } else {
      setRange([range[0], parsedValue]);
    }
  };
 
  const handleRangeMinChange = (value) => {
    setRange([value, range[1]]);
    setTempMin(String(value)); 
  };

  const handleRangeMaxChange = (value) => {
    setRange([range[0], value]);
    setTempMax(String(value)); 
  };

  const handleApply = () => {
    setRangePrice(range);
  };

  const handleReset = () => {
    setRangePrice([]);
    setRange([minPrice, maxPrice]);
    setTempMin(String(minPrice));
    setTempMax(String(maxPrice));
  };
 
  const arraysEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  return (
    <div className="price-filter">
      <h3>Filter by Price</h3>
      <div className="range-slider">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={range[0]}
          onChange={(e) => handleRangeMinChange(Number(e.target.value))} 
          className="slider"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={range[1]}
          onChange={(e) => handleRangeMaxChange(Number(e.target.value))} 
          className="slider"
        />

        <div className="range-values">
          <span translate="no">Min: {fieldState.payment ? fieldState.payment : ""}
            <input
              type="text" 
              className='form-input'
              value={tempMin}
              onChange={handleMinChange} 
              onBlur={handleMinBlur}     
            />
          </span>
          <span translate="no">Max: {fieldState.payment ? fieldState.payment : ""}
            <input
              type="text" 
              className='form-input'
              value={tempMax}
              onChange={handleMaxChange} 
              onBlur={handleMaxBlur}     
            />
          </span>
        </div>
      </div>

      <button
        className={`form-input ${arraysEqual(range, rangePrice) ? 'disabled' : 'active-border'}`}
        onClick={handleApply}
        disabled={arraysEqual(range, rangePrice)} 
      >
        Apply
      </button>
      
      <button
        className={`form-input ${!arraysEqual(range, rangePrice) ? 'disabled' : 'active-border'}`}
        onClick={handleReset}
        disabled={!arraysEqual(range, rangePrice)} 
      >
        Reset
      </button>
    </div>
  );
};

export default PriceFilter;