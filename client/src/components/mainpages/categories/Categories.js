import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        toast.success(res.data.msg);
        // alert(res.data.msg);
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        toast.success(res.data.msg);
        // alert(res.data.msg);
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (err) {
      toast.error(err.response.data.msg);
      //   alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    document.getElementById("input-create-update").focus();
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      toast.success(res.data.msg);
      //alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      toast.error(err.response.data.msg);
      //   alert(err.response.data.msg);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="categories">
        <form onSubmit={createCategory}>
          <label htmlFor="category">Category</label>
          <input
            id="input-create-update"
            type="text"
            name="category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          />

          <button type="submit">{onEdit ? "Update" : "Create"}</button>
        </form>

        {/* <TagsInput selectedTags={selectedTags} /> */}

        <div className="col">
          {categories.map((category) => (
            <div key={category._id}>
              <div className="mb-3 row">
                <div className="col">
                  <label style={{ color: "blue" }}>{category.name}</label>
                </div>
                <div className="col">
                  <button
                    onClick={() => editCategory(category._id, category.name)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ background: "crimson" }}
                    onClick={() => deleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Categories;
