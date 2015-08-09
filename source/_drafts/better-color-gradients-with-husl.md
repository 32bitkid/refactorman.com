title: Better Color Gradients with HUSL
css:
-   /css/better-color-gradients-with-husl.css
js:
- /downloads/code/husl.min.js
---

While it has been discussed [by others](http://www.stuartdenman.com/improved-color-blending/), but it's a topic that's worthy of revisiting in the context of CSS. CSS3 introduced the [`linear-gradient()`](https://drafts.csswg.org/css-images-3/#linear-gradients) function that lets you create a smooth fade between multiple colors. It make's it easy to pop a gradient here and there in CSS. For example

{% code lang:css A simple gradient from yellow to red. %}
.el { background-image: linear-gradient(0deg, yellow, red); }
{% endcode %}

Which produces:

{% figure A simple gradient from yellow to red. %}
<div class="gradient-example" id="simple-gradient"></div>
{% endfigure %}

And all it great!

## Except...

The `linear-gradient()` function usings a [RGB](https://en.wikipedia.org/wiki/RGB_color_space) interpolation to blend between colors. This can create less than ideal mix of colors in the middle. Consider

{% code lang:css A simple gradient from yellow to red. %}
.el { background-image: linear-gradient(0deg, yellow, blue); }
{% endcode %}

Which produces:

{% figure An example crappy gradient. %}
<div class="gradient-example" id="crappy-gradient">
</div>
{% endfigure %}

This might be what you expect...

Lets take closer look at the math causes this.

## Mixing in RGB space

The color mixing algorithm breaks down the start and end color into its red, green and blue color components and mixes them.

First let's break down the colors

{% figure Color Breakdown class:text-table %}
| CSS Color | Hex | Red | Green | Blue |
|-:|:-:|:-:|:-:|:-:|
| `yellow` | `#FFFF00` | 255 | 255 | 0 |
| `blue` | `#0000FF` | 0 | 0 | 255 |
{% endfigure %}

And then we can define a simple linear tween:

{% code lang:js  A simple linear tween generator %}
function linearTween(start, stop) {
  return function tween(i) { return (stop-start * i) + start; };
};
{% endcode %}

Now, look what happens when we get to the halfway point:

{% code lang:js What happens at 50%? %}
var red = linearTween(255, 0);
var green = linearTween(255, 0);
var blue = linearTween(0, 255);

red(0.5)   | 0;  // 127
green(0.5) | 0;  // 127
blue(0.5)  | 0;  // 127
{% endcode %}

We get a nice middle gray.

## Improvements
