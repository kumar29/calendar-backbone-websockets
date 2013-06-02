var CalendarEvent = Backbone.Model.extend({
	
	defaults: {
		title: "No name",
		allDay: false,
		type: "All day vacation",
		start: null,
		end: null,
		newlyAdded: false,
		color:""
	},

	initialize: function(args){
	},
	
	toJSON: function(){
		return utils.convertToJsonEvent(this.attributes);
	}
});
 