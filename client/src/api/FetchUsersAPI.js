import { useState, useEffect } from "react";
import axios from "axios";

function FetchUsersAPI(token) {
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    if (token) {
      const getAllUsers = async () => {
        const res = await axios.get(`/user/all`, {
          headers: { Authorization: token },
        });
        setAllUsers(res.data.users);
      };
      getAllUsers();
    }
  }, [token]);

  return {
    getUsers: [allUsers, setAllUsers],
  };
}

export default FetchUsersAPI;
