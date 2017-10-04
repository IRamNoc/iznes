package APITests.User.Creation;


import io.setl.wsclient.scluster.SetlSocketClusterClient;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import SETLAPIHelpers.LoginHelper;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;


import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static SETLAPIHelpers.UserHelper.createUser;


@RunWith(JUnit4.class)
public class createUserTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String address = "ws://localhost:9788/db/";


  @Test
  @Ignore
  public void createUserWithValidDataTest() throws InterruptedException, ExecutionException {

    final AtomicInteger atomicInt = new AtomicInteger(0);

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];
    CountDownLatch latch = new CountDownLatch(1);

    Connection connection = login(socket, address, LoginHelper::loginResponse);

    socket.sendMessage(factory.listUsers());

    socket.registerHandler(Message.Type.um_lu.name(), message -> {

      int call = atomicInt.getAndIncrement();
      if (call == 0) {
        JSONArray data = (JSONArray) message.get("Data");
        JSONObject resp = (JSONObject) data.get(data.size() - 1);
        Object lastUser = resp.get("userName");
        assertNotNull(lastUser);
        assertTrue(!lastUser.toString().equals(userName));
        try {
          createUser(factory, socket, userName, email, "8", "35", password);
        } catch (InterruptedException e) {
          e.printStackTrace();
        } catch (ExecutionException e) {
          e.printStackTrace();
        }
        return "";
      }

      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(data.size() - 1);
      Object lastUser = resp.get("userName");
      assertNotNull(lastUser);
      assertTrue(lastUser.toString().equals(userName));
      latch.countDown();
      return "";
    });

    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object newUser = resp.get("userName");
      assertNotNull(newUser);
      assertTrue(newUser.toString().equalsIgnoreCase(userName));
      socket.sendMessage(factory.listUsers());
      return "";
    });
  }

  @Test
  public void failToCreateUserWithInvalidEmailTest() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];

    CountDownLatch latch = new CountDownLatch(1);

      socket.registerHandler(Message.Type.Login.name(), message -> {
      socket.sendMessage(factory.addUserToAccount(userName,"pop","8","35", password));
      return "";
    });

    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object responseMessage = resp.get("Message");
      assertNotNull(message);
      assertTrue(responseMessage.toString().equalsIgnoreCase("Invalid User Name / Email Address."));
      latch.countDown();
      return "";
    });
  }


  @Test
  @Ignore("Message format error")
  public void failToCreateUserWithInvalidAccountTypeTest() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.Login.name(), message -> {
      socket.sendMessage(factory.addUserToAccount(userName,
        email,
        "8",
        "fred",
        password));
      return "";
    });

    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object sqlMessage = resp.get("Message");
      assertNotNull(message);
      assertTrue(sqlMessage.toString().contains("Incorrect integer value"));
      latch.countDown();
      return "";
    });
    Future<Connection> connexion = ws.start(address);
    latch.await();
    connexion.get().disconnect();

  }

  @Test
  @Ignore("Message format error")
  public void failToCreateUserWithInvalidAccount() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];
    login(socket, address, LoginHelper::loginResponse);

    LoginHelper.command(socket, factory.addUserToAccount(userName, email, "bob", "35", password), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object responseMessage = resp.get("Message");
      assertNotNull(message);
      assertTrue(responseMessage.toString().contains("Incorrect integer value"));

    });

    CountDownLatch latch = new CountDownLatch(1);

    socket.registerHandler(Message.Type.Login.name(), message -> {
      socket.sendMessage(factory.addUserToAccount(userName, email,"bob","35", password));
      return "";
    });

    socket.registerHandler(Message.Type.nu.name(), message -> {
      JSONArray data = (JSONArray) message.get("Data");
      JSONObject resp = (JSONObject) data.get(0);
      Object responseMessage = resp.get("Message");
      assertNotNull(message);
      assertTrue(responseMessage.toString().contains("Incorrect integer value"));
      latch.countDown();
      return "";
    });
    Future<Connection> connexion = ws.start(address);
    latch.await();
    connexion.get().disconnect();

  }

  @Test
  public void createNewUser() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, address, LoginHelper::loginResponse);

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];
    createUser(factory, socket, userName, email, "8", "35", password);

    connection.disconnect();
  }

  @Test
  public void createMultipleUsers() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, address, LoginHelper::loginResponse);
    createUser(factory, socket, "8", "35", 10);
    connection.disconnect();
  }

}
