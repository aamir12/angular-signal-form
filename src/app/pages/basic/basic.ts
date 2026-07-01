import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { email, form, FormField, required, validate } from '@angular/forms/signals';
import { DinnerReview } from '../../models/dinner-review.model';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.html',
  styleUrl: './basic.scss',
  imports: [CommonModule, FormField],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Basic {
  readonly model = signal<DinnerReview>({
    username: '',
    role: 'user',
    email: '',
    description: '',
    rating: 1,
  });

  readonly reviewForm = form(this.model, (path) => {
    required(path.username, { message: 'Username is required' });
    required(path.email, {
      message: 'Email is required',
      when: (ctx) => ctx.valueOf(path.role) !== 'author',
    });
    email(path.email, { message: 'Invalid email' });
    validate(path.description, (ctx) => {
      const value = ctx.value();
      const threshHold = ctx.valueOf(path.role) === 'user' ? 5 : 10;
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < threshHold) {
        return {
          kind: 'min-word',
          message: `Description is too short. It requires at least ${threshHold} words and you have provided ${wordCount === 0 ? 'zero' : wordCount} words`,
        };
      }
      return undefined;
    });
  });
}
