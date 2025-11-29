import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import style from './Auth.module.css';
import CustomButton from '../custom/CustomButton';

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordVisibility, setPasswordVisibility] = useState('password');
    const [confPasswordVisibility, setConfPasswordVisibility] = useState('password');

    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setPasswordVisibility((prevState) => prevState === 'password' ? 'text' : 'password');
    };

    const toggleConfPasswordVisibility = (event) => {
        event.preventDefault();
        setConfPasswordVisibility((prevState) => prevState === 'password' ? 'text' : 'password');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Incorrect email format!";
        }

        if (!formData.email || !formData.email.trim()) {
            newErrors.email = "Please enter Email";
        }

        if (!formData.firstName || !formData.firstName.trim()) {
            newErrors.firstName = "Please enter first name";
        }

        if (!formData.lastName || !formData.lastName.trim()) {
            newErrors.lastName = "Please enter last name";
        }

        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = "Please phone number";
        }

        if (!formData.password || !formData.password.trim()) {
            newErrors.password = "Please enter password";
        }

        if (!formData.confPassword || !formData.confPassword.trim()) {
            newErrors.confPassword = "Please enter confirmation password";
        }

        if (formData.password !== formData.confPassword) {
            newErrors.generalError = "Passwords do not match";
        }

        if (!isTermsAccepted) {
            newErrors.generalError = "Please accept the terms to continue";
        }


        return newErrors;
    };


    const registration = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios
            .post(`${process.env.REACT_APP_API_URL}/auth/registration`, {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone
            })
            .then((response) => {
                dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
                //setLoading(false);
                navigate('/profile');
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    setErrors({ generalError: error.response.data.message });
                }
                //setError(error.message);
                //setLoading(false);
            });
    }

    return (<form className={`${style.loginForm} ${style.container}`} onSubmit={registration}>
        <input className={`${style.inputFieldDef} ${style.inputField}`}
            name="email"
            type='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}></input>
        {errors.email && <p className={style.error}>{errors.email}</p>}
        <input className={`${style.inputFieldDef} ${style.inputField}`}
            name="firstName"
            type='text'
            placeholder='First Name'
            value={formData.firstName}
            onChange={handleChange}></input>
        {errors.firstName && <p className={style.error}>{errors.firstName}</p>}
        <input className={`${style.inputFieldDef} ${style.inputField}`}
            name="lastName"
            type='text'
            placeholder='Last Name'
            value={formData.lastName}
            onChange={handleChange}></input>
        {errors.lastName && <p className={style.error}>{errors.lastName}</p>}
        <input className={`${style.inputFieldDef} ${style.inputField}`}
            name="phone"
            type='phone'
            placeholder='Phone'
            value={formData.phone}
            onChange={handleChange}></input>
        {errors.phone && <p className={style.error}>{errors.phone}</p>}
        <div className={style.inputFieldPasswordBtn}>
            <input className={`${style.inputFieldDef} ${style.inputFieldPassword}`}
                name="password"
                type={passwordVisibility}
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}></input>
            <div className={style.passwordShowBtn} onClick={togglePasswordVisibility}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M1.66797 10C1.66797 10 4.69797 4.16669 10.0013 4.16669C15.3046 4.16669 18.3346 10 18.3346 10C18.3346 10 15.3046 15.8334 10.0013 15.8334C4.69797 15.8334 1.66797 10 1.66797 10Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5V12.5Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
        {errors.password && <p className={style.error}>{errors.password}</p>}
        <div className={style.inputFieldPasswordBtn}>
            <input className={`${style.inputFieldDef} ${style.inputFieldPassword}`}
                name="confPassword"
                type={confPasswordVisibility}
                placeholder='Confirm Password'
                value={formData.confPassword}
                onChange={handleChange}></input>
            <div className={style.passwordShowBtn} onClick={toggleConfPasswordVisibility}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M1.66797 10C1.66797 10 4.69797 4.16669 10.0013 4.16669C15.3046 4.16669 18.3346 10 18.3346 10C18.3346 10 15.3046 15.8334 10.0013 15.8334C4.69797 15.8334 1.66797 10 1.66797 10Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5V12.5Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
        {errors.confPassword && <p className={style.error}>{errors.confPassword}</p>}
        <div className={style.terms}>
            <input style={{ accentColor: "#2F3233" }}
                className={style.termsCheckbox}
                name="terms"
                type='checkbox'
                value={isTermsAccepted}
                onChange={() => { setIsTermsAccepted(prev => !prev) }}></input>
            <label className={style.termsLabel} for="terms">Accept all terms & Conditions</label>
        </div>
        {errors.generalError && <p className={style.error}>{errors.generalError}</p>}
        <CustomButton type='submit' isPrimary={true}>Create Account</CustomButton>
    </form>)
}

export default Registration