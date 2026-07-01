import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  applyWhen,
  disabled,
  email,
  Field,
  form,
  FormField,
  hidden,
  minLength,
  readonly,
  required,
  validate,
  validateTree,
} from '@angular/forms/signals';
import { DinnerBasicReview } from '../../models/basic-all.model';

@Component({
  selector: 'app-basic-all',
  imports: [CommonModule, FormField],
  templateUrl: './basic-all.html',
  styleUrl: './basic-all.scss',
})
export class BasicAll {
  readonly model = signal<DinnerBasicReview>({
    username: '',
    role: 'user',
    email: '',
    description: 'this is just a text message to verify validation of frontend side',
    rating: 1,
    recommendation: 'no-opinion',
    sendText: false,
    phone: '',
  });

  readonly reviewForm = form(this.model, (path) => {
    required(path.username, {
      message: 'Username is required',
    });
    required(path.email, {
      message: 'Email is required',
      //apply single validation
      when: (ctx) => ctx.valueOf(path.role) !== 'author',
    });
    // disabled(path.email, (ctx) => ctx.valueOf(path.role) === 'author');

    // readonly(path.email, (ctx) => ctx.valueOf(path.role) === 'author');

    hidden(path.email, {
      when: (ctx) => {
        return ctx.valueOf(path.role) === 'author';
      },
    });
    //apply multiple validation
    applyWhen(
      path.phone,
      (ctx) => Boolean(ctx.valueOf(path.sendText)),
      (phonePath) => {
        (required(phonePath, { message: 'It is required' }),
          minLength(phonePath, 10, { message: 'It should be mimimum 10 characters' }));
      },
    );
    email(path.email, {
      message: 'Email is not in the correct format',
    });

    //apply validation rule on single field
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

        // validate can also return multiple error
        // return [
        //   {
        //     kind: 'min-words',
        //     message: `Description needs to be at least ${threshold} words long (currently there are ${wordCount} words)`,
        //   },
        //   {
        //     kind: 'min-words2',
        //     message: `Test`,
        //   },
        // ];
      }

      return undefined;
    });
    // Apply to multiple field
    validateTree(path, (ctx) => {
      const rating = ctx.valueOf(path.rating);
      const recommendation = ctx.valueOf(path.recommendation);

      if (rating >= 4 && recommendation === 'not-recommend') {
        return [
          {
            kind: 'conflict-rating',
            message: 'Not allow to not recomment when you are giving rating above 4',
            fieldTree: ctx.fieldTreeOf(path.rating),
          },
          {
            kind: 'conflict-rating',
            message: 'Not allow to not recomment when you are giving rating above 4',
            fieldTree: ctx.fieldTreeOf(path.recommendation),
          },
        ];
      }

      return undefined;
    });
  });
}
