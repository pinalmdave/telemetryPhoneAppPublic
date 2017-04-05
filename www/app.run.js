angular.module('telemetry')
    .run(function($ionicPlatform, $interval, $rootScope, $formTools, $localstorage, api, $state, pushNotificationService, $settings) {
        $ionicPlatform.ready(function() {
            $rootScope.$on('notify', function(e, d){
              console.log('data', d);
            });

            $settings.get();

            $rootScope.$on('register', function(e, t){
              console.log('token', t._token);
            });

            pushNotificationService.start();

            var tFound = $interval(function() {
                if ($state.current.name != "app.register" && $state.current.name != "app.verify") {
                    if ($formTools.allowApiCall()) {
                        api.user.get(function(result) {
                            console.info('Get User Result', result);
                            $rootScope.user = result[0];
                        }, function(error) {
                            console.log('error', error);
                        });
                        
                        console.log('Token Found');
                        $interval.cancel(tFound);
                    };
                };
            }, 1000);

            api.timeZones(function(result) {
                $rootScope.timeZones = result;
            }, function(error) {
                console.log('error', error);
            });
                    
            $rootScope.$state   = $state;
            
            $rootScope.logout = function() {
                $localstorage.remove('email');
                $localstorage.remove('token');
                $state.go('app.authenticate');
            };
        });
    });