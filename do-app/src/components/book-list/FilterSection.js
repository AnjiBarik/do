import { useIcons } from '../../IconContext';

export const FilterSection = ({
  title,
  uniqueItems,
  selectedItems,
  field,
  visibilityKey,
  toggleVisibility,
  handleSelection,
  setSelectedItems
}) => {
  const { upmenu } = useIcons();
  
  return (
    uniqueItems.length > 0 && (
      <div className="section-list">
        <h3 onClick={() => toggleVisibility(title)}>
        {field && field !== "" ? field : `${title}:`}
          <img
            className={`toggle-icon social-icon ${visibilityKey || selectedItems.length > 0 ? 'rotated' : ''}`}
            src={upmenu}
            alt="Toggle Filter"
          />         
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
};