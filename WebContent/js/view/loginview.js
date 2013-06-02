var LoginView = Backbone.View.extend({

	el : "body",

	events : {
		"click #loginBtn" : "doLogin",
		"keypress input" : "doLoginOnEnter"
	},

	doLogin : function(event) {
		var userName = this.$('#loginField').val();
		var password = this.$('#password').val();

		this.model.set({
			"userName" : userName,
			"password" : password
		});

		// Login to the app
		this.user = this.model.at(0);
		this.user.on("change:color", this.loginSuccess, this);
		this.user.login();
	},

	doLoginOnEnter : function(event) {
		if (event.which == 13) {
			this.doLogin(event);
		}
	},

	initialize : function(args) {

	},

	render : function() {
		this.$el.find("#loginField").focus();
		this.$el.find("#loginBtn").button();
	},

	loginSuccess : function() {
		this.user.off("change:color");

		this.$el.find(".loginContainer").remove();

		this.initBanner();
		this.user.set("loggedIn", true);
		new CalendarView({
			"collection" : this.model
		}).render();
	},

	logout : function() {
		this.user.disconnect();
	},

	initBanner : function() {
		var userName = this.user.get("userName");
		var img = new Image();

		img.style.height = '30px';
		img.style.width = '30px';

		img.src = "images/" + userName + ".jpeg";
		this.$el.find(".loggedInUserImage").append(img);

		var self = this;
		this.$el.find("a").append(userName).click(function() {
			self.logout();
		});

		this.$el.find(".loggedInUserContainer").show();
	}

});