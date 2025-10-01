import axiosInstance from "../Utils/axiosInstance";

const suburl = "/category";

export const getCategories = () => axiosInstance.get(`${suburl}`)

