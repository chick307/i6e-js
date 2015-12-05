// (C) 2015 chick307 <chick307@gmail.com>
// Licensed under the MIT License. http://chick307.mit-license.org/2015

import assert from 'power-assert';

import * as utility from './utility';

export class Iterable {
    constructor(generator) {
        assert(utility.isFunction(generator));
        this._generator = generator;
    }

    static empty() {
        return new Iterable(function*() {});
    }

    static from(iterable) {
        assert(utility.isIterable(iterable));
        return new Iterable(function*() {
            yield* iterable;
        });
    }

    static of(...values) {
        return new Iterable(function*() {
            yield* values;
        });
    }

    static range(start, end, step) {
        if (end == null) end = start, start = 0;
        if (step == null) step = Math.sign(end - start);
        assert(utility.isNumber(start));
        assert(utility.isNumber(end));
        assert(Math.sign(step) === Math.sign(end - start));
        const m = (end - start) / step;
        return new Iterable(function*() {
            let n = 0;
            while (n < m)
                yield start + n++ * step;
        });
    }

    [Symbol.iterator]() {
        const g = this._generator;
        const i = g();
        assert(i != null && typeof i.next === 'function');
        return {
            [Symbol.iterator]() {
                return this;
            },
            next(v) {
                const { done, value } = i.next(v);
                if (done)
                    this.next = () => ({ done: true, value: undefined });
                return { done, value };
            }
        };
    }
}
