(function() {
  var c10 = d3.scale.category10();

  var createSignalGraph = function(sel, signal, idx, other, idx2) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scale.linear()
      .range([0, width])
      .domain([-0.5, signal.length - 1 + 0.5]);

    var y = d3.scale.linear()
      .range([height , 0])
      .domain(d3.extent(signal))
      .nice();

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .tickFormat("")
        .orient("bottom")
        .ticks(0);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Adds the svg canvas
    var root = d3.select(sel);

    var table = root.append("table").classed("pull", true);
    var thead = table.append("thead");
    thead.append("th").text("#");
    thead.append("th").text("Value").attr("colspan", 2)
    if(other)
      thead.append("th").html("&plusmn;").attr("colspan", 2)

    var tbody = table.insert("tbody");

    var svg = root
        .append("svg")
            .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


    var item = function(idx){
      return function(sel) {
        sel.append("line")
          .style({'stroke-width': '2'})
          .attr("stroke", c10(idx))
          .attr("x1", function(d,i) { return x(i); })
          .attr("y1", function(d,i) { return y(d); })
          .attr("x2", function(d,i) { return x(i); })
          .attr("y2", Math.min(y(0), height));

        sel.append("path")
          .attr("transform", function(d,i) {
            return "translate(" + x(i) + ", "+ y(d) +")";
          })
          .attr("fill", c10(idx))
          .attr("d", d3.svg.symbol().type(d3.svg.symbolTypes[idx % d3.svg.symbolTypes.length]));
      }
    };

    var valueFormatter = d3.format(".1f");
    var dataRowSingle = function(sel) {
      sel.append("th").text(function(d,i) { return i; });
      sel.append("td").text(function(d,i) { return valueFormatter(d); });
    };
    var dataRowDouble = function(sel) {
      sel.append("th").text(function(d,i) { return i; });
      sel.append("td").text(function(d,i) { return valueFormatter(d[0]); });
      sel.append("td").text(function(d,i) { return valueFormatter(d[1]); });
      sel.append("th").text(function(d,i) { return valueFormatter(d[1] -d[0]); });
    };


    // Add the X Axis
    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + Math.min(y(0), height) + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .classed("y axis", true)
        .call(yAxis);

    if(other) {
      svg.selectAll(".signal2")
        .data(other)
        .enter()
        .append("g")
          .classed("signal2", true)
          .call(item(idx2));
    }

    svg.selectAll(".signal")
      .data(signal)
      .enter()
      .append("g")
        .classed("signal", true)
        .call(item(idx));

    tbody
      .selectAll("tr")
      .data(other ? d3.zip(signal, other) : signal)
      .enter()
      .append("tr").call(other ? dataRowDouble : dataRowSingle);

  };

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

  var idct1d = function(dct) {
    var N = dct.length,
        signal = [],
        sum, k, n, s;

    for(n=0; n<N; n++) {
      sum = 0;
      for(k=0; k<N; k++) {
        s = k===0 ? 1/Math.sqrt(2) : 1;
        sum += s * dct[k] * Math.cos(Math.PI * (n+0.5) * k / N);
      }
      signal[n] = Math.sqrt(2/N) * sum;
    }
    return signal;
  };

  var source = [8,16,24,32,40,48,56,64];
  createSignalGraph("#signal-viz-1", source,1);
  var coeff = dct1d(source);
  createSignalGraph("#signal-viz-2", coeff,2);
  var reconstructedSignal = idct1d(coeff);
  createSignalGraph("#signal-viz-3", reconstructedSignal,3);
  createSignalGraph("#signal-viz-4", coeff,2);
  var quantized = coeff.map(function(v) { return (v/50)|0; });
  createSignalGraph("#signal-viz-5", quantized,4);
  var dequantized = quantized.map(function(v) { return v*50; });
  createSignalGraph("#signal-viz-6", dequantized,5);
  var decompressedSignal = idct1d(dequantized);
  createSignalGraph("#signal-viz-7", decompressedSignal,6);
  createSignalGraph("#signal-viz-8", source, 1, decompressedSignal,6);
})();
