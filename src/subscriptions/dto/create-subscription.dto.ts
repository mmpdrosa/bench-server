import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
