module.exports = {
  roll: roll,
  createRoller: createRoller
};


var DICE_NOTATION_REGEX = new RegExp(/^(\d*)d(\d*)(\+|-)*(\d*)$/, 'i');
var NO_DICE_ERROR = 'You cannot roll zero or a negative number of dice!';
var NO_FACES_ERROR = 'Dice cannot have zero or a negative number of faces!';



/**
 * Simulates a dice-throw according to the passed-in rules
 *
 * Some example inputs:
 *
 * - `'3d7-2'` 3 dice with 7 faces, modifier is -2
 * - `'1d6+1'` 1 dice with 6 faces, modifier is +1
 * - `'4d'` 4 dice with 6 faces, modifier is 0
 * - `'d10'` 1 dice with 10 faces, modifier is 0
 *
 * Alternatively it will receive up to 3 number arguments, any extra arguments are ignored:
 *
 * - `diceCount` is the count of the dice (default is 1)
 * - `faceCount` is the count of the faces on the dice (default is 6)
 * - `modifier` is an either positive or negative modifier to the result of the roll. The sign is required.
 * E.g. `'+2'` or `'-5'` (default is 0)
 *
 * @param {String|Number} [diceFacesOrNotation=1] - EITHER the number of dice to roll OR the number of
 * faces-per-die (defaulting the number of dice to 1) OR a string following dice-notation (eg. '2d12+1')
 * @param {Number} [faceCount=6] - The number of faces-per-die
 * @param {Number} [modifier=0] - A positive or negative number to be added to the dice-throw
 *
 * @returns {Number} - A pseudo-random number
 */
function roll (diceFacesOrNotation, faceCount, modifier)
{
  'use strict';
  var args = _parseArgs(diceFacesOrNotation, faceCount, modifier);
  return _innerRoll(args);
}


/**
 * pre-configures a (set of) dice and returns a function. When this function is called with no arguments it
 * returns a valid random sum of rolling preconfigured dice with any supplied modifier applied.
 *
 * The return value of `createRoller` also has a property `.toDiceNotation` which returns a string representing
 * the dice notation (whether or not the invocation of `createRoller` was called with a string).
 *
 * The accepted parameters are the same as for the `roll` function
 */
function createRoller (diceFacesOrNotation, faceCount, modifier)
{
  'use strict';

  var args = _parseArgs(diceFacesOrNotation, faceCount, modifier);
  var notation = _argsToNotation(args);

  function roller()
  {
    return _innerRoll(args);
  }

  roller.toDiceNotation = function () {
    return notation;
  };

  return roller;
}


/**
 * Performs a dice-roll
 * @private
 */
function _innerRoll (args)
{
  'use strict';
  var diceCount = args.diceCount;
  var faceCount = args.faceCount;
  var modifier= args.modifier;

  var sum = 0;
  for (var i=0; i<diceCount; i+=1)
  {
    sum += Math.ceil(Math.random() * faceCount);
  }

  return sum + modifier;
}


/**
 * Performs the argument-parsing detailed above
 *
 * @private
 */
function _parseArgs (diceFacesOrNotation, faceCount, modifier)
{
  'use strict';
  var match = DICE_NOTATION_REGEX.exec(diceFacesOrNotation);

  // if the first parameter matches the regex, we extract the arguments from the match
  if (match)
  {
    diceFacesOrNotation = match[1] || 1;
    faceCount = match[2] || 6;
    modifier = parseInt(match[3] + match[4], 10);
  }
  // if there's no match but any of the required params are not numbers, we throw a generic argument error
  else if (diceFacesOrNotation && typeof diceFacesOrNotation !== 'number' ||
           faceCount && typeof faceCount !== 'number' ||
           modifier && typeof modifier !== 'number')
  {
    throw new Error(['Bad arguments:', diceFacesOrNotation, faceCount, modifier].join(' '));
  }

  // reverse-ish logic: if we have a face-count, we must have a dice-count ..
  if (faceCount)
  {
    if (diceFacesOrNotation < 1)
    {
      // .. unless the dice-count is less than one of course!
      throw new Error(NO_DICE_ERROR);
    }
    if (faceCount < 1)
    {
      // .. and a face-count of less than one is no good either!
      throw new Error(NO_FACES_ERROR);
    }

    // .. but if that is all fine, then this should work
    return {
      diceCount: diceFacesOrNotation,
      faceCount: faceCount,
      modifier: modifier || 0
    };

  }
  // reverse-ish logic again: if we don't have a valid second argument, then this must be the face-count!
  else if (diceFacesOrNotation)
  {
    // but again, a face-count of less than one is no good!
    if (diceFacesOrNotation < 1)
    {
      throw new Error(NO_FACES_ERROR);
    }

    // .. and here we are!
    return {
      diceCount: 1,
      faceCount: diceFacesOrNotation,
      modifier: 0
    };
  }
  else
  {
    // lastly, if we don't have anything, just return the defaults
    return {
      diceCount: 1,
      faceCount: 6,
      modifier: 0
    };
  }
}


/**
 * Turns a object containing dice-throw rules into a string that follows dice-notation.
 *
 * ie {diceCount: 2, faceCount: 6, modifier: 0}    => `2d6`
 * ie {diceCount: 3, faceCount: 12, modifier: -5}  => `3d12-5`
 *
 * @private
 */
function _argsToNotation (args)
{
  'use strict';
  var diceCount = args.diceCount;
  var faceCount = args.faceCount;
  var modifier= args.modifier;

  return [
    diceCount,
    'd',
    faceCount,
    modifier > 0 ? '+' : '',
    modifier || ''
  ].join('');
}
