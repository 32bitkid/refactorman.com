title: Fun with pseudo-elements
tags:
  - css
date: 2013-10-29 00:00:00
---


I've known for quite a while that, you could inject content into
HTML elements using CSS pseudo-elements &ndash; `::before` and
`::after`. But, they are _way_ more useful than I originally thought...

<!-- more -->

## The Simple Stuff

Simply put, pseduo-elements let you inject CSS content _immediately before_ or _immediately after_ the content of the matched element.

For example, suppose I want all paragraphs in my document to start with the phrase "Yo dog, ". I could write:

{% code Xzibit would be proud! lang:css %}
p::before { content: "Yo dog, "; }
{% endcode %}

Instead of using a string, one can also link to another resource using the `url()` css function. Here is a style that matches any anchor with an absolute url and injects an icon after them.

{% code Adding images as content. lang:css %}
a[href^="http://"]:after, a[href^="https://"]:after {
  content: url('path-to-external-icon.png');
}
{% endcode %}

## Got it! Anything else?

Yea!

The other day I ended up on [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
for the `content` property. I noticed something new: the `attr()` value.

The `attr()` value returns the *value* of the attribute
on the element as a string. I can make a context hover for external
links to display thier `href` by doing something like this:

{% code Or... you could just use title attribute. lang:css %}
a { position: relative; }

a[href^="http://"]:hover:after, a[href^=https://]:hover:after {
  /* Display the href attribute */
  content: attr(href);

  /* Put it in a box */
  display: block;
  position: absolute;
  padding: 1ex;
  border: 1px solid #666;
  background-color: #ccc;
}
{% endcode %}

And now you have a no-js hover for links...

## One step further!

Things got *more* interesting when I realized I could
do the same with HTML5 `data-` attributes. Consider the following markup:

{% code lang:html %}
<div class="greet" data-greeting="Hola">Jim</div>
{% endcode %}

Then I could do something like this:

{% code lang:css %}
.greet:before {
  content: attr(data-greeting) " ";
}
{% endcode %}

Aparently this was old news. A quick google search turned up a bunch
of people talking about it a while ago, but it was news to me! I'm not sure
where I would get to use it, but I do like that it helps keep the DOM pretty
and it makes it simple to update certain things from javascript.

{% code lang:js %}
var forEach = Function.prototype.call.bind(Array.prototype.forEach),
    changeToHello = function(elem) {
      elem.dataset.greeting = "Hello";
    });

var greetings = document.querySelectorAll(".greet");
forEach(greetings, changeToHello);
{% endcode %}

It almost shadow-dom-esque. It's nice not having to know the internals
of how the element is going to consume the `data-` attribute, one can
just update the elements' state and be done.

## The future and beyond...

There is one unimplemented feature that would also help make this
technique a lot more powerful: the optional `[type]` argument of
the `attr()` function. The
[spec defines](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) such
behavior but, as of writing this *no browsers* implement it.

{% code This would be great! lang:css %}
.hasIcon:before {
  content: attr(data-icon-url url);
}
{% endcode %}

This would return the value of the `data-icon-url` attribute, but intrept
it's value as a url rather than just a string. It would be pretty useful
for injecting icons...
