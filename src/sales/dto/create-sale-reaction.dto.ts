import { IsEnum, IsNotEmpty } from 'class-validator';

enum ReactionContent {
  LIKE = 'like',
  DISLIKE = 'dislike',
  CLOWN = 'clown',
  SHIT = 'shit',
  HEART = 'heart',
  FIRE = 'fire',
  CLAP = 'clap',
  THINKING = 'thinking',
  ROFL = 'rofl',
}

export class CreateSaleReactionDto {
  @IsNotEmpty()
  @IsEnum(ReactionContent)
  content: ReactionContent;
}
