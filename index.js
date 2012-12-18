exports.convert = function (options) {

  var perPage = options.per_page || options.perPage,
    page = options.page || 0;

  if(!perPage){
    throw new Error('per_page parameter is required');
  }

  return {
    skip: perPage * page,
    limit: perPage
  };
};

exports.convertMiddleware = function ( options ) {
  return function(req, res, next) {
    var convertOptions = {
      perPage: req.query.perPage || req.query.per_page || options.defaultPerPage,
      page: req.query.page
    };
    try{
      req.pageData = exports.convert(convertOptions);
      next();
    }catch(err){
      res.send(400, err);    
    }
  };
};

/* Initializes the linker with a link mask
 *  var linker = require('paginate').Linker('http://awesome.com/customers?per_page=$per_page&page=$page');
 * 
 * linker.createLinks(options) with options:
 * 
 *  - per_page: the amount of objects to retrieve in each page 
 *  - total: the total amount of objects in the object set
 *  - page: the current page index (base 0)
 *
 * It will return an object like this:
 * {
 *   'first': 'http://awesome.com/customers?per_page=30&page=10',
 *   'prev': 'http://awesome.com/customers?per_page=10&page=0',
 *   'next': 'http://awesome.com/customers?per_page=30&page=2',
 *   'last': 'http://awesome.com/customers?per_page=30&page=10'
 * } 
 */
exports.Linker = function (mask) {
  this.mask = mask;
  this.createLinks = function (options) {
    var perPage = options.per_page || options.perPage;

    var lastPage = options.total / perPage,
      result = {};

    result.first = mask.replace(/\$per_page/i, perPage)
                    .replace(/\$page/i, 0);

    if(options.page >= 1){
      result.prev = mask.replace(/\$per_page/i, perPage)
                      .replace(/\$page/i, options.page - 1);
    }

    if(lastPage >= options.page + 1){
      result.next = mask.replace(/\$per_page/i, perPage)
                      .replace(/\$page/i, options.page + 1);
    }

    result.last = mask.replace(/\$per_page/i, perPage)
                    .replace(/\$page/i, lastPage);

    return result;
  };

  this.createLinksHeader = function (options) {
    var links = this.createLinks(options);
    return Object.keys(links)
      .map(function (k){
        return '<' + links[k] + '>; rel="' + k + '"';  
      }).join(',');
  };
};