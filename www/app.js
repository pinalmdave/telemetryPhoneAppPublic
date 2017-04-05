angular.module('telemetry', ['ionic', 'ngCordova', 'chart.js'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('app', {
            url:            '/app',
            abstract:       true,
            templateUrl:    'components/menu.html'
        })

        .state('app.authenticate', {
            url:    '/authenticate',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'authCtrl',
                    templateUrl:    'components/authenticate/authenticate.html'
                }
            }
        })

        .state('app.register', {
            url:    '/register',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'registerCtrl',
                    templateUrl:    'components/register/register.html'
                }
            }
        })
        .state('app.verify', {
            url:    '/verify',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'verifyCtrl',
                    templateUrl:    'components/verify/verify.html'
                }
            }
        })

        .state('app.home', {
            url:    '/home',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'homeCtrl',
                    templateUrl:    'components/home/home.html'
                }
            }
        })

        .state('app.profile', {
            url:    '/profile',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'profileCtrl',
                    templateUrl:    'components/profile/profile.html'
                }
            }
        })

        .state('app.settings', {
            url:    '/settings',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'settingsCtrl',
                    templateUrl:    'components/settings/settings.html'
                }
            }
        })

        .state('app.statuses', {
            url:    '/statuses',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'statusesCtrl',
                    templateUrl:    'components/statuses/statuses.html'
                }
            }
        })

        .state('app.alerts', {
            url:    '/alerts',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'alertsCtrl',
                    templateUrl:    'components/alerts/alerts.html'
                }
            }
        })

        .state('app.control', {
            url:    '/control',
            cache:  false,
            views: {
                'menuContent': {
                    controller:     'controlCtrl',
                    templateUrl:    'components/control/control.html'
                }
            }
        })

        $urlRouterProvider.otherwise('/app/home');
    });