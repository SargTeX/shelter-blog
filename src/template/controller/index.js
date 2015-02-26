var app = angular.module('shelter', []);

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
	$http.get('/PostList').
		success(function(data, status, header, config) {
			$scope.posts = data.posts;
		});
}