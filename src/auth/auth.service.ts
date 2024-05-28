import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/model/user.schema';
import { RegisterAuthDto } from './dto/registrer-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { comparePlainToHash, generateHash } from './utils/handleBcrypt';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    public async register(userBody: RegisterAuthDto) : Promise<GeneralReponse> {
        try {
            await this.userModel.create({
                ...userBody,
                password: await generateHash(userBody.password)
            });
            return {
                data: null,
                status: 1,
                message: "Success request create user"
            }
        } catch (error) {
            return {
                data: null,
                status: 2,
                message: `Failed request create user: ${error.errmsg}`
            }
        }
    }

    public async findByEmailAndPassword(data: LoginDto) : Promise<GeneralReponse> {
        try {
            const user = await this.userModel.findOne({email: data.email});
            const validatePassword = await comparePlainToHash(data.password, user.password);            
            if (user && validatePassword) {
                return {
                    data: user,
                    status: 1,
                    message: "Success request login user..."
                }
            } else {
                return {
                    data: null,
                    status: 2,
                    message: "User no find, please, try agrain"
                }
            }
        } catch (error) {
            return {
                data: error,
                status: 2,
                message: "Failed Request Login user..."
            }
        }
    }
}

export interface GeneralReponse {
    data: object | null;
    status: number;
    message: string;
}