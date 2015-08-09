title: Typographic Unicode
css:
- /css/typographic-unicode
----

Often, I find myself overlooking typography when writing content in HTML. It's even harder, sometimes, when dealing with CSS. Here is a quick reference some common typographical characters, and how to express them in HTML and CSS.

<!-- more -->

## Whitespaces

First, it's easy to forget that whitespace can be more expressive than the standard space character you get when pressing the <kbd>Space Bar</kbd>. Let's look closer at some common whitespace characters.

{% figure Common HTML Whitespace class:space-table class:text-table %}
|| HTML Number | HTML Name | CSS
|-:|:-:|:-:|:-:
| Regular<span>&#x0020;</span>Space | `&#x0020;` | | `\0020`
| Non&#x2011;breaking<span>&nbsp;</span>Space | `&#x00A0;` | `&nbsp;` | `\00A0`
| Figure<span>&#x2007;</span>Space | `&#x2007;` | | `\2007`
| <span>&#x0009;</span>Tab | `&#x0009;` | `&tab;` | `\0009`
{% endfigure %}

But, that's not all! There are a *whole range* of typographical spaces that can, and should, be used in specific circumstances.

{% figure Less Common HTML Whitespace class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Em<span>&#x2003;</span>Space | `&#x2003;` | `&emsp;` | `\2003`
| En<span>&#x2002;</span>Space | `&#x2002;` | `&ensp;` | `\2002`
| &#x2153;&nbsp;Em<span>&#x2004;</span>Space | `&#x2004;` | `&emsp13;` | `\2004`
| &frac14;&nbsp;Em<span>&#x2005;</span>Space | `&#x2005;` | `&emsp14;` | `\2005`
| &#x2159;&nbsp;Em<span>&#x2006;</span>Space | `&#x2006;` | | `\2006`
| Thin<span>&#x2009;</span>Space | `&#x2009;` | `&thinsp;` | `\2009`
| Hair<span>&#x200A;</span>Space | `&#x200A;` | `&hairsp;` | `\200A`
{% endfigure %}

## Zero-width Spaces and Word Break Opportunity

## Non-breaking Hyphens & Soft Hyphens

