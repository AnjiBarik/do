import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useDebounce from '../hooks/useDebounce';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import { useAlertModal } from '../hooks/useAlertModal';

const FilteredDataDisplay = ({ outputData }) => {
  const [searchValues, setSearchValues] = useState([]);
  const [filterFields, setFilterFields] = useState([]);
  const [sortOrder, setSortOrder] = useState({ field: '', order: 'asc' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [selectAllText, setSelectAllText] = useState('Select All');
  const [isTableView, setIsTableView] = useState(false);
  const { showAlert, AlertModalComponent } = useAlertModal();

  const outputDataSet = useMemo(() => outputData, [outputData]);  
  const debouncedSearchValues = useDebounce(searchValues, 300);

  const applyFiltersAndSorting = useCallback(
    (data) => {
      let filteredData = data;

      filterFields.forEach((field, index) => {
        const searchValue = debouncedSearchValues[index];
        if (searchValue && field) {
          filteredData = filteredData.filter(item =>
            String(item[field]).toLowerCase().includes(searchValue.toLowerCase())
          );
        }
      });

      if (startDate && endDate) {
        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item['currentDateTime']).toISOString();
          return itemDate >= start && itemDate <= end;
        });
      }

      if (sortOrder.field) {
        filteredData = filteredData.slice().sort((a, b) => {
          if (typeof a[sortOrder.field] === 'number' && typeof b[sortOrder.field] === 'number') {
            return sortOrder.order === 'asc' ? a[sortOrder.field] - b[sortOrder.field] : b[sortOrder.field] - a[sortOrder.field];
          } else if (sortOrder.field === 'currentDateTime') {
            return sortOrder.order === 'asc' ? new Date(a[sortOrder.field]) - new Date(b[sortOrder.field]) : new Date(b[sortOrder.field]) - new Date(a[sortOrder.field]);
          } else {
            return sortOrder.order === 'asc' ? String(a[sortOrder.field]).localeCompare(String(b[sortOrder.field])) : String(b[sortOrder.field]).localeCompare(String(a[sortOrder.field]));
          }
        });
      }

      return filteredData;
    },
    [startDate, endDate, filterFields, debouncedSearchValues, sortOrder]
  );

  const filteredData = useMemo(() => applyFiltersAndSorting(outputDataSet), [applyFiltersAndSorting, outputDataSet]);
  
  useEffect(() => {      
    const newSelectedData = selectedData.filter(orderNumber =>
      filteredData.some(item => item.orderNumber === orderNumber)  
    );
  
    if (!newSelectedData.every((item, index) => item === selectedData[index])) {      
      setSelectedData(newSelectedData);
      setSelectAllText(newSelectedData.length === filteredData.length ? 'Deselect All' : 'Select All');
    }    
  }, [filteredData, selectedData]);

  const toggleView = () => setIsTableView(prev => !prev);

  const updateSearchValue = (index, value) => {
    const newSearchValues = [...searchValues];
    newSearchValues[index] = value;
    setSearchValues(newSearchValues);
  };

  const updateFilterField = (index, value) => {
    const newFilterFields = [...filterFields];
    newFilterFields[index] = value;
    setFilterFields(newFilterFields);
    
    const newSearchValues = [...searchValues];
    newSearchValues[index] = '';
    setSearchValues(newSearchValues);
  };

  const removeFilter = (index) => {
    const newFilterFields = filterFields.filter((_, i) => i !== index);
    const newSearchValues = searchValues.filter((_, i) => i !== index);
    setFilterFields(newFilterFields);
    setSearchValues(newSearchValues);
  };

  const addFilter = () => {
    setFilterFields([...filterFields, '']);
    setSearchValues([...searchValues, '']);
  };

  const updateSortOrder = (order) => setSortOrder(prev => ({ ...prev, order }));
  const updateSortField = (value) => setSortOrder(prev => ({ ...prev, field: value }));

  const handleSelectAll = () => {
    if (selectedData.length === filteredData.length) {
      setSelectedData([]);
      setSelectAllText('Select All');
    } else {
      setSelectedData(filteredData.map(item => item.orderNumber));
      setSelectAllText('Deselect All');
    }
  };

  const copySelectedDataToClipboard = () => {
    const dataToCopy = filteredData.filter(item => selectedData.includes(item.orderNumber));
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2))
      .then(() => showAlert('Copied to clipboard'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const getFieldStyle = (field) => {
    if (field === 'orderNumber') return { fontWeight: 'bold' };
    if (field === 'currentDateTime') return { color: 'blue' };
    return {};
  };

  const formatFieldValue = (field, value) => {
    if (field === 'currentDateTime') {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localDate = userTimeZone ? new Date(value.toLocaleString([], { timeZone: userTimeZone })).toLocaleString() : '';
      return (
        <strong translate="no">
          <br /> UTC {value}
          <br /> Current local time: {localDate || 'Unable to determine local time'}
        </strong>
      );
    }
    return value;
  };

  const toggleSelect = (orderNumber) => {
    if (selectedData.includes(orderNumber)) {
      setSelectedData(selectedData.filter(item => item !== orderNumber));
    } else {
      setSelectedData([...selectedData, orderNumber]);
    }
    setSelectAllText('Deselect All');
  };

  const renderFilteredData = () => {
    if (filteredData.length < 1) {
      return <div>Oops found 0 try again</div>;
    }
    return (
      <>
        {AlertModalComponent()}
        <button className='form-input' onClick={toggleView}>
          {isTableView ? 'Switch to List View' : 'Switch to Table View'}
        </button>
        <div>
          {!isTableView ? (
            <div className='dekrypted-container'>
              {filteredData.map((outputItem, index) => (
                <div className='dekrypted' key={index}>
                  <div className={`filters-field ${selectedData.includes(outputItem.orderNumber) ? 'selected-field' : ''}`}
                    onClick={() => toggleSelect(outputItem.orderNumber)}
                  >
                    <h3>Order# {outputItem.orderNumber}</h3>
                  </div>
                  <ul className='no-markers'>
                    {Object.entries(outputItem)
                      .filter(([field]) => field !== 'orderNumber')
                      .map(([field, value]) => (
                        <li key={field} style={getFieldStyle(field)}>
                          {field}: {formatFieldValue(field, value)}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className='dekrypted-container'>
              <div className='dekrypted-table-container'>
                <table className='scrollable-table'>
                  <thead>
                    <tr>
                      <th>Select</th>                      
                      {Object.keys(filteredData[0] || {}).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((outputItem, index) => (
                      <tr key={index}>
                        <td >
                          <input
                            type="checkbox"
                            checked={selectedData.includes(outputItem.orderNumber)}
                            onChange={() => toggleSelect(outputItem.orderNumber)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>                          
                        {Object.entries(outputItem)                         
                          .map(([field, value]) => (
                            <td
                              key={field}
                              style={getFieldStyle(field)}
                              onClick={() => toggleSelect(outputItem.orderNumber)}
                            >
                              {formatFieldValue(field, value)}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleResetSelectedData = () => {
    setSelectedData([]);
    setSelectAllText('Select All');
  };

  return (
    <div>
      <div className='filters'>
        <label>Start Date</label>
        <input
          type="date"
          className='form-input'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {startDate && endDate && (
          <button className='form-input' onClick={handleResetDateFilter}>
            Reset Date Filter
          </button>
        )}      
        <label>End Date </label>
        <input
          type="date"
          className='form-input'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        {filterFields.map((field, index) => (
          <div key={index} className='filters'>
            <select
              className='form-input'
              value={field}
              onChange={(e) => updateFilterField(index, e.target.value)}
            >
              <option value="">Select Field</option>
              {outputDataSet.length > 0 &&
                Object.keys(outputDataSet[0]).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
            </select>
            <input
              type="text"
              className='form-input'
              value={searchValues[index]}
              onChange={(e) => updateSearchValue(index, e.target.value)}
              placeholder={`Search in ${field}`}
              disabled={!field} // Disable input if no field is selected
            />
            <button onClick={() => removeFilter(index)} className='form-input'>
              Remove Filter
            </button>
          </div>
        ))}
        <button onClick={addFilter} className='form-input active-border'>
          Add Filter
        </button>
      </div>
      <div>
        <div className='filters'>
        <select
            className='form-input'
            value={sortOrder.field}
            onChange={(e) => updateSortField(e.target.value)}
          >
            <option value="">Select Sort Field</option>
            {outputDataSet.length > 0 &&
              Object.keys(outputDataSet[0]).map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
          </select>
          <button
            className={`form-input ${sortOrder.order === 'asc' ? 'active-border' : ''}`}
            onClick={() => updateSortOrder('asc')}
            disabled={!sortOrder.field} // Disable button if no field is selected
          >
            ⏫ Sort ascending
          </button>
          <button
            className={`form-input ${sortOrder.order === 'desc' ? 'active-border' : ''}`}
            onClick={() => updateSortOrder('desc')}
            disabled={!sortOrder.field} // Disable button if no field is selected
          >
            ⏬ Sort descending
          </button>         
        </div>
      </div>
      <div className='filters'>       
        <div className='form-input'>
          <strong>Selected Count: {selectedData.length}</strong>
        </div>
        <button className='form-input' onClick={handleSelectAll}>
          {selectAllText}
        </button>
        <button  className={`form-input ${selectedData.length > 0 ? 'active-border' : ''}`} 
        onClick={copySelectedDataToClipboard}>
          Copy Selected Data
        </button>
        {selectedData.length > 0 && (
          <button className='form-input' onClick={handleResetSelectedData}>
            Reset Selected Data
          </button>
        )}
        <ScrollToTopButton />
      </div>
      <div>
        {renderFilteredData()}
      </div>
    </div>
  );
};

export default FilteredDataDisplay;