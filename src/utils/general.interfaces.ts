import { Message } from "src/messages/model/message.schema";
import { UserBlocked } from "src/user-blocked/model/user-blocked.schema";

export interface ResponseMessage {
    data: Message | null;
    message: string;
    status: number;
}

export interface ResponseBlockeds {
    data: UserBlocked | null;
    message: string; 
    status: number;
}

export interface FileBody {
    emailSendTo: string;
    emailSendBy: string;
    messageContent: string;
}