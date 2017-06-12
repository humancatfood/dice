import { roll, createRoller } from './index';



test('modules should be importable', () => {

  expect(roll).toBeDefined();
  expect(createRoller).toBeDefined();
  expect(typeof roll).toBe('function');
  expect(typeof createRoller).toBe('function');

});


test('createRoller should create a roller', () =>{

  const roller = createRoller('1d6');

  expect(roller).toBeDefined();
  expect(typeof roller).toBe('function');
  expect(typeof roller.toDiceNotation).toBe('function');
  expect(typeof roller.toDiceNotation()).toBe('string');

});


test('simple rolls should work', () => {
  testRolls([1, 6, 0], result => checkResult(result, 1, 6, 0));
  testRolls([6, 6, 0], result => checkResult(result, 6, 6, 0));
  testRolls([100, 2, 0], result => checkResult(result, 100, 2, 0));
});

test('modifiers should be added to the result', () => {
  testRolls([1, 6, 50], result => checkResult(result, 1, 6, 50));
  testRolls([1, 6, -10], result => checkResult(result, 1, 6, -10));
  testRolls([2, 6, 100], result => checkResult(result, 2, 6, 100));
});

test('modifiers should default to 0', () => {
  testRolls([4, 8], result => checkResult(result, 4, 8, 0));
  testRolls([1, 10], result => checkResult(result, 1, 10, 0));
});


function testRolls (args, cb)
{
  [
    roll.apply(roll, args),
    createRoller.apply(createRoller, args)()
  ].forEach(cb);
}

function checkResult (result, numDice, numFaces, modifier)
{
  expect(result).toBeGreaterThanOrEqual(numDice * 1 + modifier);
  expect(result).toBeLessThanOrEqual(numDice * numFaces + modifier);
}
