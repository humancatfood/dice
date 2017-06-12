module.exports = {
  roll: roll,
  createRoller: createRoller
};



var DICE_NOTATION_REGEX = new RegExp(/^(\d*)d(\d*)(\+|-)*(\d*)$/, 'i');


function roll (diceFacesOrNotation, faceCount, modifier)
{
  var args = _parseArgs(diceFacesOrNotation, faceCount, modifier);
  return _innerRoll(args);
}


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


function _parseArgs (diceFacesOrNotation, faceCount, modifier)
{
  var match = DICE_NOTATION_REGEX.exec(diceFacesOrNotation);

  if (match)
  {
    diceFacesOrNotation = match[1] || 1;
    faceCount = match[2] || 6;
    modifier = parseInt(match[3] + match[4], 10);
  }

  if (faceCount)
  {
    return {
      diceCount: diceFacesOrNotation,
      faceCount: faceCount,
      modifier: modifier || 0
    };
  }
  else if (diceFacesOrNotation)
  {
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


