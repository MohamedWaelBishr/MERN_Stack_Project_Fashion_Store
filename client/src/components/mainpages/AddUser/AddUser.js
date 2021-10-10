// import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";

function AddUser() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: 0,
    status: true,
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const onInputChangeCheck = (e) => {
    let isChecked = e.target.checked;
    setUser({ ...user, [e.target.name]: isChecked });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        "/user/createAdmin",
        { ...user },
        {
          headers: {
            "content-type": "application/json",
            Authorization: token,
          },
        }
      );

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Account Update Operation",
          text: res.data.msg,
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(function () {
          window.location.replace("/users");
        }, 2000);
      }
    } catch (err) {
      //   alert(err.response.data.msg);
      Swal.fire({
        icon: "error",
        title: "User Creation Error",
        text: err.response.data.msg,
      });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h2>
          Create A New User <span style={{ color: "red" }}> As Admin </span>{" "}
        </h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />

        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput}
        />
        <input
          type="number"
          name="role"
          required
          placeholder="Role"
          value={(0 || 1) && user.role}
          onChange={onChangeInput}
        />
        <div class="switch">
          <span style={{ marginRight: "50px" }}>Status </span>
          <label>
            [ Disabled ]
            <input
              type="checkbox"
              className="form-control form-control-lg"
              name="status"
              checked={user.status}
              onChange={(e) => onInputChangeCheck(e)}
            />
            <span class="lever"></span>[ Enabled ]
          </label>
        </div>

        <div className="row">
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
