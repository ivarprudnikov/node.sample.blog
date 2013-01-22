/**
 * Created with JetBrains WebStorm.
 * User: aprudnikovas
 * Date: 19/01/2013
 * Time: 22:26
 * To change this template use File | Settings | File Templates.
 */

'use strict';

function RoleHierarchy(){}

var roleConfig = [
	'ROLE_SUPERADMIN > ROLE_ADMIN'
	, 'ROLE_ADMIN > ROLE_USER'
	, 'ROLE_ADMIN > ROLE_API'
	, 'ROLE_API > ROLE_TINY_API'
];

/**
 * @param rl {String} Role to check against
 * @param callback {Function} callback
 * @return Array
 */
RoleHierarchy.prototype.getDirectLowerRoles = function(rl,callback){

	if ('string' !== typeof rl) throw new Error('role is required');
	if ('function' !== typeof callback) throw new Error('callback function required');
	if (!Array.isArray(roleConfig)) throw new Error('role config not properly set');
	if ( roleConfig.length < 1 ) {
		return callback([]);
	}

	var lowerRoles = [], configRoles = roleConfig, x = configRoles.length;

	configRoles.forEach(function(it){

		if ( it.indexOf('>') !== -1 ){
			var parts = it.split('>');
			// push first level
			if( parts.length === 2 && parts[0].trim() === rl ){
				lowerRoles.push(parts[1].trim());
			}
		}

		x -= 1;

		if(x===0) {
			return callback(lowerRoles);
		}
	});

};

/**
 * @param rl {String} Role to check against
 * @param callback {Function} callback
 * @return Array
 */
RoleHierarchy.prototype.getLowerRoles = function(rl, callback) {

	if ('string' !== typeof rl) {
		throw new Error('role is required');
	}
	if ('function' !== typeof callback){
		throw new Error('callback function required');
	}

	var self = this, lowerRoles = [], roleCache = [];

	self.getDirectLowerRoles(rl, function (arr) {
		// add 1st level deep
		lowerRoles = roleCache = self.uniqueRoles( lowerRoles.concat(arr) );

		// go deeper
		if (lowerRoles.length > 0){

			var i, j, secondLayer = [], thirdLayer = [],
				mergeThirdLayer = function(roleArray){

					thirdLayer = self.uniqueRoles( thirdLayer.concat(roleArray) );

					if( j === 0 ){
						lowerRoles = lowerRoles.concat(thirdLayer);
						callback(lowerRoles);
					}
				},
				mergeSecondLayer = function(roleArray){

					secondLayer = self.uniqueRoles( secondLayer.concat(roleArray) );

					if( i === 0 ){

						lowerRoles = lowerRoles.concat(secondLayer);

						if (lowerRoles.length !== roleCache.length) {

							// extract difference and iterate
							// through newly added roles again

							// extract `fresh` roles
							var diff = self.diff(lowerRoles,roleCache);

							// renew cache
							roleCache = lowerRoles;

							// look for third layer
							for (j = diff.length - 1; j >= 0; --j) {
								self.getDirectLowerRoles( diff[j], mergeThirdLayer );
							}

						} else {
							callback(lowerRoles);
						}
					}
				};

			for (i = lowerRoles.length - 1; i >= 0; --i) {
				self.getDirectLowerRoles( lowerRoles[i], mergeSecondLayer );
			}

		} else {
			callback(lowerRoles);
		}

	});

};

/**
 * @param arr1 {Array} array to check
 * @param arr2 {Array} array which reveals diff
 * @return Array
 */
RoleHierarchy.prototype.diff = function(arr1,arr2) {
	if ( !Array.isArray(arr1) || !Array.isArray(arr2) ) {
		throw new Error('two arrays required');
	}
	return arr1.filter(function(el) {
		return ( arr2.indexOf(el) < 0 );
	});
};

/**
 * @param arr {Array} Roles to filter
 * @return Array
 */
RoleHierarchy.prototype.uniqueRoles = function(arr){

	if (!Array.isArray(arr)) {
		throw new Error('array of roles required');
	}
	var o = {}, i, l = arr.length, r = [];
	for(i=0; i<l;i+=1) {
		o[arr[i]] = arr[i];
	}
	for(i in o) {
		r.push(o[i]);
	}
	return r;

};

module.exports = exports = new RoleHierarchy();