import axios from "axios";


/// NB: REMOVE THIS HARDCODED VERSION
const BASE_URL = "http://localhost:5164/api/books";
/// NB : TODO

export const getAllBooks = async () => {
	const res = await axios.get(BASE_URL);

  	return res.data;
//  return "Empty No Values Present";
};

export const getBookById = async (isbn) => {
  const res = await axios.get(`${BASE_URL}/${isbn}`);
  return res.data;
};




