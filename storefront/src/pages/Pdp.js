import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Subscription from "../components/subscribe/Subscription";
import { useParams } from 'react-router-dom';
import MiniCart from "../components/cart/MiniCart";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductDetail from "../components/pdp/ProductDetail";
import ProductDetailTabs from "../components/pdp/ProductDetailTabs";
import style from './pages.module.css';

export default function Pdp() {
    const { productId } = useParams();
    const [product, setProduct] = useState();


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/product/${productId}`)
            .then((response) => {
                const product = {
                    ...response.data,
                    price: response.data.prices[0].price
                }
                delete product.prices;
                setProduct(product);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [productId]);

    return (
        <>
            <Header></Header>
            <main className={style.mainPages}>
                <ProductDetail product={product}></ProductDetail>
                <ProductDetailTabs product={product}></ProductDetailTabs>
                <Subscription />
            </main>
            <MiniCart />
            <Footer></Footer>
        </>
    );
}

