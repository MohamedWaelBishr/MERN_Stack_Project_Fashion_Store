import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./users.css";

function Users() {
  const state = useContext(GlobalState);
  const [allTags, SetAllTags] = state.tagsAPI.getTags;
  const [tag, setTag] = useState("");
  const [token] = state.token;
  const getAllTags = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`/api/tags`);
      SetAllTags(res.tags);
    } catch (err) {
      alert(err.response.data.msg);
      //   alert(err.response.data.msg);
    }
  };

  // const handleOnChangeInput = (evt) => {
  //   SetAllTags({ firstName: evt.target.value });
  // };

  const createTag = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/tags/`,
        { name: tag },
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
          title: "Tag Create Operation",
          text: "Tag Created Successfully",
          showConfirmButton: false,
          timer: 1000,
        });
        setTag("");
        SetAllTags(res.data.tags);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User Update Error",
        text: err.response.data.msg,
      });
    }
  };

  const DeleteTag = (_id) => {
    Swal.fire({
      title: "Are you sure you want to delete this tag?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteTag = async () => {
          try {
            const res = await axios.delete(`/api/tags/?id=${_id}`, {
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

              SetAllTags(res.data.tags);
              // SetAllUsers(res.data.users);
              // setTimeout(function () {
              //   window.location.replace("/tags");
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
        deleteTag();
      }
    });
  };

  return (
    <>
      <div className="users-list">
        <div className="row">
          <table style={{ marginBottom: "30px" }}>
            <tr>
              <th>
                <label>Create New Tag</label>
              </th>
              <th>
                <form onSubmit={createTag}>
                  <input
                    id="input-create"
                    type="text"
                    name="tag"
                    value={tag}
                    required
                    onChange={(e) => setTag(e.target.value)}
                  />

                  <button
                    style={{
                      backgroundColor: "transparent",
                      outline: "none",
                      color: "green",
                      fontWeight: "bold",
                    }}
                    type="submit"
                  >
                    Create
                  </button>
                </form>
              </th>
            </tr>
          </table>
          <table style={{ marginBottom: "30px" }}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTags.map((tag, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{tag.name}</td>
                  <td>
                    <Link className="edit" to={`/tags/edit/${tag._id}`}>
                      Edit
                    </Link>
                    <Link className="del" onClick={() => DeleteTag(tag._id)}>
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <table>
            <tbody>
              <th>
                <label>Create New Account</label>
              </th>
              <td>
                <Link to="/users/create"> Open Create User Form</Link>
              </td>
            </tbody>
          </table> */}
        </div>
      </div>
    </>
  );
}

export default Users;
