import { roll, createRoller } from './index';



test('modules should be importable', () => {

  expect(roll).toBeDefined();
  expect(createRoller).toBeDefined();
  expect(typeof roll).toBe('function');
  expect(typeof createRoller).toBe('function');

});


test('createRoller should create a roller', () => {

  const roller = createRoller('1d6');
  expect(roller).toBeDefined();
  expect(typeof roller).toBe('function');
  expect(typeof roller.toDiceNotation).toBe('function');
  expect(typeof roller.toDiceNotation()).toBe('string');

});


test('createRoller().toDiceNotation should work', () => {

  // normal
  test([1, 6, 0], '1d6');
  test([3, 6, 10], '3d6+10');
  test([3, 6, 4], '3d6+4');
  test([2, 6, -1], '2d6-1');
  test([2, 6, -3], '2d6-3');

  // default modifier
  test([2, 6], '2d6');
  test([3, 12], '3d12');

  // default diceCount
  test([36], '1d36');
  test([12], '1d12');

  // default faceCount
  test([], '1d6');

  function test(args, str)
  {
    const roller = createRoller.apply(createRoller, args);
    expect(roller.toDiceNotation()).toBe(str);
  }

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


test('diceCount should default to 1', () => {
  testRolls([4], result => checkResult(result, 1, 4, 0));
  testRolls([6], result => checkResult(result, 1, 6, 0));
  testRolls([100], result => checkResult(result, 1, 100, 0));
});


test('faceCount should default to 6', () => {
  testRolls([], result => checkResult(result, 1, 6, 0));
  testRolls([], result => checkResult(result, 1, 6, 0));
  testRolls([], result => checkResult(result, 1, 6, 0));
});


test('it should understand dice-notation', () => {


  // normal
  testRolls(['1d20+1'], result => checkResult(result, 1, 20, 1));
  testRolls(['4d8+10'], result => checkResult(result, 4, 8, 10));
  testRolls(['2d8+10'], result => checkResult(result, 2, 8, 10));
  testRolls(['5d8-10'], result => checkResult(result, 5, 8, -10));

  // default modifier
  testRolls(['3d18'], result => checkResult(result, 3, 18, 0));
  testRolls(['10d8'], result => checkResult(result, 10, 8, 0));
  testRolls(['1d6'], result => checkResult(result, 1, 6, 0));
  testRolls(['4d10'], result => checkResult(result, 4, 10, 0));

  // default diceCount
  testRolls(['d6'], result => checkResult(result, 1, 6, 0));
  testRolls(['d100'], result => checkResult(result, 1, 100, 0));
  testRolls(['d5000'], result => checkResult(result, 1, 5000, 0));
  testRolls(['d2'], result => checkResult(result, 1, 2, 0));

  // default faceCount
  testRolls(['5d'], result => checkResult(result, 5, 6, 0));
  testRolls(['1000d'], result => checkResult(result, 1000, 6, 0));
  testRolls(['1d'], result => checkResult(result, 1, 6, 0));
  testRolls(['50d'], result => checkResult(result, 50, 6, 0));

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
  const isInt = Number.isInteger(result);
  expect(isInt).toBeTruthy();
  expect(result).toBeGreaterThanOrEqual(numDice * 1 + modifier);
  expect(result).toBeLessThanOrEqual(numDice * numFaces + modifier);
}
