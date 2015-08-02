title: React-like DOM construction in 8 lines.
---

## TL;DR

{% code Ugly as balls DOM construction. lang:js %}
var $text = document.createTextNode.bind(document);
var $comment = document.createComment.bind(document);
var $el = function(tag, attrs, c) {
  var el = document.createElement(tag), key, i, len = c && c.length;
  for (key in attrs) if(attrs.hasOwnProperty(key)) el.setAttribute(key, attrs[key]);
  for (i=0; i<len; i++) el.appendChild(c[i]);
  return el;
};
{% endcode %}

<!-- more -->

## Usage

So, how would one use this?

{% code See what I mean? lang:js %}
var el = $el('div', {'class': 'foo bar'}, [
  $el('h1', null, [ $text('Hello World') ]),
  $text('Lorem ipsum dolor sit amet!')
]);

document.body.appendChild(el);
{% endcode %}

## Closer look

## Enhancements

### Assume text-like

### Supporting Namespaces (XML)

## Good for what?
