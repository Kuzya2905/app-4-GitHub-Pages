import React from "react";
import UserContext from "../Context/Context";

import svgArrow from "../svg/arrow.svg";

const Pagination = () => {
  const {
    items,
    switchPageNext,
    currentPage,
    paginate,
    switchPagePrev,
    loadingItems,
    itemsPerPage,
    displayAllProducts,
    offsetAllItems,
  } = React.useContext(UserContext);

  const totalItems = items ? items.length : "";
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <ul className="pagination">
        {displayAllProducts && offsetAllItems > 0 ? (
          <li
            className={loadingItems ? "btn-prev disabled" : "btn-prev"}
            onClick={() => {
              switchPagePrev();
            }}
          >
            <img className="arrow-prev" src={svgArrow} alt="arrow-prev" />
            Prev
          </li>
        ) : (
          ""
        )}

        {pageNumbers.length > 1 ? (
          <>
            {pageNumbers.map((number) => (
              <li
                key={number}
                onClick={() => paginate(number)}
                className={number === currentPage ? "selected" : ""}
              >
                {number}
              </li>
            ))}
          </>
        ) : (
          ""
        )}

        {displayAllProducts ? (
          <li
            className={loadingItems ? "btn-next disabled" : "btn-next"}
            onClick={() => {
              switchPageNext();
            }}
          >
            Next
            <img className="arrow-next" src={svgArrow} alt="arrow-next" />
          </li>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default Pagination;
