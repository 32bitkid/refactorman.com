title: Exploring the Discrete Cosine Transform
date: 2015-04-28
css:
- /css/exploring-the-dct-part-i
js:
- //cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js
- /js/exploring-the-dct-part-i
---
A [discrete cosine transform (DCT)](http://en.wikipedia.org/wiki/Discrete_cosine_transform) expresses a finite sequence of data points in terms of a sum of cosine functions oscillating at different frequencies.

The DCT is used extensively in lossy audio and image compression. It can be found in MP3 audio compression, JPEG image compression, and MPEG-1/2 video compression. Let's take a closer look the fundamentals of how a DCT is practically used.

## [TL;DR](#TL;DR)

For JPEG and MPEG video, the formal definition of an 8&times;8 DCT:

{% figure A 8&times;8 DCT-II class:image %}
<img src="http://latex.codecogs.com/svg.latex?\dpi{150}&space;G_{u,v}=&space;\frac{1}{4}&space;\alpha(u)&space;\alpha(v)&space;\sum_{x=0}^{7}&space;\sum_{y=0}^{7}&space;g_{x,y}&space;\cos&space;\left&space;[&space;\frac{(2x&plus;1)u\pi}{16}&space;\right&space;]&space;\cos&space;\left&space;[&space;\frac{(2y&plus;1)v\pi}{16}&space;\right&space;]" title="G_{u,v}= \frac{1}{4} \alpha(u) \alpha(v) \sum_{x=0}^{7} \sum_{y=0}^{7} g_{x,y} \cos \left [ \frac{(2x+1)u\pi}{16} \right ] \cos \left [ \frac{(2y+1)v\pi}{16} \right ]" />
{% endfigure %}

Where:

{% figure class="image" %}
<img src="http://latex.codecogs.com/svg.latex?\dpi{150}&space;\alpha(u)&space;=&space;\begin{cases}&space;\frac{1}{\sqrt{2}},&space;&&space;\text{&space;if&space;}&space;u=0\\&space;1,&space;&&space;\text{&space;otherwise&space;}&space;\end{cases}" title="\alpha(u) = \begin{cases} \frac{1}{\sqrt{2}}, & \text{ if } u=0\\ 1, & \text{ otherwise } \end{cases}" />
{% endfigure %}

Implemented in JavaScript as:

{% code A na&iuml;ve DCT implementation in JavaScript lang:js %}
var dct = function(input) {
  var output = [], v, u, x, y, sum, val, au, av;
  for (v=0; v<8; v++) {
    for(u=0; u<8; u++) {
      sum = 0;
      for (y=0; y<8; y++) {
        for(x=0; x <8; x++) {
          val = input[y*8+x];
          val *= Math.cos(((2*x+1) * u * Math.PI)/16);
          val *= Math.cos(((2*y+1) * v * Math.PI)/16);
          sum += val;
        }
      }
      au = u === 0 ? 1/Math.SQRT2 : 1;
      av = v === 0 ? 1/Math.SQRT2 : 1;
      output[v*8+u] = 1/4 * au * av * sum;
    }
  }
  return output;
}
{% endcode %}

And the corresponding *inverse* DCT:

{% figure The DCT-III, also known as the inverse DCT class="image" %}
<img src="http://latex.codecogs.com/svg.latex?\dpi{150}&space;f_{x,y}&space;=&space;\frac{1}{4}&space;\sum_{u=0}^{7}&space;\sum_{u=0}^{7}&space;\alpha(u)&space;\alpha(v)&space;F_{u,v}&space;\cos&space;\left&space;[&space;\frac{(2x&plus;1)u\pi}{16}&space;\right&space;]&space;\cos&space;\left&space;[&space;\frac{(2y&plus;1)v\pi}{16}&space;\right&space;]" title="f_{x,y} = \frac{1}{4} \sum_{u=0}^{7} \sum_{u=0}^{7} \alpha(u) \alpha(v) F_{u,v} \cos \left [ \frac{(2x+1)u\pi}{16} \right ] \cos \left [ \frac{(2y+1)v\pi}{16} \right ]" />
{% endfigure %}

Where:

{% figure class="image" %}
<img src="http://latex.codecogs.com/svg.latex?\dpi{150}&space;\alpha(u)&space;=&space;\begin{cases}&space;\frac{1}{\sqrt{2}},&space;&&space;\text{&space;if&space;}&space;u=0\\&space;1,&space;&&space;\text{&space;otherwise&space;}&space;\end{cases}" title="\alpha(u) = \begin{cases} \frac{1}{\sqrt{2}}, & \text{ if } u=0\\ 1, & \text{ otherwise } \end{cases}" />
{% endfigure %}

Also implemented in JavaScript as:

{% codeblock A na&iuml;ve iDCT implementation in JavaScript lang:js %}
var idct = function(input) {
  var output = [], v, u, x, y, sum, val, au, av;
  for (y=0; y<8; y++) {
    for(x=0; x<8; x++) {
      sum = 0;
      for (v=0; v<8; v++) {
        for(u=0; u<8; u++) {
          au = u === 0 ? 1/Math.SQRT2 : 1;
          av = v === 0 ? 1/Math.SQRT2 : 1;
          val = block[v*8+u];
          val *= au;
          val *= av;
          val *= Math.cos(((2*x+1) * u * Math.PI)/16);
          val *= Math.cos(((2*y+1) * v * Math.PI)/16);
          sum += val;
        }
      }
      output[y*8+x] = 1/4 * sum;
    }
  }
  return output;
}
{% endcodeblock %}

These JavaScript implementations are na&iuml;ve implementations, i.e. that are quite computationally expensive and unoptimized. They *are*, however, relatively easy to reason about.

For reference, there are also several high performance variations and approximations, that reduce the number of mathematical operations required, at the cost of readability. For example:

* The LLM DCT: [
Practical fast 1-D DCT algorithms with 11 multiplications](http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=266596)
* The AAN DCT: [A Fast DCT-SQ Scheme for Images](http://search.ieice.org/bin/summary.php?id=e71-e_11_1095).

## [So, what does it do?](#So,_what_does_it_do?)

I'm going to start by looking at a simpler one-dimensional example.

We will begin with a signal, a linear ramp, like this:

{% figure The input signal class="signal-graph" id="signal-viz-1" %}
{% endfigure %}

The input signal has been sampled 8 times, each sample is *independent* from it's neighboring samples; i.e. it represents the value of the signal at a specific point in space or time. A DCT transforms these discrete data points into a sum of cosine functions, each oscillating at a *different frequencies* and at *different magnitudes*.

Specifically, the DCT will transform this of *8 samples* into *8 coefficients*. Each coefficient will multiply a specific cosine frequency -- altering that magnitude of that function and its corresponding impact on the reconstructed signal.

***

Let's look at the formal definition of the forward and inverse one-dimensional DCT that we will be using.

{% figure A 1-D DCT and iDCT class="image" %}
<img src="http://latex.codecogs.com/svg.latex?\\&space;G_{k}=&space;\alpha(k)&space;\sqrt{\frac{2}{N}}&space;\sum_{n=0}^{N-1}&space;g_{n}&space;\cos&space;\left&space;[&space;\frac{\pi}{N}&space;\left&space;(n&space;&plus;&space;\frac{1}{2}&space;\right&space;)&space;k&space;\right&space;]&space;\\&space;\\&space;\\&space;g_{n}&space;=&space;\sqrt{\frac{2}{N}}&space;\sum_{k=0}^{N-1}&space;\alpha(k)&space;G_{k}&space;\cos&space;\left&space;[&space;\frac{\pi}{N}&space;\left&space;(n&space;&plus;&space;\frac{1}{2}&space;\right&space;)&space;k&space;\right&space;]&space;\\&space;\\&space;\\&space;\text{Where:}&space;\\&space;\\&space;\alpha(x)&space;=&space;\begin{cases}&space;\frac{1}{\sqrt&space;{2}&space;},&space;&&space;\text{&space;if&space;}&space;x=0\\&space;1,&space;&&space;\text{&space;otherwise&space;}&space;\end{cases}&space;\\&space;\\&space;g&space;\text{&space;is&space;the&space;input&space;}\\&space;\\&space;G&space;\text{&space;is&space;the&space;DCT&space;output&space;}\\&space;\\&space;N&space;\text{&space;is&space;the&space;number&space;of&space;samples&space;being&space;transformed}\\" title="\\ G_{k}= \alpha(k) \sqrt{\frac{2}{N}} \sum_{n=0}^{N-1} g_{n} \cos \left [ \frac{\pi}{N} \left (n &plus; \frac{1}{2} \right ) k \right ] \\ \\ \\ g_{n} = \sqrt{\frac{2}{N}} \sum_{k=0}^{N-1} \alpha(k) G_{k} \cos \left [ \frac{\pi}{N} \left (n &plus; \frac{1}{2} \right ) k \right ] \\ \\ \\ \text{Where:} \\ \\ \alpha(x) = \begin{cases} \frac{1}{\sqrt {2} }, & \text{ if } x=0\\ 1, & \text{ otherwise } \end{cases} \\ \\ g \text{ is the input }\\ \\ G \text{ is the DCT output }\\ \\ N \text{ is the number of samples being transformed}\\" />
{% endfigure %}

First, we can focus just on the forward DCT transformation. We can translate the forward equation into the following JavaScript:

{% codeblock A na&iuml;ve implementation of a forward 1D DCT.  %}
  var dct1d = function(signal) {
    var N = signal.length,
        output = [],
        sum, k, n, s;

    for(k=0; k<N; k++) {
      sum = 0;
      for(n=0; n<N; n++) {
        sum += signal[n] * Math.cos(Math.PI * (n + 0.5) * k / N);
      }
      s = k===0 ? 1/Math.sqrt(2) : 1;
      output[k] = s * Math.sqrt(2/N) * sum;
    }
    return output;
  };
{% endcodeblock %}

This function will take an array of samples and return an array of *equal length* DCT coefficients. Now, we can use this function to transform our input signal. Something like:

```js
var coefficients = dct1d([8,16,24,32,40,48,56,64]);
```

The resulting array will be 8 elements long and will look like this:

{% figure The computed DCT coefficients class="signal-graph" id="signal-viz-2" %}
{% endfigure %}

## [Reconstructing the signal](#Reconstructing_the_signal)

Now that we have our set of coefficients, how do we transform it back into the original signal? For that, we use the *inverse* DCT.

Again, we can express this in JavaScript as:

{% codeblock A na&iuml;ve implementation of a inverse 1D DCT.  %}
  var idct1d = function(dct) {
    var N = dct.length,
        signal = [],
        sum, k, n, s;

    for(n=0; n<N; n++) {
      sum = 0;
      for(k=0; k<N; k++) {
        s = k===0 ? Math.sqrt(0.5) : 1;
        sum += s * dct[k] * Math.cos(Math.PI * (n+0.5) * k / N);
      }
      signal[n] = Math.sqrt(2/N) * sum;
    }
    return signal;
  };
{% endcodeblock %}

Let use it to reconstruct our signal:

```js
var reconstructedSignal = idct1d(coefficients);
```

Again, this function returns the same number of samples as our coefficients. And aside from some small floating-point rounding errors, the reconstructed signal is identical to the original signal.

{% figure The reconstructed signal class="signal-graph" id="signal-viz-3" %}

{% endfigure %}

## [Okay, but *why?*](#Okay,_but_why?)

Up to now, you may have noticed that each transformation has been of equivalent length; e.g., *n* samples become *n* coefficients and vice versa. So, how is this actually useful for compression?

Look again at the coefficients of our compressed signal:

{% figure The computed DCT coefficients class="signal-graph" id="signal-viz-4" %}

{% endfigure %}

Notice, that the *first two* coefficients have a relatively large magnitude, while the rest are fairly close to zero. This is because our source signal was a simple ramp: it's value increased by `8` units at each sample.

As such, most of the *energy* of the signal can be expressed in the lower frequencies, while the higher frequencies have *less* of an overall impact on the desired signal. The DCT exploits this property; this is referred to as *energy compaction*.

If our initial signal was comprised of white noise, i.e. static, there would be less -- if any -- energy compaction. However many real-world samples, whether aural or visual, the signals tend to be somewhat ordered, and better suited for this type of energy compaction.

***

We use can [quantization](http://en.wikipedia.org/wiki/Quantization_(image_processing) to squash our coefficients, which are currently real numbers, into a smaller range of integers. As a simplistic implementation, we can divide each coefficient by `50` and truncate the result. **The choice of `50` is a completely arbitrary selection on my part, it can be any number really for our purposes.**

```js
var quantized = coefficients.map(function(v) { return v/50|0; });
```

{% figure The quantized coefficients. class="signal-graph" id="signal-viz-5" %}
{% endfigure %}

After quantization, we now only have two coefficients that have values, and a long run of values of zero. This set can be [run-length encoded](http://en.wikipedia.org/wiki/Run-length_encoding) much smaller than the original set of samples.

This is *fundamentally* how the DCT is used for audio and visual compression.

## [Lossy Compression](#Lossy_Compression)

If you have a keen eye then you may have noticed something interesting during the quantization step in the last section. We *truncated* our real values into integers, i.e. we threw away some data.

While that made the data more compressible, what effect does that have on our reconstructed signal? Let's find out!

First, we need to de-quantize our coefficients:

```js
var dequantized = quantized.map(function(v) {
  return v*50;
});
```

{% figure The dequantized coefficients. class="signal-graph" id="signal-viz-6" %}
{% endfigure %}

Notice they are *not* the same as the coefficients we calculated before, due to the truncation. Now, let's run the inverse DCT and see what signal we get back:

```js
var decompressedSignal = idct1d(dequantized);
```

{% figure The reconstructed decompressed signal. class="signal-graph" id="signal-viz-7" %}
{% endfigure %}

At first glance, the reconstructed signal appears *similar*. However, on closer inspection, you can see they are actually different. That is because we threw away some of the smaller, high-frequency coefficients that were subtly adjusting the reconstructed signal. Without those frequencies, the new signal drifts away from the original.

However, compare them together on the same chart:

{% figure class="signal-graph" id="signal-viz-8" %}
  <figcaption>Both the original signal and reconstructed decompressed signal.</figcaption>
{% endfigure %}

Not quite the same, but close -- and that's the idea. We can use the DCT, to transform our set into a more *compressible* set data that can be reconstructed into a *similar* signal, but not identical. We have, however, *lost* some of the original data in the process; that is what is meant by "lossy" compression.

By adjusting the quantization value (or using a quantization matrix), one can control the balance between compressibility and signal fidelity of the transformation.

## Next up...

Let's explore deeper into the DCT:

* Visualization: Behold the waveforms of the DCT and how the signal is regenerated.
* Take it to the Next Dimension: Look at some 2D versions of the DCT.
* Indiana Jones: Explore some visual implications/artifacts of compression.

## [More Reading](#More)

* [Discrete Cosine Transform](https://unix4lyfe.org/dct-1d/)
* [What is 'energy compaction' in simple terms?](http://dsp.stackexchange.com/questions/17326/what-is-energy-compaction-in-simple-terms)
