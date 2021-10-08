import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
const EditUser = () => {
  const state = useContext(GlobalState);
  const { id } = useParams();
  const [token] = state.token;
  const [user, setUser] = useState({ role: 0 });
  const [allUsers, SetAllUsers] = state.FetchUsersAPI.getUsers;
  const history = useHistory();

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onInputChangeCheck = (e) => {
    let isChecked = e.target.checked;
    setUser({ ...user, [e.target.name]: isChecked });
  };
  useEffect(() => {
    loadUser();
  }, []);

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3000/user/update/?id=${id}`,
        user,
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
          text: "Account Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        SetAllUsers(res.data.users);
        // setTimeout(function () {
        //   window.location.replace("/users");
        // }, 2000);
        history.push("/users");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User Update Error",
        text: err.response.data.msg,
      });
    }
  };

  const loadUser = async () => {
    const result = await axios.get(
      `http://localhost:5000/user/info/?id=${id}`,
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      }
    );
    setUser(result.data.user);
  };
  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit A User</h2>
        <form>
          <div className="form-group">
            <label>Username </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="name"
              value={user.name}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Email </label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={user.email}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Role </label>
            <input
              type="number"
              className="form-control form-control-lg"
              name="role"
              value={user.role}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group">
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
          </div>
        </form>
        <button
          onClick={(e) => onSubmitUpdate(e)}
          className="btn btn-warning btn-block"
          style={{ marginTop: "20px" }}
        >
          Update User
        </button>
      </div>
    </div>
  );
};

export default EditUser;
