import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import HomePage from "./components/HomePage";
import ProductPage from "./components/ProductPage";
import LoginPage from "./components/LoginPage";
import AddToCartPage from "./components/Cart/AddToCartPage";
import CheckoutPage from "./components/CheckoutPage";
import SignupPage from "./components/SignupPage";
import OrderHistory from "./components/OrderHistory";
import OrderConfirmation from "./components/OrderConfirmation";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:category" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-to-cart" element={<AddToCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/order/:orderId" element={<OrderConfirmation />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
