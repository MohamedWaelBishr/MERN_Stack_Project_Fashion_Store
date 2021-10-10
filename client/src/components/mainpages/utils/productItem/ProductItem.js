import React from "react";
import BtnRender from "./BtnRender";
import { Link } from "react-router-dom";
// import { GlobalState } from "../../../../GlobalState";
// import { useContext } from "react";
// import { axios } from "axios";

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  // const state = useContext(GlobalState);

  const moveup = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="product_card">
      {isAdmin && (
        <form action="#">
          <p>
            <label>
              <input
                type="checkbox"
                className="filled-in"
                checked={product.checked}
                onChange={() => handleCheck(product._id)}
              />
              <span></span>
            </label>
          </p>
        </form>
      )}

      <Link to={`/detail/${product._id}`} onClick={moveup}>
        <img src={product.images.url} alt={product.title} />
      </Link>

      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
        <span
          key={product.tags._id}
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          {product.tags.map((tag) => {
            return (
              <div
                className="chip shadowOutLine"
                style={{
                  backgroundColor: `${tag.color}`,
                  borderRadius: "0",
                  fontSize: "10px",
                  color: "white",
                  fontWeight: "bold",
                }}
                key={tag._id}
              >
                {tag.name}
              </div>
            );
          })}
        </span>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

export default ProductItem;
