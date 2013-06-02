package socket;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.http.HttpServletRequest;

import model.User;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;

import persistence.UserManager;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class CalendarWebSocketServlet extends WebSocketServlet {

   private static final long serialVersionUID = 1L;

   private final Set<AuthMessageInbound> connections = new CopyOnWriteArraySet<AuthMessageInbound>();

   protected MessageInbound createWebSocketInbound(String subProtocol,
         HttpServletRequest request) {
      return new AuthMessageInbound();
   }

   private final class AuthMessageInbound extends MessageInbound {

      private WsOutbound outbound;

      @Override
      public void onOpen(WsOutbound outbound) {
         this.outbound = outbound;
         connections.add(this);
      }

      @Override
      protected void onClose(int status) {
         connections.remove(this);
      }

      @Override
      protected void onBinaryMessage(ByteBuffer message) throws IOException {
         // this application does not expect binary data

      }

      @Override
      protected void onTextMessage(CharBuffer message) throws IOException {

         Gson outJSONBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

         Gson inJSONBuilder = new Gson();

         System.out.println(message);

         // Incoming messages contain info of a single user
         Type type = new TypeToken<socket.MessagePacket<model.User>>() {}.getType();

         MessagePacket<User> rpcMessage = inJSONBuilder.fromJson(message.toString(), type);
         CharBuffer charBuffer = null;

         if (rpcMessage.getService().equals("login")) {
            User user = rpcMessage.getData();

            if (UserManager.exists(user)) {
               user = UserManager.get(user);
               rpcMessage.setData(user);

               charBuffer = CharBuffer.wrap(outJSONBuilder.toJson(rpcMessage));
            } else {
               charBuffer = CharBuffer.wrap("");
            }

            outbound.writeTextMessage(charBuffer);
            outbound.flush();
         } 
         else if (rpcMessage.getService().equals("save")) {
            User user = rpcMessage.getData();
            if (UserManager.save(user)) {
               user = UserManager.get(user);
               rpcMessage.setData(user);

               // return the user back
               broadcast(outJSONBuilder.toJson(rpcMessage));
            }
         } 
         else if (rpcMessage.getService().equals("getAll")) {
            MessagePacket<User[]> getAllMessage = new MessagePacket<User[]>();
            getAllMessage.setService("getAll");
            getAllMessage.setData(UserManager.getAll());

            // return the user back
            charBuffer = CharBuffer.wrap(outJSONBuilder.toJson(getAllMessage));

            outbound.writeTextMessage(charBuffer);
            outbound.flush();
         }

      }

      private void broadcast(String message) {
         for (AuthMessageInbound connection : connections) {
            try {
               connection.getWsOutbound().writeTextMessage(
                     CharBuffer.wrap(message));
            } catch (IOException ignore) {
               System.err.println(ignore);
            }
         }
      }
   }

}
