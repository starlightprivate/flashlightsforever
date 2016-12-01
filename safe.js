// https://www.npmjs.com/package/safe-regex
// Detect possibly catastrophic, exponential-time regular expressions

/* Sample Test;
 In the Console

$ node safe.js '(x+x+)+y'
false

$ node safe.js '(beep|boop)*'
true

$ node safe.js '(a+){10}'
false

$ node safe.js '\blocation\s*:[^:\n]+\b(Oakland|San Francisco)\b'
true
*/

var safe = require('safe-regex');
var regex = process.argv.slice(2).join(' ');
console.log(safe(regex));