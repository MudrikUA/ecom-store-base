import { Route, Routes } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import Plp from './pages/Plp';
import Pdp from './pages/Pdp';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import WishlistPage from './pages/WishlistPage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";
import { jwtDecode } from "jwt-decode";


function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const checkToken = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          dispatch(logout());
        }
      }
    };

    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, [token, dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/category/*" element={<Plp />} />
        <Route path="/product/:productId" element={<Pdp />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/registration" element={<Auth />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile/account" element={<ProfilePage />} />
        <Route path="/profile/orders" element={<ProfilePage />} />
        <Route path="/profile/personal-data" element={<ProfilePage />} />
        <Route path="/profile/change-password" element={<ProfilePage />} />
        <Route path="/profile/wishlist" element={<ProfilePage />} />
        <Route path="/profile/delete" element={<ProfilePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
