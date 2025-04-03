import { useIcons } from '../../IconContext';

export const FilterSection = ({
  title,
  uniqueItems,
  selectedItems,
  field,
  visibilityKey,
  toggleVisibility,
  handleSelection,
  setSelectedItems,
  colorBlock // We pass fieldState.colorblock, but only use it for "Color"
}) => {
  const { upmenu } = useIcons();
 
  const colorRGB = colorBlock && title === "Color"
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
    uniqueItems.length > 0 && (
      <div className="section-list">
        <h3 onClick={() => toggleVisibility(title)}>
          {field && field !== '' ? field : `${title}:`}
          <img
            className={`toggle-icon social-icon select ${visibilityKey || selectedItems.length > 0 ? 'rotated' : ''}`}
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
                  {title === "Color" && colorRGB[item.trim()] && (
                    <span
                      className="circle"
                      style={{
                        backgroundColor: `rgb(${colorRGB[item.trim()]})`,
                        display: 'inline-block',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        marginLeft: '5px',
                        verticalAlign: 'middle',
                        border: '1px solid #000',
                      }}
                    ></span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  );
};