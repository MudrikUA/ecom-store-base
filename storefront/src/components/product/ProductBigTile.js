import styles from "./ProductTile.module.css";
import Rating from '@mui/material/Rating';



export default function HomeProductsBigTile({ product }) {
    const staticImgPath = `${process.env.REACT_APP_API_URL}/static/`;

    return <div className={styles.hot_deal_first_element}>
        <img className={styles.product_big_img} src={staticImgPath + `${product.images[0]}`}
            alt={product.header} width={430} height={350} />
        <div className={styles.product_big_group} >
            <p className={styles.product_big_name}>{product.title}</p>
            <div className={styles.product_big_prices}>
                <p className={styles.product_big_price}>{product.price}{product.currency} </p>
                <p className={styles.product_big_d_pice}>{product.discontPrice}{product.currency}</p>
            </div>
            <div className={styles.product_big_rating_block}>
                <Rating name="read-only" size="small" value={product.rating} readOnly sx={{'.MuiSvgIcon-root':{fill:"black"}}}/>
                <p className={styles.product_big_rating_text}>({product.ratingCount} Feedback)</p>
            </div>
            <div className={styles.product_big_timer_block}>
                Timer placeholder
            </div>
        </div>
    </div>
}

