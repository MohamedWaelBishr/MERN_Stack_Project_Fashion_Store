import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./users.css";

function Users() {
  const state = useContext(GlobalState);
  const [allUsers, SetAllUsers] = state.FetchUsersAPI.getUsers;
  const [token] = state.token;
  const getAllUsers = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`/user/all`, {
        headers: { Authorization: token },
      });
      SetAllUsers(res.users);
    } catch (err) {
      alert(err.response.data.msg);
      //   alert(err.response.data.msg);
    }
  };

  const handleOnChangeInput = (evt) => {
    SetAllUsers({ firstName: evt.target.value });
  };

  const DeleteUser = (_id) => {
    Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUser = async () => {
          try {
            const res = await axios.delete(`/user/delete/?id=${_id}`, {
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
              SetAllUsers(res.data.users);
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
        deleteUser();
      }
    });
  };

  return (
    <>
      <div className="users-list">
        <div className="row">
          <table style={{ marginBottom: "30px" }}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user?.status?.toString()}</td>
                  <td>
                    <Link className="edit" to={`/users/edit/${user._id}`}>
                      Edit
                    </Link>
                    <Link className="del" onClick={() => DeleteUser(user._id)}>
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <tbody>
              <th>
                <label>Create New Account</label>
              </th>
              <td>
                <Link to="/users/create"> Open Create User Form</Link>
              </td>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Users;
