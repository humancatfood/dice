module.exports = {
  roll: roll,
  createRoller: createRoller
};



var DICE_NOTATION_REGEX = new RegExp(/^(\d*)d(\d*)(\+|-)*(\d*)$/, 'i');



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
 * faces-per-die OR a string following dice-notation (eg. '2d12+1')
 * @param {Number} [faceCount=6] - The number of faces-per-die
 * @param {Number} [modifier=0] - A positive or negative number to be added to the dice-throw
 *
 * @returns {Number} - A pseudo-random number
 */
function roll (diceFacesOrNotation, faceCount, modifier)
{
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
  var match = DICE_NOTATION_REGEX.exec(diceFacesOrNotation);

  if (match)
  {
    diceFacesOrNotation = match[1] || 1;
    faceCount = match[2] || 6;
    modifier = parseInt(match[3] + match[4], 10);
  }
  else if (typeof diceFacesOrNotation === 'string' ||
           typeof faceCount === 'string' ||
           typeof modifier === 'string')
  {
    _badArgs([diceFacesOrNotation, faceCount, modifier]);
  }


  if (faceCount)
  {
    if (diceFacesOrNotation < 1)
    {
      _noDice();
    }
    if (faceCount < 1)
    {
      _noFaces();
    }

    return {
      diceCount: diceFacesOrNotation,
      faceCount: faceCount,
      modifier: modifier || 0
    };

  }
  else if (diceFacesOrNotation)
  {
    if (diceFacesOrNotation < 1)
    {
      _noFaces();
    }

    return {
      diceCount: 1,
      faceCount: diceFacesOrNotation,
      modifier: 0
    };
  }
  else
  {
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


function _noDice ()
{
  throw new Error('You cannot roll zero or a negative number of dice!');
}

function _noFaces () {
  throw new Error('Dice cannot have zero or a negative number of faces!');
}

function _badArgs (args) {
  args.unshift('Bad arguments:');
  throw new Error(args.join(' '));
}
