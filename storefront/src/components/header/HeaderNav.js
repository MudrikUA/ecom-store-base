import styles from "./HeaderNav.module.css"
import navDown from '../../assets/icons/nav_drop_down.svg';
import homeIcon from '../../assets/icons/home.svg';
import callIcon from '../../assets/icons/call.svg';
import arrowRightIcon from '../../assets/icons/arrow_right.svg';
import prodCatImg from '../../assets/images/prod_mock.png';
import tourImg from '../../assets/images/tour_mock.png';
import serviceImg from '../../assets/images/service_mock.png';
import { getTourCategories, getServicesCategories } from "../../utils/mockData";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function HeaderNav({ categories }) {

    const [isProductsNavShow, setIsProductsNavShow] = useState(false);
    const [isToursNavShow, setIsToursNavShow] = useState(false);
    const [isServiceNavShow, setIsServiceNavShow] = useState(false);
    const navItemRef = useRef(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.addEventListener("mousedown", closeNavMenu);

        return () => {
            document.removeEventListener("mousedown", closeNavMenu);
        };
    }, []);

    const toggleNavDropdown = (cb) => {
        cb((prev) => !prev);
    };

    const closeNavMenu = (event) => {
        if (navItemRef.current && !navItemRef.current.contains(event.target)) {
            setIsProductsNavShow(false);
            setIsToursNavShow(false);
            setIsServiceNavShow(false);
        }
    };

    useEffect(() => {
        setIsProductsNavShow(false);
        setIsToursNavShow(false);
        setIsServiceNavShow(false);
    }, [navigate])

    return <>
        <div iv className={`${styles.nav_container}`}>
            <div className={`${styles.content_container} ${styles.nav_block}`}>
                <nav className={styles.nav_contant}>
                    <Link to="/">
                        <img src={homeIcon} alt="Home" />
                    </Link>
                    <div className={`${styles.dropdown}`}
                        onClick={() => toggleNavDropdown(setIsProductsNavShow)}>{t('nav_bar_product_catalog')}
                        <img className={styles.drop_down_gap} src={navDown} alt="Drow down" />
                    </div>
                    <div className={`${styles.dropdown}`}
                        onClick={() => toggleNavDropdown(setIsToursNavShow)}>Tours
                        <img className={styles.drop_down_gap} src={navDown} alt="Drow down" />
                    </div>
                    <div className={`${styles.dropdown}`}
                        onClick={() => toggleNavDropdown(setIsServiceNavShow)}>Sommelier Services
                        <img className={styles.drop_down_gap} src={navDown} alt="Drow down" />
                    </div>
                    <Link to="/blog">
                        <div>Blog
                        </div>
                    </Link>
                    <Link to="/contacts">
                        <div>Contacts
                        </div>
                    </Link>

                </nav>
                <div className={styles.nav_contact_block}>
                    <img src={callIcon} alt="Call now" width={21} height={21} />
                    <a href="tel:+2195550114">(219) 555-0114</a>
                </div>
            </div>
        </div>
        {isProductsNavShow ?
            <div className={`${styles.nav_drop_down_container} ${styles.nav_products}`} ref={navItemRef}>
                <div className={`${styles.content_container} ${styles.content_auto_center} ${styles.nav_drop_down_items}`}>
                    {categories?.map((category) => {
                        return <div key={category.id} className={styles.product_cat_tile}>
                            <img src={prodCatImg} alt="Category image" />
                            <Link to={`/category/${category.alias}`} className={styles.nav_tile_title} >{category.name}</Link>
                            {category.subcategories.map((subCategory) => {
                                return <Link to={`/category/${category.alias}/${subCategory.alias}`} key={subCategory.id}
                                    className={styles.nav_tile_text}>{subCategory.name}</Link>
                            })}
                        </div>
                    })}
                </div>
            </div>
            : ''
        }
        {
            isToursNavShow ?
                <div className={`${styles.nav_drop_down_container} ${styles.nav_tours}`} ref={navItemRef}>
                    <div className={`${styles.content_container} ${styles.content_auto_center} ${styles.nav_drop_down_items}`}>
                        {getTourCategories()?.map((tour) => {
                            return <div key={tour.id} className={styles.tour_tile}>
                                <img src={tourImg} alt="Category image" />
                                <a className={styles.nav_tile_title} href="#" >{tour.name}</a>
                                <a className={styles.nav_tile_text} href="#" >{tour.desc}</a>
                                <a className={styles.tour_join} href="#" >Join now <img src={arrowRightIcon}
                                    alt="Join now" width={15} height={15} /></a>
                            </div>
                        })}
                    </div>
                </div>
                : ''
        }
        {
            isServiceNavShow ?
                <div className={`${styles.nav_drop_down_container} ${styles.nav_services} ${styles.content_container}`} ref={navItemRef}>
                    <div className={`${styles.content_container} ${styles.content_auto_center} ${styles.nav_drop_down_items}`}>
                        {getServicesCategories()?.map((service) => {
                            return <div key={service.id} className={styles.service_tile}>
                                <img src={serviceImg} alt="Category image" />
                                <a className={styles.nav_tile_title} href="#" >{service.name}</a>
                                {service.options.map((opion) => {
                                    return <a key={opion.id} className={styles.nav_tile_text
                                    } href="#" >{opion.desc}</a>
                                })}
                            </div>
                        })}
                    </div>
                </div>
                : ''
        }
        </>
}