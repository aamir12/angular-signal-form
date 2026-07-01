import { Role } from './common';

export type Recommendation = 'recommend' | 'not-recommend' | 'no-opinion';

export interface Review {
  readonly username: string;
  readonly role: Role;
  readonly email: string;
  readonly description: string;
  readonly rating: number;
  readonly recommendation: Recommendation;
}
