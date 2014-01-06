var should = require('should');

var user = {
    name: 'css-find'
};

describe('integration', function(){
  it('run', function(){
    user.should.have.property('name', 'css-find');
  })
})
