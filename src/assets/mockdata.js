// mockData.js

export const mockTickets = [
  {
    id: "1",
    subject: "Login issues with mobile app",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
    },
    status: "open", // open, pending, resolved, closed
    assignedTo: null, // agent ID or null if unassigned
    team: "Technical Support", // or category
    twilioConversationSid: "CH1234567890abcdef",
    createdAt: "2025-09-08T08:00:00Z",
    updatedAt: "2025-09-08T08:15:00Z"
  },
  {
    id: "2",
    subject: "Billing question about subscription",
    customer: {
      name: "Mike Chen",
      email: "mike.chen@company.com",
    },
    status: "open",
    assignedTo: "agent_1",
    team: "Billing",
    twilioConversationSid: "CHabcdef1234567890",
    createdAt: "2025-09-08T07:45:00Z",
    updatedAt: "2025-09-08T08:10:00Z"
  },
  {
    id: "3",
    subject: "Feature request for dashboard",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@startup.io",
    },
    status: "pending",
    assignedTo: "agent_2",
    team: "Product Feedback",
    twilioConversationSid: "CH09876abcdef54321",
    createdAt: "2025-09-08T07:30:00Z",
    updatedAt: "2025-09-08T07:45:00Z"
  },
  {
    id: "4",
    subject: "Data export not working",
    customer: {
      name: "Robert Wilson",
      email: "robert.wilson@enterprise.com",
    },
    status: "resolved",
    assignedTo: "agent_1",
    team: "Technical Support",
    twilioConversationSid: "CH654321abcdef09876",
    createdAt: "2025-09-08T06:30:00Z",
    updatedAt: "2025-09-08T07:30:00Z"
  },
  {
    id: "5",
    subject: "Password reset not working",
    customer: {
      name: "Lisa Wang",
      email: "lisa.wang@tech.com",
    },
    status: "open",
    assignedTo: null,
    team: "Technical Support",
    twilioConversationSid: "CH234567abcdef89012",
    createdAt: "2025-09-08T07:50:00Z",
    updatedAt: "2025-09-08T07:55:00Z"
  },
  {
    id: "6",
    subject: "Account upgrade inquiry",
    customer: {
      name: "Tom Anderson",
      email: "tom.anderson@business.com",
    },
    status: "open",
    assignedTo: null,
    team: "Sales",
    twilioConversationSid: "CH890123abcdef45678",
    createdAt: "2025-09-08T07:40:00Z",
    updatedAt: "2025-09-08T07:50:00Z"
  }
];

export const mockMessages = {
  "1": [
    {
      id: "1",
      content: "Hi, I'm having trouble logging into my account on the mobile app. I've tried resetting my password but it's still not working.",
      timestamp: "2025-09-08T08:00:00Z",
      sender: "customer",
      senderName: "Sarah Johnson",
    },
    {
      id: "2",
      content: "Hi Sarah! I'm sorry to hear you're having trouble. Can you tell me what error message you're seeing when you try to log in?",
      timestamp: "2025-09-08T08:05:00Z",
      sender: "agent",
      senderName: "Support Agent",
    },
    {
      id: "3",
      content: "It just says 'Invalid credentials' even though I'm using the new password I just created.",
      timestamp: "2025-09-08T08:10:00Z",
      sender: "customer",
      senderName: "Sarah Johnson",
    }
  ],
  "2": [
    {
      id: "1",
      content: "Hello, I have a question about my subscription billing. I noticed some charges I don't understand.",
      timestamp: "2025-09-08T07:45:00Z",
      sender: "customer",
      senderName: "Mike Chen",
    }
  ],
  "3": [
    {
      id: "1",
      content: "Hi! I'd love to see analytics integration in the dashboard. Is this something you're planning to add?",
      timestamp: "2025-09-08T07:30:00Z",
      sender: "customer",
      senderName: "Emily Davis",
    },
    {
      id: "2",
      content: "Thanks for the suggestion Emily! I'll forward this to our product team for consideration.",
      timestamp: "2025-09-08T07:45:00Z",
      sender: "agent",
      senderName: "Alice Cooper",
    }
  ],
  "4": [
    {
      id: "1",
      content: "The data export feature isn't working. When I click export, nothing happens.",
      timestamp: "2025-09-08T06:30:00Z",
      sender: "customer",
      senderName: "Robert Wilson",
    },
    {
      id: "2",
      content: "I've fixed the export issue for you. Please try again and let me know if you have any other problems.",
      timestamp: "2025-09-08T07:15:00Z",
      sender: "agent",
      senderName: "John Smith",
    },
    {
      id: "3",
      content: "Perfect! It's working now. Thank you for the quick fix!",
      timestamp: "2025-09-08T07:30:00Z",
      sender: "customer",
      senderName: "Robert Wilson",
    }
  ]
};
