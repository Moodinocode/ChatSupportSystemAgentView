import { create } from "zustand";
import { updateTicket, getTickets } from "../Services/ticketService";
import { useAuth } from "../Context/AuthContext";

const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,


  
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

  getTicketById: (ticketId) => {
    const { tickets } = get();
    return tickets.find(ticket => ticket.id === ticketId);
  },

  
  setSelectedTicket: (ticketId) => {
    set({ selectedTicket: ticketId });
  },

handleTakeTicket: async (ticketId,newstatus) => {
  const { tickets } = get();
  set({ loading: true, error: null });
  
  try {
    const currentTicket = tickets.find(ticket => ticket.id === ticketId);
    if (!currentTicket) {
      throw new Error("Ticket not found");
    }

    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    

    const updatedTicketDto = {
      ...currentTicket,
      assignedAgent: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email
    
      },
      status: newstatus 
    };
    
    try {
    const res = await updateTicket(ticketId, updatedTicketDto);
    console.log("Ticket update response:", res);
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
    

    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? updatedTicketDto
        : ticket
    );
    
    set({ tickets: updatedTickets, loading: false });
    return { success: true, message: `You have taken ticket #${currentTicket.number || ticketId}` };
  } catch (error) {
    set({ error: error.message, loading: false });
    return { success: false, message: error.message };
  }
},


  handleAssignTicket: async (ticketId, agent) => {
  const { tickets } = get();
  set({ loading: true, error: null });

  try {
    const currentTicket = tickets.find(ticket => ticket.id === ticketId);
    if (!currentTicket) {
      throw new Error("Ticket not found");
    }

    const updatedTicketDto = {
      ...currentTicket,
      assignedAgent: {
        id: agent.id,
        username: agent.username,
        email: agent.email
      },
      status: "PENDING" 
    };

    try {
      const res = await updateTicket(ticketId, updatedTicketDto);
      console.log("Ticket update response:", res);
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }

    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId
        ? updatedTicketDto
        : ticket
    );

    set({ tickets: updatedTickets, loading: false });
    return { success: true, message: `Ticket assigned to ${agent.username}` };
  } catch (error) {
    set({ error: error.message, loading: false });
    return { success: false, message: error.message };
  }
},
  setLoading: (value) => {
    console.log("setting loading to ", value);
    set({ loading: value });
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
      const statusMessage = status === "closed" 
        ? `Ticket #${ticket?.number} has been closed`
        : `Ticket #${ticket?.number} has been ${status}`;
      
      set({ tickets: updatedTickets, loading: false });
      return { success: true, message: statusMessage };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },



  handleResolveTicket: async (ticketId) => {
    return get().handleUpdateTicketStatus(ticketId, "closed");
  },

  handleReopenTicket: async (ticketId) => {
    return get().handleUpdateTicketStatus(ticketId, "open");
  },

 
  getFilteredTickets: (filter = "all") => {
    const { tickets } = get();
    if (filter === "all") return tickets;
    return tickets.filter(ticket => ticket.status === filter);
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