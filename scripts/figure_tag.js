'use strict';
var classTest = /^class[:=]["']?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)["']?$/i;
var idTest = /^id[:=]["']?([_a-zA-Z]+[:_a-zA-Z0-9-]*)["']?$/i;

hexo.extend.tag.register('figure', function(args, content) {
  var captiontext =  [], classes = [], result, id = undefined;
  for(var i=0;i<args.length;i++) {

    if ((result = classTest.exec(args[i]))) {
      classes.push(result[1]);
    } else if ((result = idTest.exec(args[i]))) {
      id = result[1];
    } else {
      captiontext.push(args[i]);
    }
  }

  var caption = (captiontext.length > 0)
    ? '<figcaption>' + captiontext.join(' ') + '</figcaption>'
    : '';

  var classAttr = (classes.length > 0)
    ? ' class="'+ classes.join(' ') +'"'
    : '';

  var idAttr = (id)
    ? ' id="' + id + '"'
    : '';

  return '<figure' + idAttr + classAttr + '>' +
    caption +
    hexo.render.renderSync({text:content.trim(), engine:'markdown'}) +
  '</figure>';
}, {ends: true});
