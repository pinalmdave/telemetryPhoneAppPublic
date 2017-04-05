angular.module('telemetry')
    .controller('verifyCtrl', function($scope, $state, $formTools, api, $localstorage) {
        $scope.verify = {
            "email": $localstorage.get("email")
        };

        $scope.api = {
        	verify() {
        		api.auth.verify($scope.verify, function(result) {
        			$state.go("app.authenticate");
	            },function(error) {
	               $scope.error = $formTools.sortError("Verify Error", error);
	            });
        	}
        };

        $scope.cancel = function() {
            $localstorage.remove('email');
            $state.go('app.authenticate');
        };
	});