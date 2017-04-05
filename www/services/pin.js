angular.module('telemetry')
	.factory('$pin', ['$localstorage', '$q', '$graph', function($localstorage, $q, $graph) {
		var pinTime = new time();

		function setPins(pins) {
			if (pins.length > 0) {
				var done = JSON.stringify(pins);
				$localstorage.set("pins", done);
			} else {
				$localstorage.remove("pins");
			};
		};

		return {
			get() {
				var deferred = $q.defer();

				var pins = $localstorage.get("pins");
				if (typeof pins != "undefined") {
					var pins = JSON.parse(pins);
					if (pins.length > 0) {
						deferred.resolve(pins)
					} else {
						deferred.reject("no pins");
					};
					deferred.resolve(pins);

				} else {
					deferred.resolve([]);
				};

				return deferred.promise;
			},

			set(pin) {
				this.get().then(function(pins) {
					pin.position = pins.length;
					pins.push(pin);
					setPins(pins);
				});
			},

			setPins(pins) {
				return setPins(pins);
			},

			setDescriptions(pins, rtus) {
        		var deferred = $q.defer();
        		var modules  = [];

				for (var z = rtus.length - 1; z >= 0; z--) {
					for (var a = rtus[z].rtuData.length - 1; a >= 0; a--) {
	                    var statuses = [];
	                    for (var b = rtus[z].rtuData[a].data.io.length - 1; b >= 0; b--) {
	                        for (var i = rtus[z].rtuData[a].statuses.length - 1; i >= 0; i--) {
	                        	for (var c = pins.length - 1; c >= 0; c--) {
		                            var idArr = rtus[z].rtuData[a].data.io[b].id.split('.');
		                            var desc = idArr[idArr.length - 1];
		                            if (desc == rtus[z].rtuData[a].statuses[i].from && desc == pins[c].desegnation && rtus[z]._id == pins[c].rtuId) {
		                                statuses.push({
		                                    "unit":         rtus[z].rtuData[a].data.io[b].units,
		                                    "type": 		pins[c].type,
		                                    "value":        rtus[z].rtuData[a].statuses[i].value,
		                                    "position": 	pins[c].position,
		                                    "desegnation":  desc,
		                                    "description":  rtus[z].rtuData[a].data.io[b].description,
		                                    "labels": 		[],
		                                    "data": 		[]
		                                });
	                            	};
	                            };
	                        };
	                        
	                    };
	                    modules.push({
	                        rtuId:     		rtus[z]._id,
	                        module:     	rtus[z].rtuData[a].moduleId,
	                        rtuDate: 		rtus[z].rtuData[a].rtuDate,
	                        statuses:   	statuses,
	                        lastComms:  	pinTime.getCurrentDifference(rtus[z].rtuData[a].rtuDate),
	                        description:    rtus[z].description
	                    });
	                };
				};
				
				var graphIDs = [];

				for (var a = pins.length - 1; a >= 0; a--) {
            		if (pins[a].type == "graph") {
            			console.log("graph ", pins[a].rtuId);
            			graphIDs.push(pins[a].rtuId);
            		};
            	};

            	var index = 0;
            	var vEnd = modules.length;
            	for(var i=0;i<vEnd;i++){
            		if(modules[index].statuses.length == 0){
            			modules.splice(index,1);
            		}
            		else{
            			index++;
            		}
            	}

            	if (graphIDs.length > 0) {
            		$graph.get(modules).then(function(result) {
            			deferred.resolve(result)
            		});
            	} else {
					for (var i = modules.length - 1; i >= 0; i--) {
						if (modules[i].statuses.length == 0) {
							modules.splice(i, 1);
						};
					};

					if (modules.length > 0) {
						deferred.resolve(modules);
					} else {
						deferred.reject("no pins set");
					};
				};

				return deferred.promise;
			},

			remove(module) {
				this.get().then(function(pins) {
					for (var a = pins.length - 1; a >= 0; a--) {
						if (module.rtuId == pins[a].rtuId && module.module == pins[a].module) {
							pins.splice(a, 1);
							break;
						};
					};

					setPins(pins);
				});
			},

			isSet(rtuId, module, desegnation, type) {
				var setAs = {
					isSet: 	false,
					graph: 	false,
					status: false
				};
				if (typeof rtuId != "undefined" && typeof module != "undefined" && typeof desegnation != "undefined") {
					var pins = $localstorage.get("pins");
					if (typeof pins != "undefined") {
						
						pins = JSON.parse(pins) || [];

						for (var i = pins.length - 1; i >= 0; i--) {
							if (pins[i].rtuId == rtuId && pins[i].module == module && pins[i].desegnation == desegnation) {
								if (pins[i].type == type || typeof type == "undefined") {
									setAs.isSet = true;
									if (pins[i].type == "status") {
										setAs.status = true;
									} else {
										setAs.graph = true;
									};
								};
							};
						};

						return setAs;
					} else {
						return setAs;
					};
				};
				
			}
		};
	}])