var User = Backbone.Model.extend({
	
	defaults : {
		userName: "",
		password: "",
		color:"",
		loggedIn: false,
		events:[], // Holds events of type CalendarEvent for the logged in user
	},

	initialize: function(args){
		this.attributes.events = [];
		
		Socket.getInstance().on("login", this.loginCallback, this);
		Socket.getInstance().on("save", this.saveCallback, this);
	},
	
	login: function(){
	   Socket.getInstance().send(JSON.stringify(
            {"service": "login", 
             "data" : this}
            ));
	},
	
	save: function(){
	   Socket.getInstance().send(JSON.stringify(
				{"service": "save", 
				 "data" : this}
				));
	},
	
	addEvent: function(calendarEvent){
		this.set({ 
		    'events' : this.get('events').concat(calendarEvent)
		},
		{silent:true});
	},
	
	deleteEvent: function(title){
      var events = this.get("events");
      
      for(var i=0; i<events.length; i++){
         if(events[i].get("title") == title){
            events.splice( i, 1 );
         }
      }
   },
   
   modifyEvent: function(title, newTitle){
	   // Not implemented yet
   },
	
   logout:function(){
	   Socket.getInstance().disconnect();
   },
	
   loginCallback: function(data){
	   var user = data;
	   var calEvents = utils.convertToCalendarEvents(user.events, user.color);
	   this.set({"color": user.color, "events": calEvents});
   },
	
   saveCallback: function(data){
	   var user = data;
	  
	   // Save events are broadcast. Only apply them if they are for the current user.
	   // If all users' events need to be shown, the users collection will handle it.
       if(user.userName == this.get("userName") && this.get("loggedIn")){
          var calEvents = utils.convertToCalendarEvents(user.events, this.get("color"));
          this.set("events", calEvents, {silent:true});
          this.trigger("change");
       }
	}
});

