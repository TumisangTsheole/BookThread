/*import axios from "axios";


/// NB: REMOVE THIS HARDCODED VERSION
const BASE_URL = "http://localhost:5000/api/users";
/// NB : TODO

export const getAllUsers = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getUserById = async (isbn) => {
  const res = await axios.get(`${BASE_URL}/${isbn}`);
  return res.data;
};




