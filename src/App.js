import "./App.scss";
import React from "react";
import axios from "axios";
import md5 from "md5";
import UserContext from "./Context/Context";

import BlockItems from "./Block-items/Block-items";
import Pagination from "./Pagination/Pagination";
import Header from "./Header/Header";
import Filter from "./Filter/Filter";

function App() {
  // Продукты, бренды, id продуктов, интервал стоимости всех продуктовarrow-next
  const [brands, setBrands] = React.useState([]);
  const [items, setItems] = React.useState();
  const [idItems, setIdItems] = React.useState();
  const [intervalPrices, setIntervalPrices] = React.useState([0, 0]);

  // Фильтр: поиск, выпадающее меню, слайдер устанвоки стоимости с инпутом вместе
  const [valueSearch, setValueSearch] = React.useState("");
  const [valueDropDown, setValueDropDown] = React.useState("");
  const [valuesSlider, setValuesSlider] = React.useState(0);

  // Состояние заугрузки продуктов
  const [loadingItems, setLoadingItems] = React.useState(true);

  // Параметры последнего запроса для повторного запроса при ошибке
  const lastParametersRequest = React.useRef();

  // Состояние отображения всех продуктов. При первой загрузке страницы или нажатой кнопке 'All products' отображаются все продукты
  const [displayAllProducts, setDisplayAllProducts] = React.useState(true);

  //Пагинцаия. Текущие отображаемые продукты на странице
  const [currentItems, setCurrentItems] = React.useState([]);

  // Пагинация при отображении всех продуктов по 50 шт. Снизу страницы установлены 2 кнопки (Prev, Next) для пролистывании списка всех продуктов по запросу offset
  const [offsetAllItems, setOffsetAllItems] = React.useState(0);
  const [itemsPerPage] = React.useState(50);

  // Пагинация для фильтра. Отображаются номера страниц для пролистывания списка
  const [currentPage, setCurrentPage] = React.useState(1);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  // Пагинация. Изменение текущих отображаемых продуктов на странице
  React.useEffect(() => {
    setCurrentItems(() =>
      items && items.length > 0
        ? items.slice(firstItemIndex, lastItemIndex)
        : []
    );
  }, [items, firstItemIndex, lastItemIndex]);

  // Пагинцаия. Функция для пролистиывания всего списка продуктов с кнопками вперед и назад
  const switchPageNext = () => {
    setOffsetAllItems((prev) => {
      return (prev += 50);
    });
  };
  const switchPagePrev = () => {
    if (offsetAllItems > 0) {
      setOffsetAllItems((prev) => (prev -= 50));
    }
  };

  // Пагинация. Функция для изменения текущией страницы отфильрованного списка

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Текущая дата
  const date = new Date().toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    year: "numeric",
    month: "long",
  });

  // Таймштамп для запросов на сервер
  const timeStamp = React.useCallback(() => {
    const year = new Date().getUTCFullYear();
    const month =
      new Date().getUTCMonth() + 1 < 10
        ? "0" + (new Date().getUTCMonth() + 1)
        : new Date().getUTCMonth() + 1;
    const day =
      new Date().getUTCDate() < 10
        ? "0" + new Date().getUTCDate()
        : new Date().getUTCDate();
    const date = `${year}${month}${day}`;
    return date;
  }, []);

  // Сброс фильтров при отображении всех продуктов
  React.useEffect(() => {
    if (displayAllProducts) {
      setValueDropDown("");
      setValueSearch("");
      setValuesSlider(0);
    }
  }, [displayAllProducts]);

  // Получение брендов для DropDown
  React.useEffect(() => {
    const requestBrands = async () => {
      try {
        const password = "Valantis";
        const request = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_fields",
            params: { field: "brand" },
          },
          {
            headers: { "X-Auth": md5(`${password}_${timeStamp()}`) },
          }
        );
        const data = await request.data;

        // Установка уникального списка всех брендов
        setBrands(() => {
          const newData = new Set(data.result.filter((item) => item != null));
          return Array.from(newData);
        });
      } catch (error) {
        console.error(error.message);
        requestBrands();
      }
    };
    requestBrands();
  }, [timeStamp]);

  // Получение цен для Slider
  React.useEffect(() => {
    const requestPrices = async () => {
      try {
        const password = "Valantis";
        const request = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_fields",
            params: { field: "price" },
          },
          {
            headers: { "X-Auth": md5(`${password}_${timeStamp()}`) },
          }
        );
        const data = await request.data;
        const arrPrices = data.result.sort((a, b) => a - b);

        // Установка интервала стоимости слайдера на основе всех цен
        setIntervalPrices([arrPrices[0], arrPrices[arrPrices.length - 1]]);
      } catch (error) {
        console.error(error.message);
        requestPrices();
      }
    };
    requestPrices();
  }, [timeStamp]);

  // Получение id товаров по фильтру
  const requestGetIds = React.useCallback(
    async (action = "get_ids", valueParams = { offset: 0, limit: 50 }) => {
      lastParametersRequest.current = [action, valueParams];

      try {
        const password = "Valantis";
        const request = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action,
            params: valueParams,
          },
          {
            headers: { "X-Auth": md5(`${password}_${timeStamp()}`) },
          }
        );
        const data = await request.data;
        setIdItems(data.result);
      } catch (error) {
        console.error(error.message);
        requestGetIds(
          lastParametersRequest.current[0],
          lastParametersRequest.current[1]
        );
      }
    },
    [timeStamp]
  );

  // Запрос id продуктов при пролистиывании страниц и изменение offset
  React.useEffect(() => {
    setDisplayAllProducts(true);
    requestGetIds("get_ids", {
      offset: offsetAllItems,
      limit: 50,
    });
  }, [offsetAllItems, requestGetIds]);

  // Получение списка товаров по запрашиваемым id
  React.useEffect(() => {
    const requestGetItems = async () => {
      try {
        setCurrentPage(1);
        setLoadingItems(true);
        const password = "Valantis";
        const request = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_items",
            params: {
              ids: idItems,
            },
          },
          {
            headers: { "X-Auth": md5(`${password}_${timeStamp()}`) },
          }
        );
        const data = await request.data;

        // Получение уникального списка продуктов без дублей id
        const uniqueData = data.result.reduce((accumulator, current) => {
          if (accumulator.findIndex((item) => item.id === current.id) === -1) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);

        setItems(uniqueData);
        setLoadingItems(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error.message);
        requestGetItems();
      }
    };

    if (idItems && idItems.length > 0) {
      setItems([]);
      requestGetItems();
    } else {
      setItems([]);
    }
  }, [idItems, timeStamp]);

  return (
    <UserContext.Provider
      value={{
        date,
        idItems,
        currentItems,
        itemsPerPage,
        currentPage,
        items,
        valuesSlider,
        valueDropDown,
        valueSearch,
        loadingItems,
        brands,
        intervalPrices,
        offsetAllItems,
        displayAllProducts,
        setOffsetAllItems,
        timeStamp,
        paginate,
        switchPageNext,
        switchPagePrev,
        setValueDropDown,
        setValueSearch,
        setValuesSlider,
        requestGetIds,
        setDisplayAllProducts,
      }}
    >
      <div className="App">
        <div className="canvas">
          <div className="wrapper">
            <Header />
            <Filter />
            <BlockItems />
            <Pagination />
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
