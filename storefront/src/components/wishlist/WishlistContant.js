import React, { useState } from 'react';
import style from './WishlistContant.module.css';
import axios from 'axios';
import { selectWishlist } from "../../features/wishlist/wishlistSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProductLineTile from "../product/ProductLineTile";

const Wishlist = () => {
    const wishlist = useSelector(selectWishlist);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        if (wishlist.items) {
            axios.post(`${process.env.REACT_APP_API_URL}/product/byIds`, { ids: wishlist.items.filter((item) => item && !isNaN(item)) }).then((response) => {
                const products = response.data.map((product) => {
                    const newItem = {
                        ...product,
                        price: product.prices[0].price
                    }
                    delete newItem.prices;
                    return newItem;
                })
                setWishlistItems(products);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [wishlist]);

    return <div className={style.wishlistItemsContainer}>
        {wishlistItems.map((item, index) => (
            <ProductLineTile key={index} product={item} isCart={false}></ProductLineTile>
        ))}
    </div>

};

export default Wishlist;