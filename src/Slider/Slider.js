import React from "react";
import SliderReact from "react-slider";

import UserContext from "../Context/Context";

const Slider = () => {
  const {
    valuesSlider,
    intervalPrices,
    loadingItems,
    setValueDropDown,
    setValuesSlider,
    setValueSearch,
    requestGetIds,
    setDisplayAllProducts,
  } = React.useContext(UserContext);

  return (
    <div className="sliderRange">
      <div>
        <div className="values">
          Price:
          <span>
            {valuesSlider ? (
              valuesSlider
            ) : (
              <>
                {intervalPrices[0]}-{intervalPrices[1]}
              </>
            )}
          </span>
        </div>
        <SliderReact
          disabled={loadingItems}
          className={loadingItems ? "slider disabled" : "slider"}
          onChange={setValuesSlider}
          value={valuesSlider}
          min={intervalPrices[0]}
          max={intervalPrices[1]}
          step={100}
        />
      </div>
      <input
        disabled={loadingItems}
        onChange={(e) => {
          setValuesSlider(Number(e.target.value));
        }}
        className={loadingItems ? "price disabled" : "price"}
        value={valuesSlider}
        type="text"
      />
      <button
        disabled={loadingItems}
        onClick={() => {
          requestGetIds("filter", { price: valuesSlider });
          setValueSearch("");
          setValueDropDown("");
          setDisplayAllProducts(false);
        }}
        className={loadingItems ? "btn find disabled" : "btn find"}
      >
        Find
      </button>
    </div>
  );
};

export default React.memo(Slider);
