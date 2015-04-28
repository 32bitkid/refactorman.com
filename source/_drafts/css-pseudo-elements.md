title: 'Fun with pseudo-elements'
tags:
  - css
date: Nov 29, 2013
---

I've known for quite a while that, you could inject content into
HTML elements using CSS pseudo-elements &ndash; `::before` and
`::after`

For example, I wanted all paragraphs to start with "Yo dog," then
I could write a css style like this:

```css
p::before {
  content: "Yo dog, "
}
```

Or, if I wanted to be fancy, I could use CSS to display a custom
icon for absolute anchor links by using the `url()` css function.

```css
a[href^=http\:\/\/]:after {
  content: url('path-to-external-icon.png');
}
```

However, the other day I ended up on [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
for the `content` property, and I noticed something I hadn't seen
before: the `attr()` value.

The `attr()` value returns the *value* of the attribute
on the element. So, I can make a context hover for external
links to display thier `href` by doing something like this:

```css
a { position: relative; }
a[href^=http\:\/\/]:hover:after {
  /* Display the href attribute */
  content: attr(href);

  /* Put it in a box */
  display: block;
  position: absolute;
  padding: 1ex;
  border: 1px solid #666;
  background-color: #ccc;
}
```

However, things got *more* interesting when I realized I could
do the same with HTML5 `data-` attributes.

```html
<div class="greet" data-greeting="Hola">Jim</div>
```

Then I could *use* that by writing some CSS like:

```css
.greet:before {
  content: attr(data-greeting);
  margin-right: 1ex;
}
```

Aparently this was old news, a quick google search turned up a bunch
of people talking about it a while ago. But it was news to me! I'm not sure
where I would get to use it, but I do like that it helps keep the DOM pretty
and it makes it pretty simple to update things from javascript.

```js
var forEach = Function.prototype.call.bind(Array.prototype.forEach),
    changeToHello = function(elem) {
      elem.dataset.greeting = "Hello";
    });

var greetings = document.querySelectorAll(".greet");
forEach(greetings, changeToHello);
```

It almost shadow-dom-esque. It's nice not having to know the internals
of how the element is going to consume the `data-` attribute, one can
just update the elements' state and be done.

There is one unimplemented feature that would also help make this
technique a lot more powerful: setting the "type" of the `attr()` value. The
[spec defines](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) such
behavior but, as of writing this no browsers implement it.

```css
.hasIcon:before {
  content: attr(data-icon-url url);
}
```

This would return the value of the `data-icon-url` attribute, but intrept
it's value as a url rather than just a string. It would be pretty useful...