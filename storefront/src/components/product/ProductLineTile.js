import React, { useState } from 'react';
import styles from './ProductLineTile.module.css';
import { addItem, addFewItems, removeItem, removeItemLine } from "../../features/cart/cartSlice";
import { toggleItem } from "../../features/wishlist/wishlistSlice";
import { useDispatch } from 'react-redux';
import closeIcon from '../../assets/icons/close.svg';
import QuantitySelector from '../custom/QuantitySelector';
import CustomButton from '../custom/CustomButton';

export default function ProductTile({ product, isCart }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1)
    const [tottalPrice, setTottalPrice] = useState(product.price)


    const handleRemoveFromList = (event) => {
        event.preventDefault();
        if (isCart) {
            dispatch(removeItemLine(product));
        } else {
            dispatch(toggleItem(product.id));
        }

    };

    const increaseQuantity = () => {
        if (quantity < product.stock.quantity) {
            setQuantity((prev) => {
                return prev = Number(prev) + 1;
            })
            updateTottalPrice(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => {
                return prev = Number(prev) - 1;
            })
            updateTottalPrice(quantity - 1);
        }
    };

    const updateTottalPrice = (quantity) => {
        setTottalPrice(quantity * product.price);
    };

    return <>
        <div className={styles.productTile}>
            {/* <Link to={`/product/${product.id}`}> */}
            <img src={`${process.env.REACT_APP_API_URL}/static/${product.images[0]}`} alt={product.title}
                height={100} width={120} className={styles.img} />
            <p className={styles.name}>{product.title}</p>
            <p className={styles.price}>${product.price}</p>
            {product.stock && product.stock.quantity && !isCart ? <div className={styles.atcBlock}>
                <QuantitySelector increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} quantity={quantity}></QuantitySelector>
                <div className={styles.atcBtn} >
                    <CustomButton isPrimary={true} onClick={() => { dispatch(addFewItems({ item: product, itemQuantity: quantity })) }}>Add to cart</CustomButton>
                </div>

            </div> : <></>}

            {isCart ? <div className={styles.atcBlock}>
                <QuantitySelector increaseQuantity={() => product && dispatch(addItem(product))}
                    decreaseQuantity={() => product && dispatch(removeItem(product))} quantity={product.quantity}></QuantitySelector>
            </div> : <></>}

            <p className={styles.subPrice}>${isCart ? product.totalPrice.toFixed(2) : tottalPrice.toFixed(2)}</p>
            <div onClick={handleRemoveFromList} >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                    <path d="M11 23C17.0748 23 22 18.0748 22 12C22 5.92525 17.0748 1 11 1C4.92525 1 0 5.92525 0 12C0 18.0748 4.92525 23 11 23Z" stroke="#CCCCCC" stroke-miterlimit="10" />
                    <path d="M14.6654 7.6665L7.33203 16.3332" stroke="#7D7D7D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.6654 16.3332L7.33203 7.6665" stroke="#7D7D7D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            {/* </Link> */}
        </div >
    </>
}

