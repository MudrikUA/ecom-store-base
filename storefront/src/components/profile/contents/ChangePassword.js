import styles from './ChangePassword.module.css'
import CustomButton from '../../custom/CustomButton'
import { useState } from 'react'
import { useDispatch } from'react-redux';
import axios from 'axios';

export default function ChangePassword({auth}) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        curPassword: '',
        newPassword: '',
        conPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({});

    const handleSubmit = (e) => {

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        changePassword();
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.curPassword.trim()) {
            newErrors.curPassword = "Please fill in this field";
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "Please fill in this field";
        }

        if (!formData.conPassword.trim()) {
            newErrors.conPassword = "Please fill in this field";
        }
        
        if (formData.conPassword.trim() !== formData.newPassword.trim()) {
            newErrors.conPassword = "The new password and the confirmation password are different";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const changePassword = () => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/user/change-password`, {
                id: auth.user.id,
                oldPassword: formData.curPassword,
                newPassword: formData.newPassword,
          
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setNotification({ sucesses: "Information updated successfully!" });
                    setFormData({
                        curPassword: '',
                        newPassword: '',
                        conPassword: ''
                    })
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
        <p className={styles.formHeader}>Change password</p>
        <form action={handleSubmit} className={styles.dataForm}>
            <label for="">Current Password:</label>
            <input name='curPassword' type='password' value={formData.curPassword} onChange={handleChange} ></input>
            {errors.curPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.curPassword}</p>}

            <label for="">New Password:</label>
            <input name='newPassword' type='password' value={formData.newPassword} onChange={handleChange} ></input>
            {errors.newPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.newPassword}</p>}

            <label for="">Confirm Password:</label>
            <input name='conPassword' type='password' value={formData.conPassword} onChange={handleChange} ></input>
            {errors.conPassword && <p style={{ color: "red", fontSize: "12px" }}>{errors.conPassword}</p>}

            {errors.general && <p style={{ color: "red", fontSize: "12px" }}>{errors.general}</p>}
            {notification.sucesses && <p style={{ color: "green", fontSize: "14px" }}>{notification.sucesses}</p>}

            <CustomButton type='submit' isPrimary={true}><p>Save changes</p></CustomButton>
        </form>
    </div >
}