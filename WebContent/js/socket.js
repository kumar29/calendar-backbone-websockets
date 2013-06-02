var Socket = (function () {
	
	_.extend(this, Backbone.Events);
	
    var self = this;

    this.ws = new WebSocket("ws://" + window.location.hostname + ":8080/cal/websocket");
    console.log("Using a standard websocket");

    this.ws.onopen = function(e) {
    	console.log('socket opened');
        self.trigger('open', e);
    };

    this.ws.onerror = function(e) {
        self.trigger('error', e);
    };

    this.ws.onmessage = function(e) {
       if(e.data != ""){
          var messagePacket = JSON.parse(e.data);
          if(messagePacket != undefined){
             self.trigger(messagePacket.service, messagePacket.data);
          }
       }
       else{
          alert("You did something wrong");
       }
    };

    this.ws.onclose = function(e) {
        self.trigger('close', e);
        console.log('socket closed');
    };
    
    this.send = function(json){
    	self.ws.send(json);
    };
    
    this.disconnect = function(){
    	if (self.ws != null) {
            self.ws.close();
            self.ws = null;
        }
    };
    
    var instantiated;
    function init (){
       // all singleton code goes here
       return this;
    }
    
    return {
       getInstance :function(){
          if (!instantiated){
             instantiated = init();
          }
          return instantiated; 
       }
    };
    
})();
