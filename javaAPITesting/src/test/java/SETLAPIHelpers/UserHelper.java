package SETLAPIHelpers;

import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import src.APITests.io.setl.Container;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

public class UserHelper {

  public static void createUser(MessageFactory factory, SocketClientEndpoint socket, String userName, String email, String account, String userType, String password) throws InterruptedException, ExecutionException {

    CountDownLatch latch = new CountDownLatch(1);


    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object newUser = resp.get("userName");
      assertNotNull(newUser);
      assertTrue(newUser.toString().equalsIgnoreCase(userName));
      latch.countDown();
      return "";

    });

    socket.sendMessage(factory.addUserToAccount(userName, email, account, userType, password));

    latch.await();

  }

  public static Container<String> listUsers(MessageFactory factory, SocketClientEndpoint socket) throws InterruptedException, ExecutionException {

    CountDownLatch latch = new CountDownLatch(1);
  Container<String> container = new Container<>();

    socket.registerHandler(Message.Type.um_lu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(data.size() - 1);
      String lastUser = resp.get("userName").toString();
      assertNotNull(lastUser);
      container.setItem(lastUser);
      latch.countDown();
      return "";

    });

    socket.sendMessage(factory.listUsers());

    latch.await();
    return container;
  }


  public static List<Object> createUserAndCaptureUserId(MessageFactory factory, SocketClientEndpoint socket, String userName, String email, String account, String userType, String password) throws InterruptedException, ExecutionException {

    CountDownLatch latch = new CountDownLatch(1);
    List<Object> users = new ArrayList<>();

    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object newUserID = resp.get("userID").toString();
      assertNotNull(newUserID);
      users.add(newUserID);
      latch.countDown();
      return "";

    });

    socket.sendMessage(factory.addUserToAccount(userName, email, account, userType, password));

    latch.await();
    return users;
  }

  public static List<Object> createUser(MessageFactory factory, SocketClientEndpoint socket, String account, String userType, int noOfUsers) throws ExecutionException, InterruptedException {
    for (int i = 0; i < noOfUsers; i++) {
    CountDownLatch latch = new CountDownLatch(1);
    List<Object> user = new ArrayList<>();

      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];


      socket.registerHandler(Message.Type.nu.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object newUser = resp.get("userName");
        user.add(newUser);
        assertNotNull(newUser);
        assertTrue(newUser.toString().equalsIgnoreCase(userName));
        latch.countDown();
        return "";
      });

      socket.sendMessage(factory.addUserToAccount(userName, email, account, userType, password));

      latch.await();
      return user;
      }
    return null;
  }

  public static void createDuplicateUser(MessageFactory factory, SocketClientEndpoint socket, String account, String userType) throws ExecutionException, InterruptedException {
    final AtomicInteger atomicInt = new AtomicInteger(0);

      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];

     CountDownLatch latch = new CountDownLatch(1);
        socket.registerHandler(Message.Type.nu.name(), message -> {

          int call = atomicInt.getAndIncrement();
          if (call == 0) {
          JSONArray data = (JSONArray) message.get("Data");
          JSONObject resp = (JSONObject) data.get(0);
          Object status = resp.get("Status");
          assertNotNull(status);
          assertTrue(status.toString().equals("OK"));
          socket.sendMessage(factory.addUserToAccount(userName, email, account, userType, password));
          return "";

      }
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object responseMessage = resp.get("Message");
        assertNotNull(message);
        assertTrue(responseMessage.toString().equalsIgnoreCase("User Name / Email Address already exists."));
        latch.countDown();
        return "";
      });

    socket.sendMessage(factory.addUserToAccount(userName, email, account, userType, password));


    latch.await();
      }


  public static void deleteUser(MessageFactory factory, SocketClientEndpoint socket, String userId) throws ExecutionException, InterruptedException {

      CountDownLatch latch = new CountDownLatch(1);

      socket.registerHandler(Message.Type.du.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        String deletedUser = resp.get("userID").toString();
        System.out.println("############## Deleted user :  " + userId + " ##################");
        assertTrue(deletedUser.equals("userId"));
        latch.countDown();
        return "";
      });

      socket.sendMessage(factory.deleteUserFromAccount(userId));

      latch.await();

    }

}
