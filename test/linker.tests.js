var Linker = require('../').Linker,
    linker = new Linker('http://awesome.com/customers?per_page=$per_page&page=$page');

 // * 
 // * linker.createLinks(options) with options:
 // * 
 // *  - per_page: the amount of objects to retrieve in each page 
 // *  - total: the total amount of objects in the object set
 // *  - page: the current page index (base 0)
 // *
 // * It will return an object like this:
 // * {
 // *   'first': 'http://awesome.com/customers?per_page=30&page=10',
 // *   'prev': 'http://awesome.com/customers?per_page=10&page=0',
 // *   'next': 'http://awesome.com/customers?per_page=30&page=2',
 // *   'last': 'http://awesome.com/customers?per_page=30&page=10'
 // * } 
 // */
 // 
describe('linker', function () {
  before(function () {
    this.result = linker.createLinks({
      per_page: 10,
      total: 100,
      page: 2
    });
  });

  it('can create the link to the first page', function () {
    this.result.first.should.eql('http://awesome.com/customers?per_page=10&page=0');
  });

  it('can create the link to the prev page', function () {
    this.result.prev.should.eql('http://awesome.com/customers?per_page=10&page=1');
  });

  it('can create the link to the next page', function () {
    this.result.next.should.eql('http://awesome.com/customers?per_page=10&page=3');
  });

  it('can create the link to the last page', function () {
    this.result.last.should.eql('http://awesome.com/customers?per_page=10&page=10');
  });

  describe('when there is not a next page', function(){
    before(function () {
      this.result = linker.createLinks({
        per_page: 10,
        total: 100,
        page: 10
      });
    });

    it('should not return a link to the next page', function () {
      this.result.should.not.have.property('next');
    });
  });

  describe('when there is not previous page', function(){
    before(function () {
      this.result = linker.createLinks({
        per_page: 10,
        total: 100,
        page: 0
      });
    });

    it('should not return a link to the prev page', function () {
      this.result.should.not.have.property('prev');
    });
  });

  describe('create links headers', function () {
    before(function () {
      this.result = linker.createLinksHeader({
        per_page: 10,
        total: 100,
        page: 2
      });
    });

    it('should work', function () {
      var expected = [
        '<http://awesome.com/customers?per_page=10&page=0>; rel="first"',
        '<http://awesome.com/customers?per_page=10&page=1>; rel="prev"',
        '<http://awesome.com/customers?per_page=10&page=3>; rel="next"',
        '<http://awesome.com/customers?per_page=10&page=10>; rel="last"'
      ].join(',');
      this.result.should.eql(expected);
    });

  });
});