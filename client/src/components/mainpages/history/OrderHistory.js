import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);

  const DeleteOrder = (_id) => {
    Swal.fire({
      title: "Are you sure you want to Cancel this order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const cancelOrder = async () => {
          try {
            const res = await axios.delete(`/api/payment/?id=${_id}`, {
              headers: {
                "content-type": "multipart/form-data",
                Authorization: token,
              },
            });
            if (res) {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: res.data.msg,
                showConfirmButton: false,
                timer: 2000,
              });
              setHistory(res.data.payments);
              // setTimeout(function () {
              //   window.location.replace("/users");
              // }, 2500);
            }
          } catch (err) {
            // alert(err.response.data.msg);
            Swal.fire({
              icon: "error",
              title: "Oops... Something went wrong!",
              text: err.response.data.msg,
            });
          }
        };
        cancelOrder();
      }
    });
  };

  return (
    <div className="history-page">
      <h2>Record Of Orders</h2>

      <h4>You have {history.length} ordered</h4>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Payment ID</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((items, index) => {
            if (isAdmin && items.status) {
              return (
                <tr key={items._id}>
                  <td>{index}</td>
                  <td>{items._id}</td>
                  <td>
                    <span style={{ color: "green" }}>[✔] </span>
                    {new Date(items.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    <p style={{ fontWeight: "bold" }}>
                      {moment(items.createdAt).fromNow()}
                    </p>
                  </td>

                  <td>
                    <Link
                      to={`/history/${items._id}`}
                      style={{ fontWeight: "bold", color: "orange" }}
                    >
                      View
                    </Link>
                    {isAdmin ? (
                      <Link
                        className="del"
                        onClick={() => DeleteOrder(items._id)}
                      >
                        Cancel Order
                      </Link>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              );
            } else if (!isAdmin) {
              if (items.status) {
                return (
                  <tr key={items._id}>
                    <td>{index}</td>
                    <td>{items._id}</td>
                    <td>
                      <span style={{ color: "green" }}>[✔] </span>
                      {new Date(items.createdAt).toLocaleDateString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      <p style={{ fontWeight: "bold" }}>
                        {moment(items.createdAt).fromNow()}
                      </p>
                    </td>
                    <td>
                      <Link
                        to={`/history/${items._id}`}
                        style={{ fontWeight: "bold", color: "orange" }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={items._id}>
                    <td style={{ backgroundColor: "crimson" }}>{index}</td>
                    <td>{items._id}</td>
                    <td>
                      <span style={{ color: "Red" }}>[✘] </span>
                      {new Date(items.createdAt).toLocaleDateString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <p style={{ fontWeight: "bold", color: "crimson" }}>
                        ❝ Order Canceled By Administrator.❞
                      </p>
                      <p style={{ fontWeight: "bold", color: "#218c74" }}>
                        ❝ Your Money Will Be Refunded To Your Bank Account
                        Within A Week.❞
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Contact Customer Service If You Have Any Questions.
                      </p>
                    </td>
                    <td style={{ fontWeight: "bold", color: "crimson" }}>
                      🅲🅰🅽🅲🅴🅻🅴🅳
                    </td>
                  </tr>
                );
              }
            }
          })}
        </tbody>
      </table>

      {isAdmin ? (
        <>
          <h4>Canceled Orders</h4>
          <table style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Payment ID</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "rgba(183, 21, 64,0.3)" }}>
              {history.map((items, index) => {
                if (!items.status) {
                  return (
                    <tr key={items._id}>
                      <td>{index}</td>
                      <td>{items._id}</td>
                      <td>
                        <span style={{ color: "Red" }}>[✘] </span>
                        {new Date(items.createdAt).toLocaleDateString([], {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                        <p style={{ fontWeight: "bold" }}>
                          {moment(items.createdAt).fromNow()}
                        </p>
                      </td>

                      <td>
                        <Link
                          to={`/history/${items._id}`}
                          style={{ fontWeight: "bold", color: "#1B1464" }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default OrderHistory;
