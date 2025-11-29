import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Subscription from "../components/subscribe/Subscription";
import MiniCart from "../components/cart/MiniCart";
import PlpContent from "../components/plp/PlpContent";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import style from './pages.module.css';

import { selectCart } from "../features/cart/cartSlice";
import { useSelector } from "react-redux";
import axios, { querystring } from "axios";
import qs from "qs";

export default function Plp() {
  const PAGE_SIZE = 18;
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParamsLoad, setIsParamsLoad] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [filter, setFilters] = useState({});
  const cart = useSelector(selectCart);

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); // Розбиваємо шлях на частини
  const categoryId = pathParts[pathParts.length - 1];
  const [prevPathname, setPrevPathname] = useState();

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {

    if (location.pathname !== prevPathname) {

      // Реагуємо лише на зміну шляху
      const newFilterParams = getFilterObjectFromUrl();
      if (Object.keys(newFilterParams).length === 0) {
        setFilterParams({});
      } else if (JSON.stringify(newFilterParams) !== JSON.stringify(filterParams)) {
        setFilterParams(newFilterParams);
      }

      setIsParamsLoad(true);
      setPrevPathname(location.pathname); // Оновлюємо попередній шлях
    }
  }, [location.pathname, prevPathname]); // Залежність лише від pathname


  // useEffect(() => {
  //   const newFilterParams = getFilterObjectFromUrl();
  //   if (JSON.stringify(newFilterParams) !== JSON.stringify(filterParams)) {
  //     setFilterParams(newFilterParams);
  //   }
  //   setIsParamsLoad(true);
  // }, []);

  useEffect(() => {
    if (!isParamsLoad) return;
    const updatedParams = new URLSearchParams();

    for (const key in filterParams) {
      const value = filterParams[key];

      if (Array.isArray(value)) {
        value.forEach((item) => updatedParams.append(key, item)); // Додаємо кожен елемент окремо
      } else if (value !== undefined) {
        updatedParams.set(key, value);
      }
    }

    if (searchParams.toString() !== updatedParams.toString()) {
      setSearchParams(updatedParams);
    }
  }, [filterParams]);

  useEffect(() => {
    loadData();
  }, [filterParams, currentPage]);

  function loadData() {
    if (!isParamsLoad) { return }
    console.log("filterParams" + JSON.stringify(filterParams))
    axios
      .get(`${process.env.REACT_APP_API_URL}/product/categoryAlias/${categoryId}`, {
        params: { currency: cart.currency, page: currentPage, pageSize: PAGE_SIZE, ...filterParams },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((response) => {
        const products = response.data.products.map((product) => {
          const newItem = {
            ...product,
            price: product.prices[0].price
          };
          delete newItem.prices;
          return newItem;
        });

        const { totalItems, totalPages, currentPage, pageSize } = response.data;
        setPaginationData({ totalItems, totalPages, currentPage, pageSize });
        setLoading(false);
        setProducts(products);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setError(error.message);
      });
  }

  function loadFilters() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/product/categoryFilters/${categoryId}`, {
        params: { currency: cart.currency },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((response) => {
        setFilters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setError(error.message);
      });
  }

  function getFilterObjectFromUrl() {
    const newFilterParams = {};
    const page = searchParams.get("page");
    const brand = searchParams.getAll("brand");
    const country = searchParams.getAll("country");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (page) newFilterParams.page = Number(page);
    if (brand.length) newFilterParams.brand = brand;
    if (country.length) newFilterParams.country = country;
    if (minPrice) newFilterParams.minPrice = minPrice;
    if (maxPrice) newFilterParams.maxPrice = maxPrice;
    return newFilterParams;
  }

  return (
    <>
      <Header></Header>
      <main className={style.mainPages}>
        <PlpContent products={products}
          filters={filter}
          setFilterParams={setFilterParams}
          paginationData={paginationData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filterParams={filterParams} />
        <Subscription />
      </main >
      <MiniCart />
      <Footer></Footer>
    </>
  );
}
