import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import Badge from "./UIHelpers/Badge.jsx";
import { Card } from "./UIHelpers/Card.jsx";
import { ScrollArea } from "./UIHelpers/ScrollArea.jsx";
import { Clock, User, AlertTriangle } from "lucide-react";

dayjs.extend(relativeTime);

export function TicketList({ tickets, selectedTicket, onTicketSelect }) {
  const [filter, setFilter] = useState("all");
  

  const statusConfig = {
    OPEN: { color: "bg-primary  text-white", label: "Open" },
    pending: { color: "bg-warning text-warning-foreground", label: "Pending" },
    CLOSED: { color: "bg-success text-success-foreground", label: "closed" },
    urgent: { color: "bg-error text-error-foreground", label: "Urgent" },
  };

    const filteredTickets = tickets?.filter(ticket => 
      filter === "all" ? true : ticket.status === filter
    ) || [];

  return (
    <div className="w-80 border-r bg-base-100 h-full flex flex-col">
      {/* Filter buttons */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ticket Queue</h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "open", "pending", "urgent"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status === "all" ? "All" : statusConfig[status]?.label || status}
            </button>
          ))}
        </div>
      </div>

   
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredTickets.map(ticket => (
            <Card
              key={ticket.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedTicket === ticket.id
                  ? "ring-2 ring-primary bg-gray-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onTicketSelect(ticket)}
            >
      
            <div className="flex items-start justify-between mb-2">
              {(() => {
                const safeStatus = statusConfig[ticket.status] || statusConfig["pending"];
                

                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">#{ticket.id}</span>
                      <Badge
                        classnames={`text-xs ${safeStatus.color}`}
                        text={safeStatus.label}
                      />
                    </div>

                  </>
                );
              })()}
            </div>



              {/* Subject */}
              <h4 className="font-medium text-sm text-gray-800 line-clamp-1 mb-2">
                {ticket.subject}
              </h4>

              {/* Customer */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <User className="w-3 h-3" />
                <span className="truncate">{ticket.customer.username}</span>
              </div>

              {/* Last message */}
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ticket.lastMessage}</p>

              {/* Timestamp and assigned */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    
                    <span>{dayjs(ticket.createdAt).fromNow()}</span>
                  </div>

                  {ticket.assignedAgent && (
                    <span className="font-medium text-primary">{ticket.assignedAgent.username}</span>
                  )}
                </div>
              {/* Urgent notice */}
              {ticket.status === "urgent" && (
                <div className="flex items-center gap-1 mt-2 text-xs text-error">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Urgent attention required</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
