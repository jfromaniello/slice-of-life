var paginate = require('../');
var _ = require('lodash');

describe('paginate.convert', function () {
  beforeEach(function () {
    this.fixture = _.range(50);
  });

  it('{per_page: 10, page: 0} to {skip: 0, take: 10}', function () {
    var result = paginate.convert({per_page: 10, page: 0});
    result.skip.should.eql(0);
    result.limit.should.eql(10);
  });

  it('{per_page: 10, page: 1} to {skip: 10, take: 10}', function () {
    var result = paginate.convert({per_page: 10, page: 0});
    result.skip.should.eql(0);
    result.limit.should.eql(10);
  });

  it('{perPage: 10, page: 1} to {skip: 10, take: 10}', function () {
    var result = paginate.convert({perPage: 10, page: 0});
    result.skip.should.eql(0);
    result.limit.should.eql(10);
  });

  it('should work for splice', function(){
    var pageData = paginate.convert({per_page: 10, page: 0}),
        page = this.fixture.splice(pageData.skip, pageData.limit);
    
    _.difference(page, _.range(10))
      .should.be.empty; 
  });

  it('should work for splice 2', function(){
    var pageData = paginate.convert({per_page: 10, page: 1}),
        page = this.fixture.splice(pageData.skip, pageData.limit);
    
    _.difference(page, _.range(10, 20))
      .should.be.empty; 
  });
});