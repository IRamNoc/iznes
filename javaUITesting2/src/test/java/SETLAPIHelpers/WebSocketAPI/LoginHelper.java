package SETLAPIHelpers.WebSocketAPI;

import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONObject;


import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.Consumer;

public class LoginHelper {


  public static Connection login(SocketClientEndpoint socket, String address, Consumer<JSONObject> callback) {
    CountDownLatch latch = new CountDownLatch(1);
    socket.registerHandler(Message.Type.Login.name(), message -> {
      callback.accept(message);
      latch.countDown();
      return "";
    });

    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
    Future<Connection> connection = ws.start(address);

    try {
      latch.await();
      return connection.get();
    } catch (InterruptedException | ExecutionException e) {
      throw new RuntimeException(e);
    }
  }

  public static void command(SocketClientEndpoint socket, Message msg, Consumer<JSONObject> callback) {
    CountDownLatch l = new CountDownLatch(1);

    socket.registerHandler(msg.type.name(), message -> {
      callback.accept(message);
      l.countDown();
      return "";
    });
    socket.sendMessage(msg);

    try {
      l.await();
    } catch (InterruptedException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }





  }

  public static void loginResponse(JSONObject message){

  }

  public static void createUserSuccess(JSONObject message){

  }

}

