import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends MutationOutput {}
