import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument = Message & Document;

@Schema({timestamps: true})
export class Message {
    @Prop()
    content: string;
    @Prop()
    datetime: string;
    @Prop({default: 0})
    status: number; //0 = Send, 1 = Recived, 2 = Watched
    @Prop({default: 0})
    delete: number;
    @Prop()
    send_by: string;
    @Prop()
    send_to: string;
    @Prop({default: 'message'})
    type: string;
    @Prop({default: null})
    filename: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);