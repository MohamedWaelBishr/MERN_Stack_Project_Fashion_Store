import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
// import PaypalButton from "./PaypalButton";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import { useHistory } from "react-router";

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    Swal.fire({
      title: "Are you sure you want to remove this product from cart?",
      text: "You are about to remove this product",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        cart.forEach((item, index) => {
          if (item._id === id) {
            cart.splice(index, 1);
          }
        });

        setCart([...cart]);
        addToCart(cart);
      }
    });
  };

  const tranSuccess = async (stripe_token) => {
    const paymentID = stripe_token.id;

    // console.log(token.id);
    try {
      const res = await axios.post(
        "/api/payment",
        { cart, paymentID: paymentID, amount: total * 100 },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      setCart([]);
      addToCart([]);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Billing Operation",
          text: "You have successfully placed an order.",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          history.push("/history");
        }, 2000);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User Update Error",
        text: err.response.data.msg,
      });
    }
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem", marginTop: "10px" }}>
        Cart Empty
      </h2>
    );

  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart container-small" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>$ {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>
            <div className="delete" onClick={() => removeProduct(product._id)}>
              ❌
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>
          Total: <sup>$</sup>
          {total}
        </h3>
        {/* <PaypalButton total={total} tranSuccess={tranSuccess} /> */}
        <StripeCheckout
          name="Bishr Fashion Store"
          description="Place an order"
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Samsung_Pay_icon.svg/1024px-Samsung_Pay_icon.svg.png"
          amount={total * 100}
          token={(_token) => {
            tranSuccess(_token);
          }}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
          panelLabel="Pay : "
        >
          <button className="btn waves-effect waves-light indigo darken-4">
            Checkout and Pay
          </button>
        </StripeCheckout>
      </div>
    </div>
  );
}

export default Cart;
