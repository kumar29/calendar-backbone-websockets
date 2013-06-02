$(function(){
	var App = Backbone.Router.extend({
	   
	   routes: {
	      'login' : 'login',
	      },
		
		login: function(){
		   var users = new Users();
		   this.login = new LoginView({model:users}).render();
		},
	});
	
	window.app = new App();
	Backbone.history.start();
	window.app.navigate('login', {trigger:true});
});