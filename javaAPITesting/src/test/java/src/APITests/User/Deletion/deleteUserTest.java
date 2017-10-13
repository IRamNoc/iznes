package src.APITests.User.Deletion;

import io.setl.wsclient.scluster.SetlSocketClusterClient;
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
import SETLAPIHelpers.LoginHelper;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.UserHelper.*;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;



@RunWith(JUnit4.class)
public class deleteUserTest {

    private class Holder<T>{
      T value = null;
    }

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);

    KeyHolder holder = new KeyHolder();
    MessageFactory factory = new MessageFactory(holder);
    SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
    SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
    String localAddress = "ws://localhost:9788/db/";

    @Test
    public void deleteUserTest() throws InterruptedException, ExecutionException {

      final AtomicInteger atomicInt = new AtomicInteger(0);

      Holder<Integer> userIdHolder = new Holder<>();

      String userDetails[] = generateUserDetails();
      String newUserName = userDetails[0];
      String password = userDetails[1];
      String email = userDetails[2];

      CountDownLatch latch = new CountDownLatch(1);

      Connection connection = login(socket, localAddress, LoginHelper::loginResponse);

      socket.registerHandler(Message.Type.um_lu.name(), message -> {

        int call = atomicInt.getAndIncrement();
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(data.size() - 1);
        Object lastUserName = resp.get("userName");
        Object oldUserName = lastUserName;

        switch (call) {
          case 0: //first time

            assertNotNull(lastUserName);
            assertTrue(!lastUserName.toString().equals(newUserName));
            socket.sendMessage(factory.addUserToAccount(newUserName, email, "8", "35", password));
            break;

          case 1: //second time

            assertNotNull(lastUserName);
            assertTrue(lastUserName.toString().equals(newUserName));
            System.out.println("UserIdHolder at delete = " + userIdHolder.value);
            socket.sendMessage(factory.deleteUserFromAccount(userIdHolder.value.toString()));
            break;

          case 2: //third time

            assertNotNull(lastUserName);
            assertTrue(lastUserName.equals(oldUserName));
            latch.countDown();
            break;
        }
        return "";
      });


      socket.registerHandler(Message.Type.nu.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object newUser = resp.get("userName");
        Object userID = resp.get("userID");
        userIdHolder.value = ((Number) userID).intValue();
        assertNotNull(newUser);
        assertTrue(newUser.toString().equalsIgnoreCase(newUserName));
        socket.sendMessage(factory.listUsers());

        return "";
      });

      socket.sendMessage(factory.listUsers());

      socket.registerHandler(Message.Type.du.name(), message -> {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(0);
        Object status = resp.get("Status");
        assertTrue(status.toString().equals("OK"));
        socket.sendMessage(factory.listUsers());
        connection.disconnect();
        return "";
      });

    }

  @Test
  public void simpleDeleteTest() throws ExecutionException, InterruptedException {
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
      String userId = createUserAndCaptureUserId(factory, socket, "8", "35").get(0).toString();

      //LIST USERS AFTER NEW USER CREATION
      String newLastUserName = listUsers(factory, socket);
      assertTrue(newLastUserName.equalsIgnoreCase(userName));

      //DELETE NEW USER
      deleteUser(factory, socket, userId);

      //LIST USERS AFTER DELETION
      String oldLastUserName = listUsers(factory, socket);

      assertTrue(!oldLastUserName.equalsIgnoreCase(userName));
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
