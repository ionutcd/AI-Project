import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const generateChat = (query) => {
  return axios.post(`${API_URL}/user_query/chat`, query, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const generateBubbleChat = (query) => {
  return axios.post(`${API_URL}/user_query_bubble/chat`, query, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// delete chat
export const deleteChat = (id) => {
  return axios.post(`${API_URL}/user_query/deleteChat`, { id });
};
