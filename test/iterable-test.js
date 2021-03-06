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

    describe('addLast method', () => {
        it('creates added iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.addLast(4, 5, 6);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3, 4, 5, 6]);
        });
    });

    describe('chunk method', () => {
        it('creates chunked iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.chunk(2);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [[1, 2], [3]]);
        });
    });

    describe('concat method', () => {
        it('creates concatenated iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2]; });
            const b = new Iterable(function*() { yield* [3, 4]; });
            const c = new Iterable(function*() { yield* [[5], 6]; });
            const r = a.concat(b, c);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3, 4, [5], 6]);
        });
    });

    describe('drop method', () => {
        it('creates dropped iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.drop(2);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [3]);
        });
    });

    describe('dropWhile method', () => {
        it('creates dropped iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x < 2);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.dropWhile(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [2, 3]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.callCount === 2);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('every method', () => {
        context('when some values do not meet the condition', () => {
            it('returns false', () => {
                const receiver = {};
                const spy = sinon.spy((x) => x % 2 == 1);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.every(spy, receiver) === false);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.callCount === 2);
                assert(spy.alwaysCalledOn(receiver));
            });
        });

        context('when every values meet the condition', () => {
            it('returns true', () => {
                const receiver = {};
                const spy = sinon.spy(() => true);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.every(spy, receiver) === true);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.getCall(2).calledWithExactly(3));
                assert(spy.callCount === 3);
                assert(spy.alwaysCalledOn(receiver));
            });
        });
    });

    describe('fill', () => {
        it('fills with value from start index to end index', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3, 4, 5]; });
            const r = a.fill(0, 2, 4);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 0, 0, 5]);
        });

        it('fills with value from start index', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3, 4, 5]; });
            const r = a.fill(0, 2);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 0, 0, 0]);
        });

        it('fills with value', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3, 4, 5]; });
            const r = a.fill(0);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [0, 0, 0, 0, 0]);
        });
    });

    describe('filter method', () => {
        it('creates filtered iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x % 2 === 1);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.filter(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 3]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.getCall(2).calledWithExactly(3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('find method', () => {
        it('find a first value which meet the condition', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x >= 2);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.find(spy, receiver) === 2);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.callCount === 2);
            assert(spy.alwaysCalledOn(receiver));
        });

        context('when no values meet the condition', () => {
            it('returns undefined', () => {
                const receiver = {};
                const spy = sinon.spy(() => false);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.find(spy, receiver) === undefined);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.getCall(2).calledWithExactly(3));
                assert(spy.callCount === 3);
                assert(spy.alwaysCalledOn(receiver));
            });
        });
    });

    describe('findIndex method', () => {
        it('find a first value which meet the condition', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x >= 2);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.findIndex(spy, receiver) === 1);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.callCount === 2);
            assert(spy.alwaysCalledOn(receiver));
        });

        context('when no values meet the condition', () => {
            it('returns -1', () => {
                const receiver = {};
                const spy = sinon.spy(() => false);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.findIndex(spy, receiver) === -1);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.getCall(2).calledWithExactly(3));
                assert(spy.callCount === 3);
                assert(spy.alwaysCalledOn(receiver));
            });
        });
    });

    describe('first method', () => {
        it('returns first value', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.first(4) === 1);
        });

        context('when empty', () => {
            it('returns first argument', () => {
                const a = new Iterable(function*() {});
                assert(a.first(4) === 4);
            });
        });
    });

    describe('flatMap method', () => {
        it('creates tranformed iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x) => [x * 2, x * 2 + 1]);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.flatMap(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [2, 3, 4, 5, 6, 7]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.getCall(2).calledWithExactly(3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('flatten method', () => {
        const values = [1, [2, [3], [4, [5]]], 6];

        it('creates flat iterator', () => {
            const a = new Iterable(function*() { yield* values; });
            const r = a.flatten();
            assert.deepEqual(Array.from(r), [1, 2, 3, 4, 5, 6]);
        });

        context('when passed depth', () => {
            it('creates flat iterator', () => {
                const a = new Iterable(function*() { yield* values; });
                const r = a.flatten(2);
                assert.deepEqual(Array.from(r), [1, 2, 3, 4, [5], 6]);
            });
        });
    });

    describe('fold method', () => {
        it('fold values', () => {
            const receiver = {};
            const spy = sinon.spy((x, y) => x + y);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.fold(5, spy, receiver) === 11);
            assert(spy.getCall(0).calledWithExactly(5, 1));
            assert(spy.getCall(1).calledWithExactly(6, 2));
            assert(spy.getCall(2).calledWithExactly(8, 3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('forEach method', () => {
        it('iterates over passed generator', () => {
            const receiver = {};
            const spy = sinon.spy();
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            a.forEach(spy, receiver);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.getCall(2).calledWithExactly(3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('includes method', () => {
        context('when iterator has the value', () => {
            it('returns true', () => {
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.includes(2) === true);
            });
        });

        context('when iterator does not have the value', () => {
            it('returns false', () => {
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.includes(4) === false);
            });
        });
    });

    describe('indexOf method', () => {
        it('finds the value and returns the index', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.indexOf(2) === 1);
        });

        context('when the value is not found', () => {
            it('returns -1', () => {
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                assert(a.indexOf(4) === -1);
            });
        });
    });

    describe('isEmpty method', () => {
        context('when isEmpty', () => {
            it('returns true', () => {
                const a = new Iterable(function*() {});
                assert(a.isEmpty() === true);
            });
        });

        context('when no isEmpty', () => {
            it('returns false', () => {
                const spy = sinon.spy();
                const a = new Iterable(function*() {
                    yield spy();
                    yield spy();
                });
                assert(a.isEmpty() === false);
                assert(spy.callCount === 1);
            });
        });
    });

    describe('last method', () => {
        it('returns last value', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.last(4) === 3);
        });

        context('when empty', () => {
            it('returns first argument', () => {
                const a = new Iterable(function*() {});
                assert(a.last(4) === 4);
            });
        });
    });

    describe('lastIndexOf method', () => {
        it('finds the value and returns the last index', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3, 1, 2, 3]; });
            assert(a.lastIndexOf(2) === 4);
        });

        context('when the value is not found', () => {
            it('returns -1', () => {
                const a =
                    new Iterable(function*() { yield* [1, 2, 3, 1, 2, 3]; });
                assert(a.lastIndexOf(4) === -1);
            });
        });
    });

    describe('map method', () => {
        it('creates transformed iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x * x);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.map(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 4, 9]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.getCall(2).calledWithExactly(3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('repeat method', () => {
        it('repeats the values passed times', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.repeat(3);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3, 1, 2, 3, 1, 2, 3]);
        });

        it('returns empty when 0 passed', () => {
            const spy = sinon.spy(() => 1);
            const a = new Iterable(function*() { yield spy(); });
            const r = a.repeat(0);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), []);
            assert(spy.callCount === 0);
        });

        it('repeats the values infinitely', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.repeat();
            assert(r instanceof Iterable);
            const iter = r[Symbol.iterator]();
            for (let i = 0; i < 0xFF; i++) {
                assert.deepEqual(iter.next(), { done: false, value: 1 });
                assert.deepEqual(iter.next(), { done: false, value: 2 });
                assert.deepEqual(iter.next(), { done: false, value: 3 });
            }
        });
    });

    describe('scan method', () => {
        it('creates transformed iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x, y) => x + y);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.scan(0, spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 3, 6]);
            assert(spy.getCall(0).calledWithExactly(0, 1));
            assert(spy.getCall(1).calledWithExactly(1, 2));
            assert(spy.getCall(2).calledWithExactly(3, 3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('size method', () => {
        it('returns length', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.size() === 3);
        });
    });

    describe('some method', () => {
        context('when some values meet the condition', () => {
            it('returns true', () => {
                const receiver = {};
                const spy = sinon.spy((x) => x % 2 == 0);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                const r = a.some(spy, receiver);
                assert(r === true);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.callCount === 2);
                assert(spy.alwaysCalledOn(receiver));
            });
        });

        context('when every values do not meet the condition', () => {
            it('returns false', () => {
                const receiver = {};
                const spy = sinon.spy(() => false);
                const a = new Iterable(function*() { yield* [1, 2, 3]; });
                const r = a.some(spy, receiver);
                assert(r === false);
                assert(spy.getCall(0).calledWithExactly(1));
                assert(spy.getCall(1).calledWithExactly(2));
                assert(spy.getCall(2).calledWithExactly(3));
                assert(spy.callCount === 3);
                assert(spy.alwaysCalledOn(receiver));
            });
        });
    });

    describe('spread method', () => {
        it('calls argument with generated values', () => {
            const receiver = {};
            const returnValue = {};
            const spy = sinon.spy(() => returnValue);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            assert(a.spread(spy, receiver) === returnValue);
            assert(spy.getCall(0).calledWithExactly(1, 2, 3));
            assert(spy.getCall(0).calledOn(receiver));
            assert(spy.callCount === 1);
        });
    });

    describe('take method', () => {
        it('creates new iterator', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.take(2);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2]);
        });
    });

    describe('takeWhile method', () => {
        it('creates new iterator', () => {
            const receiver = {};
            const spy = sinon.spy((x) => x < 2);
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.takeWhile(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.callCount === 2);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('tap method', () => {
        it('creates new iterator', () => {
            const receiver = {};
            const spy = sinon.spy();
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.tap(spy, receiver);
            assert(r instanceof Iterable);
            assert.deepEqual(Array.from(r), [1, 2, 3]);
            assert(spy.getCall(0).calledWithExactly(1));
            assert(spy.getCall(1).calledWithExactly(2));
            assert(spy.getCall(2).calledWithExactly(3));
            assert(spy.callCount === 3);
            assert(spy.alwaysCalledOn(receiver));
        });
    });

    describe('toArray method', () => {
        it('returns an array', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3]; });
            const r = a.toArray();
            assert(r instanceof Array);
            assert.deepEqual(r, [1, 2, 3]);
        });
    });

    describe('toMap method', () => {
        it('returns an array', () => {
            const a = new Iterable(function*() { yield* [[1, 2], [3, 4]]; });
            const r = a.toMap();
            assert(r instanceof Map);
            assert.deepEqual(Array.from(r), [[1, 2], [3, 4]]);
        });
    });

    describe('toSet method', () => {
        it('returns an array', () => {
            const a = new Iterable(function*() { yield* [1, 2, 3, 1, 2, 3]; });
            const r = a.toSet();
            assert(r instanceof Set);
            assert.deepEqual(Array.from(r), [1, 2, 3]);
        });
    });
});
