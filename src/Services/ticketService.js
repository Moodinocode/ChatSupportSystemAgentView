import axiosInstance from "../Utils/axiosInstance";
import { mockTickets } from "../assets/mockdata";

const suburl = "/ticket";

// export const getTickets = async () => axiosInstance.get(`${suburl}/`);
export const getTickets = async () => {
  return { data: mockTickets };
};
export const getTicketById = async (ticketId) => axiosInstance.get(`${suburl}/${ticketId}`);



export const takeTicket = async (ticketId) => axiosInstance.post(`${suburl}/${ticketId}/take`);
export const bulkTakeTickets = async (ticketIds) => axiosInstance.post(`${suburl}/bulk-take`, { ticketIds });




export const assignTicket = async (ticketId, agentId) => axiosInstance.post(`${suburl}/${ticketId}/assign`, { agentId });
export const bulkAssignTickets = async (ticketIds, agentId) => axiosInstance.post(`${suburl}/bulk-assign`, { ticketIds, agentId });


export const updateTicketStatus = async (ticketId,status) => axiosInstance.put(`${suburl}/upddate/${ticketId}`, status);
export const bulkUpdateTicketStatus = async (ticketIds,status) => axiosInstance.put(`${suburl}/bulk-update`, { ticketIds, status });