import {
  createMetadataKey,
  LogicFn,
  MAX_NUMBER,
  metadata,
  MetadataReducer,
  SchemaPath,
  validate,
} from '@angular/forms/signals';

/* MetadataReducer.max<number>(): it will create a metadata key that will store the maximum number of words allowed for a string field. The metadata key will be used to validate the string field and ensure that it does not exceed the specified maximum number of words.
 */
export const MIN_WORDS = createMetadataKey(MetadataReducer.max<number>());

export function minWords(path: SchemaPath<string>, minValue: number | LogicFn<string, number>) {
  metadata(path, MIN_WORDS, (ctx) => (typeof minValue === 'number' ? minValue : minValue(ctx)));

  validate(path, (ctx) => {
    const value = ctx.value();
    const threshold = ctx.state.metadata(MIN_WORDS)!();

    if (!threshold) return;

    // check that there are at least 10 words
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount < threshold) {
      return {
        kind: 'min-words',
        message: `Description needs to be at least ${threshold} words long (currently there are ${wordCount} words)`,
      };
    }

    return null;
  });
}
