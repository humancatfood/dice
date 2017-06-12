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

  const numDice = 1;
  const numFaces = 6;
  const modifier = 0;

  const roller = createRoller(numDice, numFaces, modifier);

  const results = [
    roll(numDice, numFaces, modifier),
    roller()
  ];

  results.forEach(result => {
    expect(result).toBeGreaterThanOrEqual(numDice * 1);
    expect(result).toBeLessThanOrEqual(numDice * numFaces);
  });

});


test('modifier should default to 0', () => {

  const numDice = 1;
  const numFaces = 6;

  const roller = createRoller(numDice, numFaces);

  const results = [
    roll(numDice, numFaces),
    roller()
  ];

  results.forEach(result => {
    expect(result).toBeGreaterThanOrEqual(numDice * 1);
    expect(result).toBeLessThanOrEqual(numDice * numFaces);
  });

});
