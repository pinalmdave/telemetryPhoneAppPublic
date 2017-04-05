angular.module('telemetry')
    .factory('api', function($rootScope,  $localstorage, $ionicLoading, $http) {
        function buildDTO(DTO) {
            var header = {
                "email":        $localstorage.get('email'),
                "clientIdAuth": settings.clientId
            };
            DTO.header = header;
            return DTO;
        };

        var processCall = {
            post(url, route, DTO, done, error) {
                var postUrl = url + route;
                $http.defaults.headers.common['Authorization'] = $localstorage.get("token") || $localstorage.get("token1");
                $http.post(postUrl, DTO)
                .success(function(data) {
                    done(data);
                })
                .error(function(reason) {
                    error(reason);
                });
            },

            get(url, route, DTO, done, error) {
                var postUrl = url + route;
                $http.get(postUrl, DTO)
                .success(function(data) {
                    done(data);
                })
                .error(function(reason) {
                    error(reason);
                });
            },

            put(url, route, DTO, done, error) {
                var putUrl = url + route;
                $http.put(putUrl, DTO)
                .success(function(data) {
                    done(data);
                })
                .error(function(reason) {
                    error(reason);
                });
            }
        };

        var processCallReturnArrayPositions = {
            post(url, route, DTO, done, modulesPos, statusesPos, error) {
                var postUrl = url + route;
                $http.defaults.headers.common['Authorization'] = $localstorage.get("token") || $localstorage.get("token1");
                $http.post(postUrl, DTO)
                .success(function(data) {
                    done(data,modulesPos,statusesPos);
                })
                .error(function(reason) {
                    error(reason);
                });
            },
        };


        return {
            auth: {
                authenticate(auth, done, error) {
                    $rootScope.apiCallName = "Authenticating";
                    console.log('authenticating');
                    $localstorage.set('email', auth.email);
                    var DTO = buildDTO({
                        'password':     auth.password,
                        "pushToken":    $localstorage.getObject("ionic_io_push_token").token
                    });
                    DTO.header.clientIdAuth = '000000000000000000000001';
                    processCall.put(settings.authServer.host, 'auth/authenticate', DTO, done, error);
                },

                allowAccess(done, error) {
                    $rootScope.apiCallName = "Allowing Access";

                    console.log('allowing access');
                    var DTO = buildDTO({
                        "expiry":       Date.now() + 50 * 60 * 60 * 1000,
                        'scopes':       settings.scopes,
                        'clientId':     settings.clientId,
                        "tokenAddOn":   {},
                        "description":  settings.appName
                    });
                    DTO.header.clientIdAuth = '000000000000000000000001';
                    processCall.post(settings.authServer.host, 'auth/allowaccess', DTO, done, error);
                },

                verify(verify, done, error) {
                    $rootScope.apiCallName = "Verifying Your Code";
                    console.log('Verifying User');
                    var DTO = buildDTO({
                        'code':     verify.code,
                        'email':    verify.email
                    });
                    processCall.put(settings.authServer.host, 'auth/verify', DTO, done, error);
                },

                register(register, done, error) {
                    $rootScope.apiCallName = "Registering";
                    console.log('Registering');
                    $localstorage.set("email", register.email);
                    var DTO = buildDTO({
                        'password': register.password,
                        'userName': register.userName,
                    });
                    processCall.put(settings.authServer.host, 'auth/register', DTO, done, error);
                }
            },

            alerts: {
                get(done, error) {
                    $rootScope.apiCallName = "Getting Your Alerts";
                    console.log('Getting Alerts');
                    var DTO = buildDTO({});
                    processCall.post(settings.alertingServer.host, 'alerting/alert/listhistorical', DTO, done, error);
                }
            },

            rtus: {
                get(done, error) {
                    $rootScope.apiCallName = "Getting RTU's";
                    console.log('Getting RTUs');
                    var DTO = buildDTO({});
                    processCall.post(settings.telemetryServer.host, 'telemetry/rtu/list', DTO, done, error);
                },

                getHistorical(rtuId, modulePos, statusesPos, done, error) {
                    $rootScope.apiCallName = "Setting Graphs";
                    console.log('Getting Historical');
                    var endDate     = new Date();
                    // var startDate   = new Date('2017-03-29 21:00');
                    var startDate   = new Date();
                    startDate   = new Date(startDate.setDate(startDate.getDate() - 1));
                    var DTO = buildDTO({
                        "sort":         JSON.stringify({"_id": 1}),
                        "skip":         0,
                        "limit":        1000,
                        "rtuId":        rtuId,
                        "endDate":      endDate,
                        "startDate":    startDate
                    });
                    processCallReturnArrayPositions.post(settings.telemetryServer.host, 'telemetry/rtu/gethistorical', DTO, done,modulePos, statusesPos, error);
                }
            },

            user: {
                get(done, error) {
                    console.log('Getting User');
                    var DTO = buildDTO({});
                    processCall.post(settings.authServer.host, 'users/list', DTO, done, error);
                },

                update(profile, done, error) {
                    $rootScope.apiCallName = "Update Your Details";
                    console.log('Updating User');
                    var DTO = buildDTO({
                        'language':       profile.language,
                        'timeZone':       profile.timeZone,
                        'userName':       profile.userName,
                        'profilePic':     profile.profilePic,
                        'userSurname':    profile.userSurname,
                        'mobileNumber':   profile.mobileNumber
                    });
                    processCall.post(settings.authServer.host, 'users/update', DTO, done, error);
                },

                changePassword(password, done, error) {
                    $rootScope.apiCallName = "Changing Password";
                    console.log($rootScope.apiCallName);
                    var DTO = buildDTO({
                        'passwordOld': password.old,
                        'passwordNew': password.new
                    });
                    processCall.post(settings.authServer.host, 'auth/changepassword', DTO, done, error);
                }
            },

            timeZones(done, error) {
                $http.get('./assets/json/timezones.json')
                .success(function(data) {
                    done(data);
                })
                .error(function(reason) {
                    error(reason);
                });
            }
        };
    });