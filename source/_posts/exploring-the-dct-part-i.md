title: Exploring the Discrete Cosine Transform
date: 2014-08-03
---

A [discrete cosine transform (DCT)](http://en.wikipedia.org/wiki/Discrete_cosine_transform) expresses a finite sequence of data points in terms of a sum of cosine functions oscillating at different frequencies.

Let's take a closer look at how a DCT is practically used, within the scope of JPEG/MPEG compression/decompression.

## Example input block

The first thing that happens is the image is broken down into 8&times;8 pixel blocks. An example block might look something like this:

```coffeescript
input = [
 52, 55, 61, 66, 70, 61, 64, 73,
 63, 59, 55, 90, 109, 85, 69, 72,
 62, 59, 68, 113, 144, 104, 66, 73,
 63, 58, 71, 122, 154, 106, 70, 69,
 67, 61, 68, 104, 126, 88, 68, 70,
 79, 65, 60, 70, 77, 68, 58, 75,
 85, 71, 64, 59, 55, 61, 65, 83,
 87, 79, 69, 68, 65, 76, 78, 94
]
```

## Center around zero

Next, the values get shifted from a positive range to a range centered around zero.

```coffeescript
center = (input) -> (val-128 for val in input)
```

## 2D DCT-II

Then, we perform the DCT. It's formal definition looks something like this:

<figure>
<figcaption>The DCT</figcaption>
<a href="http://www.codecogs.com/eqnedit.php?latex=\dpi{150}&space;G_{u,v}=&space;\frac{1}{4}&space;\alpha(u)&space;\alpha(v)&space;\sum_{x=0}^{7}&space;\sum_{y=0}^{7}&space;g_{x,y}&space;\cos&space;\left&space;[&space;\frac{(2x&plus;1)u\pi}{16}&space;\right&space;]&space;\cos&space;\left&space;[&space;\frac{(2y&plus;1)v\pi}{16}&space;\right&space;]" target="_blank"><img src="http://latex.codecogs.com/png.latex?\dpi{150}&space;G_{u,v}=&space;\frac{1}{4}&space;\alpha(u)&space;\alpha(v)&space;\sum_{x=0}^{7}&space;\sum_{y=0}^{7}&space;g_{x,y}&space;\cos&space;\left&space;[&space;\frac{(2x&plus;1)u\pi}{16}&space;\right&space;]&space;\cos&space;\left&space;[&space;\frac{(2y&plus;1)v\pi}{16}&space;\right&space;]" title="G_{u,v}= \frac{1}{4} \alpha(u) \alpha(v) \sum_{x=0}^{7} \sum_{y=0}^{7} g_{x,y} \cos \left [ \frac{(2x+1)u\pi}{16} \right ] \cos \left [ \frac{(2y+1)v\pi}{16} \right ]" /></a>
</figure>

Where:

<figure>
<a href="http://www.codecogs.com/eqnedit.php?latex=\dpi{120}&space;\alpha(u)&space;=&space;\begin{cases}&space;\frac{1}{\sqrt{2}},&space;&&space;\text{&space;if&space;}&space;u=0\\&space;1,&space;&&space;\text{&space;otherwise&space;}&space;\end{cases}" target="_blank"><img src="http://latex.codecogs.com/png.latex?\dpi{120}&space;\alpha(u)&space;=&space;\begin{cases}&space;\frac{1}{\sqrt{2}},&space;&&space;\text{&space;if&space;}&space;u=0\\&space;1,&space;&&space;\text{&space;otherwise&space;}&space;\end{cases}" title="\alpha(u) = \begin{cases} \frac{1}{\sqrt{2}}, & \text{ if } u=0\\ 1, & \text{ otherwise } \end{cases}" /></a>
</figure>

Which can be expressed in CoffeeScript as:

```coffeescript
dct2 = (input) ->
  output = []
  for v in [0...8]
    for u in [0...8]
      sum = 0
      for y in [0...8]
        for x in [0...8]
          val = input[y*8+x]
          val *= Math.cos(((2*x+1) * u * Math.PI)/16)
          val *= Math.cos(((2*y+1) * v * Math.PI)/16)
          sum += val
      au = if u is 0 then 1/Math.SQRT2 else 1
      av = if v is 0 then 1/Math.SQRT2 else 1
      output[v*8+u] = 1/4 * au * av * sum
  output
```

## Quantization

Now that the block is represented as a collection of intensities of frequences, we can begin to reduce the relative intensitiy of the ones that the human eye is less sensitive to. This allows us to reduce the impact of higher frequency components, while maintaining a relatively good represenation of the initial block.

```coffeescript
quantizationMatrix = [
 16, 11, 10, 16, 24, 40, 51, 61,
 12, 12, 14, 19, 26, 58, 60, 55,
 14, 13, 16, 24, 40, 57, 69, 56,
 14, 17, 22, 29, 51, 87, 80, 62,
 18, 22, 37, 56, 68, 109, 103, 77,
 24, 35, 55, 64, 81, 104, 113, 92,
 49, 64, 78, 87, 103, 121, 120, 101,
 72, 92, 95, 98, 112, 100, 103, 99
]

quantize = (input, quant) -> Math.round(val / quant[i] for val, i in input)
```
This results in many high frequency components get rounded to zero, and the rest being represented as small positive or negative integers. These values are much more compressable than the original set or even the resulting raw DCT.

## Putting it to all together

```coffeescript
result = quantize(dct2(center(input)), quantizationMatrix)
```

<p data-height="507" data-theme-id="0" data-slug-hash="cpnbs" data-default-tab="result" data-user="32bitkid" class='codepen'>See the Pen <a href='http://codepen.io/32bitkid/pen/cpnbs/'>Discrete Cosine Transformation</a> by James Holmes (<a href='http://codepen.io/32bitkid'>@32bitkid</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

> Note: that the first table in the demo is editable. Feel free to play around with the numbers and observe the resulting changes to the resulting frequencies!

## Next up... Decompression
