import axiosInstance from "../Utils/axiosInstance";

const suburl = "/user";

export const getUsers = async () => axiosInstance.get(`${suburl}/`);
export const getUserById = async (userId) => axiosInstance.get(`${suburl}/${userId}`);
export const getUserByRole = async (role) => axiosInstance.get(`${suburl}/role/${role}`);