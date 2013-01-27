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
		it('Returns next() if role matches', function(done){
			var req = {
					isAuthenticated : function(){ return true; },
					user : { authorities : ['bla'] }
				}, res = {};
			auth.__set__("mongoose", {
				model : function(role){
					return {
						find : function(obj,cb){ return cb(null,[{authority:'matching_role'}]) }
					}
				}
			});

			auth.require('matching_role')(req,res,function(){
				done();
			});
		});
		it('Fails if there are no roles in role hierarchy', function(done){
			var mockedResults = { flash : {}, redirect : {} },
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
						find : function(obj,cb){ return cb(null,[{authority:'other_role'}]) }
					}
				}
			});
			auth.__set__("roleCompare", {
				getLowerRoles : function(role,cb){
					return cb([])
				}
			});

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Not authorised to access this resource'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
		it('Fails if there are no matching roles in role hierarchy', function(done){
			var mockedResults = { flash : {}, redirect : {} },
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
						find : function(obj,cb){ return cb(null,[{authority:'other_role'}]) }
					}
				}
			});
			auth.__set__("roleCompare", {
				getLowerRoles : function(role,cb){
					return cb(['not_matching_child_role','another_not_matching_role'])
				}
			});

			should.not.exist( auth.require('some_role')(req,res,next) );

			mockedResults.flash.should.eql( {'error':'Not authorised to access this resource'} );
			mockedResults.redirect.should.eql( '/login' );
			done();
		});
		it('Returns next() if role matches one in role hierarchy tree', function(done){
			var req = {
				isAuthenticated : function(){ return true; },
				user : { authorities : ['role_ids_array'] }
			}, res = {};
			auth.__set__("mongoose", {
				model : function(role){
					return {
						find : function(obj,cb){
							return cb(null,[{authority:'x'},{authority:'y'},{authority:'z'}])
						}
					}
				}
			});
			auth.__set__("roleCompare", {
				getLowerRoles : function(role,cb){
					if(role === 'z')return cb(['matching_role'])
					return cb(['not_matching_role'])
				}
			});
			auth.require('matching_role')(req,res,function(){
				done();
			});
		});
	});

});
