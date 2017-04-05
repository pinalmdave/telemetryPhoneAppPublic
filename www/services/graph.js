angular.module('telemetry')
	.factory('$graph', ['api', '$q', '$formTools', '$rootScope', '$settings', function(api, $q, $formTools, $rootScope, $settings) {
		return {
			get(modules) {
				var deferred = $q.defer();

				$formTools.spinner(true);
				var callsMade = 0;
				var callsReceived = 0;
				var modulePos = 0;
				for(var item of modules){
					if(item.statuses.length > 0){
						var statusesPos = 0;
						for(var itemStatus of item.statuses){
							callsMade++;
							api.rtus.getHistorical(item.rtuId, modulePos, statusesPos, function(result, modulePos, statusesPos) {
			        			callsReceived++;
			        			var countSkip = 1;
			        			var index = 0;
			        			var pointsToPlot = $settings.get().graphs.maxPoints;
			        			if(result.length > pointsToPlot){
			        				countSkip = parseInt(result.length / pointsToPlot);
			        			}
			        			for(var results of result){
			        				if(index % countSkip == 0){
					        			for(var key in results.rtuData.dataIn){
					        				if(key == modules[modulePos].statuses[statusesPos].desegnation){
					        					var serverDate = new Date(results.serverDate);
					        					modules[modulePos].statuses[statusesPos].labels.push(serverDate.toLocaleString());
							        			modules[modulePos].statuses[statusesPos].data.push(parseInt(results.rtuData.dataIn[key]));
					        				}
					        			}
			        				}
				        			index++;
			        			}
			        		}, function(error) {
			        			console.log(error);
			        		});
							statusesPos++;
						}
					}
					modulePos++;
				}

				var vTimeout = 60;
				var myCheck = setInterval(function(){
					vTimeout--;
					if(vTimeout < 0){
						clearInterval(myCheck);
						deferred.reject('error');
					}
					if(callsMade == callsReceived){
						$formTools.spinner(false);
						clearInterval(myCheck);
						deferred.resolve(modules);
					}
				},1000);


				return deferred.promise;
			},

		};
	}])