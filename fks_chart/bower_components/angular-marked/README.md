# angular-marked
AngularJS Markdown using [marked](https://github.com/chjj/marked).

## Usage
1. `bower install angular-marked` or `bower install Hypercubed/angular-marked`
2. Include the `marked.js` script into your app.  By default should be at `bower_components/marked/lib/marked.js`.
3. Include the `angular-marked.js` into your app.  By default should be at `bower_components/angular-marked/angular-marked.js`.
4. Add `hc.marked` as a module dependency to your app.

### Set default options (optional)

```js

	app.config(['markedProvider', function(markedProvider) {
	  markedProvider.setOptions({gfm: true});
	}]);
```

Example using [highlight.js Javascript syntax highlighter](http://highlightjs.org/) (must include highlight.js script).

```js
	markedProvider.setOptions({
      gfm: true,
      tables: true,
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });
```

### As a directive

```html

	<marked>   
	     #Markdown directive   
	     *It works!*  
	</marked>
```

Bind the markdown input to a scope variable:

```html

	<div marked="my_markdown"> 
	</div>
	<!-- Uses $scope.my_markdown -->
```

Include a markdown file:

```html

	<div marked ng-include="'README.md'"> 
	</div>
	<!-- Uses markdown content from README.md -->
```

### As a service

```js

	app.controller('myCtrl', ['marked', function(marked) {
	  $scope.html = marked('#TEST');
	}]);
```

## Testing

Install npm and bower dependencies: 

```
	npm install
	bower install
	npm test
```

## Why?

I wanted to use `marked` instead of `showdown` as used in `angular-markdown-directive` as well as expose the option to globally set defaults.  Yes, it is probably best to avoid creating a bunch of angular wrapper modules... but I use this enough across multiple projects to make it worth while for me.  Use it if you like.  Pull requests are welcome.

## Acknowledgments
Based on [angular-markdown-directive](https://github.com/btford/angular-markdown-directive) by [briantford](http://briantford.com/) which, in turn, is based on [this excellent tutorial](http://blog.angularjs.org/2012/05/custom-components-part-1.html) by [@johnlinquist](https://twitter.com/johnlindquist).

## License
MIT
