import React from "react";

import Search from "../Search/Search";
import DropDown from "../DropDown/DropDown";
import Slider from "../Slider/Slider";
import UserContext from "../Context/Context";

const Filter = () => {
  const {
    loadingItems,
    requestGetIds,
    setOffsetAllItems,
    offsetAllItems,
    setDisplayAllProducts,
  } = React.useContext(UserContext);

  return (
    <section className="filter">
      <button
        name="Button all products"
        disabled={loadingItems}
        className={loadingItems ? "btn disabled" : "btn"}
        onClick={() => {
          setDisplayAllProducts(true);
          if (offsetAllItems === 0) {
            requestGetIds();
          } else setOffsetAllItems(0);
        }}
      >
        All products
      </button>
      <span>Filter</span>
      <Search />
      <DropDown />
      <Slider />
    </section>
  );
};

export default Filter;
