// (C) 2015 chick307 <chick307@gmail.com>
// Licensed under the MIT License. http://chick307.mit-license.org/2015

import assert from 'power-assert';
import sinon from 'sinon';

import defaultExport, * as allExports from '../src/i6e';
import { Iterable } from '../src/iterable';

describe('Iterable class', () => {
    it('be exported', () => {
        assert(Iterable === defaultExport);
        assert(Iterable === allExports.Iterable);
    });

    it('implements @@iterator', () => {
        const a = new Iterable(() => {
            let x = 0;
            return {
                next: () => ++x === 4 ?
                    { done: true, value: undefined } :
                    { done: false, value: x }
            };
        });
        const i = a[Symbol.iterator]();
        assert.deepEqual(i.next(), { done: false, value: 1 });
        let n = 2;
        for (const x of i)
            assert(x === n++);
        assert.deepEqual(i.next(), { done: true, value: undefined });
    });

    describe('empty static method', () => {
        it('creates Iterable from iterable', () => {
            const r = Iterable.empty();
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), []);
        });
    });

    describe('from static method', () => {
        it('creates Iterable from iterable', () => {
            const r = Iterable.from([1, 2, 3]);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3]);
        });
    });

    describe('of static method', () => {
        it('creates Iterable from iterable', () => {
            const r = Iterable.of(1, 2, 3);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3]);
        });
    });

    describe('range static method', () => {
        it('creates Iterable from end value', () => {
            const r = Iterable.range(3);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [0, 1, 2]);
        });

        it('creates Iterable from start and end value', () => {
            const r = Iterable.range(1, 5);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3, 4]);
        });

        it('creates Iterable from start, end, and step value', () => {
            const r = Iterable.range(0, -20, -5);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [0, -5, -10, -15]);
        });
    });

    describe('zip static method', () => {
        it('creates Iterable of array from iterables', () => {
            const r = Iterable.zip([1, 2, 3], [4, 5, 6], [7, 8, 9]);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
        });

        context('when lengths of iterables are varying', () => {
            it('fit to shortest one', () => {
                const r = Iterable.zip([1, 2, 3], [4, 5], [6, 7, 8, 9]);
                assert(r instanceof Iterable);
                assert.deepEqual(Array.from(r), [[1, 4, 6], [2, 5, 7]]);
            });
        });
    });

    describe('addFirst method', () => {
        it('creates added iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.addFirst(-2, -1, 0);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [-2, -1, 0, 1, 2, 3]);
        });
    });
});
