package SETLAPIHelpers;

import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

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

  public static void createUser(MessageFactory factory, SocketClientEndpoint socket, String account, String userType, int noOfUsers) throws ExecutionException, InterruptedException {
    for (int i = 0; i < noOfUsers; i++) {
    CountDownLatch latch = new CountDownLatch(1);

      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];


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
   }
