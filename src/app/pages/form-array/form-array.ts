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
  ValidationError,
} from '@angular/forms/signals';
import { DinnerReviewList } from '../../models/form-array.model';
import { ReviewErrors, ReviewsService } from '../../services/reviews-service';

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
    otherEmail: ['abc.xyz@test.com'],
  });

  readonly submittedSuccessfully = signal(false);
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

  removeOtherEmailItem(index: number) {
    this.model.update((state) => ({
      ...state,
      otherEmail: state.otherEmail.filter((r, i) => i !== index),
    }));
  }

  addOtherEmailItem() {
    this.model.update((state) => ({
      ...state,
      otherEmail: [...state.otherEmail, ''],
    }));
  }

  readonly reviewForm = form(
    this.model,
    (path) => {
      // it is used to disable entire form after submit form
      disabled(path, { when: (ctx) => ctx.fieldTree().submitting() });
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
                kind: 'rating-recommendation',
                message: 'Rating and Recommendation Conflict',
                fieldTree: ctx.fieldTreeOf(p.recommendation),
              },
            ];
          }

          return undefined;
        });
      });
      applyEach(path.otherEmail, (p) => {
        required(p, {
          message: 'It is required',
        });

        email(p, {
          message: 'Email is not in the correct format',
        });
      });
    },
    {
      submission: {
        // action: async (frm) => {
        //   console.log('starting to submit the form', frm().value());
        // },
        // action: this.onFormSubmit.bind(this), //working
        action: this.onFormSubmit2.bind(this), //working
        onInvalid: (frm) => {
          // to set focus on first invalid field, we can use the following code
          console.log('The form is not valid, the errors are: ', frm().errorSummary());
          const firstInvalid = frm().errorSummary()[0];
          firstInvalid?.fieldTree().focusBoundControl();
        },
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

  async onFormSubmit2(frm: FieldTree<DinnerReviewList>): Promise<TreeValidationResult> {
    console.log('starting to submit the form');
    this.submittedSuccessfully.set(false);
    const submitResult = await this.reviewsService.submitReview3(frm().value());
    const treeValidationResult = toTreeValidationResult(submitResult, frm);
    console.log('Submission completed');
    if (!treeValidationResult) this.submittedSuccessfully.set(true);
    return treeValidationResult;
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

function toTreeValidationResult(
  result: ReviewErrors,
  frm: FieldTree<DinnerReviewList>,
): TreeValidationResult {
  if (Object.keys(result).length === 0) return null;

  const res: ValidationError.WithFieldTree[] = [];

  if (result.email) {
    res.push({
      kind: 'submit-error',
      message: result.email,
      fieldTree: frm.email,
    });
  }

  if (result.role) {
    res.push({
      kind: 'submit-error',
      message: result.role,
      fieldTree: frm.role,
    });
  }

  return res;
}
