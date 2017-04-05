angular.module('telemetry')
	.controller('profileCtrl', function($rootScope, $scope, api, $ionicModal, $formTools) {
        var storage     = $formTools.checkTokenAndEmail();
        $scope.email    = storage.email;

		$ionicModal.fromTemplateUrl('components/profile/views/edit.html', {
            scope:      $scope,
            animation: 'slide-in-up'
        }).then(function(editProfile) {
            $scope.editProfile = editProfile;
        });

        $ionicModal.fromTemplateUrl('components/profile/views/password.html', {
            scope:      $scope,
            animation: 'slide-in-up'
        }).then(function(passwordModal) {
            $scope.passwordModal = passwordModal;
        });

        $scope.api = {
            update() {
                $formTools.spinner(true);
                api.user.update($scope.edit, function(result) {
                    console.info("Update Profile Result", result);
                    $scope.editProfile.hide();
                    $formTools.spinner(false);
                }, function(error) {
                    console.log("Update Profile Error", error);
                    $formTools.spinner(false);
                });
            },

            password() {
                $formTools.spinner(true);
                api.user.changePassword($scope.password, function(result) {
                    console.info("Update Profile Result", result);
                    $scope.passwordModal.hide();
                    $formTools.spinner(false);
                }, function(error) {
                    console.log("Update Profile Error", error);
                    $formTools.spinner(false);
                });
            },
        };

        $scope.control = {
        	modals: {
        		edit() {
                    $scope.edit = JSON.parse(angular.toJson($rootScope.user));
        			$scope.editProfile.show();
        		},

                password() {
                    $scope.password = {};
                    $scope.passwordModal.show();
                }
        	}
        }
	});