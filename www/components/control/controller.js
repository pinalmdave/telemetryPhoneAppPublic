angular.module('telemetry')
    .controller('controlCtrl', function($scope, api, $formTools, $localstorage) {
        var storage     = $formTools.checkTokenAndEmail();
        $scope.email    = storage.email;

        $scope.api = {
        	rtus() {
        		$formTools.spinner(true);
        		api.rtus.get(function(result) {
                    $scope.rtus = result;
        			console.info('Get RTU Result', result);
        			$formTools.spinner(false);
        		}, function(error) {
        			$formTools.spinner(false);
        		});
        	}
        };

        if ($formTools.allowApiCall(storage)) {
            // API CALL
        };
    });