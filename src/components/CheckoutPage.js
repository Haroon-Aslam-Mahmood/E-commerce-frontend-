import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderService, handleOrderError } from "../utils/OrderService";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, isAuthenticated, clearCart, user } =
    useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information - Pre-populated from user account
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Billing Information
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",

    // Payment Information
    paymentMethod: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Pre-populate form with user data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      let userData = user;

      // If user is undefined, try to get from localStorage
      if (!userData) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            userData = JSON.parse(storedUser);
          }
        } catch (error) {
          // Silent fail for localStorage access
        }
      }

      // If we have user data, populate the form
      if (userData) {
        const username = userData.username || userData.name || "";
        const usernameParts = username.split(" ");

        const firstName =
          userData.firstName || userData.given_name || usernameParts[0] || "";
        const lastName =
          userData.lastName ||
          userData.family_name ||
          usernameParts.slice(1).join(" ") ||
          "";
        const email = userData.email || userData.emailAddress || "";
        const phone =
          userData.phone || userData.phoneNumber || userData.mobile || "";

        const finalFirstName = firstName || username;
        const finalLastName = lastName;
        const fullName =
          finalFirstName && finalLastName
            ? `${finalFirstName} ${finalLastName}`.trim()
            : finalFirstName || username || "";

        if (finalFirstName || finalLastName || email || phone) {
          setFormData((prev) => ({
            ...prev,
            firstName: finalFirstName,
            lastName: finalLastName,
            email,
            phone,
            cardName: fullName,
            billingFirstName: finalFirstName,
            billingLastName: finalLastName,
          }));
        }
      }
    }
  }, [user, isAuthenticated]);

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    }

    if (step === 2 && !formData.sameAsShipping) {
      // Validate billing information
      if (!formData.billingFirstName.trim())
        newErrors.billingFirstName = "First name is required";
      if (!formData.billingLastName.trim())
        newErrors.billingLastName = "Last name is required";
      if (!formData.billingAddress.trim())
        newErrors.billingAddress = "Address is required";
      if (!formData.billingCity.trim())
        newErrors.billingCity = "City is required";
      if (!formData.billingState.trim())
        newErrors.billingState = "State is required";
      if (!formData.billingZipCode.trim())
        newErrors.billingZipCode = "Zip code is required";
    }

    if (step === 3 && formData.paymentMethod === "credit") {
      // Validate payment information
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      if (!formData.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsProcessing(true);

    try {
      // Prepare order data with cart items
      const orderData = {
        items: cartItems.map((item) => ({
          productId:
            item.id?._id || item.id || item.productId?._id || item.productId,
          name: item.name,
          size: item.size || "One Size", // Provide default size if missing
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalAmount: Math.round(getTotalPrice() * 1.08 * 100) / 100, // Round to avoid floating point issues
        subtotal: getTotalPrice(),
        tax: Math.round(getTotalPrice() * 0.08 * 100) / 100,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment || "", // Ensure empty string instead of undefined
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: formData.sameAsShipping
          ? {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              apartment: formData.apartment || "",
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            }
          : {
              firstName: formData.billingFirstName,
              lastName: formData.billingLastName,
              address: formData.billingAddress,
              apartment: formData.billingApartment || "",
              city: formData.billingCity,
              state: formData.billingState,
              zipCode: formData.billingZipCode,
              country: formData.billingCountry,
            },
        paymentMethod: formData.paymentMethod,
        email: formData.email,
        phone: formData.phone || "", // Ensure empty string instead of undefined
        status: "pending",
      };

      console.log("Creating order with data:", orderData);
      console.log("Cart items original data:", cartItems);
      console.log(
        "Extracted productIds:",
        orderData.items.map((item) => ({
          originalItem: cartItems.find((ci) => ci.name === item.name),
          extractedId: item.productId,
          hasSize: !!item.size,
          size: item.size,
        }))
      );
      console.log("User authentication status:", isAuthenticated);
      console.log("User data:", user);

      // Create order using order service
      const result = await orderService.createOrder(orderData);

      console.log("Order creation result:", result);

      // Clear cart after successful order
      clearCart();

      // Check different possible response structures
      const orderId =
        result?.order?.orderId ||
        result?.orderId ||
        result?.id ||
        result?._id ||
        Date.now().toString(); // Fallback ID

      console.log("Using order ID:", orderId);

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`, {
        state: {
          orderData: result,
          items: cartItems,
          total: getTotalPrice() * 1.08,
        },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // More specific error handling
      let errorMessage = "Failed to create order. Please try again.";

      // Check for network errors
      if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }
      // Check for authentication errors
      else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
        // Optionally redirect to login
        // navigate('/login');
      }
      // Check for validation errors
      else if (error.response?.status === 400) {
        errorMessage =
          error.response?.data?.message ||
          "Invalid order data. Please check your information.";
      }
      // Check for 500 server errors - be more specific
      else if (error.response?.status === 500) {
        const serverErrorMessage =
          error.response?.data?.message || error.response?.data?.error;
        errorMessage = serverErrorMessage
          ? `Server error: ${serverErrorMessage}`
          : "Internal server error. The backend encountered an issue while processing your order. Please try again later.";

        console.error("Server error details:", error.response?.data);
      }
      // Check for other server errors
      else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      // Check if there's a specific error message
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // Check if it's a custom error from handleOrderError
      else if (typeof error === "string") {
        errorMessage = error;
      }

      console.log("Final error message:", errorMessage);

      // For development, show more detailed error
      const isDevelopment = process.env.NODE_ENV === "development";
      const alertMessage = isDevelopment
        ? `Order Creation Failed:\n\n${errorMessage}\n\nDevelopment Info:\n- Backend URL: ${
            error.config?.url
          }\n- Status: ${
            error.response?.status
          }\n- Check backend server logs for more details\n- Error Data: ${JSON.stringify(
            error.response?.data,
            null,
            2
          )}`
        : `Order Creation Failed:\n\n${errorMessage}`;

      alert(alertMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  // Add check for authentication and empty cart
  if (!isAuthenticated) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Please log in to continue</h2>
          <p>You need to be logged in to proceed with checkout.</p>
          <button
            onClick={() => window.history.back()}
            className="btn-back-to-shop"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <p>
            Please add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-back-to-shop"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="progress-bar">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Billing</div>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2>Shipping Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    {errors.firstName && (
                      <span className="error-text">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    {errors.lastName && (
                      <span className="error-text">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && (
                    <span className="error-text">{errors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Apartment, suite, etc.</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "error" : ""}
                    />
                    {errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? "error" : ""}
                    />
                    {errors.state && (
                      <span className="error-text">{errors.state}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? "error" : ""}
                    />
                    {errors.zipCode && (
                      <span className="error-text">{errors.zipCode}</span>
                    )}
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" onClick={nextStep} className="btn-next">
                    Continue to Billing
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2>Billing Information</h2>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                    />
                    Same as shipping address
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="billingFirstName"
                          value={formData.billingFirstName}
                          onChange={handleInputChange}
                          className={errors.billingFirstName ? "error" : ""}
                        />
                        {errors.billingFirstName && (
                          <span className="error-text">
                            {errors.billingFirstName}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          name="billingLastName"
                          value={formData.billingLastName}
                          onChange={handleInputChange}
                          className={errors.billingLastName ? "error" : ""}
                        />
                        {errors.billingLastName && (
                          <span className="error-text">
                            {errors.billingLastName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        className={errors.billingAddress ? "error" : ""}
                      />
                      {errors.billingAddress && (
                        <span className="error-text">
                          {errors.billingAddress}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Apartment, suite, etc.</label>
                      <input
                        type="text"
                        name="billingApartment"
                        value={formData.billingApartment}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleInputChange}
                          className={errors.billingCity ? "error" : ""}
                        />
                        {errors.billingCity && (
                          <span className="error-text">
                            {errors.billingCity}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleInputChange}
                          className={errors.billingState ? "error" : ""}
                        />
                        {errors.billingState && (
                          <span className="error-text">
                            {errors.billingState}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Zip Code *</label>
                        <input
                          type="text"
                          name="billingZipCode"
                          value={formData.billingZipCode}
                          onChange={handleInputChange}
                          className={errors.billingZipCode ? "error" : ""}
                        />
                        {errors.billingZipCode && (
                          <span className="error-text">
                            {errors.billingZipCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="form-navigation">
                  <button type="button" onClick={prevStep} className="btn-back">
                    Back to Shipping
                  </button>
                  <button type="button" onClick={nextStep} className="btn-next">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2>Payment Information</h2>

                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === "credit"}
                      onChange={handleInputChange}
                    />
                    <span>Credit Card</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {formData.paymentMethod === "credit" && (
                  <>
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={errors.cardName ? "error" : ""}
                      />
                      {errors.cardName && (
                        <span className="error-text">{errors.cardName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? "error" : ""}
                      />
                      {errors.cardNumber && (
                        <span className="error-text">{errors.cardNumber}</span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? "error" : ""}
                        />
                        {errors.expiryDate && (
                          <span className="error-text">
                            {errors.expiryDate}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={errors.cvv ? "error" : ""}
                        />
                        {errors.cvv && (
                          <span className="error-text">{errors.cvv}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {formData.paymentMethod === "COD" && (
                  <div className="cod-section">
                    <p>
                      You will pay in cash upon delivery. Please ensure you have
                      the exact amount ready.
                    </p>
                  </div>
                )}

                <div className="form-navigation">
                  <button type="button" onClick={prevStep} className="btn-back">
                    Back to Billing
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Place Order ${formatPrice(getTotalPrice())}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>{formatPrice(getTotalPrice() * 0.08)}</span>
            </div>
            <div className="total-row total">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice() * 1.08)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
