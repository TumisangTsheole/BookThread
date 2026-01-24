/*import axios from "axios";

/// NB: REMOVE THIS HARDCODED VERSION
const BASE_URL = "http://localhost:5000/api/userbooks";
/// NB : TODO


export const getAllUserBooks = async () => {
	const res = await axios.get(BASE_URL);
	return res.data;	
};

export const getUserBook = async (id) => {
	const res = await axios.get(`${BASE_URL}/${userId}/${isbn}`);
	return res.data;
}
