# Role Playing Game Dice Rolling

The goal of this exercise is to create a module which implements rolling dice for a role playing game.

When required / imported two functions should be available roll and createRoller.

Both functions accept arguments in 2 forms.

If the first argument supplied is a string, it is assumed to be a string in the standard subset of [dicenotation](https://en.wikipedia.org/wiki/Dice_notation) (details follow). Any other arguments are ignored.

The string should be of the form `${diceCount}d${faceCount}${modifier}` where:

- `diceCount` is the count of the dice (default is 1)
- `faceCount` is the count of the faces on the dice (default is 6)
- `modifier` is a positive or negative number to get added to the result of the roll. The sign is required. E.g. `'+2'` or `'-5'`

Some example inputs:

- `'3d7-2'` 3 dice with 7 faces, modifier is -2
- `'1d6+1'` 1 dice with 6 faces, modifier is +1
- `'4d'` 4 dice with 6 faces, modifier is 0
- `'d10'` 1 dice with 10 faces, modifier is 0

Alternatively it will receive up to 3 number arguments, any extra arguments are ignored:

- `diceCount` is the count of the dice (default is 1)
- `faceCount` is the count of the faces on the dice (default is 6)
- `modifier` is an either positive or negative modifier to the result of the roll. The sign is required. E.g. `'+2'` or `'-5'` (default is 0)

When only one number is supplied in either approach it is the `faceCount`.



## `roll()`

See above for parameters. roll returns a whole number with a valid random sum of the result of a dice roll for the supplied arguments.

```javascript
  roll(3, 8);    // returns a whole number between 3 and 24
  roll("3d8-2"); // returns a whole number between 1 and 22
```


## `createRoller()`

See above for parameters. `createRoller` pre-configures a (set of) dice and returns a function. When this function is called with no arguments it returns a valid random sum of rolling preconfigured dice with any supplied modifier applied.

The return value of `createRoller` also has a property `.toDiceNotation` which returns a string representing the dice notation (whether or not the invocation of `createRoller` was called with a string).

```javascript
  const threeEightFacedDice = createRoller(3, 8, -2);
  threeEightFacedDice(); // returns a whole number between 1 and 22
  threeEightFacedDice.toDiceNotation(); // returns "3d8-2"
```
