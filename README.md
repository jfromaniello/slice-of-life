Helper functions to create paginated REST APIs in node.js. Took some ideas from the [github api v3](http://developer.github.com/v3/#pagination). 

![slice of life boat](http://aux.iconpedia.net/uploads/1050712019.png)

> I took the name from [Dexter Morgan boat](http://dexter.wikia.com/wiki/Slice_of_Life) because I like the show and paginate is already used :)

## Installation

	npm install slice-of-life

## The convert method

This is useful for cases when you want to ask the consumer just the **page number** and maybe the **per page** amount of objects, but you have to convert this information to the classical **skip**, **take**, **limit**.

~~~javascript
var sliceOfLife = require('slice-of-life');

var pageData = sliceOfLife.convert({
  per_page: 100, //perPage also works
  page: 5
});

console.log(pageData);

// will print {skip: 500, limit: 100} as simple as that.  
~~~

## The convert middleware

There is also an express middleware to do the convert

~~~javascript
var sliceOfLife = require('slice-of-life');

//setup
app.use(sliceOfLife.convertMiddleware({defaultPerPage: 100}));

//then in a route:

app.get('/customers', function (req, res) {
  console.log(req.pageData);
  //will print {skip: xx, limit: xx};
});
~~~

## The Linker

SliceOfLife has also a linker class to create links to other pages.

~~~javascript
var Linker = require('slice-of-life').Linker,
	linker = new Linker('http://awesome.com/products?per_page=$per_page&page=$page');

var links = linker.createLinks({
 per_page: 10,
 total: 100,
 page: 5
});

console.log(links);

/* It will return an object like this:
  {
    'first': 'http://awesome.com/products?per_page=30&page=10',
	'prev': 'http://awesome.com/products?per_page=10&page=0',
	'next': 'http://awesome.com/products?per_page=30&page=2',
	'last': 'http://awesome.com/products?per_page=30&page=10'
  }
*/
~~~

The create links method needs these options:

-  per_page: the amount of objects to retrieve in each page 
-  total: the total amount of objects in the object set
-  page: the current page index (base 0)

### linker.createLinksHeader

The **createLinksHeader** method of the linker does the same thing than **createLinks** but it returns an string with the [Links header format](http://www.w3.org/Protocols/9707-link-header.html).

~~~javascript

var links = linker.createLinksHeader({
 per_page: 10,
 total: 100,
 page: 5
});

console.log(links);

/*
It will print something like:

<http://awesome.com/customers?per_page=10&page=0>; rel="first",
  <http://awesome.com/customers?per_page=10&page=1>; rel="prev",
  <http://awesome.com/customers?per_page=10&page=3>; rel="next",
  <http://awesome.com/customers?per_page=10&page=10>; rel="last"

(without line breaks)
*/
~~~

## License

I know how hard and well-engineered this thing seems but I don't want to be billionary with this module, so this is MIT licensed :)