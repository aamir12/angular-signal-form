import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

import { FieldWrapper } from '../field-wrapper/field-wrapper';
import { StarRating } from '../star-rating/star-rating';

import { ReviewItem } from '../../../models/common';

@Component({
  selector: 'app-review-item-form',
  imports: [FormField, FieldWrapper, StarRating],
  templateUrl: './review-item-form.html',
  styleUrl: './review-item-form.scss',
})
export class ReviewItemForm {
  readonly header = input('');

  readonly formField = input.required<FieldTree<ReviewItem>>();
}
