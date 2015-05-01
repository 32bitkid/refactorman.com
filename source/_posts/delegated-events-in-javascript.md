title: "Understanding Delegated JavaScript Events"
date: 2014-10-20 00:00:00
tags:
updated: "Nov 1, 2014"
---

Have you ever been curious how delegated events _work_ in JavaScript? How they can be implemented? Let's take a look...

<!-- more -->

---

While I ended up using a CSS-only implementation for [this pen](http://codepen.io/32bitkid/pen/qJEoC), I started by writing it mostly using classes and JavaScript.

However, I had a conflict. I wanted to use [Delegated Events](http://api.jquery.com/on/#direct-and-delegated-events) but I also wanted to minimize the dependencies I wanted to inject. I didn't want to have to import _all_ of jQuery for this little test, just to be able to use delegated events one bit.

Let's take a closer look at what exactly delegated events are, how they work, and various ways to implement them.

## Ok, so what's the issue?

Let's look at a simplified example:

Let's say that I had a list of buttons and each time I clicked on one, then I want to mark that button as "active". If I click it again, then deactivate it.

So let's start with some HTML:

{% code Example Markup. lang:html %}
<ul class="toolbar">
  <li><button class="btn">Pencil</button></li>
  <li><button class="btn">Pen</button></li>
  <li><button class="btn">Eraser</button></li>
</ul>
{% endcode %}

I could use standard JavaScript event handler by doing something like this:

{% code Using direct event handlers. lang:js %}
var buttons = document.querySelectorAll(".toolbar .btn");

for(var i = 0; i < buttons.length; i++) {
  var button = buttons[i];
  button.addEventListener("click", function() {
    if(!button.classList.contains("active"))
      button.classList.add("active");
    else
      button.classList.remove("active");
  });
}
{% endcode %}

And this looks good... But it will not work; at least not the way one might expect it to.

## Bitten by closures

For those of you that have been doing functional JavaScript for a while, the problem mat be obvious.

For the uninitiated, however, the handler function closes over the `button` variable. However, there is only _one_ of them; it gets reassigned by each iteration of the loop.

The first time though the loop, it points at the first button. The next time, the second button. And so on... However, by the time that you *actually click* one of the elements and trigger the handler, the loop has completed and the `button` variable will point at the _last_ element iterated over.

 Not good.

What we really need is a stable scope for each function; let's refactor an extract a handler generator to give us a stable scope...

{% code Using a closure. lang:js %}
var buttons = document.querySelectorAll(".toolbar button");
var createToolbarButtonHandler = function(button) {
  return function() {
    if(!button.classList.contains("active"))
      button.classList.add("active");
    else
      button.classList.remove("active");
  };
};

for(var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", createToolBarButtonHandler(buttons[i]));
}
{% endcode %}

Better!

Now it actually works. We are using a function to create us a stable scope for `button`. This ensures the `button` variable in the handler will always point at the element that we think it will.

This seems good; it will work. However, we can still do better.

## So, what the problem?

First, we are making a lot of handlers.

For each element that matches `.toolbar button` we create a function and attach it as an event listener. With the three buttons we have right now the allocations are negligible.

However, consider this:

{% code Tons of DOM lang:js %}
<ul class="toolbar">
  <li><button id="button_0001">Foo</button></li>
  <li><button id="button_0002">Bar</button></li>
  // ... 997 more elements ...
  <li><button id="button_1000">baz</button></li>
</ul>
{% endcode %}

It won't blow up, but it is far from ideal. We are allocating a bunch of function that we don't _have_ to. Let's try to refactor so that we can _share_ a single function that is attached _multiple times_.

---

Rather than closing over the `button` variable to keep track of which button we clicked on, instead we can use `event` object.

The `event` object is the first argument provided to a handler when the event is dispatched. It contains some metadata about the event. Among other things, we are interested in the `currentTarget` property. With it, we will get a reference to the element that was _actually clicked on_.

{% code First look at the <code>currentTarget</code> property lang:js %}
var buttons = document.querySelectorAll(".toolbar button");

var toolbarButtonHandler = function(e) {
  var button = e.currentTarget;
  if(!button.classList.contains("active"))
    button.classList.add("active");
  else
    button.classList.remove("active");
};

for(var i = 0; i < buttons.length; i++) {
  button.addEventListener("click", toolbarButtonHandler);
}
{% endcode %}

Great!

Not only did this refactor reduce the number of required handlers down to single function, it also made the code more readable by factoring out our generator function.

However, we can _still_ do better.

## But, why?

Let's say we have some dynamic buttons that are added and removed dynamically through JavaScript.

Based on our current implementation, we would also need to remember to wire up the event listeners directly to those dynamic elements. That means we would also have to hold onto a reference to that handler, reference from more places, and make sure to remove remove it from elements before we tear them off of the DOM.

That doesn't sound like fun. But, perhaps there is a different approach.

Let's start by getting a better understanding of how events work and how they move through the DOM.

## Okay, how do (most) events work?

When the user clicks on an element, an event gets generated to notify the application of the user's intent. Events get dispatched in three phases:

* Capturing
* Target
* Bubbling

{% aside %}
NOTE: Not _all_ events bubble/capture. Instead, a few are dispatched directly on the target. For example, most `focus` and `blur` events don't bubble. However, *most* event types do.
{% endaside %}

For most event types, the event starts outside the document and then descends though the DOM hierarchy to the `target` of the event. Once the event reaches it's target, it then turns around and heads back out the same way, until it exits the DOM.

Here is a full HTML example:

{% code Example DOM to demonstrate event bubbling. lang:html %}
<html>
<body>
  <ul>
    <li id="li_1"><button id="button_1">Button A</button></li>
    <li id="li_2"><button id="button_2">Button B</button></li>
    <li id="li_3"><button id="button_3">Button C</button></li>
  </ul>
</body>
</html>
{% endcode %}

Pretend the user clicks on `Button A`, then the event would travel like this like this:

{% codeblock Crude illustration of the event life-cycle. %}
START
| #document  \
| HTML        |
| BODY         } CAPTURE PHASE
| UL          |
| LI#li_1    /
| BUTTON     <-- TARGET PHASE
| LI#li_1    \
| UL          |
| BODY         } BUBBLING PHASE
| HTML        |
v #document  /
END
{% endcodeblock %}

