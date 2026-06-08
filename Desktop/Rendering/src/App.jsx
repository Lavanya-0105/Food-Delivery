import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Recipes from "./data";
import CardSample from "./card";
import { clearCart } from "./cartSlice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDish, setSelectedDish] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Credit Card");
  const [address, setAddress] = useState("");

  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const subtotal = useSelector((state) => state.cart.totalPrice);
  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  const categories = [
    "All",
    "Breakfast",
    "Appetizers",
    "Mains",
    "Desserts",
    "Drinks",
  ];

  const filteredRecipes = useMemo(() => {
    if (selectedCategory === "All") return Recipes;
    return Recipes.filter((dish) => dish.category === selectedCategory);
  }, [selectedCategory]);

  const isOrderValid = cartItems.length > 0 && address.trim() !== "";

  return (
    <div className="restaurant-container">
      <header className="main-header">
        <div className="header-top">
          <h1 onClick={() => setCurrentView("home")} className="logo-brand">
            Bistro Delight
          </h1>

          <nav className="nav-links">
            <span
              className={currentView === "home" ? "active-link" : ""}
              onClick={() => setCurrentView("home")}
            >
              Home
            </span>
            <span
              className={currentView === "menu" ? "active-link" : ""}
              onClick={() => setCurrentView("menu")}
            >
              Menu
            </span>
            <span
              className={`cart-nav-badge ${currentView === "cart" ? "active-cart" : ""}`}
              onClick={() => setCurrentView("cart")}
            >
              Cart ({totalItemsCount})
            </span>
          </nav>
        </div>

        {currentView === "menu" && (
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedDish(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {currentView === "home" && (
        <div className="hero-section">
          <div className="hero-content">
            <h2>Gourmet Food Delivered To Your Doorstep</h2>
            <p>
              Experience exquisite dishes crafted by top chefs, made with fresh,
              locally-sourced ingredients.
            </p>
            <button
              className="explore-menu-btn"
              onClick={() => setCurrentView("menu")}
            >
              Explore Our Menu ➔
            </button>
          </div>
        </div>
      )}

      {currentView === "menu" && (
        <div className="main-layout">
          <ul className={`menu-grid ${selectedDish ? "shrink-grid" : ""}`}>
            {filteredRecipes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className="card-wrapper"
              >
                <CardSample dish={dish} />
              </div>
            ))}
          </ul>

          {selectedDish && (
            <div className="detail-panel">
              <button
                className="close-btn"
                onClick={() => setSelectedDish(null)}
              >
                ×
              </button>
              <img
                src={selectedDish.imgUrl}
                alt={selectedDish.name}
                className="detail-image"
              />
              <div className="detail-content">
                <span className="detail-category">{selectedDish.category}</span>
                <h2>{selectedDish.name}</h2>
                <p className="detail-price">${selectedDish.price.toFixed(2)}</p>
                <h3>Ingredients:</h3>
                <ul className="ingredients-list">
                  {selectedDish.ingredients.map((ingredient, index) => (
                    <li key={index}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {currentView === "cart" && (
        <div className="checkout-layout">
          <div className="checkout-items-section">
            <h2>Your Ordered Dishes</h2>
            {cartItems.length === 0 ? (
              <p className="empty-msg">
                Your cart is empty. Go back and add some delicious food!
              </p>
            ) : (
              <ul className="checkout-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="checkout-item-row">
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className="checkout-item-img"
                    />
                    <div className="checkout-item-details">
                      <h3>{item.name}</h3>
                      <p className="checkout-item-meta">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="checkout-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="invoice-summary-card">
            <h2>Order Summary</h2>
            <hr />

            <div className="address-section">
              <h3>
                Delivery Address <span className="required-star">*</span>
              </h3>
              <textarea
                placeholder="Enter your complete delivery address here..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
                rows="3"
                required
              />
              {address.trim() === "" && (
                <span className="error-text">
                  Address is required to place your order.
                </span>
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (10%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row total-highlight">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <div className="payment-mode-section">
              <h3>Select Payment Mode</h3>
              <div className="payment-options">
                {["Credit Card", "PayPal", "Apple Pay", "Cash on Delivery"].map(
                  (mode) => (
                    <label
                      key={mode}
                      className={`payment-label ${paymentMode === mode ? "selected-mode" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={mode}
                        checked={paymentMode === mode}
                        onChange={() => setPaymentMode(mode)}
                      />
                      {mode}
                    </label>
                  ),
                )}
              </div>
            </div>

            <button
              className="place-order-btn"
              disabled={!isOrderValid}
              onClick={() => {
                alert(
                  `Order Placed Successfully!\n\nDelivering to: ${address}\nPaid via: ${paymentMode}\nTotal Amount: $${grandTotal.toFixed(2)}`,
                );
                dispatch(clearCart());
                setAddress("");
                setCurrentView("home");
              }}
            >
              {!isOrderValid && cartItems.length > 0
                ? "Please Enter Address"
                : "Place Order & Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
