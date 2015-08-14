title: Typographic Unicode
css:
  - /css/typographic-unicode
date: 2015-08-09 13:55:45
tags:
  - typography
  - css
  - html
comments: false
---


Often, I find myself skipping over typography when writing content in HTML. It's even harder, sometimes, when dealing with CSS. Here is a quick reference some common typographical characters, and how to express them in both HTML and CSS.

<!-- more -->
***

## White space

First, it's easy to forget that white space can be more expressive than the standard space character you get when pressing the <kbd>Space Bar</kbd>. Let's look closer at some common white space characters.

{% figure Common HTML White space class:space-table class:text-table %}
|| HTML Number | HTML Name | CSS
|-:|:-:|:-:|:-:
| Regular<span>&#x0020;</span>Space | `&#x20;` | | `\0020`
| Non&#x2011;breaking<span>&nbsp;</span>Space | `&#xA0;` | `&nbsp;` | `\00A0`
| Figure<span>&#x2007;</span>Space | `&#x2007;` | | `\2007`
| <span>&#x0009;</span>Tab | `&#x0009;` | `&tab;` | `\0009`
{% endfigure %}

But, even that is not it! There are a *whole range* of typographical spaces that can--and should--be used in specific circumstances.

{% figure Less Common HTML Whitespace class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Em<span>&#x2003;</span>Space | `&#x2003;` | `&emsp;` | `\2003`
| En<span>&#x2002;</span>Space | `&#x2002;` | `&ensp;` | `\2002`
| &#x2153;&nbsp;Em<span>&#x2004;</span>Space | `&#x2004;` | `&emsp13;` | `\2004`
| &frac14;&nbsp;Em<span>&#x2005;</span>Space | `&#x2005;` | `&emsp14;` | `\2005`
| &#x2159;&nbsp;Em<span>&#x2006;</span>Space | `&#x2006;` | | `\2006`
| Thin<span>&#x2009;</span>Space | `&#x2009;` | `&thinsp;` | `\2009`
| Hair<span>&#x200A;</span>Space | `&#x200a;` | `&hairsp;` | `\200a`
{% endfigure %}

Lastly, there is a *zero&#8209;width space*, for those times when you want a space but don't want a space. But seriously, a zero&#8209;width space provides a wrapping opportunity within a long word without introducing a visible space. Also see the *soft hyphen* below.

{% figure White-less whitespace. class:space-table class:text-table %}
|| HTML Element | HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Zero&#8209;width space | `<wbr>` | `&#x200b;` | | `\200b`
{% endfigure %}

## Hyphens and Dashes

Remember, there is [a difference](http://practicaltypography.com/hyphens-and-dashes.html) between hyphens and dashes; use the right symbol for the *right task*.

{% figure Hyphens and dashes class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Hyphen <span>-</span> | `&#x2003;` | | `\2003`
| En Dash <span>&ndash;</span> | `&#x2002;` | `&ndash;` | `\2002`
| Em Dash <span>&mdash;</span> | `&#x2004;` | `&mdash;` | `\2004`
{% endfigure %}

There are two other special-case hyphens that might be useful in some cases. The non-breaking hyphen is great for a hyphenated word that makes no sense when it gets split up. The soft hyphen is great for hinting long words, so the browser can break appropriately.

{% figure Special-case hyphens class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Non<span>&#x2011;</span>breaking hyphen | `&#x2011;` | | `\2011`
| Soft hyphen         | `&#xad;` | `&shy;` | `\00ad`
{% endfigure %}

## Quotes

{% figure &ldquo;Quotes&rdquo; class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| <span>&#x0027;</span>straight single<span>&#x0027;</span> | `&#x27;` | | `\0027` |
| <span>&#x0022;</span>straight double<span>&#x0022;</span>  | `&#x22;` | | `\0022` |
| <span>&lsquo;</span>curly single open&rsquo; | `&#x2018;` | `&lsquot;` | `\2018` |
| &lsquo;curly single close<span>&rsquo;</span> | `&#x2019;` | `&rsquot;` | `\2019` |
| <span>&ldquo;</span>curly double open&rdquo; | `&#x201c;` | `&ldquot;` | `\201c` |
| &ldquo;curly double close<span>&rdquo;</span> | `&#x201d;` | `&rdquot;` | `\201d` |
{% endfigure %}

Advanced stylists, pair the CSS property [`quotes`](https://developer.mozilla.org/en-US/docs/Web/CSS/quotes) with the [`<q>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q) HTML element to markup and style quotations.

## Math

Best to avoid using a - when you really mean &minus;, and don't use an x when you mean &times;.

{% figure <q cite='https://en.wikipedia.org/wiki/Dexter%27s_Laboratory'>Ah, what a fine day for science!</q> class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Plus <span>+</span> | `&#x2B;` | | `\002B` |
| Minus <span>&minus;</span> | `&#x2212;` | `&minus;` | `\2212` |
| Times <span>&times;</span> | `&#xD7;` | `&times;` | `\00D7` |
| Divide <span>&divide;</span> | `&#xF7;` | `&divide;` | `\00F7` |
| Prime<span>&prime;</span> | `&#x2032;` | `&prime;` | `\2032` |
| Double Prime<span>&Prime;</span> | `&#x2033;` | `&Prime;` | `\2033` |
| Triple Prime<span>&#x2034;</span> | `&#x2034;` | | `\2034` |
{% endfigure %}

## Legal

{% figure Legally Typographic class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Copyright<span>&copy;</span> | `&#xa9;` | `&copy;` | `\00a9`
| Trademark<span>&trade;</span> | `&#x2122;` | `&trade;` | `\2122`
| Registered Trademark<span>&reg;</span> | `&#xae;` | `&reg;` | `\00ae`
| Service Mark<span>&#x2120;</span> | `&#x2120;` | | `\2120`
| Sound Copyright<span>&#x2117;</span> | `&#x2117;` | | `\2117`
{% endfigure %}

Remember to always consult a lawyer before you start slapping symbols around willy-nilly.

## The Next Level

Are you are ready to take your typography to the next level? Feel free to consult this list and seriously <del>confuse</del><ins>bedazzle</ins> your average reader.

{% figure Taking it to the <em>max</em>! class:space-table class:text-table %}
|| HTML Number  | HTML Name | CSS
|-:|:-:|:-:|:-:
| Ellipsis<span>&hellip;</span> | `&#x2026;` | `&hellip;` | `\2026`
| Paragraph <span>&para;</span> | `&#x00b6;` | `&para;` | `\00b6`
| Section <span>&sect;</span> | `&#x00a7;` | `&sect;` | `\00a7`
| Interrobang<span>&#x203d;</span> | `&#x203d;` | | `\203d`
{% endfigure %}

## Is that it? Are they any more?

I'll say! The complete Unicode range comprises of a whopping total of 1,114,112 code points... There are a lot more interesting characters to find; however, finding a typeface that supports them is another matter entirely.
