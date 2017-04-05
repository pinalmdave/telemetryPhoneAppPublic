angular.module('telemetry')
    .factory('$formTools', ['$state', '$localstorage', '$rootScope', '$ionicLoading', function($state, $localstorage, $rootScope, $ionicLoading) {
        function checkTokenAndEmail() {
            if (($localstorage.get("token") == null || $localstorage.get("email") == null)) {
                $state.go('app.authenticate');
                return {
                    "token": {},
                    "email": ""
                }
            } else {
                return {
                    "token": $localstorage.get("token"),
                    "email": $localstorage.get("email")
                };
            };
        };

        return {
            getAbsolutePath() {
                var loc      = window.location;
                var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
                return(loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length)));
            },

            checkTokenAndEmail() {
                return checkTokenAndEmail();
            },

            checkIfScopeAllowed(url, buttonRoles) {
                var checkToken = checkTokenAndEmail();
                if(typeof checkToken.token == 'object'){
                    if (typeof checkToken.token.scopes == "undefined") {
                        return true;
                    };
                };     
                var token = JSON.parse(checkToken.token);

                for (var i = 0; i < token.scopes.length; i++) {
                    if (token.scopes[i].url == url) {
                        if (buttonRoles.indexOf(parseInt(token.scopes[i].role)) > -1){
                            return true;
                        };
                    };
                };
                return false;
            },

            sortError(call, error) {
                if (typeof error != "undefined" && error != null) {
                    if (error.errors[0].code == "70") {
                        error = error.errors[0].reason
                        $("#error").modal("show");
                    } else if (error.errors[0].code == "401") {
                        $state.go("app.authenticate");
                    } else {
                        error = error.errors[0].reason
                        $("#error").modal("show");
                    };
                } else {
                    error = "Error is null. Please check Commection";
                };
                
                var callError = {call, error};
                console.log(callError);
                return error;
            },

            allowApiCall() {
                var storage = checkTokenAndEmail();
                if (typeof storage.email != "" && storage.email != "" && typeof storage.token != "" && storage.token != "") {
                    return true;
                } else {
                    return false;
                };
            },

            spinner(state) {
                $rootScope.test = "hello";
                if (state) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="android"></ion-spinner><br><div>{{ apiCallName }}</div>'
                    });
                } else {
                    $ionicLoading.hide();
                };
            },

            change(organizationOnly, myDomain, validateDomain) {
                if (organizationOnly == 1) {
                    validateDomain = validateDomain.split("@");
                    validateDomain = validateDomain.splice(1,1);
                    validateDomain = validateDomain[0];
                    if (myDomain == validateDomain) {
                        $rootScope.domainInvalid = false;
                    } else {
                        $rootScope.domainInvalid = true;
                    };
                };
            },

            checkRole(myRole, allowedRoles) {
                for (var i = allowedRoles.length - 1; i >= 0; i--) {
                    if (allowedRoles[i] == myRole) {
                        return true;
                    };
                };
                return false;
            },

            disabled(role, roles) {
                for (var i = roles.length - 1; i >= 0; i--) {
                    if (roles[i] == role) {
                        return false;
                    };
                };
                return true;
            },

            setRole(result, myEmail) {
                for (var i = result.length - 1; i >= 0; i--) {
                    for (var a = result[i].users.length - 1; a >= 0; a--) {
                        if (result[i].users[a].email == myEmail) {
                            result[i].role = parseInt(result[i].users[a].role);
                            break;
                        };
                    };
                };
                return result;
            }
        };
    }]);