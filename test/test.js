var chai = require('chai');
var assert = chai.assert;
var fs = require('fs');
var vm = require('vm');
var path = './public/js/utilities.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);


chai.config.truncateThreshold = 0;

V1 = new Vector(2, 2);
V2 = new Vector(3, 3);

describe('Vector', function () {
    describe(':Add()', function () {
        it('Should return a vector (A1+B1, A2+B2)', function () {
            assert.equal(V1.Add(V2)).to.deep.equal(new Vector(5,5));
        });
    })
})