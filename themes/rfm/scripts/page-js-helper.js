'use strict';

function jsHelper(){
  /* jshint validthis: true */
  var result = [];
  var path = '';

  for (var i = 0, len = arguments.length; i < len; i++){
    path = arguments[i];

    if (Array.isArray(path)) {
      result = result.concat(jsHelper.apply(this, path));
    } else {
      if (path.substring(path.length - 3, path.length) !== '.js') path += '.js';
      var url_resolver = (path.substring(0,2) === './') ? this.relative_url.bind(this, this.page.url) : this.url_for.bind(this);
      result.push('<script src="' + url_resolver(path) + '" type="text/javascript"></script>');
    }
  }

  return result;
}

hexo.extend.helper.register('page_js', function() {
  if (!this.page || !this.page.js) return;
  return jsHelper.apply(this, this.page.js).join('\n');
});
