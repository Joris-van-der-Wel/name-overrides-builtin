name-overrides-builtin
======================
Test if a given name might override a property of a DOM Node marked as [`[OverrideBuiltins]`](http://www.w3.org/TR/WebIDL/#OverrideBuiltins). To be specific, `HTMLDocument` and `HTMLFormElement`. This package uses a list so that it works in javascript implementations that do not have DOM and to make sure the behaviour is consistent between browser versions. 

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

var list = overridesBuiltin.list(); // ['ATTRIBUTE_NODE', 'CDATA_SECTION_NODE', ...
var list = overridesBuiltin.list('HTMLDocument');
```
