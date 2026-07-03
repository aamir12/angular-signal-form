import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  applyEach,
  disabled,
  email,
  Field,
  FieldTree,
  form,
  FormField,
  FormRoot,
  max,
  min,
  minLength,
  required,
  submit,
  TreeValidationResult,
  validate,
  validateTree,
} from '@angular/forms/signals';
import { DinnerReviewList } from '../../models/form-array.model';
import { ReviewsService } from '../../services/reviews-service';

@Component({
  selector: 'app-form-array',
  imports: [CommonModule, FormField, FormRoot],
  templateUrl: './form-array.html',
  styleUrl: './form-array.scss',
})
export class SignaleFormArray {
  readonly reviewsService = inject(ReviewsService);
  readonly model = signal<DinnerReviewList>({
    username: 'Kobi Hari',
    role: 'user',
    email: 'kobi2294@yahoo.com',
    description: 'The dinner was very nice, we enjoyed it so much',
    reviews: [
      {
        aspect: 'Food',
        rating: 4,
        recommendation: 'recommend',
      },
      {
        aspect: 'Service',
        rating: 5,
        recommendation: 'recommend',
      },
    ],
  });

  addReviewItem() {
    this.model.update((state) => ({
      ...state,
      reviews: [
        ...state.reviews,
        {
          aspect: '',
          rating: 3,
          recommendation: 'no-opinion',
        },
      ],
    }));
  }

  removeItem(index: number) {
    this.model.update((state) => ({
      ...state,
      reviews: state.reviews.filter((r, i) => i !== index),
    }));
  }

  readonly reviewForm = form(
    this.model,
    (path) => {
      // it is used to disable entire form after submit form
      disabled(path, { when: (ctx) => ctx.state.submitting() });
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

      validate(path.description, (ctx) => {
        const value = ctx.value();
        const threshold = ctx.valueOf(path.role) === 'author' ? 10 : 5;

        // check that there are at least 10 words
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount < threshold) {
          return {
            kind: 'min-words',
            message: `Description needs to be at least ${threshold} words long (currently there are ${wordCount} words)`,
          };
        }

        return undefined;
      });

      applyEach(path.reviews, (p) => {
        min(p.rating, 1, {
          message: 'Min 1',
        });

        max(p.rating, 5, {
          message: 'Max 5',
        });

        required(p.aspect, {
          message: 'Aspect is mandatory',
        });

        validateTree(p, (ctx) => {
          const rating = ctx.valueOf(p.rating);
          const recommendation = ctx.valueOf(p.recommendation);
          if (rating >= 4 && recommendation === 'not-recommend') {
            return [
              {
                kind: 'rating-conflict',
                message: 'Rating Conflict',
                fieldTree: ctx.fieldTreeOf(p.rating),
              },
              {
                kind: 'rating-conflict',
                message: 'Rating Conflict',
                fieldTree: ctx.fieldTreeOf(p.recommendation),
              },
            ];
          }

          return undefined;
        });
      });
    },
    {
      submission: {
        action: this.onFormSubmit.bind(this),
      },
    },
  );

  async onFormSubmit(frm: FieldTree<DinnerReviewList>): Promise<TreeValidationResult> {
    console.log('starting to submit the form');
    const res = await this.reviewsService.submitReview(frm);
    //If server error.
    if (res) {
      return res;
    }
    console.log('Form Submitted successfully. We can put over other logic here');

    return undefined;
  }

  //button click submition
  // onSubmit() {
  //   submit(this.reviewForm, async (frm) => {
  //     console.log('starting to submit the form');
  //     const res = await this.reviewsService.submitReview(frm);
  //     //If server error.
  //     if (res) {
  //       return res;
  //     }
  //     console.log('Form Submitted successfully. We can put over other logic here');

  //     return undefined;
  //   });
  // }
}
