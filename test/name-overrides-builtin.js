'use strict';
var assert = require('assert');
var overridesBuiltin = require('..');

function getAllPropertyNames()
{
        var names = [];

        for (var i = 0; i < arguments.length; ++i)
        {
                var obj = arguments[i];

                while (obj)
                {
                        names = names.concat(Object.getOwnPropertyNames(obj));
                        obj = Object.getPrototypeOf(obj);
                }
        }

        names.sort();
        return names.filter(function(name, index, names)
        {
                return index === 0 || names[index - 1] !== name;
        });
}

describe('name-overrides-builtin', function()
{
        var document = global.document || require('jsdom').jsdom('<html/>');

        it('Should return true for properties that are a builtin', function()
        {
                getAllPropertyNames(document).forEach(function (name)
                {
                        if (require('jsdom').jsdom && name[0] === '_')
                        {
                                // skip jsdom interal property
                                // (also, jsdom does not support [OverrideBuiltins] yet)
                                return;
                        }

                        if (name[0] === '@' && name[1] === '@')
                        {
                                // skip properties added by es6-symbol polyfill
                                return;
                        }

                        assert.strictEqual(overridesBuiltin(name), true, name + ' should return true (document)');
                });

                getAllPropertyNames(document.createElement('form')).forEach(function (name)
                {
                        if (require('jsdom').jsdom && name[0] === '_')
                        {
                                // skip jsdom interal property
                                // (also, jsdom does not support [OverrideBuiltins] yet)
                                return;
                        }

                        if (name[0] === '@' && name[1] === '@')
                        {
                                // skip properties added by es6-symbol polyfill
                                return;
                        }

                        assert.strictEqual(overridesBuiltin(name), true, name + ' should return true (form)');
                });
        });

        it('Should return false for properties that are not a builtin', function()
        {
                assert.strictEqual(overridesBuiltin('foo'), false, 'foo should be allowed');
                assert.strictEqual(overridesBuiltin('firstchild'), false, 'match should be case sensitive');
                assert.strictEqual(overridesBuiltin('bar'), false, 'bar should be allowed');
                assert.strictEqual(overridesBuiltin(''), false, 'empty string should be allowed');
        });
});