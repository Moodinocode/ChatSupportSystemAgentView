import { useAuth } from '../Context/AuthContext.jsx';
import  Badge  from './UIHelpers/Badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from "./UIHelpers/Card.jsx";
import { Separator } from "./UIHelpers/Seperator.jsx";
import { 
  User, 
  Mail, 
  Clock, 
  Tag, 
  AlertTriangle, 
  UserCheck, 
  UserX,
  CheckCircle,
  RotateCcw
} from "lucide-react";

const statusConfig = {
  OPEN: { color: "bg-primary text-primary-foreground", label: "Open" },
  pending: { color: "bg-warning text-warning-foreground", label: "Pending" },
  CLOSED: { color: "bg-success text-success-foreground", label: "CLOSED" },
  urgent: { color: "bg-urgent text-urgent-foreground", label: "Urgent" }
};


const TicketDetails = ({ 
    ticket, 
    currentAgent,
    onTakeTicket, 
    onAssignTicket, 
    onResolveTicket,
    onReopenTicket 
  }) => {
    if (!ticket) return <div> </div>

  const {user} = useAuth();

  return (
    <div className="w-80 border-l bg-card h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Ticket Details</h3>
        
        {/* Ticket Actions */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ticket.status === "OPEN" && (
              <button 
                onClick={onTakeTicket}
                className="btn btn-primary btn-sm w-full flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Take Ticket
              </button>
            )}
            
            {(ticket.status === "pending" && ticket.assignedAgent === user.username)  && (
              <>
                <button 
                  onClick={onAssignTicket}
                  className="btn btn-outline btn-sm w-full flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  Reassign
                </button>
                <button 
                  onClick={onResolveTicket}
                  className="btn btn-outline btn-sm w-full flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
              </>
            )}
            
    
          </CardContent>
        </Card>

        {/* Ticket Information */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            {(() => {
              // Safely resolve status and priority
              const safeStatus = statusConfig[ticket.status] || statusConfig["pending"];
              

              return (
                <>
                  {/* Status Section */}
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={`${safeStatus.color} text-xs`}>
                    {safeStatus.label}
                  </Badge>
                </>
              );
            })()}
          </div>


            
            <Separator />
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-xs text-muted-foreground">{ticket.timestamp}</p>
              </div>
            </div>
            
            {ticket.assignedAgent && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned to</p>
                  <p className="text-xs text-primary font-medium">{ticket.assignedAgent}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{ticket.customer.name}</p>
                <p className="text-xs text-muted-foreground">Customer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{ticket.customer.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">Subject</p>
              </div>
            </div>
            
            {ticket.status === "urgent" && (
              <>
                <Separator />
                <div className="flex items-center gap-2 p-2 bg-urgent/10 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-urgent" />
                  <div>
                    <p className="text-sm font-medium text-urgent">Urgent Priority</p>
                    <p className="text-xs text-muted-foreground">
                      Requires immediate attention
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetails;
