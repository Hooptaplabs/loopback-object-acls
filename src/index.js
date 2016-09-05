/**
 * Created by desaroger on 3/09/16.
 */

const {prettyError} = require('./utils');
let {What} = require('./factories');

prettyError.attach();

console.log('what', What('epepe'));