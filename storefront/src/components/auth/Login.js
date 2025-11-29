import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import style from './Auth.module.css';
import CustomButton from '../custom/CustomButton';

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordVisibility, setPasswordVisibility] = useState('password');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setPasswordVisibility((prevState) => prevState === 'password' ? 'text' : 'password');
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

        if (!formData.password || !formData.password.trim()) {
            newErrors.password = "Please enter password";
        }

        return newErrors;
    };

    const login = (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios
            .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            })
            .then((response) => {
                dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
                navigate('/profile/account');
            })
            .catch((error) => {
                setErrors({ respError: error.response.data.message });
            });
    }

    return (
        <form className={`${style.loginForm} ${style.container}`} onSubmit={login}>
            <input
                className={`${style.inputFieldDef} ${style.inputField}`}
                name="email"
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
            />
            {errors.email && <p className={style.error}>{errors.email}</p>}
            <div className={style.inputFieldPasswordBtn}>
                <input
                    className={`${style.inputFieldDef} ${style.inputFieldPassword}`}
                    name="password"
                    type={passwordVisibility}
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <div className={style.passwordShowBtn} onClick={togglePasswordVisibility}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M1.66797 10C1.66797 10 4.69797 4.16669 10.0013 4.16669C15.3046 4.16669 18.3346 10 18.3346 10C18.3346 10 15.3046 15.8334 10.0013 15.8334C4.69797 15.8334 1.66797 10 1.66797 10Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5V12.5Z" stroke="#2F3233" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            {errors.password && <p className={style.error}>{errors.password}</p>}
            <div className={style.forgetPassword} >Forget Password?</div>
            {errors.respError && <p className={style.error}>{errors.respError}</p>}
            <CustomButton type='submit' isPrimary={true}>Login</CustomButton>
        </form>
    )
}

export default Login;