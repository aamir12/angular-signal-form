import { Recommendation, Role } from './common';

export interface DinnerBasicReview {
  readonly username: string;
  readonly role: Role;
  readonly email: string;
  readonly description: string;
  readonly rating: number;
  readonly sendText: boolean;
  readonly phone: string;
  readonly recommendation: Recommendation;
}
