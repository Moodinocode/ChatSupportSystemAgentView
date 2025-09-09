import axiosInstance from "../Utils/axiosInstance";

const suburl = "/chat";

export const sendMessage = async (ticketId, content) => axiosInstance.post(`${suburl}/`, { content });