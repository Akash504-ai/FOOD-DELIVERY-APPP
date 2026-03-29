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
import PaymentSuccess from "./pages/PaymentSuccess";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyshop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";

export const serverUrl = import.meta.env.VITE_API_URL;

// ✅ Protected Route (correct)
const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return children;
};

function App() {
  const { userData, loading } = useSelector((state) => state.user);

  // ✅ ALWAYS call hooks at top level (React rule)
  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  // ✅ Socket only after user loaded
  useEffect(() => {
    if (!userData) return;

    const socket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.emit("identity", { userId: userData._id });

    return () => socket.disconnect();
  }, [userData?._id]);

  if (loading) return null;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
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
      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
  );
}

export default App;

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { io } from "socket.io-client";

// import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
// import ForgotPassword from "./pages/ForgotPassword";
// import Home from "./pages/Home";
// import CreateEditShop from "./pages/CreateEditShop";
// import AddItem from "./pages/AddItem";
// import EditItem from "./pages/EditItem";
// import CartPage from "./pages/CartPage";
// import CheckOut from "./pages/CheckOut";
// import OrderPlaced from "./pages/OrderPlaced";
// import MyOrders from "./pages/MyOrders";
// import TrackOrderPage from "./pages/TrackOrderPage";
// import Shop from "./pages/Shop";
// import PaymentSuccess from "./pages/PaymentSuccess";

// import useGetCurrentUser from "./hooks/useGetCurrentUser";

// export const serverUrl = import.meta.env.VITE_API_URL;

// const ProtectedRoute = ({ children }) => {
//   const { loading } = useSelector((state) => state.user);
//   const token = localStorage.getItem("token");

//   if (loading) return <div>Loading...</div>;

//   if (!token) {
//     return <Navigate to="/signin" />;
//   }

//   return children;
// };

// function App() {
//   const { userData, loading } = useSelector((state) => state.user);

//   // ✅ ONLY THIS HOOK FIRST
//   useGetCurrentUser();

//   // ✅ SOCKET AFTER USER READY
//   useEffect(() => {
//     if (!userData) return;

//     const socket = io(serverUrl, {
//       withCredentials: true,
//       transports: ["websocket"],
//     });

//     socket.emit("identity", { userId: userData._id });

//     return () => socket.disconnect();
//   }, [userData?._id]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <Routes>
//       <Route
//         path="/signin"
//         element={!userData ? <SignIn /> : <Navigate to="/" />}
//       />
//       <Route
//         path="/signup"
//         element={!userData ? <SignUp /> : <Navigate to="/" />}
//       />
//       <Route
//         path="/forgot-password"
//         element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/create-edit-shop"
//         element={
//           <ProtectedRoute>
//             <CreateEditShop />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-item"
//         element={
//           <ProtectedRoute>
//             <AddItem />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/edit-item/:itemId"
//         element={
//           <ProtectedRoute>
//             <EditItem />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/cart"
//         element={
//           <ProtectedRoute>
//             <CartPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/checkout"
//         element={
//           <ProtectedRoute>
//             <CheckOut />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/order-placed"
//         element={
//           <ProtectedRoute>
//             <OrderPlaced />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/my-orders"
//         element={
//           <ProtectedRoute>
//             <MyOrders />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/track-order/:orderId"
//         element={
//           <ProtectedRoute>
//             <TrackOrderPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/shop/:shopId"
//         element={
//           <ProtectedRoute>
//             <Shop />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/payment-success"
//         element={
//           <ProtectedRoute>
//             <PaymentSuccess />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default App;
