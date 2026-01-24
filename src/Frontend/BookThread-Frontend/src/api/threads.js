/*import axios from "axios";

/// NB: REMOVE THIS HARDCODED VERSION
const BASE_URL = "http://localhost:5000/api/threads";
/// NB : TODO


export const getAllThreads = async () => {
	const res = await axios.get(BASE_URL);
	return res.data;	
};

export const getThreadById = async (id) => {
	const res = await axios.get(BASE_URL);
	return res.data;
}
