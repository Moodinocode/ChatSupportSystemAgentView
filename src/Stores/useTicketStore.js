import { create } from "zustand";
import { updateTicket, getTicketsForAgent } from "../Services/ticketService";

const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  
  lastPageLoaded:0,
  isLastPage: false,


  fetchMoreTickets: async () => {
    console.log("fetching more")
    if (get().isLastPage) return;
    set({ loading: true, error: null });
    try {
    // getTickets().then(response => {
      console.log("test");
      console.log(sessionStorage.getItem("user"))
      getTicketsForAgent(JSON.parse(sessionStorage.getItem("user")).id, get().lastPageLoaded+1).then(response => {
      console.log("API response:", response);
      const newTickets = response.data.content;
      const page = response.data.pageable.pageNumber;
      const last = response.data.last;
      

      set(state => ({
        tickets: [...state.tickets, ...newTickets],
        lastPageLoaded: page,
        isLastPage: last,
        loading: false
      }));
      });
    } catch (error) {
      console.error(error)
      set({ error: error.message, loading: false });
    }
  },


  
  fetchTickets: async () => {
    console.log("fetching")
    set({ loading: true, error: null });
    try {
    // getTickets().then(response => {
    
      console.log("test");
      console.log(sessionStorage.getItem("user"))
      getTicketsForAgent(JSON.parse(sessionStorage.getItem("user")).id,  get().lastPageLoaded).then(response => {
      console.log("API response:", response);
      const newTickets = response.data.content;
      const page = response.data.pageable.pageNumber;
      const last = response.data.last;

      set(state => ({
        tickets: [...state.tickets, ...newTickets],
        lastPageLoaded: page,
        isLastPage: last,
        loading: false
      }));
      });
    } catch (error) {
      console.error(error)
      set({ error: error.message, loading: false });
    }
  },

  onTicketRecieve: (newTicket) => {
    set((state) => {
      const existingTicketIndex = state.tickets.findIndex(ticket => ticket.id === newTicket.id);

      if (existingTicketIndex !== -1) {
        const updatedTickets = [...state.tickets];
        updatedTickets[existingTicketIndex] = {
          ...updatedTickets[existingTicketIndex],
          ...newTicket, 
        };

        return { tickets: updatedTickets };
      } else {
        return { tickets: [...state.tickets, newTicket] };
      }
    });
  },


  getTicketById: (ticketId) => {
    const { tickets } = get();
    return tickets.find(ticket => ticket.id === ticketId);
  },

  
  setSelectedTicket: (ticketId) => {
    set({ selectedTicket: ticketId });
  },

handleTakeTicket: async (ticketId, newstatus) => {
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
    
    const res = await updateTicket(ticketId, updatedTicketDto);
    console.log("Ticket update response:", res);
    
    // Fix: Use === for comparison, not = for assignment
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? res.data  // Use the response data from the server
        : ticket
    );
    
    set({ tickets: updatedTickets, loading: false });
    return { success: true, message: `You have taken ticket #${currentTicket.number || ticketId}` };
  } catch (error) {
    console.error("Error updating ticket:", error);
    set({ error: error.message, loading: false });
    return { success: false, message: error.message };
  }
},
getTicketCategory: (ticketId) => {
  const { tickets } = get();

  // Find the ticket by its ID
  const ticket = tickets.find(ticket => ticket.id === ticketId);

  if (!ticket) {
    console.warn(`Ticket with ID ${ticketId} not found`);
    return null; // or throw an error depending on your needs
  }

  // Return the category or null if not set
  return ticket.category || null;
},



handleUpdateTicketCategory: async (ticketId, newCategory) => {
  const { tickets } = get();
  set({ loading: true, error: null });

  try {
    console.log(newCategory)
    const currentTicket = tickets.find(ticket => ticket.id === ticketId);
    if (!currentTicket) {
      throw new Error("Ticket not found");
    }


    const updatedTicketDto = {
      ...currentTicket,
      category: newCategory,
      assignedAgent: null  
    };

   
    const res = await updateTicket(ticketId, updatedTicketDto);
    console.log("Ticket update response:", res);


    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId
        ? res.data 
        : ticket
    );

    set({ tickets: updatedTickets, loading: false });

    return { 
      success: true, 
      message: `Ticket #${currentTicket.number || ticketId} category has been updated to ${newCategory} and assigned agent cleared.` 
    };
  } catch (error) {
    console.error("Error updating ticket category:", error);
    set({ error: error.message, loading: false });
    return { success: false, message: error.message };
  }
},



  handleAssignTicket: async (ticketId, agent) => {
  const { tickets } = get();
  console.log("handling")
  set({ loading: true, error: null });

  try {
    const currentTicket = tickets.find(ticket => ticket.id === ticketId);
    if (!currentTicket) {
      throw new Error("Ticket not found");
    }
      console.log("updating")


    const updatedTicketDto = {
      ...currentTicket,
      assignedAgent: {
        id: agent.id,
        username: agent.username,
        email: agent.email
      },
      status: "PENDING" 
    };

     console.log("sending")

    try {
      console.log(2)
      const res = await updateTicket(ticketId, updatedTicketDto);
      console.log(3)
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
      console.log(status)
      set({ tickets: updatedTickets, loading: false });
      return { success: true, message: statusMessage };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },



  handleResolveTicket: async (ticketId) => {
    return get().handleUpdateTicketStatus(ticketId, "RESOLVED");
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