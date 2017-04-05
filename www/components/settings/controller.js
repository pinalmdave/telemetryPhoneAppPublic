angular.module('telemetry')
	.controller('settingsCtrl', function($scope, $settings) {
		$scope.update = function() {
			$settings.set();
		};
	});