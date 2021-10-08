import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";

function Profile() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;
  const [user, setUser] = state.userAPI.userInfo;
  const [passConfirmed, setPassConfirmed] = useState("");

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onChangeInputConfirmed = (e) => {
    setPassConfirmed(e.target.value);
  };

  const onInputChangeCheck = (e) => {
    let isChecked = e.target.checked;
    setUser({ ...user, [e.target.name]: isChecked });
  };

  const logoutUser = async () => {
    await axios.get("/user/logout");

    localStorage.removeItem("firstLogin");

    window.location.href = "/";
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    if (user.password === passConfirmed) {
      try {
        let res = await axios.put(
          "/user/edit",
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
            logoutUser();
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
    } else {
      Swal.fire({
        icon: "error",
        title: "User Update Error",
        text: "Password Should Match",
      });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h2>Update Profile Information</h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />

        <input
          type="text"
          name="password"
          required
          autoComplete="on"
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput}
        />

        <input
          type="text"
          name="confirm_password"
          required
          autoComplete="on"
          placeholder="Confirm Password"
          onChange={onChangeInputConfirmed}
        />

        {isAdmin && (
          <>
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
          </>
        )}

        <div className="row">
          <button type="submit">Update Info</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
