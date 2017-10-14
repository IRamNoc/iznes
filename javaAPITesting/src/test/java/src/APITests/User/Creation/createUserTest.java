package src.APITests.User.Creation;


import SETLAPIHelpers.UserHelper;
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

import javax.xml.stream.FactoryConfigurationError;
import java.lang.reflect.Array;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;


import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static SETLAPIHelpers.MemberHelper.createMember;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.UserHelper.*;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class createUserTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://localhost:9788/db/";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void createUserWithValidDataTest() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createUser(factory, socket, "8", "35");
    connection.disconnect();
  }

  @Test
  public void failToCreateUserWithInvalidEmailTest() throws InterruptedException, ExecutionException {

    CountDownLatch latch = new CountDownLatch(1);

      socket.registerHandler(Message.Type.Login.name(), message -> {
      socket.sendMessage(factory.addUserToAccount("Test_User_1","pop","8","35", "password"));
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
    Future<Connection> connexion = ws.start(localAddress);
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
    login(socket, localAddress, LoginHelper::loginResponse);

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
    Future<Connection> connexion = ws.start(localAddress);
    latch.await();
    connexion.get().disconnect();
  }

  @Test
  public void createNewUser() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createUser(factory, socket,"8","35");
    connection.disconnect();
  }

  @Test
  public void createMultipleUsers() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createUser(factory, socket, "8", "35", 5);
    connection.disconnect();
  }

  @Test
  public void failToCreateDuplicateUsers() throws ExecutionException, InterruptedException {
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createDuplicateUser(factory, socket, "8", "35");
    connection.disconnect();
  }

}
