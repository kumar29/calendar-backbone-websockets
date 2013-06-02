package model;

import java.util.Date;

import com.google.gson.annotations.Expose;

public class CalendarEvent 
{
   @Expose
	private String title;
   @Expose
	private EventType type;
   @Expose
	private Date startDate;
   @Expose
	private Date endDate;
	
	public enum EventType {
		ALL_DAY, HALF_DAY_AM, HALF_DAY_PM, CUSTOM
	}
	
	public CalendarEvent(){}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public EventType getType() {
		return type;
	}

	public void setType(EventType type) {
		this.type = type;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	

}
