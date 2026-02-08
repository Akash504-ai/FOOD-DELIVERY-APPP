import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { io } from "socket.io-client";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyshop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";

export const serverUrl = "http://localhost:8000";

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) return null;
  if (!userData) return <Navigate to="/signin" />;

  return children;
};

function App() {
  const { userData, loading } = useSelector((state) => state.user);

  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  useEffect(() => {
    if (!userData) return;

    const socket = io(serverUrl, { withCredentials: true });
    socket.emit("identity", { userId: userData._id });

    return () => socket.disconnect();
  }, [userData?._id]);

  if (loading) return null; // 🚀 THIS FIXES YOUR REFRESH BUG

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-edit-shop"
        element={
          <ProtectedRoute>
            <CreateEditShop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-item"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-item/:itemId"
        element={
          <ProtectedRoute>
            <EditItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-placed"
        element={
          <ProtectedRoute>
            <OrderPlaced />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/track-order/:orderId"
        element={
          <ProtectedRoute>
            <TrackOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;