import { useDispatch } from 'react-redux';
import { addFewItems, addItem } from '../../features/cart/cartSlice';
import { useState } from 'react';
import ContentLayout from '../layout/ContentLayout';


export default function Product({ product }) {
    const dispatch = useDispatch();
    const [itemQuantity, setItemQuantity] = useState(1);

    return (product ? <ContentLayout><div>
        <img src={`${process.env.REACT_APP_API_URL}/static/${product.images[0]}`} alt={product.title} height={196} width={262} />
        <div>Name:{product.title}</div>
        <div>Short discription: {product.descriptionShort}</div>
        <div>Category: {product.category.name}</div>
        <div>SKU:{product.sku}</div>
        <div>Price:{product.price}</div>
        {product.stock && product.stock.quantity ? <>
            <button onClick={() => { setItemQuantity(prev => prev > 1 ? prev - 1 : prev) }}>-</button>
            <span >{itemQuantity}</span>
            <button onClick={() => { setItemQuantity(prev => prev < product.stock.quantity ? prev + 1 : prev) }}>+</button>

            <button onClick={() => {
                dispatch(addFewItems({ item: product, itemQuantity: itemQuantity }));
            }}>Add to cart</button></> : <>Out of Stock!</>}

    </div></ContentLayout> : <></>)
}