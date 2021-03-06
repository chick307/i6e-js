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

    static zip(...values) {
        assert(values.every(utility.isIterable));
        return new Iterable(function*() {
            const as = values.map((x) => x[Symbol.iterator]());
            for (;;) {
                const xs = as.map((a) => a.next());
                if (xs.some((x) => x.done))
                    return xs.map((x) => x.value);
                yield xs.map((x) => x.value);
            }
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

    addFirst(...values) {
        const self = this;
        return new Iterable(function*() {
            yield* values;
            yield* self;
        });
    }

    addLast(...values) {
        const self = this;
        return new Iterable(function*() {
            yield* self;
            yield* values;
        });
    }

    chunk(count) {
        assert(isFinite(count));
        const self = this;
        return new Iterable(function*() {
            const xs = self[Symbol.iterator]();
            for (const x of xs) {
                const c = [x];
                for (let i = 1; i < count; i++) {
                    const { done, value } = xs.next();
                    if (done)
                        break;
                    c.push(value);
                }
                yield c;
            }
        });
    }

    concat(...iterables) {
        assert(iterables.every(utility.isIterable));
        const self = this;
        return new Iterable(function*() {
            yield* self;
            for (const xs of iterables)
                yield* xs;
        });
    }

    drop(count) {
        assert(utility.isNumber(count));
        const self = this;
        return new Iterable(function*() {
            const xs = self[Symbol.iterator]();
            for (let i = 0; i < count && !xs.next().done; i++);
            yield* xs;
        });
    }

    dropWhile(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            const xs = self[Symbol.iterator]();
            for (const x of xs) {
                if (func.call(receiver, x))
                    continue;
                yield x;
                break;
            }
            yield* xs;
        });
    }

    every(func, receiver) {
        assert(utility.isFunction(func));
        for (const x of this) {
            if (!func.call(receiver, x))
                return false;
        }
        return true;
    }

    fill(value, start = 0, end = Infinity) {
        assert(utility.isNumber(start));
        assert(utility.isNumber(end));
        const self = this;
        return new Iterable(function*() {
            let i = 0;
            for (const x of self) {
                yield (start <= i && i < end) ? value : x;
                i++;
            }
        });
    }

    filter(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            for (const x of self) {
                if (func.call(receiver, x))
                    yield x;
            }
        });
    }

    find(func, receiver) {
        assert(utility.isFunction(func));
        for (const x of this) {
            if (func.call(receiver, x))
                return x;
        }
    }

    findIndex(func, receiver) {
        assert(utility.isFunction(func));
        let i = 0;
        for (const x of this) {
            if (func.call(receiver, x))
                return i;
            i++;
        }
        return -1;
    }

    first(defaultValue) {
        for (const x of this)
            return x;
        return defaultValue;
    }

    flatMap(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            for (const x of self)
                yield* utility.flatten(1, func.call(receiver, x));
        });
    }

    flatten(depth = Infinity) {
        assert(utility.isNumber(depth));
        const self = this;
        return new Iterable(function*() {
            for (const x of self)
                yield* utility.flatten(depth, x);
        });
    }

    fold(initialValue, func, receiver) {
        assert(utility.isFunction(func));
        let v = initialValue;
        for (const x of this)
            v = func.call(receiver, v, x);
        return v;
    }

    forEach(func, receiver) {
        assert(utility.isFunction(func));
        for (const x of this)
            func.call(receiver, x);
    }

    includes(value) {
        for (const x of this) {
            if (x === value)
                return true;
        }
        return false;
    }

    indexOf(value) {
        let i = 0;
        for (const x of this) {
            if (x === value)
                return i;
            i++;
        }
        return -1;
    }

    isEmpty() {
        for (const _ of this)
            return false;
        return true;
    }

    last(value) {
        let x = value;
        for (x of this);
        return x;
    }

    lastIndexOf(value) {
        let n = -1;
        let i = 0;
        for (const x of this) {
            if (x === value)
                n = i;
            i++;
        }
        return n;
    }

    map(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            for (const x of self)
                yield func.call(receiver, x);
        });
    }

    repeat(count = Infinity) {
        assert(utility.isNumber(count));
        const self = this;
        return new Iterable(function*() {
            if (count < 1)
                return;

            const xs = [];
            for (const x of self) {
                yield x;
                xs.push(x);
            }

            for (let i = 1; i < count; i++)
                yield* xs;
        });
    }

    scan(defaultValue, func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            let v = defaultValue;
            for (const x of self)
                yield v = func.call(receiver, v, x);
        });
    }

    size() {
        let i = 0;
        for (const _ of this)
            i++;
        return i;
    }

    some(func, receiver) {
        assert(utility.isFunction(func));
        for (const x of this) {
            if (func.call(receiver, x))
                return true;
        }
        return false;
    }

    spread(func, receiver) {
        assert(utility.isFunction(func));
        return func.call(receiver, ...this);
    }

    take(count) {
        assert(utility.isNumber(count));
        const self = this;
        return new Iterable(function*() {
            let n = 0;
            for (const x of self) {
                if (n++ >= count)
                    break;
                yield x;
            }
        });
    }

    takeWhile(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            for (const x of self) {
                if (!func.call(receiver, x))
                    break;
                yield x;
            }
        });
    }

    tap(func, receiver) {
        assert(utility.isFunction(func));
        const self = this;
        return new Iterable(function*() {
            for (const x of self) {
                func.call(receiver, x);
                yield x;
            }
        });
    }

    toArray() {
        return [...this];
    }

    toMap() {
        return new Map(this);
    }

    toSet() {
        return new Set(this);
    }
}
