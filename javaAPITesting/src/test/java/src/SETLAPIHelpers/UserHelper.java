package SETLAPIHelpers;

import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.socketsrv.MessageFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
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
    CountDownLatch latch = new CountDownLatch(1);
    for (int i = 0; i < noOfUsers; i++) {

      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];
      //createUser(factory, socket, userName, email, account,userType, password);
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
 }
