import test from 'ava';
import { sortByKey } from '../../src/shared/utils/collection';

test('sortByKey should sort items based on the given key and order', t => {
  const unsortedInput = [
    { name: 'Yellow' },
    { name: 'Blue' },
    { name: 'Red' },
    { name: 'green' }
  ];

  const cases = [
    {
      sortKey: '-asc',
      message: 'should do nothing when key is not provided',
      expectedOutput: unsortedInput
    },
    {
      sortKey: 'name-',
      message: 'should do nothing when order is not provided',
      expectedOutput: unsortedInput
    },
    {
      sortKey: 'name-asc',
      message: 'should sort items ascending, when order is asc',
      expectedOutput: [
        { name: 'Blue' },
        { name: 'green' },
        { name: 'Red' },
        { name: 'Yellow' }
      ]
    },
    {
      sortKey: 'name-dsc',
      message: 'should sort items in descending, when order is dsc',
      expectedOutput: [
        { name: 'Yellow' },
        { name: 'Red' },
        { name: 'green' },
        { name: 'Blue' }
      ]
    },
    {
      sortKey: 'name-something',
      message: 'should sort items in descending, when order is not asc',
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
