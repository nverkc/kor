
function ignore() {}

// Creates a computed that is not designed to have a return value, just
// side-effects. It must be given a pureComputed that keeps it awake.
ko.execute = function(pureComputed, evaluator, thisObj) {

    if (!ko.isPureComputed(pureComputed)) {
        throw new Error("ko.execute must be passed a ko.pureComputed");
    }

    var internalComputed = ko.pureComputed(evaluator, thisObj);

    var disposable;
    function wake() {
        if (!disposable) {
            disposable = internalComputed.subscribe(ignore);
        }
    }

    // Should we start in the awake state?
    if (pureComputed.getSubscriptionsCount("change") !== 0) {
        wake();
    }

    pureComputed.subscribe(wake, null, "awake");
    pureComputed.subscribe(function() {
        if (disposable) {
            disposable.dispose();
            disposable = null;
        }
    }, null, "asleep");

    return internalComputed;
}

// ko.unpromise:
//
// Returns a pureComputed, using an evaluator function that may return
//  a promise (or thenable). The promise is unwrapped and supplies the
// value of the returned pureComputed.
//
// The second argument is optional, and may be an object containing any
// of these optional properties:
//
//     initialValue - the value of the returned pureComputed prior to
//                    promise being resolved
//
//     errorValue   - the value of the returned pureComputed if the
//                    promise is rejected
//
//     thisArg      - the 'this' argument for the evaluator function
//
// If no errorValue is specified, initialValue is used instead. If no
// initialValue is specified, undefined is used instead.
ko.unpromise = function(evaluator, options) {
    var latest = ko.observable(options && options['initialValue']),
        waitingOn = 0,
        result = ko.pureComputed(latest),
        errorValue = options && (options['errorValue'] || options['initialValue'])

    ko.execute(result, function() {
        var p = evaluator.call(options && options['.thisArg']);
        var w = ++waitingOn;
        if (p.then) {
            p.then(function(v) {
                if (w === waitingOn) {
                    latest(v);
                }
            }, function() {
                if (w === waitingOn) {
                    latest(errorValue);
                }
            });
        } else {
            latest(p);
        }
    });
    return result;
}

ko.exportSymbol('execute', ko.execute);
ko.exportSymbol('unpromise', ko.unpromise);
