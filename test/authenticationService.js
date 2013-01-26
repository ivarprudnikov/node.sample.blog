var rewire = require("rewire")
	, should = require('should')
	, assert = require("assert")
	, auth = rewire('../services/authentication');

auth.__set__("mongoose", {
	model : function(role){return {}}
});

describe('Authentication service tests', function(){
	describe('Check ensure authenticated',function(){
		it('Continues with next()', function(done){
			var req = {
				isAuthenticated:function(){return true}
				}, res = {}, next = function(){return 'success';};
			auth.ensureAuthenticated(req,res,next).should.equal('success');
			done();
		});
		it('Fails and redirects', function(done){

			var mockedResults = { flash : {}, redirect : {}},
				req = {
					isAuthenticated:function(){return false},
					flash : function(type,route){ mockedResults.flash[type] = route}
				}, res = {
					redirect : function(route){ mockedResults['redirect'] = route }
				}, next = function(){return 'success';};

			should.not.exist( auth.ensureAuthenticated(req,res,next) )

			mockedResults.flash.should.eql( {'error':'Authentication required'} );
			mockedResults.redirect.should.eql( '/login' );
			done();

		});
	});

	describe('Throws error if no ROLE is passed',function(){
		it('is authenticated', function(done){
			(function(){
				auth.require();
			}).should.throw('ROLE is required');
			done();
		});
		it('Fails if user is not authenticated', function(done){
			var mockedResults = { flash : {}, redirect : {}},
				req = {
					isAuthenticated:function(){return false},
					flash : function(type,route){ mockedResults.flash[type] = route}
				}, res = {
					redirect : function(route){ mockedResults['redirect'] = route }
				}, next = function(){return 'success';};

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Authentication required'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
		it('Fails if authentication passes but no user in request', function(done){
			var mockedResults = { flash : {}, redirect : {}},
				req = {
					isAuthenticated:function(){return true},
					flash : function(type,route){ mockedResults.flash[type] = route}
				}, res = {
					redirect : function(route){ mockedResults['redirect'] = route }
				}, next = function(){return 'success';};

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Authentication required'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
		it('Fails if user has no roles at all', function(done){
			var mockedResults = { flash : {}, redirect : {}},
				req = {
					isAuthenticated:function(){return true},
					flash : function(type,route){ mockedResults.flash[type] = route},
					user : { authorities : [] }
				}, res = {
					redirect : function(route){ mockedResults['redirect'] = route }
				}, next = {};

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Not authorised to access this resource'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
		it('Throws if db throws when searching for roles', function(done){
			var req = {
					isAuthenticated:function(){return true},
					user : { authorities : ['bla','bla'] }
				}, res = {}, next = function(something){return something;};

			auth.__set__("mongoose", {
				model : function(role){
					return {
						find : function(obj){ throw new Error('bla') }
					}
				}
			});

			(function(){
				auth.require('some_role')(req,res,next)
			}).should.throw('bla');

			done();
		});
		it('Fails if no roles found in db', function(done){
			var mockedResults = { flash : {}, redirect : {}},
				req = {
					isAuthenticated:function(){return true},
					flash : function(type,route){ mockedResults.flash[type] = route},
					user : { authorities : ['bla'] }
				}, res = {
					redirect : function(route){ mockedResults['redirect'] = route }
				}, next = {};

			auth.__set__("mongoose", {
				model : function(role){
					return {
						find : function(obj,cb){ return cb(null,[]) }
					}
				}
			});

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Not authorised to access this resource'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
	});

});
