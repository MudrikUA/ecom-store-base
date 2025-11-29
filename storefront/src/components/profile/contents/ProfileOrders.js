import { useEffect, useState } from 'react';
import styles from './ProfileOrders.module.css'
import searchIcon from '../../../assets/icons/search.svg';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { height } from '@mui/system';


export default function ProfileOrders({ auth }) {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const formatter = new Intl.DateTimeFormat("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 300,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/order/byUser`, {
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })
            .then((response) => {
                setOrders(response.data)

            })
            .catch((error) => {
                //setError(error.message);
                //setLoading(false);
            });
    }, [])

    return (
        <div className={styles.orders}>
            <p className={styles.formHeader}>Orders Content</p>
            {orders && orders.map((order) => (
                <div className={styles.orderContainer} key={order.id}>
                    <p>Order ID: {order.id}</p>
                    <p>Order Date: {formatter.format(new Date(order.createdAt))}</p>
                    <p>Order Total: {order.total_price} {order.currency}</p>
                    <p>Status: {order.status}</p>
                    <img src={searchIcon} onClick={() => { setSelectedOrder(order); handleOpen(); }} alt="Search" width={20} height={20} />

                </div>
            ))}
            {selectedOrder ?
                <Modal
                    open={showModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <span className={styles.orderHeader}>Order detail (# {selectedOrder.id})</span>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div >
                                <p>Order Date: {formatter.format(new Date(selectedOrder.createdAt))}</p>
                                <p>Order Total: {selectedOrder.total_price} {selectedOrder.currency}</p>
                                <p>Status: {selectedOrder.status}</p>
                            </div>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className={styles.shippingHeader}>Shipping detail</div>
                            {selectedOrder.shipping ? <div >
                                <p>First name: {selectedOrder.shipping.customer_first_name}</p>
                                <p>Last name: {selectedOrder.shipping.customer_last_name}</p>
                                <p>Phone: {selectedOrder.shipping.customer_phone}</p>
                                <p>Address: {selectedOrder.shipping.address}, {selectedOrder.shipping.city},
                                    {selectedOrder.shipping.country},
                                    {selectedOrder.shipping.postal_code}</p>
                                <p>Status: {selectedOrder.shipping.status}</p>
                                <p>Shipped at: {formatter.format(new Date(selectedOrder.shipping.shipped_at))}</p>
                            </div> : <></>}
                        </Typography>
                    </Box>
                </Modal> : <></>}
        </div>
    );
}