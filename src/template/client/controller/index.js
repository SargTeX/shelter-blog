var app = angular.module('shelter', []);
app.controller("TestCtrl", function($scope, $http) {
	$http.get("http://localhost:2000/PostList").
		success(function(data, status, headers, config) {
			$scope.posts = data;
		}).
		error(function(data, status, headers, config) {
			console.log('Error!');
		});
});
/*
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'blog',
			controller: BlogCtrl
		}).
		otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true);
}]);

function BlogCtrl($scope, $http) {
	$http.get('/').
		success(function(data, status, header, config) {
			$scope.posts = data.posts;
		});
}
*/