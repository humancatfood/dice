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


test('it should throw errors for invalid arguments', () => {

  testErrors([-10], /zero or a negative number of faces/i);
  testErrors([-100], /zero or a negative number of faces/i);
  testErrors([-10, 10], /zero or a negative number of dice/i);
  testErrors([10, -10], /zero or a negative number of faces/i);
  testErrors([-10, 10, 5], /zero or a negative number of dice/i);
  testErrors([10, -10, -5], /zero or a negative number of faces/i);
  testErrors(['-4d20'], /arguments/i);
  testErrors(['1f20+10'], /arguments/i);
  testErrors(['123-5'], /arguments/i);
  testErrors(['blabla'], /arguments/i);
  testErrors([2, 'blabla'], /arguments/i);
  testErrors([1, 2, 'blabla'], /arguments/i);
  testErrors(['blabla', 1], /arguments/i);
  testErrors(['blabla', 1, 2], /arguments/i);

});




test('simple rolls should work', () => {
  testRolls([1, 6, 0], 1, 6, 0);
  testRolls([6, 6, 0], 6, 6, 0);
  testRolls([100, 2, 0], 100, 2, 0);
});


test('modifiers should be added to the result', () => {
  testRolls([1, 6, 50], 1, 6, 50);
  testRolls([1, 6, -10], 1, 6, -10);
  testRolls([2, 6, 100], 2, 6, 100);
});


test('modifiers should default to 0', () => {
  testRolls([4, 8], 4, 8, 0);
  testRolls([1, 10], 1, 10, 0);
});


test('diceCount should default to 1', () => {
  testRolls([4], 1, 4, 0);
  testRolls([6], 1, 6, 0);
  testRolls([6], 1, 6, 0);
  testRolls([100], 1, 100, 0);
});


test('faceCount should default to 6', () => {
  testRolls([], 1, 6, 0);
  testRolls([], 1, 6, 0);
  testRolls([], 1, 6, 0);
});


test('it should understand dice-notation', () => {


  // normal
  testRolls(['1d20+1'], 1, 20, 1);
  testRolls(['4d8+10'], 4, 8, 10);
  testRolls(['2d8+10'], 2, 8, 10);
  testRolls(['5d8-10'], 5, 8, -10);

  // default modifier
  testRolls(['3d18'], 3, 18, 0);
  testRolls(['10d8'], 10, 8, 0);
  testRolls(['1d6'], 1, 6, 0);
  testRolls(['4d10'], 4, 10, 0);

  // default diceCount
  testRolls(['d6'], 1, 6, 0);
  testRolls(['d100'], 1, 100, 0);
  testRolls(['d5000'], 1, 5000, 0);
  testRolls(['d2'], 1, 2, 0);

  // default faceCount
  testRolls(['5d'], 5, 6, 0);
  testRolls(['1000d'], 1000, 6, 0);
  testRolls(['1d'], 1, 6, 0);
  testRolls(['50d'], 50, 6, 0);

});


function testRolls (args, expectedNumDice, expectedNumFaces, expectedModifier)
{

  [
    roll.apply(roll, args),
    createRoller.apply(createRoller, args)()
  ].forEach(result => {

    const isInt = Number.isInteger(result);
    expect(isInt).toBeTruthy();
    expect(result).toBeGreaterThanOrEqual(expectedNumDice * 1 + expectedModifier);
    expect(result).toBeLessThanOrEqual(expectedNumDice * expectedNumFaces + expectedModifier);

  });

}


function testErrors (args, err)
{
  expect(roll.bind(roll, ...args)).toThrow(err);
  expect(createRoller.bind(createRoller, ...args)).toThrow(err);
}

