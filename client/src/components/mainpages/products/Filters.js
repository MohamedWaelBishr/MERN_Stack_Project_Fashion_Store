import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";

function Filters() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;

  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;
  const [tag, setTag] = state.productsAPI.tag;
  const [tags] = state.tagsAPI.getTags;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };

  const handleTag = (e) => {
    setTag(e.target.value);
    setSearch("");
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <span style={{ marginLeft: "3px", color: "blue", fontWeight: "bold" }}>
          Filters:{" "}
        </span>
        <select
          name="category"
          value={category}
          className="browser-default"
          onChange={handleCategory}
          style={{ display: "block", color: "blue" }}
        >
          <option value="">All Products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {/* <select
          name="tag"
          value={tag}
          className="browser-default"
          onChange={handleTag}
          style={{ display: "block", color: "blue" }}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option value={"tags=" + tag._id} key={tag._id}>
              {tag.name}
            </option>
          ))}
        </select> */}
      </div>

      <input
        type="text"
        style={{
          color: "blue",
          fontWeight: "bold",
          marginRight: "10px",
          marginLeft: "10px",
        }}
        value={search}
        placeholder="Enter your search!"
        className="form-control"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="row">
        <span style={{ color: "blue", fontWeight: "bold" }}>Sort By: </span>
        <select
          style={{ display: "block", color: "blue" }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="browser-default"
        >
          <option value="">Newest</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-sold">Best sales</option>
          <option value="sort=-price">Price: Hight-Low</option>
          <option value="sort=price">Price: Low-Hight</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
