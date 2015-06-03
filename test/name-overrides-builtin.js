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
        var documentProperties = getAllPropertyNames(document);
        var formProperties = getAllPropertyNames(document.createElement('form'));

        // These are inconsistent between browsers:
        var skipFormFalseCheck = [
                // On document but not on form in chrome 43:
                'onpointerlockchange',
                'onpointerlockerror',
                'onselectionchange',
                'all', // also firefox

                // On document but not on form in firefox 38:
                'onbeforescriptexecute',

                // On document but not on form in firefox 24 (present in firefox 17):
                'onafterscriptexecute',

                // On document but not on form in IE 11:
                'onstop',
                'onstoragecommit',

                // On document but not on form in IE 10:
                'hidden',

                // on document & form in IE 9:
                'readyState',
                'onreadystatechange'
        ];

        var skipDocumentFalseCheck = [
                // On form but not document in jsdom:
                'dir',
                'prefix', // (also chrome 43)
                'localName',
                'namespaceURI',

                // On form but not document in lots of browsers:
                'attributes',
                'hasAttributes',
                'childElementCount',
                'children',
                'firstElementChild',
                'lastElementChild',
                'parentElement',
                'focus',
                'contains',

                // On form but not document in IE 11:
                'onbeforecopy',
                'onbeforecut',
                'onbeforepaste',
                'oncopy',
                'oncuechange',
                'oncut',
                'ongotpointercapture',
                'onmouseenter',
                'onmouseleave',
                'onpaste',
                'releasePointerCapture',

                // On form but not document in IE 9:
                'onresize',

                // On form but not on document in Safari 5.1:
                'hidden',

                // On form but not document in firefox 23:
                'QueryInterface',
                'getUserData',
                'setUserData',

                // on form but not document in chrome 35
                'onautocomplete',
                'onautocompleteerror'
        ];

        documentProperties.forEach(function (name)
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

                it('overridesBuiltin("' + name + '", "HTMLDocument") === true', function()
                {
                        assert.strictEqual(overridesBuiltin(name, 'HTMLDocument'), true);
                        assert.strictEqual(overridesBuiltin(name, 'document'), true);
                });

                it('overridesBuiltin("' + name + '") === true', function()
                {
                        assert.strictEqual(overridesBuiltin(name), true);
                });

                if (formProperties.indexOf(name) < 0 && skipFormFalseCheck.indexOf(name) < 0)
                {
                        it('overridesBuiltin("' + name + '", "HTMLFormElement") === false', function()
                        {
                                assert.strictEqual(overridesBuiltin(name, 'HTMLFormElement'), false);
                        });
                }
        });

        formProperties.forEach(function (name)
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

                it('overridesBuiltin("' + name + '", "HTMLFormElement") === true', function()
                {
                        assert.strictEqual(overridesBuiltin(name, 'HTMLFormElement'), true);
                        assert.strictEqual(overridesBuiltin(name, 'form'), true);
                });

                it('overridesBuiltin("' + name + '") === true', function()
                {
                        assert.strictEqual(overridesBuiltin(name), true);
                });

                if (documentProperties.indexOf(name) < 0 && skipDocumentFalseCheck.indexOf(name) < 0)
                {
                        it('overridesBuiltin("' + name + '", "HTMLDocument") === false', function()
                        {
                                assert.strictEqual(overridesBuiltin(name, 'HTMLDocument'), false);
                        });
                }
        });


        it('overridesBuiltin("foo", "HTMLDocument") === false', function()
        {
                assert.strictEqual(overridesBuiltin('foo'), false);
        });

        it('overridesBuiltin("bar", "HTMLDocument") === false', function()
        {
                assert.strictEqual(overridesBuiltin('bar'), false);
        });

        it('overridesBuiltin("firstchild", "HTMLDocument") === false', function()
        {
                assert.strictEqual(overridesBuiltin('firstchild'), false);
        });

        it('overridesBuiltin("", "HTMLDocument") === false', function()
        {
                assert.strictEqual(overridesBuiltin(''), false);
        });
});