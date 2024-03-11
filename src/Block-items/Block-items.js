import React from "react";
import UserContext from "../Context/Context";

const BlockItems = () => {
  const { currentItems, idItems } = React.useContext(UserContext);

  return (
    <section className="items">
      {currentItems.length > 0 ? (
        <table>
          <tbody>
            <tr className="headers">
              {Object.keys(currentItems[0]).map((key) => (
                <td key={key} className={key}>
                  {key}
                </td>
              ))}
            </tr>

            {currentItems.map((item) => (
              <tr key={item.id}>
                {Object.keys(item).map((key) => (
                  <td key={key} className={key}>
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : idItems && idItems.length === 0 ? (
        "Products not found"
      ) : (
        "Loading products..."
      )}
    </section>
  );
};

export default BlockItems;
