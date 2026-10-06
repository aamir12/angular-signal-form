import { Injectable } from '@angular/core';
import { FieldTree, ValidationError } from '@angular/forms/signals';
import { DinnerReviewList } from '../models/form-array.model';
import { DinnerNestedReview, ResuableReview } from '../models/nested-review';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  async submitReview(reviewForm: FieldTree<DinnerReviewList>) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const res: ValidationError.WithOptionalFieldTree[] = [];
    const review = reviewForm().value();

    //Here we can map server error with client error
    // If the email is not in the best-dinner.com domain, reject the review
    if (!review.email.endsWith('@best-dinner.com')) {
      res.push({
        message: 'Only best-dinner.com emails are allowed to submit reviews.',
        kind: 'email-domain',
        fieldTree: reviewForm.email,
      });
    }

    // If the username is "Kobi Hari", he can only submit reviews as an author
    if (review.username.toLowerCase() === 'kobi hari' && review.role !== 'author') {
      res.push({
        message: 'Kobi Hari can only submit reviews as an author.',
        kind: 'invalid-role',
        fieldTree: reviewForm.role,
      });
    }

    review.otherEmail.forEach((email, index) => {
      if (!email.endsWith('@test.com')) {
        res.push({
          message: 'Email must end with @test.com',
          kind: 'email-domain',
          fieldTree: reviewForm.otherEmail[index],
        });
      }
    });

    // how to add error related to form not related to any field, for example, if the review has more than 5 reviews, we can add an error to the form itself
    if (review.reviews.length > 5) {
      res.push({
        message: 'You can only submit up to 5 reviews.',
        kind: 'too-many-reviews',
        fieldTree: reviewForm,
      });
    }

    return res.length ? res : undefined;
  }

  async submitReview2(reviewForm: FieldTree<ResuableReview>) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const res: ValidationError.WithOptionalFieldTree[] = [];

    const review = reviewForm().value();
    // If the email is not in the best-dinner.com domain, reject the review
    if (!review.email.endsWith('@best-dinner.com')) {
      res.push({
        message: 'Only best-dinner.com emails are allowed to submit reviews.',
        kind: 'email-domain',
        fieldTree: reviewForm.email,
      });
    }

    // If the username is "Kobi Hari", he can only submit reviews as an author
    if (review.username.toLowerCase() === 'kobi hari' && review.role !== 'author') {
      res.push({
        message: 'Kobi Hari can only submit reviews as an author.',
        kind: 'invalid-role',
        fieldTree: reviewForm.role,
      });
    }

    return res.length ? res : undefined;
  }
}
