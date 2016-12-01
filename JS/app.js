var nyslApp = angular.module('nyslApp', []);

nyslApp.controller('NyslController', function($scope, $http){
	$http.get('JS/data.json').success(function(data) {
		$scope.games = data.games;
		console.log($scope.games);
		$scope.locations = data.locations;
		console.log($scope.locations);
	});
	

	$scope.locationName = "My location";
	$scope.locationAddress = "My address";
	
	
	
	//$scope.showLocationId = function(event) { //this function will be stored when page is loaded but only executed when clicked on.
		//console.log($(event.target).attr("id"));
	//};

	
	$scope.fillLocationInfo = function(locations){
		//$(".page").hide();
		//$("#locationInfo").show();
		$scope.locationName = "new location";
    $scope.locationAddress = "new address";
	};
	
  
	
	
	
});