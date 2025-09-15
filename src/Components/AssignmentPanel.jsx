import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./UIHelpers/Card";
import Badge from "./UIHelpers/Badge";
import { ScrollArea } from "./UIHelpers/ScrollArea";
import {mockAgents} from "../assets/mockdata";
import { 
  Users, 
  UserCheck,  
  AlertTriangle,
  CheckSquare,
  User
} from "lucide-react";

const AssignmentPanel = ({ tickets, onAssignTickets }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const unassignedTickets = tickets.filter(t => !t.assignedAgent && t.status !== "closed");
  const urgentTickets = unassignedTickets.filter(t => t.status === "urgent");

  const handleTicketSelection = (ticketId, checked) => {
    if (checked) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev.filter(id => id !== ticketId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTickets(unassignedTickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleAssignment = () => {
    if (selectedTickets.length > 0 && selectedAgent) {
      onAssignTickets(selectedTickets, selectedAgent);
      setSelectedTickets([]);
      setSelectedAgent("");
    }
  };

  const getAgentStatusColor = (status) => {
    switch (status) {
      case "available": return "badge-success";
      case "busy": return "badge-warning"; 
      case "away": return "badge-neutral";
      default: return "badge-neutral";
    }
  };

  const getCapacityColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-error";
    if (percentage >= 70) return "text-warning";
    return "text-success";
  };

  return (
    <div className="flex-1 p-6 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-base-content mb-2">Ticket Assignment</h1>
          <p className="text-base-content/70">Manage and distribute tickets to your team</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Unassigned</p>
                  <p className="text-xl font-bold">{unassignedTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-error" />
                <div>
                  <p className="text-sm text-base-content/70">Urgent Unassigned</p>
                  <p className="text-xl font-bold text-error">{urgentTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-success" />
                <div>
                  <p className="text-sm text-base-content/70">Selected</p>
                  <p className="text-xl font-bold">{selectedTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ticket Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Unassigned Tickets</CardTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedTickets.length === unassignedTickets.length && unassignedTickets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span className="text-sm text-base-content/70">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {unassignedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex items-center gap-3 p-3 rounded-md border transition-colors ${
                        selectedTickets.includes(ticket.id) 
                          ? "bg-primary/10 border-primary" 
                          : "hover:bg-base-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={(e) => handleTicketSelection(ticket.id, e.target.checked)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono">#{ticket.number}</span>
                          <Badge 
                            classnames={`text-xs ${
                              ticket.status === "urgent" ? "badge-error" :
                              ticket.status === "PENDING" ? "badge-warning" :
                              "badge-primary"
                            }`}
                            text={ticket.status}
                          />
                          {ticket.status === "urgent" && (
                            <AlertTriangle className="w-3 h-3 text-error" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{ticket.subject}</p>
                        <p className="text-xs text-base-content/70">
                          {ticket.customer.name} • {ticket.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Agent Selection & Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Available Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Assign to Agent</label>
                  <select 
                    className="select select-bordered w-full"
                    value={selectedAgent} 
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="">Select an agent</option>
                    {mockAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.status} ({agent.activeTickets}/{agent.maxCapacity})
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleAssignment}
                  disabled={selectedTickets.length === 0 || !selectedAgent}
                  className="btn btn-primary w-full"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign {selectedTickets.length} Ticket{selectedTickets.length !== 1 ? 's' : ''}
                </button>

                <div className="divider"></div>

                {/* Agent Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Agent Status</h4>
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-2 bg-base-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-base-content/70" />
                        <div>
                          <p className="text-sm font-medium">{agent.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge 
                              classnames={`text-xs ${getAgentStatusColor(agent.status)}`}
                              text={agent.status}
                            />
                            {agent.specialties && (
                              <span className="text-xs text-base-content/70">
                                {agent.specialties.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getCapacityColor(agent.activeTickets, agent.maxCapacity)}`}>
                          {agent.activeTickets}/{agent.maxCapacity}
                        </p>
                        <p className="text-xs text-base-content/70">tickets</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPanel;