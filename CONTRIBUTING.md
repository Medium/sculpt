# Contributing

Questions, comments, bug reports, and pull requests are all welcome.  Submit them at [the project on GitHub](https://github.com/Medium/sculpt/).  If you haven't contributed to a [Medium](http://github.com/Medium/) project before please head over to the [Open Source Project](https://github.com/Medium/open-source#note-to-external-contributors) and fill out an contributor license agreement (it should be pretty painless).

Bug reports that include steps-to-reproduce (including code) are the best. Even better, make them in the form of pull requests.

## Workflow

### Pull requests

[Fork](https://github.com/Medium/sculpt/fork) the project on GitHub and make a pull request from your feature branch against the upstream master branch. Consider rebasing your branch onto the latest master before sending a pull request to make sure there are no merge conflicts, failing tests, or other regressions.

### Code style

Your code should pass JS Hint (part of the `npm test` script). When in doubt, try to follow existing conventions and these basic rules:

* Don't use semi-colons. We think our code looks sleeker without them.
* Indent using two spaces. Never use tabs.
* Delete trailing whitespace. It's ugly.
* Use spaces after the `function` keyword, like this: `function () {}`


## Documentation

### JSDoc

We use Closure-style [JSDoc](https://developers.google.com/closure/compiler/docs/js-for-compiler) for inline documentation. There is no formal guideline, but please try to follow the existing conventions for documentation. For example, function paramaters and return values should always be documented, and functions should also have a brief, clear description.

Use examples and in-line documentation when they're helpful. Avoid comments like `This adds 1 to the variable "i"`.

### Readme

If you introduce changes or new features that will affect users, consider updating or adding the relevant section of the [readme](https://github.com/Medium/sculpt/blob/master/README.md).

## Tests

### Unit tests

Tests use [Mocha](http://visionmedia.github.io/mocha/) and can be run with `npm test`. Tests will automatically be run on [Travis CI](https://travis-ci.org/Medium/sculpt) for new pull requests, and pull requests will only be merged if the tests pass.

New features and bug fixes should have new unit tests. Don't be afraid to make the tests fun to read, we will all be fine without another example of asserting "foobar" or "example data". I like Vampire Weekend lyrics. Be creative.
