angular.module('telemetry')
    .controller('statusesCtrl', function($rootScope, $scope, api, $formTools, $localstorage, $ionicModal, $q, $pin, $interval) {
        var storage     = $formTools.checkTokenAndEmail();
        $scope.email    = storage.email;
        var statusTime  = new time();
        $scope.selected = {};

        $scope.orderBy = "-serverDate";

        $scope.api = {
        	rtus() {
        		$formTools.spinner(true);
        		api.rtus.get(function(result) {
                    for (var i = result.length - 1; i >= 0; i--) {
                        result[i].lastComms = statusTime.getCurrentDifference(result[i].serverDate)
                    };
                    $rootScope.rtus = result;
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
                    if ($rootScope.rtus.length > 0) {
                        $interval(function() {
                            for (var i = $rootScope.rtus.length - 1; i >= 0; i--) {
                                if ($rootScope.rtus[i].lastComms) {
                                    $rootScope.rtus[i].lastComms = statusTime.getCurrentDifference($rootScope.rtus[i].serverDate)
                                };
                            };
                        }, 1000);
                    };
        			console.info('Get RTU Result', result);
        			$formTools.spinner(false);
                    $scope.$broadcast('scroll.refreshComplete');
        		}, function(error) {
        			$formTools.spinner(false);
                    $scope.$broadcast('scroll.refreshComplete');
        		});
        	}
        };

        $ionicModal.fromTemplateUrl('components/statuses/views/stat.html', {
            scope:      $scope,
            animation:  'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $ionicModal.fromTemplateUrl('components/statuses/views/pin.html', {
            scope:      $scope,
            animation:  'slide-in-up'
        }).then(function(pinSelector) {
            $scope.pinSelector = pinSelector;
        });    

        $scope.control = {
            modals: {
                open(_id) {
                    $scope.control.rtus.select(_id).then(function(rtu) {
                        $scope.modules = [];

                        for (var a = rtu.rtuData.length - 1; a >= 0; a--) {
                            var statuses = [];
                            for (var b = rtu.rtuData[a].data.io.length - 1; b >= 0; b--) {
                                for (var i = rtu.rtuData[a].statuses.length - 1; i >= 0; i--) {
                                    var idArr = rtu.rtuData[a].data.io[b].id.split('.');
                                    var desc = idArr[idArr.length - 1];
                                    if (desc == rtu.rtuData[a].statuses[i].from) {
                                        statuses.push({
                                            "unit":         rtu.rtuData[a].data.io[b].units,
                                            "value":        rtu.rtuData[a].statuses[i].value,
                                            "desegnation":  desc,
                                            "description":  rtu.rtuData[a].data.io[b].description
                                        });
                                    };
                                };
                                
                            };
                            $scope.modules.push({
                                module:     rtu.rtuData[a].moduleId,
                                rtuDate:    rtu.rtuData[a].rtuDate,
                                statuses:   statuses,
                                lastComms:  statusTime.getCurrentDifference(rtu.rtuData[a].rtuDate)
                            });
                        };

                        if ($scope.modules.length > 0) {
                            $interval(function() {
                                for (var i = $scope.modules.length - 1; i >= 0; i--) {
                                    if ($scope.modules[i].lastComms) {
                                        $scope.modules[i].lastComms = statusTime.getCurrentDifference($scope.modules[i].rtuDate)
                                    };
                                };
                            }, 1000);
                        };

                        console.log("modules", $scope.modules)

                        $scope.modal.show();
                    }, function(error) {
                        console.error(error)
                    });
                },

                close() {
                    $scope.modal.hide();
                }
            },

            rtus: {
                select(_id) {
                    var deferred = $q.defer();

                    $scope.rtu = {};
                    for (var i = $rootScope.rtus.length - 1; i >= 0; i--) {
                        if ($rootScope.rtus[i]._id == _id) {
                            $scope.rtu = JSON.parse(angular.toJson($rootScope.rtus[i]));
                            deferred.resolve($scope.rtu);
                        };
                    };
                    if (typeof $scope.rtu._id == "undefined") {
                        deferred.reject('no rtu found');
                    };

                    return deferred.promise;
                }
            },

            status: {
                compile(rtu) {
                    var deferred = $q.defer();

                    var statuses = [];

                    for (var key in rtu.dataIn) {
                        if (rtu.dataIn.hasOwnProperty(key)) {
                            statuses.push({
                                "from":     key,
                                "value":    parseInt(rtu.dataIn[key])
                            });
                        };
                    };

                    if (statuses.length > 0) {
                        deferred.resolve(statuses);
                    } else {
                        deferred.resolve('statuses are empty');
                    };

                    return deferred.promise;
                }
            },

            modules: {
                select() {

                }
            },

            pins: {
                open($event, module, stat) {
                    $scope.selected.graph    = false;
                    $scope.selected.status   = false;
                    $scope.module = module;
                    $scope.desegnation = stat.desegnation;
                    $scope.pinSelector.show($event);

                    $scope.pin = {
                        "rtuId":        $scope.rtu._id,
                        "module":       module,
                        "position":     Math.random(),
                        "desegnation":  stat.desegnation
                    };

                    console.log(stat.desegnation);

                    var setCheck = $pin.isSet($scope.rtu._id, module, stat.desegnation);

                    if (setCheck.isSet) {
                        $scope.selected.graph    = setCheck.graph;
                        $scope.selected.status   = setCheck.status;
                    };
                },

                set(type) {
                    var setCheck = $pin.isSet($scope.rtu._id, $scope.module, $scope.desegnation, type);

                    if (!setCheck.isSet) {
                        $scope.pin.type = type;
                        $pin.set($scope.pin);
                        $scope.pin;
                    };
                }
            }
        };

        if ($formTools.allowApiCall()) {
            $scope.api.rtus();
        };
    });