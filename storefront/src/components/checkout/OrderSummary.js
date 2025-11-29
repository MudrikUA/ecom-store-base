import style from "./OrderSummary.module.css"

const OrderSummary = ({cart}) => {
    const staticUrl = `${process.env.REACT_APP_API_URL}/static/`;

    return (<div className={style.checkoutSumary}>
        <p className={style.checkoutSumaryTitle}>Order Summary</p>
        {cart.items.map((item) => (
            <div className={style.checkoutSumaryTile}>
                <div className={style.checkoutSumaryDescBlock}>
                    <img src={`${staticUrl}${item.images[0]}`} alt={item.title}
                        width={60} height={60} className={style.img} />
                    <div className={style.checkoutSumaryDescText}>
                        <p>{item.title}</p>
                        <p>x{item.quantity}</p>
                    </div>
                </div>
                <p className={style.checkoutSumaryItemPrice}>${item.totalPrice.toFixed(2)}</p>
            </div>
        ))}
        <div className={style.total}>
            <div className={`${style.checkoutSumaryLine} ${style.checkoutSumaryLineHighlight}`}>
                <p>Sub total:</p>
                <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div className={`${style.checkoutSumaryLine} ${style.checkoutSumaryLineHighlight}`}>
                <p>Shipping total: </p>
                <span>0</span>
            </div>
            <div className={style.checkoutSumaryLine}>
                <p>Total: </p>
                <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
    )
}

export default OrderSummary;