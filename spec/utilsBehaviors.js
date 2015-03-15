describe('unwrapObservable', function() {
    it('Should return the underlying value of observables', function() {
        var someObject = { abc: 123 },
            observablePrimitiveValue = ko.observable(123),
            observableObjectValue = ko.observable(someObject),
            observableNullValue = ko.observable(null),
            observableUndefinedValue = ko.observable(undefined),
            computedValue = ko.computed(function() { return observablePrimitiveValue() + 1; });

        expect(ko.utils.unwrapObservable(observablePrimitiveValue)).toBe(123);
        expect(ko.utils.unwrapObservable(observableObjectValue)).toBe(someObject);
        expect(ko.utils.unwrapObservable(observableNullValue)).toBe(null);
        expect(ko.utils.unwrapObservable(observableUndefinedValue)).toBe(undefined);
        expect(ko.utils.unwrapObservable(computedValue)).toBe(124);
    });

    it('Should return the supplied value for non-observables', function() {
        var someObject = { abc: 123 };

        expect(ko.utils.unwrapObservable(123)).toBe(123);
        expect(ko.utils.unwrapObservable(someObject)).toBe(someObject);
        expect(ko.utils.unwrapObservable(null)).toBe(null);
        expect(ko.utils.unwrapObservable(undefined)).toBe(undefined);
    });

    it('Should be aliased as ko.unwrap', function() {
        expect(ko.unwrap).toBe(ko.utils.unwrapObservable);
        expect(ko.unwrap(ko.observable('some value'))).toBe('some value');
    });
});

describe('arrayForEach', function () {
    it('Should go call the callback for each element of the array, in order', function () {
        var callback = jasmine.createSpy('callback');

        ko.utils.arrayForEach(["a", "b", "c"], callback);

        expect(callback.calls.length).toBe(3);
        expect(callback.calls[0].args).toEqual(["a", 0]);
        expect(callback.calls[1].args).toEqual(["b", 1]);
        expect(callback.calls[2].args).toEqual(["c", 2]);
    });

    it('Should do nothing with empty arrays', function () {
        var callback = jasmine.createSpy('callback');

        ko.utils.arrayForEach([], callback);

        expect(callback).not.toHaveBeenCalled();
    });
});

describe('arrayIndexOf', function () {
    it('Should return the index if the element is found in the input array', function () {
        var result = ko.utils.arrayIndexOf(["a", "b", "c"], "b");
        expect(result).toBe(1);
    });

    it('Should return -1 for empty arrays', function () {
        var result = ko.utils.arrayIndexOf([], "a");
        expect(result).toBe(-1);
    });

    it('Should return -1 if the element is not found', function () {
        var result = ko.utils.arrayIndexOf(["a", "b", "c"], "d");
        expect(result).toBe(-1);
    });

    it('Should return the first index if the element is found twice', function () {
        var result = ko.utils.arrayIndexOf(["a", "b", "c", "c"], "c");
        expect(result).toBe(2);
    });
});

describe('arrayRemoveItem', function () {
    it('Should remove the matching element if found', function () {
        var input = ["a", "b", "c"];
        ko.utils.arrayRemoveItem(input, "a");
        expect(input).toEqual(["b", "c"]);
    });

    it('Should do nothing for empty arrays', function () {
        var input = [];
        ko.utils.arrayRemoveItem(input, "a");
        expect(input).toEqual([]);
    });

    it('Should do nothing if no matching element is found', function () {
        var input = ["a", "b", "c"];
        ko.utils.arrayRemoveItem(input, "d");
        expect(input).toEqual(["a", "b", "c"]);
    });

    it('Should remove only the first matching element', function () {
        var input = ["a", "b", "b", "c"];
        ko.utils.arrayRemoveItem(input, "b");
        expect(input).toEqual(["a", "b", "c"]);
    });
});

describe('Function.bind', function() {
    // In most browsers, this will be testing the native implementation
    // Adapted from Lo-Dash (https://github.com/lodash/lodash)
    function fn() {
        var result = [this];
        result.push.apply(result, arguments);
        return result;
    }

    it('should bind a function to an object', function () {
        var object = {},
            bound = fn.bind(object);

        expect(bound('a')).toEqual([object, 'a']);
    });

    it('should accept a falsey `thisArg` argument', function () {
        ko.utils.arrayForEach(['', 0, false, NaN], function (value) {
            var bound = fn.bind(value);
            expect(bound()[0].constructor).toEqual(Object(value).constructor);
        });
    });

    it('should bind a function to `null` or `undefined`', function () {
        var bound = fn.bind(null),
            actual = bound('a'),
            global = jasmine.getGlobal();

        expect(actual[0]).toEqualOneOf([null, global]);
        expect(actual[1]).toEqual('a');

        bound = fn.bind(undefined);
        actual = bound('b');

        expect(actual[0]).toEqualOneOf([undefined, global]);
        expect(actual[1]).toEqual('b');

        bound = fn.bind();
        actual = bound('b');

        expect(actual[0]).toEqualOneOf([undefined, global]);
        expect(actual[1]).toEqual('b');
    });

    it('should partially apply arguments', function () {
        var object = {},
            bound = fn.bind(object, 'a');

        expect(bound()).toEqual([object, 'a']);

        bound = fn.bind(object, 'a');
        expect(bound('b')).toEqual([object, 'a', 'b']);

        bound = fn.bind(object, 'a', 'b');
        expect(bound()).toEqual([object, 'a', 'b']);
        expect(bound('c', 'd')).toEqual([object, 'a', 'b', 'c', 'd']);
    });

    it('should append array arguments to partially applied arguments', function () {
        var object = {},
            bound = fn.bind(object, 'a');

        expect(bound(['b'], 'c')).toEqual([object, 'a', ['b'], 'c']);
    });

    it('should rebind functions correctly', function () {
        var object1 = {},
            object2 = {},
            object3 = {};

        var bound1 = fn.bind(object1),
            bound2 = bound1.bind(object2, 'a'),
            bound3 = bound1.bind(object3, 'b');

        expect(bound1()).toEqual([object1]);
        expect(bound2()).toEqual([object1, 'a']);
        expect(bound3()).toEqual([object1, 'b']);
    });
});
