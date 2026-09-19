# Chat Support System — Agent View

The agent-facing half of a two-sided support platform. A customer starts a conversation in the [customer app](https://github.com/Moodinocode/ChatSupportSystemUserView); it arrives here as a ticket that an agent can pick up, triage, reassign and answer.

Both halves talk to the same backend, which is not public.

Built at Tecfrac, September–October 2025.

## What it does

- **Ticket dashboard** — every conversation as a ticket, paginated, with status and last-message context
- **Ticket detail** with full conversation history and the customer's metadata
- **Reply in real time**, with the customer seeing typing indicators
- **Assignment and reassignment** — take a ticket, or hand it to another agent through a reassignment modal
- **Categorisation and re-categorisation**, backed by a category service
- **Priority levels** surfaced on the ticket list
- **Live updates over WebSockets (STOMP)** — new tickets and new messages arrive without a refresh
- **Media display** in the conversation thread
- **Chatbot** handling the first line before escalation

## Stack

| Concern | Choice |
|---|---|
| Framework | React + Vite |
| State | Zustand — separate stores for conversations and tickets |
| Realtime | STOMP over WebSockets, via a `WebSocketContext` provider |
| Styling | Tailwind CSS + DaisyUI, with a small in-house component set |
| Messaging | Twilio Conversations SDK |
| Voice | Twilio Voice SDK |
| Dates | dayjs |
| HTTP | axios, through a shared instance handling auth and refresh |

## Structure

```
src/
├── Pages/              Login, Registration, TicketsView
├── Components/
│   ├── AuthComponents/     Email, password and username inputs
│   ├── UIHelpers/          Badge, Card, ChatBubble, ScrollArea,
│   │                       Separator, ReassignForm, ReassignModal
│   ├── TicketDashboard.jsx
│   ├── TicketList.jsx
│   ├── TicketDetails.jsx
│   ├── AssignmentPanel.jsx
│   └── ChatInterface.jsx
├── Context/            AuthContext, WebSocketContext
├── Services/           agent, ticket, chat, category, user, auth, Twilio
├── Stores/             Zustand conversation and ticket stores
└── Utils/              axios instance, metadata formatting
```

This half is roughly twice the size of the customer app — around 3,300 lines against 1,500 — because triage is where the complexity lives: assignment, categorisation, pagination and live ticket updates have no counterpart on the customer side.

## Running it

```bash
npm install
npm run dev
```

The app expects the support backend to be reachable through the configured proxy. That backend is a private service, so this repository is not runnable end to end on its own — it is published to show the client-side architecture rather than as a deployable product.

## Known debt

The two halves of this system were built as separate repositories, and the code they share has drifted rather than staying in step. `AuthContext`, `ProtectedRoute`, `axiosInstance`, `authService`, the auth input components and the Zustand conversation store all exist in both repositories in slightly different versions — the conversation store alone differs by around 70 lines between them.

The right structure is a single repository with `apps/customer`, `apps/agent` and a shared package holding auth, the API client and the conversation store. That consolidation has not been done; it is the first thing worth fixing if this were taken further.
