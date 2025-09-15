import { mockAgents } from "../assets/mockdata";
import axiosInstance from "../Utils/axiosInstance";


const suburl = "/agent";


//export const getAgents = async () => axiosInstance.get(`${suburl}`)
export const getAgents = async () => mockAgents;
