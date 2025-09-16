import axiosInstance from "../Utils/axiosInstance";

const suburl = "/ticket";

export const getTickets = async () => axiosInstance.get(`${suburl}`);

export const getTicketById = async (ticketId) => axiosInstance.get(`${suburl}/${ticketId}`);

export const updateTicket = async (ticketId, ticket) => axiosInstance.put(`${suburl}/${ticketId}`,ticket );

export const getTicketByCustomerId = async (customerId) => axiosInstance.get(`${suburl}/customer/${customerId}`);

export const getTicketByAgentId = async (agentId) => axiosInstance.get(`${suburl}/agent/${agentId}`);

export const getTicketByStatus = async (status) => axiosInstance.get(`${suburl}/status/${status}`);

export const bulkAssignTickets = async (tickets, agent) => axiosInstance.put(`${suburl}/bulkassign`, {tickets,agent})