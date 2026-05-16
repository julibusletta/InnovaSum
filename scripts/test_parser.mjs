
function testParser(markupFixed) {
  let fixedAdj = 0;
  let isUSD = true;
  const cleanFixed = markupFixed.toUpperCase();
  const usdMatch = cleanFixed.match(/\$(\d+)\s*USD/i);
  const arsMatch = cleanFixed.match(/\$(\d+)(K)?\s*ARS/i);
  
  if (arsMatch) {
    fixedAdj = parseFloat(arsMatch[1]);
    if (arsMatch[2]) fixedAdj *= 1000;
    isUSD = false;
  } else if (usdMatch) {
    fixedAdj = parseFloat(usdMatch[1]);
    isUSD = true;
  } else {
    // Secondary check
    const usdMatchNoSign = cleanFixed.match(/(\d+)\s*USD/i);
    const arsMatchNoSign = cleanFixed.match(/(\d+)(K)?\s*ARS/i);
    if (arsMatchNoSign) {
      fixedAdj = parseFloat(arsMatchNoSign[1]);
      if (arsMatchNoSign[2]) fixedAdj *= 1000;
      isUSD = false;
    } else if (usdMatchNoSign) {
      fixedAdj = parseFloat(usdMatchNoSign[1]);
      isUSD = true;
    } else {
      fixedAdj = 20;
      isUSD = true;
    }
  }
  return { fixedAdj, isUSD };
}

console.log('Test 10k ARS:', testParser(">500: +10% | <500: +$10k ARS"));
console.log('Test 10000 ARS:', testParser(">500: +10% | <500: +$10000 ARS"));
console.log('Test 20 USD:', testParser("+$20 USD"));
console.log('Test No match:', testParser("some text"));
