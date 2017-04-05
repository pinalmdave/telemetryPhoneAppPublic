var settings = {
	'authServer': {
		'host': 'https://auth.bitid.co.za:443/'
	},
	'alertingServer': {
		'host': 'https://alerting.bitid.co.za:443/'
	},
	'telemetryServer': {
		'host': 'https://telemetry.bitid.co.za:443/'
	},
	'appName': 	'IOT Dash',
	'clientId': '000000000000000000000007',
	'scopes': [
        {'url':'/users/list','role':1},
        {'url':'/users/update','role':2},
        {'url':'/telemetry/rtu/list','role':1},
        {'url':'/auth/changepassword','role':2},
        {'url':'/telemetry/rtu/gethistorical','role':1},
        {'url':'/alerting/alert/listhistorical','role':1}
	]
};