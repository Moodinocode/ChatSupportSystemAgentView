import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./UIHelpers/ScrollArea";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import ChatBubble from "./UIHelpers/ChatBubble";
import useConversationStore from "../Stores/useConversationStore";

const ChatInterface = ({ ticket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { conversations, activeConversation, setActiveConversation, loading, sendMessage } = useConversationStore();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (ticket?.conversationSid) {
      const conversationData = conversations.find(
        c => c.conversation.sid === ticket.conversationSid
      );

      if (conversationData) {
        setActiveConversation(conversationData);
      } else {
        // If not in local store, still set active with minimal data
        setActiveConversation({ conversation: { sid: ticket.conversationSid }, messages: [] });
      }
    }
  }, [ticket?.conversationSid, conversations, setActiveConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeConversation?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages.length]);

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage && !selectedFile) return;

    if (activeConversation?.conversation?.sid) {
      try {
        await sendMessage(activeConversation.conversation.sid, {
          text: trimmedMessage || null,
          file: selectedFile || null,
        });
        setNewMessage("");
        setSelectedFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b bg-base-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-base-content">
                Ticket #{ticket.number}
              </h3>
              <span className="text-sm text-base-content/70">
                with {ticket.customer.username}
              </span>
            </div>
            <p className="text-sm text-base-content/70 mt-1">
              {ticket.subject}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-2 text-gray-600">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {activeConversation?.messages?.map((message) => (
              <ChatBubble
                key={message.sid}
                message={message.body}
                media={message.media} // Pass media data
                isCurrentUser={message.author !== ticket.customer.username}
                author={message.author}
                timestamp={message.timestamp}
                profileImageUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.author)}&background=random`}
                showAvatar={true}
                showFooter={false}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Message Input */}
      <div className="border-t bg-base-100 p-4">
        {/* File preview */}
        {selectedFile && (
          <div className="mb-2 p-2 bg-base-200 rounded-lg text-sm">
            <span className="text-base-content/70">Selected file: </span>
            <span className="font-medium">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-error hover:text-error-focus"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            ref={fileInputRef}
          />
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input input-bordered flex-1"
            />
            <button 
              onClick={handleSend}
              disabled={!newMessage.trim() && !selectedFile}
              className="btn btn-primary px-4"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-base-content/70 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;