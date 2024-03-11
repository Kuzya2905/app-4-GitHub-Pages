import React from "react";
import { DebounceInput } from "react-debounce-input";

import svgSearch from "../svg/search.svg";
import UserContext from "../Context/Context";

const Search = () => {
  const {
    loadingItems,
    valueSearch,
    requestGetIds,
    setValuesSlider,
    setValueDropDown,
    setValueSearch,
    setDisplayAllProducts,
  } = React.useContext(UserContext);

  React.useEffect(() => {
    if (valueSearch !== "") {
      requestGetIds("filter", { product: valueSearch });
    }
  }, [valueSearch, requestGetIds]);

  return (
    <div className="search">
      <img src={svgSearch} alt="search" />
      <DebounceInput
        disabled={loadingItems && !valueSearch ? true : false}
        className={loadingItems && !valueSearch ? "input disabled" : "input"}
        type="text"
        debounceTimeout={1200}
        value={valueSearch}
        placeholder="Search"
        onChange={(e) => {
          setValueSearch(e.target.value);
          setValueDropDown("");
          setValuesSlider(0);
          setDisplayAllProducts(false);
        }}
      />
    </div>
  );
};

export default React.memo(Search);
