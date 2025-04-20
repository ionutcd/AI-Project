import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllQueries = () => {
  return axios.get(`${API_URL}/user_query`);
};

export const verifyURL = async (tokens) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/other/verifyHashURL`,
      tokens,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    sessionStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

// export const getComparativeAnalysisData = (values) => {
//     return axios.post(`${API_URL}/core/api/comparitive-analytics/`, values)
//   }
