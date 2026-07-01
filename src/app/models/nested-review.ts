import { ReviewItem, Role } from './common';

export interface DinnerNestedReview {
  readonly username: string;
  readonly role: Role;
  readonly email: string;
  readonly description: string;
  readonly food: ReviewItem;
  readonly service: ReviewItem;
}
