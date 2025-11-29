import styles from "./Header.module.css"
import locationIcon from '../../assets/icons/location.svg';
import logoName from '../../assets/icons/logo_name.svg';
import logoPhoto from '../../assets/icons/logo_photo.svg';
import wishlistIcon from '../../assets/icons/like.svg';
import cartIcon from '../../assets/icons/cart.svg';
import searchIcon from '../../assets/icons/search.svg';
import closeIcon from '../../assets/icons/close.svg';
import arrowDown from '../../assets/icons/arrow_down.svg';
import ContentLayout from '../layout/ContentLayout.js'
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout } from "../../features/auth/authSlice";
import axios from 'axios';
import { selectCart, changeCurrency } from "../../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../i18n';

import { useRef, useState, useEffect } from "react";
import HeaderNav from "./HeaderNav";

export default function Header() {
    const cart = useSelector(selectCart);
    const auth = useSelector(selectAuth);
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('Eng');
    const [currency, setCurrency] = useState(cart.currency);
    const [search, setSearch] = useState(false);
    const [categories, setCategories] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();


    useEffect(() => {
        if (search && inputRef.current) {
            inputRef.current.focus();
        }
    }, [search]);

    const handleSearchToggle = () => {
        setSearch((prev) => !prev);
    };

    const logoutAction = () => {
        dispatch(logout());
    };

    useEffect(() => {
        console.log('Fetching categories');
        axios
            .get(`${process.env.REACT_APP_API_URL}/category/tree/root`, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                },
            })
            .then((response) => {
                setCategories(response.data.subcategories);
                console.log('Categories fetched:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return <header>
        <div className={styles.header_container}>
            <ContentLayout>
                <div className={styles.header_content}>
                    <div className={styles.header_contacts}>
                        <img src={locationIcon} alt="Location" width={12} height={12} />
                        <p >Store Location: Lincoln_ 344, Illinois, Chicago, USA</p>
                    </div>
                    <div className={styles.header_settings}>
                        <div className={`${styles.dropdown}`}>{language}
                            <img className={styles.drop_down_gap} src={arrowDown} alt="Drow down" />
                            <ul>
                                <li onClick={() => {setLanguage('Eng');i18n.changeLanguage('en');}}>Eng</li>
                                <li onClick={() => {setLanguage('Ukr');i18n.changeLanguage('uk');}}>Ukr</li>
                            </ul>
                        </div>

                        <div className={`${styles.dropdown}`}>{currency}
                            <img className={styles.drop_down_gap} src={arrowDown} alt="Drow down" />
                            <ul>
                                <li onClick={() => { setCurrency('usd'); dispatch(changeCurrency('usd')); navigate('/') }}>usd</li>
                                <li onClick={() => { setCurrency('hrn'); dispatch(changeCurrency('hrn')); navigate('/') }}>hrn</li>
                            </ul>
                        </div>
                        <div className={`${styles.header_setting_splitter}`}></div>
                        {!auth.token ? <div >
                            <Link to="/login">Log in</Link>
                            <span>/</span>
                            <Link to="/registration">Create Account</Link>
                        </div> : <div >
                            <a onClick={logoutAction}>Logout</a>
                            <span>/</span>
                            <Link to="/profile/account">Profile</Link>
                        </div>}
                    </div>
                </div>
                <div className={`${styles.header_content} ${styles.header_logo}`}>
                    <div >
                        <Link to="/">
                            <img src={logoPhoto} alt="Logo" />
                            <img src={logoName} alt="Wine and voyages" />
                        </Link>
                    </div>
                    <div className={styles.header_icons}>
                        {search ?
                            <div className={styles.search_container}>
                                <img src={searchIcon} alt="Search" width={20} height={20} />
                                <input placeholder="Search" type="text" id="search" ref={inputRef}
                                    className={styles.header_search_input} name="search" />
                                <img src={closeIcon} alt="Close search" width={20} height={20}
                                    onClick={() => handleSearchToggle()} />
                            </div> :
                            <img className={styles.search_button} src={searchIcon} alt="Search"
                                width={20} height={20} onClick={() => handleSearchToggle()} />}
                        <Link to={`${!auth.token ? '/wishlist' : '/profile/wishlist'}`}>
                            <img src={wishlistIcon} alt="Wishlist" width={32} height={32} />
                        </Link>
                        <div className={`${styles.header_icon_splitter}`}></div>
                        <Link to="/cart">
                            <img src={cartIcon} alt="Cart" width={26} height={26} />
                        </Link>
                    </div>
                </div>
            </ContentLayout>
        </div>
        <HeaderNav categories={categories}></HeaderNav>
    </header>
}


