name-overrides-builtin
======================
Test if a given name might override a property of a DOM Node marked as [`[OverrideBuiltins]`](http://www.w3.org/TR/WebIDL/#OverrideBuiltins). To be specific, `HTMLDocument` and `HTMLFormElement`. This package uses a list so that it works in javascript implementations that do not have DOM and to make sure the behaviour is consistent between browser versions.
 
[![Sauce Test Status](https://saucelabs.com/browser-matrix/nameoverridesbuiltin.svg)](https://saucelabs.com/u/nameoverridesbuiltin)

If an element qualifies as a [named property](http://www.w3.org/TR/WebIDL/#idl-named-properties) because of its _name_ or _id_ attribute, the value of that attribute is used to set a property on `HTMLDocument` and `HTMLFormElement` instances. This property overrides any built in property, such as `createElement`, `firstChild`, etc. For example:

```html
<img id="createElement">
<script>
        console.log(document.createElement.tagName); // IMG
</script>

<form id="myform">
        <input name="childNodes">
</form>
<script>
        console.log(myform.childNodes.tagName); // INPUT
</script>
```

Usage
-----
```javascript
var overridesBuiltin = require('name-overrides-builtin');
overridesBuiltin('createElement') === true;
overridesBuiltin('foo') === false;
overridesBuiltin('createElement', 'HTMLDocument') === true;
overridesBuiltin('createElement', 'HTMLFormElement') === false;

// returns ['ATTRIBUTE_NODE', 'CDATA_SECTION_NODE', ...
var list = overridesBuiltin.list();
var list = overridesBuiltin.list('HTMLDocument');
```

DOMPurify
---------
[DOMPurify](https://www.npmjs.com/package/dompurify) is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG. 

DOMPurify checks for named property clobbering by inspecting the browser it is running in. This is not adequate for some use cases. For example if you are sanitizing only on the server side (e.g. node.js + [jsdom](https://www.npmjs.com/package/jsdom)) and sending that content to various browsers, properties or method that are implemented in browsers but not jsdom are able to be overridden.
 
For such a use case, this library provides a convenient hook:

```javascript
var window = require('jsdom').jsdom().defaultView;
var DOMPurify = require('dompurify')(window);
var overridesBuiltin = require('name-overrides-builtin');

// returns '<img id="webkitRequestFullScreen" src="cat.png">'
DOMPurify.sanitize('<img id="webkitRequestFullScreen" src="cat.png">');

overridesBuiltin.addDOMPurifyHook(DOMPurify);

// returns '<img src="cat.png">'
DOMPurify.sanitize('<img id="webkitRequestFullScreen" src="cat.png">');
```