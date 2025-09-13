import { create } from "zustand";
import { takeTicket, getTickets } from "../Services/ticketService";
import { mockTickets } from "../assets/mockdata";
const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  currentAgent: "Agent1", 

  
  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
    getTickets().then(response => {
      console.log("API response:", response);
      set({ tickets: response.data, loading: false });
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  // fetchTickets: async () => {

  //     set({ tickets: mockTickets });
    
  // },

  // Get a specific ticket by ID
  getTicketById: (ticketId) => {
    const { tickets } = get();
    return tickets.find(ticket => ticket.id === ticketId);
  },

  // Set selected ticket
  setSelectedTicket: (ticketId) => {
    set({ selectedTicket: ticketId });
  },

  // Take a ticket (assign to current agent)
  handleTakeTicket: async (ticketId) => {
    const { currentAgent, tickets } = get();
    set({ loading: true, error: null });
    
    try {
      await takeTicket(ticketId, currentAgent);
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo: currentAgent, status: "open" }
          : ticket
      );
      
      set({ tickets: updatedTickets, loading: false });
      return { success: true, message: `You have taken ticket #${tickets.find(t => t.id === ticketId)?.number}` };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },


  // Assign ticket to specific agent
  handleAssignTicket: async (ticketId, agentId) => {
    const { tickets } = get();
    set({ loading: true, error: null });
    
    try {
      await assignTicket(ticketId, agentId);
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo: agentId }
          : ticket
      );
      
      set({ tickets: updatedTickets, loading: false });
      return { success: true, message: `Ticket assigned to ${agentId}` };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },



  // Update ticket status (resolve, reopen, etc.)
  handleUpdateTicketStatus: async (ticketId, status) => {
    const { tickets } = get();
    set({ loading: true, error: null });
    
    try {
      await updateTicketStatus(ticketId, status);
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: status }
          : ticket
      );
      
      const ticket = tickets.find(t => t.id === ticketId);
      const statusMessage = status === "resolved" 
        ? `Ticket #${ticket?.number} has been resolved`
        : `Ticket #${ticket?.number} has been ${status}`;
      
      set({ tickets: updatedTickets, loading: false });
      return { success: true, message: statusMessage };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },



  handleResolveTicket: async (ticketId) => {
    return get().handleUpdateTicketStatus(ticketId, "resolved");
  },

  handleReopenTicket: async (ticketId) => {
    return get().handleUpdateTicketStatus(ticketId, "open");
  },

 
  getFilteredTickets: (filter = "all") => {
    const { tickets } = get();
    if (filter === "all") return tickets;
    return tickets.filter(ticket => ticket.status === filter);
  },

  // Get ticket statistics
getTicketStats: () => {
  const { tickets, currentAgent } = get();

  // Ensure tickets is always an array
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  return {
    total: safeTickets.length,
    open: safeTickets.filter(t => t.status === "open").length,
    pending: safeTickets.filter(t => t.status === "pending").length,
    urgent: safeTickets.filter(t => t.status === "urgent").length,
    closed: safeTickets.filter(t => t.status === "resolved").length,
    unassigned: safeTickets.filter(t => !t.assignedTo).length,
    myTickets: safeTickets.filter(t => t.assignedTo === currentAgent).length,
  };
},

  // Get recent activity (non-resolved tickets sorted by timestamp)
  getRecentActivity: (limit = 5) => {
    const { tickets } = get();
    return tickets
      .filter(t => t.status !== "closed")
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, limit);
  },


}));

export default useTicketStore;