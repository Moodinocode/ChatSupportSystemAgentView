import React, { useState } from "react";
import { ScrollArea } from "./UIHelpers/ScrollArea";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import ChatBubble from "./UIHelpers/ChatBubble";

const ChatInterface = ({ ticket, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                with {ticket.customer.name}
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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isAgent={message.sender === "agent"}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-base-100 p-4">
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm">
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
              disabled={!newMessage.trim()}
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