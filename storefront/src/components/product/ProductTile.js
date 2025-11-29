import React from 'react';
import styles from './ProductTile.module.css';
import { addItem } from "../../features/cart/cartSlice";
import { toggleItem, selectIsProductInWishlist } from "../../features/wishlist/wishlistSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import cartIcon from '../../assets/icons/cart.svg';
import heartIcon from '../../assets/icons/like.svg';
import heartCheckedIcon from '../../assets/icons/heart-checked.svg';


export default function ProductTile({ product, isShowActionBtns }) {
    const dispatch = useDispatch();
    const isInStore = useSelector((state) => selectIsProductInWishlist(state, product.id));
    const staticImgPath = `${process.env.REACT_APP_API_URL}/static/`;

    const handleAddToCart = (event) => {
        event.preventDefault();
        dispatch(addItem(product));
    };

    const handleAddToWishlist = (event) => {
        event.preventDefault();
        dispatch(toggleItem(product.id));
    };

    return <Link className={styles.productTileLink} to={`/product/${product.id}`}>
        <div className={styles.product_tile}>
            <img className={styles.product_img} src={staticImgPath + `${product.images[0]}`}
                alt={product.header} />
            <div className={styles.product_group} >
                <div className={styles.product_information} >
                    <p className={styles.product_name}>{product.title}</p>
                    <div className={styles.product_prices}>
                        <p className={styles.product_price}>{product.price}{product.currency} </p>
                        <p className={styles.product_d_pice}>{product.discontPrice}{product.currency}</p>
                    </div>
                    <Rating name="read-only" size="small" value={product.rating} readOnly sx={{ '.MuiSvgIcon-root': { fill: "black" } }} />
                </div>

                {product.stock && product.stock.quantity ? isShowActionBtns ? <div>
                    <img src={cartIcon} alt="Cart" width={28} height={28}
                        onClick={handleAddToCart} />
                </div> : <></> : <div className={styles.product_oos_text}>Out of stock</div>}
            </div>
            <img className={styles.whishlistBtn} src={!isInStore ? heartIcon : heartCheckedIcon}
                alt="Heart" width={28} height={28}
                onClick={handleAddToWishlist} />
        </div>
    </Link >
    {/* <div className={styles.productTile}>
            <img src={staticImgPath + `${product.images[0]}`} alt={product.title}
                height={196} width={262} />
            <div className={styles.details}>
                <div>
                    <p className={styles.name}>{product.title}</p>
                    <div className={styles.prices_block}></div>
                    <p className={styles.price}>${product.price}</p>
                    <p className={styles.price_discont}>${product.price}</p>
                </div>
                <img className={styles.whishlistBtn} src={!isInStore ? heartIcon : heartCheckedIcon}
                    alt="Heart" width={28} height={28}
                    onClick={handleAddToWishlist} />
                {product.stock && product.stock.quantity ? isShowActionBtns ? <div>
                    <img src={cartIcon} alt="Cart" width={28} height={28}
                        onClick={handleAddToCart} />
                </div> : <></> : <>Out of stock</>}
            </div>
        </div > */}


}