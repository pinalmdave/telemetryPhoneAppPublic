angular.module('telemetry')
	.controller('alertsCtrl', function($rootScope, $scope, $state, api, $localstorage, $formTools, $interval, $q) {
        var storage     = $formTools.checkTokenAndEmail();
        $scope.email    = storage.email;

        var alertTime = new time();

        $scope.api = {
            rtus() {
                $formTools.spinner(true);
                api.rtus.get(function(result) {
                    console.info('Get RTUs Result', result);
                    $scope.rtus = result;
                    $scope.api.alerts();
                }, function(error) {
                    console.info('Get RTUs Error', error);
                });
            },

        	alerts() {
        		api.alerts.get(function(result) {
        			console.info('Get Alerts Result', result);
                    $scope.alerts = [];
                    for (var a = result.length - 1; a >= 0; a--) {
                        $scope.alerts.push({
                            "time":         alertTime.getCurrentDifference(result[a].serverDate),
                            "rtuId":        result[a].rtuId,
                            "message":      result[a].message,
                            "serverDate":   result[a].serverDate
                        });
                    };
                    console.log($scope.alerts);
                    $interval(function() {
                        $scope.alerts.map(function(obj) {
                            return obj.time = alertTime.getCurrentDifference(obj.serverDate)
                        });
                    }, 1000);
        			$formTools.spinner(false);
        		}, function(error) {
        			console.info('Get Alerts Error', error);
        			$formTools.spinner(false);
        		});
        	}
        };

        if ($formTools.allowApiCall()) {
        	$scope.api.rtus();
        };
    });