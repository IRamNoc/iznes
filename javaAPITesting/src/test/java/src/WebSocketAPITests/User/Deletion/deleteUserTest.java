package src.WebSocketAPITests.User.Deletion;

import SETLAPIHelpers.User;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.*;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;



@RunWith(JUnit4.class)
public class deleteUserTest {

    private class Holder<T>{
      T value = null;
    }

    @Rule
    public Timeout globalTimeout = Timeout.millis(3000);

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    String localAddress = "ws://localhost:9788/db/";


  @Test
  public void simpleDeleteUserTest() throws ExecutionException, InterruptedException {
      Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

      //USER DETAILS
      String userDetails[] = generateUserDetails();
      String userName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];

      //LIST USERS BEFORE NEW USER CREATION
      String lastUserName = listUsers(factory, socket);
      assertTrue(!lastUserName.equalsIgnoreCase(userName));

      //CREATE NEW USER
      User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);

      //LIST USERS AFTER NEW USER CREATION
      String newLastUserName = listUsers(factory, socket);
      assertTrue(newLastUserName.equalsIgnoreCase(user.getUserName()));

      //DELETE NEW USER
      deleteUser(factory, socket, user.getUserID());

      //LIST USERS AFTER DELETION
      String oldLastUserName = listUsers(factory, socket);

      assertTrue(!oldLastUserName.equalsIgnoreCase(user.getUserName()));
      assertTrue(oldLastUserName.equalsIgnoreCase(lastUserName));

      connection.disconnect();
    }

  @Test
  public void failToDeleteNonExistentUserTest() throws ExecutionException, InterruptedException {
      Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
      CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.du.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object status = resp.get("Status");
      assertTrue(status.toString().equals("FAIL"));
      latch.countDown();
      return "";
    });

    socket.sendMessage(factory.deleteUserFromAccount("9999"));

    latch.await();
    connection.disconnect();

    }
}
