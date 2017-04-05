angular.module('telemetry')
    .controller('registerCtrl', function($scope, $state, $formTools, api, $localstorage) {
        $scope.register = {};
        $scope.api = {
        	register() {
                $formTools.spinner(true);
        		api.auth.register($scope.register, function(result) {
        			$state.go("app.verify");
                    $formTools.spinner(false);
	            }, function(error) {
                    $formTools.spinner(false);
	               $scope.error = $formTools.sortError("Register Error", error);
	            });
        	}
        };
	});