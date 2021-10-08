import { useState, useEffect } from "react";
import axios from "axios";

function TagsAPI(token) {
  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    if (token) {
      const getAllTags = async () => {
        const res = await axios.get(`/api/tags`);
        setAllTags(res.data.tags);
      };
      getAllTags();
    }
  }, [token]);

  return {
    getTags: [allTags, setAllTags],
  };
}

export default TagsAPI;
