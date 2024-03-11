import React, { useState } from "react";

import svgArrow from "../svg/arrow.svg";
import UserContext from "../Context/Context";

const DropDown = () => {
  const {
    valueDropDown,
    requestGetIds,
    valueSearch,
    loadingItems,
    brands,
    setValueDropDown,
    setValueSearch,
    setValuesSlider,
    setDisplayAllProducts,
  } = React.useContext(UserContext);

  const [isOpen, setOpen] = useState(false);
  const dropDownRef = React.useRef(null);
  const firstLoading = React.useRef(true);

  // Закрытие Drop-Down при нажатии за пределами кнопки
  React.useEffect(() => {
    const clickOutside = (e) => {
      if (
        dropDownRef.current &&
        !e.composedPath().includes(dropDownRef.current)
      ) {
        setOpen(false);
      }
    };
    document.body.addEventListener("click", clickOutside);
    return () => {
      document.body.removeEventListener("click", clickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (!firstLoading.current && valueDropDown !== "") {
      requestGetIds("filter", { brand: valueDropDown });
    }
    firstLoading.current = false;
  }, [valueDropDown, requestGetIds]);

  return (
    <div ref={dropDownRef} className="drop-down">
      Select brand
      <button
        disabled={loadingItems}
        className={loadingItems ? "btn disabled" : "btn"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {valueDropDown ? valueDropDown : "Not selected"}
        <img className={isOpen ? "down" : ""} src={svgArrow} alt="Arrow" />
      </button>
      <nav className={isOpen ? "active" : ""}>
        {brands.length > 0 ? (
          <ul>
            {brands.map((item) => (
              <li
                onClick={() => {
                  setDisplayAllProducts(false);
                  setValuesSlider(0);
                  if (valueSearch) {
                    setValueSearch("");
                  }
                  setValueDropDown(item);
                  setOpen((prev) => !prev);
                }}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          "Загрузка данных..."
        )}
      </nav>
    </div>
  );
};

export default React.memo(DropDown);
