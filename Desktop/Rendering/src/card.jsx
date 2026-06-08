import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";

export default function CardSample({ dish }) {
  const dispatch = useDispatch();

  return (
    <li className="recipe-card">
      <img src={dish.imgUrl} alt={dish.name} className="recipe-image" />
      <div className="recipe-info">
        <h3>{dish.name}</h3>
        <p className="category-tag">{dish.category}</p>
        <div className="card-footer">
          <span className="price">${dish.price.toFixed(2)}</span>
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(dish));
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
}
