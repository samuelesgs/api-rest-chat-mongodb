import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserBloquedDocument = UserBlocked & Document;

@Schema({ timestamps: true })
export class UserBlocked {
    @Prop({ required: true })
    emailOwner: string;
    @Prop()
    emailList: string[];
}

export const UserBlockedSchema = SchemaFactory.createForClass(UserBlocked);

