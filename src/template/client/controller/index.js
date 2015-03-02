var serverAdress = "http://localhost:2000";

var app = angular.module('shelter', []);
app.controller("TestCtrl", function($scope, $http) {
	$http.get(serverAdress + "/PostAdd", {params: {
		title: "Test Title",
		content: "Test Content",
		languageId: "en"
	}}).
		success(function(data, status, headers, config) {
			//$scope.posts = data;
			console.log(data);
		}).
		error(function(data, status, headers, config) {
			console.log('Error!', data);
		});
});
app.controller("LoginCtrl", function($scope, $http) {
	$scope.user = {};

	$scope.processLogin = function() {
		$http.post(serverAdress + "/UserLogin", {user: $scope.user}).
			success(function(data) {
				console.log(data);
			}).
			error(function(data) {
				console.log('Error!', data);
			});
	};
})
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