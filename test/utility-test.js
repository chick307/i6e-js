// (C) 2015 chick307 <chick307@gmail.com>
// Licensed under the MIT License. http://chick307.mit-license.org/2015

import assert from 'power-assert';

import * as allExports from '../src/i6e';
import * as utility from '../src/utility';

describe('utility module', () => {
    describe('flatten function', () => {
        it('generates flatten values', () => {
            const r = utility.flatten(2, [[0, 1], 2, [[3, 4], [5, [6]]]]);
            assert.deepEqual(Array.from(r), [0, 1, 2, [3, 4], [5, [6]]]);
        });
    });

    describe('isFunction function', () => {
        context('when passed a value is function', () => {
            it('returns true', () => {
                assert(utility.isFunction(function*() {}) === true);
                assert(utility.isFunction(function() {}) === true);
                assert(utility.isFunction(() => {}) === true);
            });
        });

        context('when passed a value is not function', () => {
            it('returns false', () => {
                assert(utility.isFunction(null) === false);
                assert(utility.isFunction({}) === false);
            });
        });
    });

    describe('isIterable function', () => {
        it('is exported', () => {
            assert(allExports.isIterable === utility.isIterable);
        });

        context('when passed a value is iterable', () => {
            it('returns true', () => {
                assert(utility.isIterable(function*() {}()) === true);
                assert(utility.isIterable({
                    [Symbol.iterator]: () => {}
                }) === true);
            });
        });

        context('when passed a value is not iterable', () => {
            it('returns false', () => {
                assert(utility.isIterable(null) === false);
                assert(utility.isIterable({}) === false);
            });
        });
    });

    describe('isIterator function', () => {
        it('is exported', () => {
            assert(allExports.isIterator === utility.isIterator);
        });

        context('when passed a value is iterator', () => {
            it('returns true', () => {
                assert(utility.isIterator(function*() {}()) === true);
                assert(utility.isIterator({
                    next: () => {}
                }) === true);
            });
        });

        context('when passed a value is not iterator', () => {
            it('returns false', () => {
                assert(utility.isIterator(null) === false);
                assert(utility.isIterator({}) === false);
            });
        });
    });

    describe('isNumber function', () => {
        context('when passed a value is iterable', () => {
            it('returns true', () => {
                assert(utility.isNumber(0) === true);
                assert(utility.isNumber(1) === true);
                assert(utility.isNumber(-1) === true);
                assert(utility.isNumber(1.5) === true);
                assert(utility.isNumber(Infinity) === true);
            });
        });

        context('when passed a value is not number', () => {
            it('returns false', () => {
                assert(utility.isNumber(null) === false);
                assert(utility.isNumber({}) === false);
                assert(utility.isNumber(NaN) === false);
            });
        });
    });

    describe('isPositiveInteger function', () => {
        context('when passed value is a positive integer', () => {
            it('returns true', () => {
                assert(utility.isPositiveInteger(0) === true);
                assert(utility.isPositiveInteger(12) === true);
            });
        });

        context('when passed value is not a positive integer', () => {
            it('returns false', () => {
                assert(utility.isPositiveInteger(null) === false);
                assert(utility.isPositiveInteger({}) === false);
                assert(utility.isPositiveInteger(NaN) === false);
                assert(utility.isPositiveInteger(Infinity) === false);
                assert(utility.isPositiveInteger(-1) === false);
                assert(utility.isPositiveInteger(1.5) === false);
            });
        });
    });
});
