import React from "react";
import Badge from "./UIHelpers/Badge.jsx";
import { Card, CardHeader, CardContent, CardTitle } from "./UIHelpers/Card.jsx";
import { Users, CheckCircle, AlertTriangle, TrendingUp, UserCheck } from "lucide-react";
import useTicketStore from '../Stores/useTicketStore';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);

const TicketDashboard = ({ tickets = [] }) => {

  const stats = {
    total: tickets.length,
    OPEN: tickets.filter(t => t.status === "OPEN").length,
    pending: tickets.filter(t => t.status === "pending").length,
    urgent: tickets.filter(t => t.status === "urgent").length,
    CLOSED: tickets.filter(t => t.status === "CLOSED").length,
    unassigned: tickets.filter(t => !t.assignedTo).length,
    myTickets: tickets.filter(t => t.assignedTo === JSON.parse(sessionStorage.getItem("user")).username).length, 
  }


 const recentActivity = tickets
    .filter(t => t.status !== "closed")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);



  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-6xl mx-auto"> 
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Support Dashboard</h1>
    
        </div>

   
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold text-warning">{stats.unassigned}</p>
              </div>
              <UserCheck className="w-8 h-8 text-warning" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-urgent">{stats.urgent}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-urgent" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Tickets</p>
                <p className="text-2xl font-bold text-primary">{stats.myTickets}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
        </div>

      
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["OPEN", "pending", "urgent", "CLOSED"].map((status) => {
                  const count = stats[status];
                  const bgColor =
                    status === "OPEN"
                      ? "bg-primary"
                      : status === "pending"
                      ? "bg-warning"
                      : status === "urgent"
                      ? "bg-urgent"
                      : "bg-success";

                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className={`${bgColor} h-2 rounded-full`}
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">#{ticket.id}</p>
                      <p className="text-xs text-muted-foreground truncate">{ticket.subject}</p>
                    </div>
                    <div className="flex flex-col items-center justify-between w-36">
                    <div className="flex items-center gap-2">
                      <Badge
                        text={ticket.status.name}
                        classnames={`text-xs ${
                          ticket.status === "urgent"
                            ? "bg-urgent text-urgent-foreground"
                            : ticket.status === "pending"
                            ? "bg-warning text-warning-foreground"
                            : ticket.status === "CLOSED"? 
                            "bg-success text-success-foreground"
                            :"bg-primary text-white"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">{dayjs(ticket.createdAt).fromNow()}</span>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;
