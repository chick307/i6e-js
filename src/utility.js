// (C) 2015 chick307 <chick307@gmail.com>
// Licensed under the MIT License. http://chick307.mit-license.org/2015

export function* flatten(depth, value) {
    if (depth < 1 || !isIterable(value)) {
        yield value;
    } else {
        for (const x of value)
            yield* flatten(depth - 1, x);
    }
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isIterable(value) {
    return value != null && typeof value[Symbol.iterator] === 'function';
}

export function isIterator(value) {
    return value != null && typeof value.next === 'function';
}

export function isNumber(value) {
    return typeof value === 'number' && value === value;
}

export function isPositiveInteger(value) {
    return value === value >>> 0;
}
