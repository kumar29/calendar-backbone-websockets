package persistence;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;

import model.CalendarEvent;
import model.User;

public class UserManager {
	
	private static User[] users = {
		new User("Kiran", "password", "red"), 
		new User("John", "password", "purple"),
		new User("Kumar", "password", "maroon"),
	};
	
	/**
	 * Does the User with the given credentials exists?
	 * @param user
	 * @return
	 */
	public static boolean exists (User user) {
		Iterator<User> iterator = new HashSet<User>(Arrays.asList(users)).iterator();
		while (iterator.hasNext()) {
			User existingUser = iterator.next();
			if (user.getUserName().equals(existingUser.getUserName()) && 
				user.getPassword().equals(existingUser.getPassword())) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Save the incoming user's data (only events for now). If success
	 * return true 
	 * 
	 * @param user
	 * @return
	 */
	public static boolean save(User user)
	{
		Iterator<User> iterator = new HashSet<User>(Arrays.asList(users)).iterator();
		while (iterator.hasNext()) {
			User existingUser = iterator.next();
			if (user.getUserName().equals(existingUser.getUserName()))
			{
				existingUser.setEvents(user.getEvents());
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Retrieve the user from persistent storage based on the incoming user name.
	 * 
	 * @param user
	 * @return
	 */
	public static User get(User user)
	{
		Iterator<User> iterator = new HashSet<User>(Arrays.asList(users)).iterator();
		while (iterator.hasNext()) {
			User existingUser = iterator.next();
			if (user.getUserName().equals(existingUser.getUserName()))
			{
				return existingUser;
			}
		}
		
		return null;
	}
	
	/**
	 * Get all users in the system
	 * @return
	 */
	public static User[]  getAll()
	{
		return users;
	}

}
