'use strict';
var classTest = /^class[:=]["']?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)["']?$/i;
var idTest = /^id[:=]["']?([_a-zA-Z]+[:_a-zA-Z0-9-]*)["']?$/i;

hexo.extend.tag.register('aside', function(args, content) {
  return '<aside>' +
    hexo.render.renderSync({text:content.trim(), engine:'markdown'}) +
  '</aside>';
}, {ends: true});
