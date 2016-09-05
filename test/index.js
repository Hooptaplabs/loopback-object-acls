
const {expect, describeAuto, prettyError} = require('./utils');

prettyError.attach();

describeAuto(__dirname, ['utils']);

//describe('supermodulo', () => {
//
//	it('hola', () => {
//	    expect('hola').to.deep.equal('hola');
//	});
//
//
//
//
//});
