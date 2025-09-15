import { Conversation } from "@twilio/conversations";
import axiosInstance from "../Utils/axiosInstance";

const suburl = "/twilio";

export const joinTwilioConversation = (conversationSid) => axiosInstance.post(`${suburl}/join`,{conversationSid})