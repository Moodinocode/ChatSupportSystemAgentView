import { useAuth } from '../Context/AuthContext.jsx';
import useTicketStore from '../Stores/useTicketStore.js';
import  Badge  from './UIHelpers/Badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from "./UIHelpers/Card.jsx";
import { Separator } from "./UIHelpers/Seperator.jsx";
import { hasDisplayableMetadata } from '../Utils/metaDataFormatting.js';
import { 
  User, 
  Mail, 
  Clock, 
  Tag, 
  UserCheck, 
  UserX,
  CheckCircle,
} from "lucide-react";

const statusConfig = {
  OPEN: { color: "bg-primary text-primary-foreground", label: "Open" },
  PENDING: { color: "bg-warning text-warning-foreground", label: "Pending" },
  CLOSED: { color: "bg-success text-success-foreground", label: "CLOSED" },
  urgent: { color: "bg-urgent text-urgent-foreground", label: "Urgent" }
};


const TicketDetails = ({ 
    ticketId, 
    onTakeTicket, 
    onAssignTicket, 
    onResolveTicket,
  }) => {
    const {loading, tickets} = useTicketStore()
    // if (!ticket) return <div> </div>

    const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return <div>Loading ticket...</div>;


  console.log("ticket deatils "+JSON.stringify(ticket))
  console.log("ticket stat "+JSON.stringify(ticket.status))

   const customerMetadata = ticket.customer?.metadata;
  const shouldShowMetadata = hasDisplayableMetadata(customerMetadata);
  

  return (
    <div className="w-80 border-l bg-card h-full overflow-y-auto">
      <div className="p-4">
        {loading?  (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-2 text-gray-600">Loading ticket Details...</p>
        </div>
      </div>
    ):(
      <>
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
            
            {ticket.status === "PENDING"  && (
             
             <>
              
                <button 
                  onClick={onAssignTicket}//it should open a dropdown list of either agents or categories to reassign
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
              const safeStatus = statusConfig[ticket.status] || statusConfig["PENDING"];
              

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
                  <p className="text-xs text-primary font-medium">{ticket.assignedAgent.username}</p>
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
                <p className="text-sm font-medium">{ticket.customer.username}</p>
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
            
            {/* {ticket.status === "urgent" && (
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
            )} */}
          </CardContent>
        </Card>
           {/* Customer Metadata */}
        {shouldShowMetadata && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortMetadataEntries(Object.entries(customerMetadata)).map(([key, value], index) => (
                <div key={key}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {formatMetadataKey(key)}
                    </p>
                    <div className="text-sm">
                      <MetadataValue value={value} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        </>
    )}
      </div>
    </div>
  );
};

export default TicketDetails;