Notice that you can follow the path the event takes down to the element that received the click.

For any button we click on in our DOM, we can be sure that the event will bubble back out through our parent `ul` element. We can exploit this feature of the event dispatcher, combined with our defined hierarchy to simplify our implementation and implement Delegated Events.

## Delegated Events

Delegated events are events that are attached to a parent element, but only get executed when the target of the event matches some criteria.

Let's look at a concrete example and switch back to our toolbar example DOM from before:

{% code Our example Markup again. lang:html %}
<ul class="toolbar">
  <li><button class="btn">Pencil</button></li>
  <li><button class="btn">Pen</button></li>
  <li><button class="btn">Eraser</button></li>
</ul>
{% endcode %}

So, since we know that any clicks on the button elements will get bubbled through the `UL.toolbar` element, let's put the event handler _there_ instead. We'll have to adjust our handler a little bit from before:

{% code Using a delegated event. lang:js %}
var toolbar = document.querySelector(".toolbar");
toolbar.addEventListener("click", function(e) {
  var button = e.target;
  if(!button.classList.contains("active"))
    button.classList.add("active");
  else
    button.classList.remove("active");
});
{% endcode %}

That cleaned up a lot of code, and we have no more loops! Notice that we use `e.target` instead of `e.currentTarget` as we did before. That is because we are listening for the event at a different level.

* `e.target` is _actual_ target of the event. Where the event is trying to get to, or where it came from, in the DOM.
* `e.currentTarget` is the current element that is handling the event.

In our case `e.currentTarget` will be the `UL.toolbar`.

## More Robust Delegated Events

Right now, we handle any click on any element that bubbles though `UL.toolbar`, but our matching strategy is a little too simple. What if we had more complicated DOM that included icons and items that were supposed to be non-clickable

{% code A more complex markup example. lang:html %}
<ul class="toolbar">
  <li>
    <button class="btn">
    <i class="fa fa-pencil"></i>
    Pencil
    </button>
  </li>
  <li>
    <button class="btn">
      <i class="fa fa-paint-brush"></i>
      Pen
    </button>
  </li>
  <li class="separator"></li>
  <li>
    <button class="btn">
      <i class="fa fa-eraser"></i>
      Eraser
    </button>
  </li>
</ul>
{% endcode %}

OOPS!

Now, when we click on the `LI.separator` or the icons, we add the `active` class to _that_ element. That's not cool. We need a way to filter our events so we only react to elements we care about, or if our `target` element is contained by an element we care about.

Let's make a little helper to handle that:

{% code A higher-order function to help simplify event delegation. lang:js %}
var delegate = function(criteria, listener) {
  return function(e) {
    var el = e.target;
    do {
      if (!criteria(el)) continue;
      e.delegateTarget = el;
      listener.apply(this, arguments);
      return;
    } while( (el = el.parentNode) );
  };
};
{% endcode %}

This helper does two things, first it walks though each element and their parents to see if it matches a criteria function. If it does, then it adds a property to the event object called `delegateTarget`, which is the element that matched our filtering criteria. And then invokes the listener. If nothing matches, the no handlers are fired.

We can use it like this:

{% code Using the helper... lang:js %}
var toolbar = document.querySelector(".toolbar");

var buttonsFilter = function(elem) {
  return elem.classList && elem.classList.contains("btn");
};

var buttonHandler = function(e) {
  var button = e.delegateTarget;
  if(!button.classList.contains("active"))
    button.classList.add("active");
  else
    button.classList.remove("active");
};

var delegatedHandler = delegate(buttonsFilter, buttonHandler);
toolbar.addEventListener("click", delegatedHandler);
{% endcode %}

Now, that's what I'm talking about: A single event handler, attached to a single element that does all the work, but only does it on the elements that we care about and will react nicely to elements added or removed from the DOM dynamically.

## Wrapping up

We've looked at the basics of how to implement event delegation in pure JavaScript in order to reduce the number of event handlers we need to generate or attach.

There are a few things I would do, if I were going to abstract this into a library, or use it for production level code:

* Create helper functions to handle criteria matching in a unified functional way.

  Perhaps something like:

{% code Criteria helpers... lang:js %}
var criteria = {
  isElement: function(e) { return e instanceof HTMLElement; },
  hasClass: function(cls) {
    return function(e) {
      return criteria.isElement(e) && e.classList.contains(cls);
    }
  }
  // More criteria matchers
};
{% endcode %}

* A partial application helper would also be nice:

{% code A partial application of delegate. lang:js %}
var partialDelgate = function(criteria) {
  return function(handler) {
    return delgate(criteria, handler);
  }
};
{% endcode %}

If you have any suggestions or improvements, send me a message! Happy coding!
