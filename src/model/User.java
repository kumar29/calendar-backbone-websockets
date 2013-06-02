package model;

import java.util.ArrayList;

import com.google.gson.annotations.Expose;

public class User {

	@Expose
	private String userName;
	
	private String password;
	transient private String myThumbnail; // not used yet
	
	@Expose
	private String color;
	
	@Expose
	private ArrayList<CalendarEvent> events;

	public User(String username, String password) {
		this.userName = username;
		this.password = password;
	}

	public User(String username, String password, String color) {
		this(username, password);
		this.color = color;
	}

	public String getPassword() {
		return password;
	}

	public String getUserName() {
		return userName;
	}

	public void setUsername(String username) {
		userName = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setEvents(ArrayList<CalendarEvent> events) {
		this.events = events;
	}

	public ArrayList<CalendarEvent> getEvents() {
		return events;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

}
