
**kor** is a JavaScript library supporting reactive programming. It is actually
just a tiny subset of the excellent **Knockout** library with all the stuff to
do with binding to the DOM removed. This is because there are several ways to
achieve the DOM-binding part (for example, React) but which lack anything as
mature or helpful as Knockout's reactive programming support.

By cutting Knockout down to its core (or *kor*?) we end up with a library that
is only 5.4 KB in size (minified+gzipped) and yet supplies the support needed
for convenient reactive programming.

## Authorship

Given kor's obvious direct heritage, it would be ridiculous for me to claim
authorship - I just deleted a bunch of stuff. At the same time the Knockout
team have not decided to create this subset so they should not be blamed for
any shortcomings it suffers from.

Therefore to give credit and blame where its due, let's say:

> Copyright (c) Steven Sanderson, the Knockout.js team, and other contributors
http://knockoutjs.com/, with parts deleted by Daniel Earwicker

## License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

## What survived?

The surviving functions work exactly the same as in Knockout. The only
difference is that when loaded by a script tag in the browser, the root object
is called `kor` instead of `ko`, to avoid collision with Knockout:

* `kor.observable`
* `kor.observableArray`
* `kor.computed` and `kor.pureComputed` (prefer the latter)
* `kor.extenders` and built-ins such as `throttle`, `rateLimit`
* `kor.unwrap` and `kor.peekObservable`
* `kor.toJS`

As a bonus, I've also integrated the
[knockout.clear](https://github.com/danielearwicker/knockout.clear) extension
that I put together with a lot of help from
[Michael Best](https://github.com/mbest) of the Knockout team, so that includes:

* `kor.unpromise`
* `kor.execute`

You can find complete documentation for all these features in their respective
source libraries:

* [knockoutjs.com](http://knockoutjs.com/)
* [knockout.clear](https://github.com/danielearwicker/knockout.clear)

## Using with Knockout plugins

There are extension libraries that work alongside Knockout, such as
[Mapping](http://knockoutjs.com/documentation/plugins-mapping.html)

In the browser, if you are just using a `script` tag to import kor, you would
need to "rename" kor by doing this before you load any extension libraries:

    window.ko = window.kor;

Of course, this is only useful if the extension library is satisfied by the
subset retained in kor.

(NB. I'm planning to fix knockout.clear so it automatically works with kor).

## TypeScript

There are type declarations in the `typings` folder.
