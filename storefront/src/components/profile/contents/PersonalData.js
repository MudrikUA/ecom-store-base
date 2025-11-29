import styles from './PersonalData.module.css'
import CustomButton from '../../custom/CustomButton'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function PersonalData({ auth, updateUser }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: auth.user?.first_name,
        lastName: auth.user?.last_name,
        email: auth.user?.email,
        phone: auth.user?.phone,
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        updateProfileData();
        setErrors({});
        setNotification({});
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.firstName || !formData.firstName.trim()) {
            newErrors.firstName = "Please fill in the first name field";
        }

        if (!formData.lastName || !formData.lastName.trim()) {
            newErrors.lastName = "Please fill in the last name field";
        }

        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = "Please fill in the phone field";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Incorrect email format!";
        }

        if (formData.password.length < 1) {
            newErrors.password = "Please fill in the password field.";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const updateProfileData = () => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/update`, {
                id: auth.user.id,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    const updatedUser = {
                        email: response.email,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone,
                    };
                    dispatch(updateUser(updatedUser));
                    setNotification({ sucesses: "Information updated successfully!" });
                    setErrors({});
                }
                //setLoading(false);
            })
            .catch((error) => {
                setErrors({ general: error?.response?.data.message });
                setNotification({});
                //setError(error.message);
                //setLoading(false);
            });
    }

    return <div className={styles.dataContainer}>
        <p className={styles.formHeader}>Personal Data Content</p>

        <form onSubmit={handleSubmit} className={styles.dataForm}>
            <label for="">First name:</label>
            <input name='firstName' type='text' value={formData?.firstName} onChange={handleChange} ></input>
            {errors.firstName && <p style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</p>}

            <label for="">Last name:</label>
            <input name='lastName' type='text' value={formData?.lastName} onChange={handleChange} ></input>
            {errors.lastName && <p style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</p>}

            <label for="">Email:</label>
            <input name='email' type='email' value={formData?.email} onChange={handleChange} ></input>
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}

            <label for="">Phone:</label>
            <input name='phone' type='phone' value={formData?.phone} onChange={handleChange} ></input>
            {errors.phone && <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>}

            <span>To save changes, please enter your password.</span>
            <label for="">Password:</label>
            <input name='password' type='password' value={formData.password} onChange={handleChange} ></input>

            {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}
            {errors.general && <p style={{ color: "red", fontSize: "12px" }}>{errors.general}</p>}
            {notification.sucesses && <p style={{ color: "green", fontSize: "14px" }}>{notification.sucesses}</p>}
            <CustomButton type='submit' isPrimary={true}><p>Save changes</p></CustomButton>
        </form>
    </div >
}