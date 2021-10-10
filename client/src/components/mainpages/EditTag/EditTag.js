import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
import { SketchPicker } from "react-color";

const EditUser = () => {
  const state = useContext(GlobalState);
  const { id } = useParams();
  const [token] = state.token;
  const [tag, setTag] = useState({});
  const [color, setColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [allTags, SetAllTags] = state.tagsAPI.getTags;
  const history = useHistory();

  const onInputChange = (e) => {
    setTag({ ...tag, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadTag();
  }, []);

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(`${tag.name}`);
      const res = await axios.put(
        `http://localhost:3000/api/tags/?id=${id}`,
        { tag: tag },
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
          title: "Tag Update Operation",
          text: "Tag Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        SetAllTags(res.data.tags);
        history.push("/tags");

        // setTimeout(function () {
        //   window.location.replace("/tags");
        // }, 2000);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Tag Update Error",
        text: err.response.data.msg,
      });
    }
  };

  const loadTag = async () => {
    const result = await axios.get(
      `http://localhost:5000/api/tags/single/?id=${id}`
    );
    setTag(result.data.tag);
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit A Tag</h2>
        <form>
          <div className="form-group">
            <label>Tag </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="name"
              value={tag.name}
              onChange={(e) => onInputChange(e)}
            />
          </div>

          <div className="color-picker">
            <span>
              Previous Tag Color :
              <span style={{ color: tag.color }}>{tag.color}</span>
            </span>

            <button
              onClick={(e) => {
                e.preventDefault();
                setShowColorPicker((showColorPicker) => !showColorPicker);
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {showColorPicker ? " Close Color Picker" : "Open Color Picker"}
              </span>
            </button>
            <span>
              {showColorPicker && (
                <SketchPicker
                  color={color}
                  onChange={(updatedColor) => {
                    setTag({ ...tag, color: updatedColor.hex });
                    setColor(updatedColor.hex);
                  }}
                />
              )}
            </span>

            <span>
              New Color : <span style={{ color: color }}> {color}</span>
            </span>
          </div>
        </form>
        <button
          onClick={(e) => onSubmitUpdate(e)}
          className="btn btn-warning btn-block"
          style={{ marginTop: "20px" }}
        >
          Update Tag
        </button>
      </div>
    </div>
  );
};

export default EditUser;
