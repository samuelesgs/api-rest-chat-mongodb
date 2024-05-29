import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required : true, unique : true})
    email : string;
    @Prop()
    password : string;
    @Prop()
    name : string;
    @Prop({default: null})
    img : string;
    @Prop({default: null})
    id_socket: string;
}

export const UserSchema = SchemaFactory.createForClass(User);