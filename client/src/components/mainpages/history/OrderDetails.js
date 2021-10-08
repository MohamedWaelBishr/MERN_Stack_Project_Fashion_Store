import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

function OrderDetails() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState([]);
  var total = 0;

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  if (orderDetails.length === 0) return null;

  orderDetails.cart.map((item) => {
    total += item.price * item.quantity;
  });

  return (
    <div className="history-page">
      <h2>Order #{orderDetails._id} - Details </h2>

      <h4>You have {orderDetails.cart.length} Unique Products In This Order</h4>
      <table style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{orderDetails._id}</td>
            <td>{orderDetails.name}</td>
            <td>{orderDetails.email}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>
                {" "}
                <sup> $ </sup> {item.price * item.quantity}
              </td>
            </tr>

            //   console.log("total : " + total)
          ))}
        </tbody>
      </table>

      <table style={{ marginTop: "30px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold" }}> Total Price </td>
            <td style={{ fontWeight: "bold" }}>
              {" "}
              <sup> $ </sup>
              {total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
