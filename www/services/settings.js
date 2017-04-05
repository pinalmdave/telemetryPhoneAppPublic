angular.module('telemetry')
	.factory('$settings', ['$localstorage', '$rootScope', function($localstorage, $rootScope) {
		var defaultSettings = {
			graphs: {
				maxPoints: 10
			},
			notifications: {
				popups: true
			}
		};

		return {
			get() {
				var settings = $localstorage.get('settings');
				if (typeof settings == "undefined") {
					$localstorage.setObject('settings', defaultSettings);
					$rootScope.settings = defaultSettings;
					return defaultSettings;
				} else {
					settings = JSON.parse(settings);
					$rootScope.settings = settings;
					return settings;
				};
			},

			set() {
				if (typeof $rootScope.settings != "undefined") {
					$localstorage.setObject('settings', $rootScope.settings);
				};
			}
		};
	}])