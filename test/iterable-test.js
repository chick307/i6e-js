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
});
