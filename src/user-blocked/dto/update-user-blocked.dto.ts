import { PartialType } from '@nestjs/swagger';
import { CreateUserBlockedDto } from './create-user-blocked.dto';

export class UpdateUserBlockedDto extends PartialType(CreateUserBlockedDto) {}
