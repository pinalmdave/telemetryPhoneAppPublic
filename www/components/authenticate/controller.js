angular.module('telemetry')
	.controller('authCtrl', function($rootScope, $scope, $state, api, $localstorage, $formTools) {
        $scope.auth = {};

        $scope.api = {
            authenticate() {
                $formTools.spinner(true);
                api.auth.authenticate($scope.auth, function(result) {
                    $localstorage.set("email", result[0].email);
                    $localstorage.setObject("token1", result[0].token);
                    $scope.api.allowAccess();
                },function(error) {
                    $formTools.spinner(false);
                    if (error.errors[0].code == "69") {
                        error = error.errors[0].message
                        alert(error);
                    } else {
                        $scope.error = $formTools.sortError("Authenticate Error", error);
                    };
                });
            },

            allowAccess() {
                api.auth.allowAccess(function(result) {
                    $localstorage.remove("token1");
                    $localstorage.setObject("token", result[0].token);
                    $formTools.spinner(false);
                    $state.go('app.home');
                }, function(error){
                    $formTools.spinner(false);
                    $scope.error = $formTools.sortError("Allow Access Error", error);
                });
            }
        };
	});