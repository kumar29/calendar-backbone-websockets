package socket;

import com.google.gson.annotations.Expose;


public class MessagePacket <T>{
   @Expose
	private String service;
   @Expose
   private T data; // Can be user or a list of users
	
	public String getService() {
		return service;
	}
	public void setService(String service) {
		this.service = service;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
}