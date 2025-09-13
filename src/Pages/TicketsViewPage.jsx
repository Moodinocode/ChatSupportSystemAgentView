import React, { useState, useEffect } from 'react';
import { TicketList } from '../Components/TicketList';
import ChatInterface from '../Components/ChatInterface';
import TicketDetails from '../Components/TicketDetails';
import TicketDashboard from '../Components/TicketDashboard';
import AssignmentPanel from '../Components/AssignmentPanel';
import { LayoutDashboard, Users, MessageSquare } from "lucide-react";
import useTicketStore from '../Stores/useTicketStore';
import useConversationStore from '../Stores/useConversationStore';
import { useAuth } from '../Context/AuthContext';


const TicketsViewPage = () => {
  const [viewMode, setViewMode] = useState("dashboard");

  const {user} = useAuth()
  
  // Zustand store
  const {
    tickets,
    selectedTicket,
    currentAgent,
    loading,
    fetchTickets,
    setSelectedTicket,
    getTicketById,
    handleTakeTicket,
    handleResolveTicket,
    handleReopenTicket,
    handleAssignTicket
    
  } = useTicketStore();

  const { initClient, client, setActiveConversation,activeConversation } = useConversationStore();


  const selectedTicketData = selectedTicket ? getTicketById(selectedTicket) : null;


  useEffect(() => {
    fetchTickets().then(() => {
      console.log("Fetched tickets:", tickets)
      });
      initClient()
  }, [fetchTickets]);


  const handleTicketSelect = async(ticket) => {
    if (activeConversation) {
      const currentTicket = tickets.find(
        (t) => t.twilioConversationSid === activeConversation.sid
      );

      //get ticket with conversation id same as active conversation by id
      //check if assigned to self
      //if not then leave()
      if (currentTicket && currentTicket.assignedAgent !== user.username) {
        try {
          const conv = await client.getConversationBySid(activeConversation.sid);
          await conv.leave();
          console.log("Left conversation for ticket:", currentTicket.id);
        } catch (error) {
          console.error("Error leaving conversation:", error);
        }
      }


    }
    console.log("Selected ticket:", ticket);
    setSelectedTicket(ticket.id);
    console.log("Ticket's conversation SID:", ticket.twilioConversationSid);
    
    if (!client) {
      console.error("Twilio client not initialized");
      return;
    }
    try {
    const conversation = await client.getConversationBySid(ticket.twilioConversationSid)
    //await conversation.join() -- if not already a participant --> ticket not asssigned to me
    console.log("Setting active conversation for ticket:", ticket.id, conversation);
    await setActiveConversation({conversation});
    setViewMode("chat");
  } catch (error) {
      console.error("Error fetching conversation:", error);
      return;
    }
    
  };


  const onTakeTicket = async () => {
    if (selectedTicketData) {
      console.log("handling")
      const result = await handleTakeTicket(selectedTicket,"pending");
      console.log(result)
    }
  };

  const onAssignTicket = async (AgentName) => {
    if (selectedTicketData) {
      console.log("handling")
      const result = await handleAssignTicket(selectedTicket,AgentName)
      console.log(result)
    }
    
  };

  const onResolveTicket = async () => {
    if (selectedTicketData) {
      console.log("handling")
      const result = await handleTakeTicket(selectedTicket,"CLOSED");
      console.log(result)
    }
  };




  // Show loading spinner
  if (loading && tickets.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-2 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-base-100 border-b p-2">
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-sm ${viewMode === "dashboard" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setViewMode("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            className={`btn btn-sm ${viewMode === "assignment" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setViewMode("assignment")}
          >
            <Users className="w-4 h-4 mr-2" />
            Assignment
          </button>
          <button
            className={`btn btn-sm ${viewMode === "chat" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setViewMode("chat")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </button>
          
          {/* Loading indicator in header */}
          {loading && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="loading loading-spinner loading-sm"></div>
              <span className="text-sm text-gray-600">Updating...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full pt-14">
        {/* Ticket List - Always visible */}
        <TicketList 
          tickets={tickets}
          selectedTicket={selectedTicket}
          onTicketSelect={handleTicketSelect}
        />
        
        {/* Main Content Area */}
        {viewMode === "dashboard" && (
          <TicketDashboard 
            tickets={tickets} 
            currentAgent={currentAgent} 
          />
        )}

        {viewMode === "assignment" && (
          <AssignmentPanel 
            tickets={tickets}
            onAssignTickets={handleAssignTickets}
          />
        )}

        {viewMode === "chat" && selectedTicketData ? (
          <>
            <ChatInterface 
  ticket={selectedTicketData}
/>
            <TicketDetails 
              ticket={selectedTicketData}
              currentAgent={currentAgent}
              onTakeTicket={onTakeTicket}
              onAssignTicket={onAssignTicket}
              onResolveTicket={onResolveTicket}
            />
          </>
        ) : viewMode === "chat" && !selectedTicketData ? (
          <div className="flex-1 flex items-center justify-center bg-base-200/20">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-base-content/70 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content/70 mb-2">
                Select a ticket to start chatting
              </h3>
              <p className="text-sm text-base-content/70">
                Choose a ticket from the queue to view conversation history
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TicketsViewPage;