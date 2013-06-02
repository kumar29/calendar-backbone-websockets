var Users = Backbone.Collection.extend({

   model: User,
   
   initialize : function(args) {
      Socket.getInstance().on("save", this.saveCallback, this);
      Socket.getInstance().on("getAll", this.allUsersCallback, this);
   },
   
   toggleAllEvents: function(){
      if(!this.allEventsVisible){
         this.allEventsVisible = true;
         this.getAllUsers();
      }
      else{
         this.allEventsVisible = false;
         
         // Find the logged in user model and issue a save which will cause the calendar
         // to update.
         var userModel = this.findWhere({"loggedIn":true});
         userModel.save();
      }
   },
      
   getAllUsers: function(){
      Socket.getInstance().send(JSON.stringify(
            {"service": "getAll"}
            ));
   },
   
   allUsersCallback: function(data){
      var users = data;
      var self = this;
      
      // for each user 
      if(Array.isArray(users)){
         _.each(users, function(user){
            var calEvents = utils.convertToCalendarEvents(user["events"], user.color);
            
            // If the user exists in the model, update...
            var userModel = self.findWhere({"userName":user.userName});
            if(userModel){
               userModel.set("events", calEvents);
            }
            else{ // Create a new model and add to the collection
               var currUser = new User();
               currUser.set({"userName" : user.userName, 
            	              "color": user.color,
            	              "events": calEvents});
               self.add(currUser);
            }
         });
      }
   },
   
   saveCallback: function(data){
      var user = data;
      var self = this;
      
      this.each(function(model,index){
         // If the save event was for a user not currently logged and all events are
         // supposed to be shown...
         if(model.get("loggedIn")){
            // ignore. Handled in user
         }
         else{
            if(self.allEventsVisible){
               if(model.get("userName") == user.userName){
                  var calEvents = utils.convertToCalendarEvents(user.events, model.get("color"));
                  model.set("events", calEvents);
               }
            }
            else{
               model.set("events", []);
            }
         }
      });
   }
});
