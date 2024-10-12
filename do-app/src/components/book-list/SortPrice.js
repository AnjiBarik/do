import React, { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../../BooksContext';
import './PriceFilter.css'; 

const PriceFilter = ({ prompt }) => {
  const { rangePrice, setRangePrice, fieldState } = useContext(BooksContext);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [range, setRange] = useState([0, 0]);

  useEffect(() => {
    if (prompt.length > 0) {
      const prices = prompt.map(book => book.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);

      if (rangePrice && rangePrice.length > 0) {
        setRange(rangePrice);
      } else {
        setRange([min, max]);
      }
    }
  }, [prompt, rangePrice]);
 
  const handleMinChange = (e) => {
    const min = Number(e.target.value);
    if (min <= range[1]) {
      setRange([min, range[1]]);
    }
  };
  
  const handleMaxChange = (e) => {
    const max = Number(e.target.value);
    if (max >= range[0]) {
      setRange([range[0], max]);
    }
  };

  const handleApply = () => {
    setRangePrice(range);
    setMinPrice(range[0]);
    setMaxPrice(range[1]);
  };

  const handleReset = () => {
    setRangePrice([]);
    setRange([minPrice, maxPrice]);
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
          onChange={handleMinChange}
          className="slider"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={range[1]}
          onChange={handleMaxChange}
          className="slider"
        />
        {/* <div className="range-values">
        <span translate="no">Min:{fieldState.payment ? fieldState.payment : ""}{range[0]}</span>
        <span translate="no">Max:{fieldState.payment ? fieldState.payment : ""}{range[1]}</span>
        </div> */}
       <div className="range-values">
    <span translate="no">Min: {fieldState.payment ? fieldState.payment : ""}
        <input 
            type="number" 
            className='form-input'
            value={range[0]} 
            onChange={(e) => {
                const newMin = +e.target.value;
                if (newMin <= range[1]) {
                    setRange([newMin, range[1]]);
                }
            }} 
            min={minPrice}
            max={maxPrice}
        />
    </span>
    <span translate="no">Max: {fieldState.payment ? fieldState.payment : ""}
        <input 
            type="number" 
            className='form-input'
            value={range[1]} 
            onChange={(e) => {
                const newMax = +e.target.value;
                if (newMax >= range[0]) {
                    setRange([range[0], newMax]);
                }
            }} 
            min={minPrice}
            max={maxPrice}
        />
    </span>
</div>


      </div>      
      <button
         className={`form-input ${range === rangePrice ? 'disabled' : 'active-border'}`}
         onClick={handleApply}
         disabled={range === rangePrice}
      >
        Apply
      </button>
      
      <button
        className={`form-input ${range !== rangePrice ? 'disabled' : 'active-border'}`}
        onClick={handleReset}
        disabled={range !== rangePrice}
      >
        Reset
      </button>

    </div>
  );
};

export default PriceFilter;