var utils = {
		convertToCalendarEvents: function(events, color)
		{
			var eventsToReturn = [];
			if(events != undefined){
				
				for(var i=0; i<events.length; i++){
					var event = new CalendarEvent();
					event.set("title", events[i].title);
					
					event.set("color", color);
					
					if(events[i].type == 'ALL_DAY'){
						event.set("allDay", true);
						event.set("start",  new Date(events[i].startDate));
						event.set("type", "All day vacation");
					}
					else if(events[i].type == 'HALF_DAY_AM'){
						// Assuming Day starts at 9, ends at 5.
						event.set("start", new Date(events[i].startDate));
						event.set("end", new Date(events[i].endDate));
						
						event.set("type", "Vacation AM");
					}
					else if(events[i].type == 'HALF_DAY_PM'){
						event.set("start", new Date(events[i].startDate));
						event.set("end", new Date(events[i].endDate));
						
						event.set("type", "Vacation PM");
					}
					
					eventsToReturn.push(event);
				}
			}
			
			return eventsToReturn;
		},
		
		convertToJsonEvent: function(event)
		{
			var jsonEvent = {};
			jsonEvent.title = event.title;
			
			var type = event.type;
			
			if(type == "All day vacation"){
				jsonEvent.type = "ALL_DAY";
				jsonEvent.startDate = $.fullCalendar.formatDate(event.start, "MMM dd, yyyy h:mm:ss TT");
			}
			else if(type == "Vacation AM"){
				jsonEvent.type = "HALF_DAY_AM";
			
				var start, end;
				if(event.newlyAdded){
					start = new Date(event.start.getTime() + 9*60*60000);
					end = new Date(start.getTime() + 4*60*60000);
				}
				else{
					start = event.start;
					end = event.end;
				}
				
				jsonEvent.startDate = $.fullCalendar.formatDate(start, "MMM dd, yyyy h:mm:ss TT");
				jsonEvent.endDate = $.fullCalendar.formatDate(end, "MMM dd, yyyy h:mm:ss TT");
			}
			else{
				jsonEvent.type = "HALF_DAY_PM";
				
				var start, end;
				if(event.newlyAdded){
					start = new Date(event.start.getTime() + 13*60*60000);
					end = new Date(start.getTime() + 4*60*60000);
				}
				else{
					start = event.start;
					end = event.end;
				}
				
				jsonEvent.startDate = $.fullCalendar.formatDate(start, "MMM dd, yyyy h:mm:ss TT");
				jsonEvent.endDate = $.fullCalendar.formatDate(end, "MMM dd, yyyy h:mm:ss TT");
			}
			return jsonEvent;
		},
		
		getColor: function(eventTitle, colorMap){
			for(var user in colorMap){
				var regex = new RegExp(user+"$");
				if(regex.test(eventTitle)){
					return colorMap[user];
				}
			}
			return "orange";
		}


};
