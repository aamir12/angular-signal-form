export type Recommendation = 'recommend' | 'not-recommend' | 'no-opinion';
export type Role = 'user' | 'author' | 'chef';

export interface ReviewItem {
  readonly rating: number;
  readonly recommendation: Recommendation;
}

export interface MenuItem {
  title: string;
  route: string;
}
