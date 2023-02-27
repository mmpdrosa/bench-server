import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class Keys {
  @IsNotEmpty()
  @IsString()
  auth: string;

  @IsNotEmpty()
  @IsString()
  p256dh: string;
}

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @ValidateNested({ each: true })
  @Type(() => Keys)
  keys: Keys;
}
