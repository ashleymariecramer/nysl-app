var nyslApp = angular.module('nyslApp', []);

nyslApp.controller('NyslController', function($scope, $http){
	$http.get('JS/data.json').success(function(data) {
		$scope.games = data.games;
		console.log($scope.games);
		$scope.locations = data.locations;
		console.log($scope.locations);
	});
	
	$scope.showLocationInfo = function() { //this function will be stored when page is loaded but only executed when clicked on.
		$scope.location.name = "My location";
		$scope.location.address = "My address";
	};
	
	
	
	
	
	
});