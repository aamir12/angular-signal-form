import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  apply,
  applyEach,
  disabled,
  email,
  Field,
  form,
  FormField,
  FormRoot,
  max,
  min,
  minLength,
  required,
  submit,
  validate,
  validateTree,
} from '@angular/forms/signals';
import { DinnerNestedReview, ResuableReview } from '../../models/nested-review';
import { FieldWrapper } from './field-wrapper/field-wrapper';
import { ReviewItemForm } from './review-item-form/review-item-form';
import { ReviewsService } from '../../services/reviews-service';
import { minWords } from '../../schemas/min-words.validator';
import { reviewItemSchema } from '../../schemas/review-item.schema';

@Component({
  selector: 'app-resuable',
  imports: [CommonModule, FormField, FieldWrapper, ReviewItemForm, FormRoot],
  templateUrl: './resuable.html',
  styleUrl: './resuable.scss',
})
export class Resuable {
  readonly reviewsService = inject(ReviewsService);
  readonly submittedSuccessfully = signal(false);

  readonly model = signal<ResuableReview>({
    username: 'Kobi Hari',
    role: 'user',
    email: 'kobi2294@yahoo.com',
    description: 'The dinner was very nice, we enjoyed it so much',
    food: {
      rating: 4,
      recommendation: 'recommend',
    },
    service: {
      rating: 5,
      recommendation: 'recommend',
    },
  });

  readonly reviewForm = form(this.model, (path) => {
    required(path.username, {
      message: 'Username is required',
    });
    required(path.email, {
      message: 'Email is required',
      when: (ctx) => ctx.valueOf(path.role) !== 'author',
    });
    email(path.email, {
      message: 'Email is not in the correct format',
    });
    disabled(path, { when: (ctx) => ctx.state.submitting() });
    minWords(path.description, (ctx) => (ctx.valueOf(path.role) === 'author' ? 10 : 5));

    apply(path.food, reviewItemSchema);
    apply(path.service, reviewItemSchema);
  });

  onSubmit() {
    submit(this.reviewForm, async (frm) => {
      console.log('starting to submit the form');
      const res = await this.reviewsService.submitReview2(frm);
      if (!res) {
        this.submittedSuccessfully.set(true);
      }
      return res;
    });
  }
}
