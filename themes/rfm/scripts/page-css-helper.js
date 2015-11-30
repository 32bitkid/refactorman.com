'use strict';

function cssHelper(url) {
  /* jshint validthis: true */
  var result = [];
  var path = '';

  for (var i = 0, len = arguments.length; i < len; i++){
    path = arguments[i];

    if (Array.isArray(path)) {
      result = result.concat(cssHelper.apply(this, path));
    } else {
      if (path.substring(path.length - 4, path.length) !== '.css') path += '.css';
      var url_resolver = (path.substring(0,2) === './') ? this.relative_url.bind(this, this.page.url) : this.url_for.bind(this);
      result.push('<link rel="stylesheet" href="' + url_resolver(path) + '" type="text/css">');
    }
  }

  return result;
};

hexo.extend.helper.register('page_css', function() {
  if (!this.page || !this.page.css) return;
  return cssHelper.apply(this, this.page.css).join('\n');
});

hexo.extend.helper.register('page_css_add', function(p) {
  if (!this.page) return;
  if (!this.page.css) { this.page.css = []; }
  if (this.page.css.indexOf(p) === -1) { this.page.css.push(p); }
});
