angular.module('telemetry')
    .controller('homeCtrl', function($scope, api, $formTools, $pin, $q, $interval, $ionicScrollDelegate) {
        var storage     = $formTools.checkTokenAndEmail();
        $scope.email    = storage.email;
        var homeTime 	= new time();

		$scope.listCanSwipe 	= true;

		$scope.api = {
        	rtus() {
        		var deferred = $q.defer();
        		$formTools.spinner(true);
        		api.rtus.get(function(result) {
        			for (var a = result.length - 1; a >= 0; a--) {
                        for (var b = result[a].rtuData.length - 1; b >= 0; b--) {
                            result[a].rtuData[b].statuses = [];
                            for (var key in result[a].rtuData[b].dataIn) {
                                if (result[a].rtuData[b].dataIn.hasOwnProperty(key)) {
                                    result[a].rtuData[b].statuses.push({
                                        "from":     key,
                                        "value":    parseInt(result[a].rtuData[b].dataIn[key])
                                    });
                                };
                            };
                        };
                    };
					$formTools.spinner(false);
        			console.info('Get RTU Result', result);
                    deferred.resolve(result);
        		}, function(error) {
					$formTools.spinner(false);
        			deferred.reject(error);
        		});

        		return deferred.promise;
        	}
        };

		$scope.control = {
			pins: {
				delete(module, pos) {
					for (var a = $scope.pins.length - 1; a >= 0; a--) {
						for (var b = $scope.pins[a].statuses.length - 1; b >= 0; b--) {
							if (module.rtuId == $scope.pins[a].rtuId && module.module == $scope.pins[a].module) {
								if ($scope.pins[a].statuses[b].position == pos) {
									$pin.remove(module);
									$scope.pins[a].statuses.splice(b, 1);
								};
								if ($scope.pins[a].statuses.length == 0) {
									$scope.pins.splice(a, 1);
								};
							};
						};
					};
				},

				position: {
					up(index, pos) {
						if ($scope.pins[index].position > 0) {
							for (var i = $scope.pins.length - 1; i >= 0; i--) {
								if ($scope.pins[i].position == (pos - 1)) {
									$scope.pins[i].position = $scope.pins[i].position + 1;
								};
							};
							$scope.pins[index].position = $scope.pins[index].position - 1;
						};
					},

					down() {

					}
				}
			},

			load() {
        		$scope.delete = false;
				$scope.api.rtus().then(function(rtus) {
					$pin.get().then(function(pins) {
                        $scope.$broadcast('scroll.refreshComplete');
						$pin.setDescriptions(pins, rtus).then(function(pins) {
							$scope.pins = pins;
							if ($scope.pins.length > 0) {
                            $interval(function() {
                                for (var i = $scope.pins.length - 1; i >= 0; i--) {
                                    if ($scope.pins[i].lastComms) {
                                        $scope.pins[i].lastComms = homeTime.getCurrentDifference($scope.pins[i].rtuDate)
                                    };
                                };
                            }, 1000);
                        };
							console.log("Modeled Pins", pins);
                            $scope.$broadcast('scroll.refreshComplete');

						});
					}, function(error) {
						// body...
                        $scope.$broadcast('scroll.refreshComplete');
					});

				});
			},



			hold() {
				alert();
			}
		};

		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		$scope.series = ['Series A'];
		$scope.colors = ["rgba(37,100,196,1)","rgba(125,7,207,1)","rgba(124,219,112,1)","rgba(195,78,24,1)"];
		$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
		$scope.options = {
			scales: {
				yAxes: [
					{
						id: 		'y-axis-1',
						type: 		'linear',
						display: 	true,
						position: 	'left'
					}
				]
			}
		};

        if ($formTools.allowApiCall()) {
			$scope.control.load();
		};
    });