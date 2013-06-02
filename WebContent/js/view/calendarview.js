var CalendarView = Backbone.View.extend({

	el : "#MainArea",

	events : {
		"click #allEventsBtn" : "showAllEvents",
	},

	initialize : function(arguments) {
		// The logged in user is always the first user in this
		// view's collection
		this.user = this.collection.at(0);

		this.collection.bind("change add", this.refresh, this);

		this.eventClickCallback = _.bind(this.eventClickCallback, this);
	},

	render : function(arguments) {
		this.$el.show();

		// Enable drag and drop on event types

		// initialize the external events
		this.$el.find('#external-events div.external-event').each(function() {
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex : 999,
				revert : true, // will cause the event to go back to its
				revertDuration : 0
			// original position after the drag
			});
		});

		var self = this;

		var calendar = this.$el.find('#calendar').fullCalendar({
			// put your options and callbacks here
			width : 900,
			header : {
				left : 'prev,next today',
				center : 'title',
				right : 'month,agendaWeek,agendaDay'
			},
			selectable : true,
			eventMouseover : function(event, jsEvent, view) {
				$(this).css({
					backgroundColor : "#006"
				});
			},
			eventMouseout : function(event, jsEvent, view) {
				$(this).css({
					backgroundColor : event.color
				});
			},
			eventClick : self.eventClickCallback,
			droppable : true,
			theme : true,
			drop : function(date, allDay) {

				// retrieve the dropped element's stored Event Object
				var event = $(this);

				var calEvent = new CalendarEvent();
				var value = prompt('Give a name for your event', "");
				if (value == null) {
					return;
				}

				calEvent.set("title", value + " " + self.user.get("userName"));
				calEvent.set("type", event.text());
				calEvent.set("start", date);
				calEvent.set("newlyAdded", true);

				self.user.addEvent(calEvent);
				self.user.save();
			}
		});

		// Add handling to All events button
		this.$el.find("#allEventsBtn").button();
	},

	refresh : function() {
		var events = this.collection.pluck("events");

		if (events && events.length > 0) {
			this.$el.find('#calendar').fullCalendar('removeEvents');
			for ( var i in events) {
				for ( var j in events[i]) {

					// Don't know WTF I have to do this instead of using
					// events[i][j].attributes
					var attrs = {};
					attrs.start = events[i][j].attributes.start;
					attrs.end = events[i][j].attributes.end;
					attrs.title = events[i][j].attributes.title;
					attrs.allDay = events[i][j].attributes.allDay;
					attrs.color = events[i][j].attributes.color;

					this.$el.find('#calendar').fullCalendar('renderEvent',
							attrs, true);
				}
			}
		}
	},

	showAllEvents : function() {
		var buttonText = this.$el.find("#allEventsBtn span");
		if (buttonText.text() == "Show Pyramid Team Events") {
			buttonText.text("Hide Pyramid Team Events");
		} else {
			buttonText.text("Show Pyramid Team Events");

		}
		this.collection.toggleAllEvents();
	},

	eventClickCallback : function(event, jsEvent, view) {

		// Can only delete own events
		var self = this;

		// Do you want to modify or delete the event
		var variables = {
			text : event.title
		};
		var el = $("#updatedelete-template");
		var div = _.template(el.html(), variables);
		self.$el.append(div);

		$("#dialog-confirm").dialog({
			resizable : true,
			height : 240,
			modal : true,
			show : {
				effect : "size",
				duration : 500
			},
			hide : {
				effect : "explode",
				duration : 1000
			},
			buttons : {
				"Modify" : function() {
					alert("Not implemented yet")
				},
				"Delete" : function() {
					self.user.deleteEvent(event.title);
					self.user.save();
					$(this).dialog("close");
				}
			}
		});
	}
});