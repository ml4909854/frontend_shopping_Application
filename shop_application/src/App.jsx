// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Navbar from './Navbar/Navbar';
import Home from './Components/Home/Home';
import Product from './Components/Product/Product';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';
import Login from './Components/Login/Login';
import Signup from './Components/Singnup/Signup';
import PrivateRoute from './Components/PrivateRoute';
import Checkout from './Components/Checkout/Checkout.jsx';

import AdminUsers from './admin/pages/AdminUsers/AdminUsers';
import AdminProducts from './admin/pages/AdminProducts/AdminProducts';
import AdminOrders from './admin/pages/AdminOrder/AdminOrders';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard/AdminDashboard.jsx';
import OrderDetails from './admin/pages/OrderDetails/OrderDetails';

// ✅ Secure role-based redirection
const RoleRedirect = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;
      return role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
    } catch (error) {
      localStorage.removeItem('token');
    }
  }

  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />

        {/* ✅ USER ROUTES */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="product" element={<Product />} />
          <Route path="productDetail/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="cart" element={<PrivateRoute roleRequired="user"><Cart /></PrivateRoute>} />
          <Route path="checkout" element={<PrivateRoute roleRequired="user"><Checkout /></PrivateRoute>} />
          <Route path="order" element={<PrivateRoute roleRequired="user"><Order /></PrivateRoute>} />
        </Route>

        {/* ✅ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="order/:orderId" element={<OrderDetails />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
