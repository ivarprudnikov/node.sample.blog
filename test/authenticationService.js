var rewire = require("rewire")
	, should = require('should')
	, auth = rewire('../services/authentication');

auth.__set__("mongoose", {
	model : function(role){return {}}
});

describe('Authentication service tests', function(){
	describe('Check ensure authenticated',function(){
		it('is authenticated', function(done){
			var req = {
				isAuthenticated:function(){return true}
				}, res = {}, next = function(){return 'success';};
			auth.ensureAuthenticated(req,res,next).should.equal('success');
			done();
		});
	});
});
