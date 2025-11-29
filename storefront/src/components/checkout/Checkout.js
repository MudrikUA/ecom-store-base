import axios from 'axios';
import CryptoJS from 'crypto-js';
import { selectAuth } from "../../features/auth/authSlice"
import { selectCart, clearCart } from "../../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom"
import editIcon from '../../assets/icons/pen.svg';
import { Link, useNavigate } from "react-router-dom";
import CheckoutProgressBar from './CheckoutProgressBar';
import CustomButton from '../custom/CustomButton';
import OrderSummary from './OrderSummary';

import styles from "./Checkout.module.css"

const Checkout = () => {
    const auth = useSelector(selectAuth);
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [checkoutStep, setCheckoutStep] = useState('shipping')

    const [firstName, setFirstName] = useState(auth.user ? auth.user.first_name : '');
    const [lastName, setLastName] = useState(auth.user ? auth.user.last_name : '');
    const [email, setEmail] = useState(auth.user ? auth.user.email : '');
    const [phone, setPhone] = useState(auth.user ? auth.user.phone : '');

    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [postal, setPostal] = useState('');

    const [notes, setNotes] = useState('');

    const [billingFirstName, setBillingFirstName] = useState('');
    const [billingLastName, setBillingLastName] = useState('');

    const [billingAddress, setBillingAddress] = useState('');
    const [billingCountry, setBillingCountry] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingPostal, setBillingPostal] = useState('');

    const [useForBilling, setUseForBilling] = useState(false);
    const [billingPreFilled, setBillingPreFilled] = useState(false);

    const [shippingMethod, setShippingMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [orderNumber, setOrderNumber] = useState();


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/payment-method/active`, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })
            .then((response) => {
                setPaymentMethods(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/shipping-method/active`, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })
            .then((response) => {
                setShippingMethods(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (!auth.token) {
            navigate('/login');
        }
    });

    useEffect(() => {
        if (!cart.items || cart.items.length < 1) {
            navigate('/cart');
        }
    }, []);

    function goToStep(step) {
        if (step === "shipping") {
            // if(){}
            setCheckoutStep(step);
        } else if (step === "billing") {
            if (useForBilling) {
                flushSync(() => {
                    setBillingAddress(address);
                    setBillingCountry(country);
                    setBillingState(state);
                    setBillingCity(city);
                    setBillingPostal(postal);
                    setBillingPreFilled(true);
                });
            }
            //copy data from shipping to billing if  necessary
            setCheckoutStep(step);
        } else if (step === "confirmation") {
            //create order and only then redirect to confirmation page
            const order = genereteOrder();
            placeOrder(order);
        }
    }

    function placeOrder(order) {
        axios
            .post(`${process.env.REACT_APP_API_URL}/order`, order, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })
            .then((response) => {
                if (response.status === 201) {
                    setOrderNumber(response.data.id)
                    setCheckoutStep("confirmation");
                    dispatch(clearCart());
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function genereteOrder() {
        const transactionId = CryptoJS.SHA256(`${auth.user.id}${email}${new Date().toISOString()}`).toString();

        return {
            "user_id": auth.user.id,
            "total_price": cart.totalAmount.toFixed(2),
            "currency": cart.currency,
            "status": "new",
            "shipping_id": {
                "customer_last_name": lastName,
                "customer_first_name": firstName,
                "customer_phone": phone,
                "address": address,
                "city": city,
                "postal_code": postal,
                "country": country,
                "status": "new",
                "shipping_method_id": shippingMethod,
                "shipped_at": new Date().toISOString(),
                "notes": notes
            },
            "payment_id": {
                "payment_method_id": paymentMethod,
                "transaction_id": transactionId,
                "status": "new",
                "paid_at": new Date().toISOString(),
                "customer_last_name": billingLastName,
                "customer_first_name": billingFirstName,
                "address": billingAddress,
                "city": billingCity,
                "postal_code": billingPostal,
                "country": billingCountry
            },
            "items": cart.items.map(item => ({
                "product_id": item.id,
                "quantity": item.quantity,
                "price": item.price,
                "currency": cart.currency
            }))
        }
    }

    function submitShippingForm() {
        goToStep('billing');
    }
    function submitBillingForm() {
        goToStep('confirmation');
    }

    return <>{checkoutStep === "shipping" ? <div>
        <CheckoutProgressBar checkoutStep={checkoutStep}></CheckoutProgressBar>
        <div className={styles.checkoutBlock}>
            <form action={submitShippingForm} className={styles.checkoutForm}>
                <div className={styles.sectionContainer}>
                    <p className={styles.sectionHeader}>Contact Details</p>
                    <div className={styles.inputContaner}>
                        <span>First name</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            required
                            name="firstName"
                            value={firstName} onChange={(e) => setFirstName(e.target.value)}
                            placeholder='Your first name' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>Last name</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="lastName"
                            value={lastName} onChange={(e) => setLastName(e.target.value)}
                            placeholder='Your last name' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>Email</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='email'
                            required
                            name="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder='Your email' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>Phone Number</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='phone'
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder='xxx-xxx-xxx-xxx' />
                    </div>
                </div>

                <div className={styles.sectionContainer}>
                    <p className={styles.sectionHeader}>Shipping Details</p>
                    <div className={styles.inputContaner}>
                        <span>Street Address</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='Your street address' />
                    </div>
                    <div></div>
                    <div className={styles.inputContaner}>
                        <span>Country / Region</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="country"
                            value={country} onChange={(e) => setCountry(e.target.value)}
                            placeholder='Select' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>State / Province</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='Select' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>City</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='Select' />
                    </div>
                    <div className={styles.inputContaner}>
                        <span>ZIP / Postal Code</span>
                        <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                            type='text'
                            name="postal"
                            value={postal} onChange={(e) => setPostal(e.target.value)}
                            placeholder='Select' />
                    </div>

                    <div className={styles.checkboxBlock}>
                        <input style={{ accentColor: "#2F3233" }}
                            type="checkbox"
                            name="useForBilling" value={useForBilling}
                            onChange={(e) => setUseForBilling(e.target.checked)} />
                        <label htmlFor="useForBilling">Use this information for billing</label>
                    </div>

                </div>

                <div>
                    <p className={styles.sectionHeader}>Shipping Methods</p>
                    <div className={styles.shippingMethodsBlock}>
                        {shippingMethods.map((sm) => {
                            return <div className={styles.shippingMethod}>
                                {/* <input className={styles.shippingMethodsRadio} required type="radio" id={sm.id} name="shippingMethod" value={sm.id} checked={shippingMethod === String(sm.id)} onChange={(e) => setShippingMethod(e.target.value)} /> */}
                                <input className={styles.shippingMethodsRadio}
                                    required
                                    type="radio"
                                    id={sm.id}
                                    name="shippingMethod"
                                    value={sm.id}
                                    checked={shippingMethod?.id === sm.id}
                                    onChange={(e) => setShippingMethod(sm)} />
                                <div>
                                </div><label htmlFor={sm.id}>
                                    <div className={styles.shippingMethodImg}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                                            <path d="M42.625 19.375H52.9422C53.3282 19.3725 53.706 19.4868 54.0</div>258 19.703C54.3457 19.9191 54.5927 20.2269 54.7344 20.586L58.125 29.0625" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3.875 34.875H42.625" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M43.5938 52.3125C46.8039 52.3125 49.4062 49.7102 49.4062 46.5C49.4062 43.2898 46.8039 40.6875 43.5938 40.6875C40.3836 40.6875 37.7812 43.2898 37.7812 46.5C37.7812 49.7102 40.3836 52.3125 43.5938 52.3125Z" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M18.4062 52.3125C21.6164 52.3125 24.2188 49.7102 24.2188 46.5C24.2188 43.2898 21.6164 40.6875 18.4062 40.6875C15.1961 40.6875 12.5938 43.2898 12.5938 46.5C12.5938 49.7102 15.1961 52.3125 18.4062 52.3125Z" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M37.7812 46.5H24.2188" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.5938 46.5H5.8125C5.29864 46.5 4.80583 46.2959 4.44248 45.9325C4.07913 45.5692 3.875 45.0764 3.875 44.5625V17.4375C3.875 16.9236 4.07913 16.4308 4.44248 16.0675C4.80583 15.7041 5.29864 15.5 5.8125 15.5H42.625V40.7602" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M42.625 29.0625H58.125V44.5625C58.125 45.0764 57.9209 45.5692 57.5575 45.9325C57.1942 46.2959 56.7014 46.5 56.1875 46.5H49.4062" stroke="#2F3233" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className={styles.shippingMethodDesc}>
                                        <p className={styles.shippingMethodName}>{sm.name}</p>
                                        <p className={styles.shippingMethodTime}>{sm.delivery_time}</p>
                                    </div>
                                </label>
                            </div>
                        })}
                    </div>
                </div>

                <div className={styles.addInformBlock}>
                    <p className={styles.sectionHeader}>Additional Info</p>
                    <div className={styles.addInform}>
                        <p className={styles.addInformNotification}>Order Notes (Optional)</p>
                        <textarea className="form-control" id="description" rows="5"
                            name="description"
                            placeholder="Notes about your order, e.g. special notes for delivery"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}></textarea>
                    </div>
                </div>

                <div className={styles.actionBtnBlock}>
                    <div className={styles.actionBack}><Link to={"/cart"}><CustomButton isPrimary={false}>Go back</CustomButton></Link></div>
                    <div className={styles.actionNext}><CustomButton type="submit" isPrimary={true}>Go to Billing</CustomButton></div>
                </div>
            </form>
            <OrderSummary cart={cart}></OrderSummary>
        </div>
    </div> : <></>}
        {checkoutStep === "billing" ? <div>
            <CheckoutProgressBar checkoutStep={checkoutStep}></CheckoutProgressBar>
            <div className={styles.checkoutBlock}>
                <form action={submitBillingForm} className={styles.checkoutForm}>
                    <div className={styles.sectionContainerSrt}>
                        <p className={styles.sectionHeader}>Shipping Information</p>
                        <div className={styles.filledDataBlock}>
                            <div className={styles.filledDataText}>
                                <div>{`${firstName} ${lastName},`}</div>
                                <div>{`${address}, ${city}, ${state}, ${country}, ${postal}`}</div>
                                <div>{`${shippingMethod.name}, ${shippingMethod.delivery_time}, ${shippingMethod.cost ? shippingMethod.cost : shippingMethod.description}`}</div>
                            </div>
                            <div className={styles.editActions}>
                                <img src={editIcon} alt="Location" width={24} height={24} />
                                <a onClick={() => goToStep('shipping')}>Go back</a>
                            </div>
                        </div>
                    </div>

                    {billingPreFilled ? <div className={styles.sectionContainerSrt}>
                        <p className={styles.sectionHeader}>Billing Information</p>
                        <div className={styles.filledDataBlock}>
                            <div className={styles.filledDataText}>
                                <div>{`${address}, ${city}, ${state}, ${country}, ${postal}`}</div>
                            </div>
                            <div className={styles.editActions}>
                                <img src={editIcon} alt="Location" width={24} height={24} />
                                <a onClick={() => setBillingPreFilled(false)}>Edit</a>
                            </div>
                        </div>
                    </div> : <></>}

                    {!billingPreFilled ? <div className={styles.sectionContainer}>
                        <p className={styles.sectionHeader}>Billing Information</p>
                        <div className={styles.inputContaner}>
                            <span>First name</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                                type='text'
                                required
                                name="firstName"
                                value={billingFirstName} onChange={(e) => setBillingFirstName(e.target.value)}
                                placeholder='Your first name' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>Last name</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`}
                                type='text'
                                name="lastName"
                                value={billingLastName} onChange={(e) => setBillingLastName(e.target.value)}
                                placeholder='Your last name' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>Street Address</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`} required type='text' name="address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder='Your street address' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>Country / Region</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`} required type='text' name="country" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} placeholder='Select' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>State / Province</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`} required type='text' name="state" value={billingState} onChange={(e) => setBillingState(e.target.value)} placeholder='Select' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>City</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`} required type='text' name="city" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} placeholder='Select' />
                        </div>
                        <div className={styles.inputContaner}>
                            <span>ZIP / Postal Code</span>
                            <input className={`${styles.inputFieldDef} ${styles.inputField}`} required type='text' name="postal" value={billingPostal} onChange={(e) => setBillingPostal(e.target.value)} placeholder='Select' />
                        </div>
                    </div> : <></>}

                    <div className={styles.sectionContainerSrt}>
                        <p className={styles.sectionHeader}>Payment Methods</p>
                        <div className={styles.paymentList}>
                            {paymentMethods.map((pm) => {
                                return (
                                    <div key={pm.id} className={styles.redioGroup}>
                                        <input required type="radio" id={pm.id} name="paymentMethod" value={pm.id} checked={paymentMethod === String(pm.id)} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <label htmlFor={pm.id} className={styles.redioLabel}>
                                            <p className={styles.paymentTitle}>{pm.name}</p>
                                            <p className={styles.paymentDescription}>{pm.description}</p>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        <p>By placing an order you agree to Wine & Voyages terms and conditions.</p>
                    </div>
                    <div className={styles.actionBtnBlock}>
                        <div className={styles.actionBack}><CustomButton onClick={() => goToStep('shipping')} isPrimary={false}>Go back</CustomButton></div>
                        <div className={styles.actionNext}><CustomButton type="submit" isPrimary={true}>Pay ${cart.totalAmount.toFixed(2)}</CustomButton></div>
                    </div>
                </form>
                <OrderSummary cart={cart}></OrderSummary>
            </div>
        </div> : <></>}
        {checkoutStep === "confirmation" ? <div>
            <CheckoutProgressBar checkoutStep={checkoutStep}></CheckoutProgressBar>
            <div className={styles.confirmationBlock}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="158" height="240" viewBox="0 0 158 240" fill="none">
                        <path d="M13.5157 20.9322C13.2805 15.7585 12.6978 11.0292 11.9134 7.00163H145.767C145.743 7.15938 145.719 7.31717 145.696 7.47491C145.108 11.4702 144.775 16.2254 144.712 21.3787C144.587 31.6779 145.538 43.9965 147.962 55.6881L147.985 55.8024L148.013 55.9157C151.813 71.4852 153.015 94.5722 145.014 113.535C141.069 122.883 134.93 131.15 125.783 137.195C116.625 143.246 104.022 147.354 86.7015 147.669L82.4894 147.746V147.668H75.8227C60.9818 147.668 41.181 144.486 26.8759 131.925C13.0717 119.804 2.83578 97.5236 9.67663 55.7674C13.1455 43.1121 13.9716 30.961 13.5157 20.9322Z" stroke="#2F3233" stroke-width="13.3333" />
                    </svg>
                </div>
                <p className={styles.confirmationText1}>Thank you for your purchase!</p>
                <p className={styles.confirmationText2}>Order Successfully Placed</p>
                <p className={styles.confirmationText3}>Order Number: {orderNumber}</p>
                <div className={styles.confirmationBtn}><Link to={"/"}><CustomButton isPrimary={true}>Continue Shopping</CustomButton></Link></div>
            </div>
        </div> : <></>}</>
}

export default Checkout;