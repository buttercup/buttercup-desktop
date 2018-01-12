import test from 'ava';
import { sortByKey } from '../../src/shared/utils/collection';

test('sortByKey should do nothing when sortKey is invalid', t => {
  const unsortedInput = [{ name: 'Yellow' }, { name: 'Blue' }, { name: 'Red' }];

  const outputWithoutKey = sortByKey(unsortedInput, '-asc');
  t.deepEqual(
    outputWithoutKey,
    unsortedInput,
    'sortKey should do nothing when key is not provided'
  );

  const outputWithoutOrder = sortByKey(unsortedInput, 'name-');
  t.deepEqual(
    outputWithoutOrder,
    unsortedInput,
    'sortKey should do nothing when order is not provided'
  );
});

test('sortByKey should sort items based on the given key and order', t => {
  const unsortedInput = [
    { name: 'Yellow' },
    { name: 'Blue' },
    { name: 'Red' },
    { name: 'green' }
  ];

  const cases = [
    {
      sortKey: 'name-asc',
      message: 'sortKey should sort items ascending, when order is asc',
      expectedOutput: [
        { name: 'Blue' },
        { name: 'green' },
        { name: 'Red' },
        { name: 'Yellow' }
      ]
    },
    {
      sortKey: 'name-dsc',
      message: 'sortKey should sort items in descending, when order is dsc',
      expectedOutput: [
        { name: 'Yellow' },
        { name: 'Red' },
        { name: 'green' },
        { name: 'Blue' }
      ]
    },
    {
      sortKey: 'name-something',
      message: 'sortKey should sort items in descending, when order is not asc',
      expectedOutput: [
        { name: 'Yellow' },
        { name: 'Red' },
        { name: 'green' },
        { name: 'Blue' }
      ]
    }
  ];

  cases.forEach(testCase => {
    const output = sortByKey(unsortedInput, testCase.sortKey);
    t.deepEqual(output, testCase.expectedOutput, testCase.message);
  });
});
