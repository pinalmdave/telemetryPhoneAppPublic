angular.module('telemetry')
	.factory('pushNotificationService', function($rootScope, $localstorage, $settings) {
		var start = function() {
			try {
		        var push = new Ionic.Push({
					"debug": true, 
					'canRunActionsOnWake': true,
					'canPlaySound': true,
					'alert': 		$settings.get().notifications.popups,
					'badge':true,
					"pluginConfig": {
						"android": {
							icon: 		"push_icon",
							sound: 		true,
							vibrate: 	true,
							forceShow: 	$settings.get().notifications.popups,
							iconColor: 	"#0000FF"
						}
					},

					"onNotification": function(notification) {
							$rootScope.$broadcast('notify', notification);
					},

					"onRegister": function(data) {
					}
		        });
		        push.register(function(token) {
		        	push.saveToken(token);
		        	$rootScope.$broadcast('register', token);
		        });
		    }
			catch(e){
				console.error('failed to register for push notification');
				alert(e);
			}
		};
		
		return {
			start:start
		};
	});