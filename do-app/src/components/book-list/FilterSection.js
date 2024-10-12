export const FilterSection = ({ title, uniqueItems, selectedItems, field, visibilityKey, toggleVisibility, handleSelection, setSelectedItems }) => (
    uniqueItems.length > 0 && (
      <div className="section-list">
        <h3 onClick={() => toggleVisibility(title)}>
          <button className="selected-button active-border" >
            {visibilityKey || selectedItems.length > 0 ? '-' : '+'}
          </button>
          {field && field !== "" ? field : `${title}:`}
        </h3>
        {(visibilityKey || selectedItems.length > 0) && (
          <ul className="no-markers filters">
            {uniqueItems.map((item) => (
              <li key={item}>
                <label className="filters">
                  <input
                    type="checkbox"
                    value={item}
                    checked={selectedItems.includes(item)}
                    onChange={() => handleSelection(item, setSelectedItems)}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  );
  