package src.APITests.User.Update;


import SETLAPIHelpers.LoginHelper;
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

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static SETLAPIHelpers.LoginHelper.login;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.UserHelper.*;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class updateUserTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3330000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  SetlSocketClusterClient ws = new SetlSocketClusterClient(socket);
  String localAddress = "ws://localhost:9788/db/";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void updateUserEmailAddress() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    List<Object> user = createUserAndCaptureDetails(factory, socket, "8", "35");
    updateUser(factory, socket, user.get(0).toString(), "test@test.com", "8", "35", "test@test.com", "emailAddress", 0);

    connection.disconnect();
  }
  @Test
  public void updateUserAccountID() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    List<Object> user = createUserAndCaptureUserId(factory, socket, "8", "35");
    updateUser(factory, socket, user.get(0).toString(), user.get(1).toString(), "7", "35", "7", "accountID", 0);

    connection.disconnect();
  }
  @Test
  public void updateUserUserType() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    List<Object> user = createUserAndCaptureUserId(factory, socket, "8", "35");
    updateUser(factory, socket, user.get(0).toString(), user.get(1).toString(), user.get(2).toString(), "35", "35", "userType", 0);

    connection.disconnect();
  }

  /*@Test
  public void updateUserPasswordToValidTest() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createUser(factory, socket, "8", "35");
    updateUser(factory, socket, "password", "PASSWORD!@£");
    connection.disconnect();
  }

  @Test
  public void updateUserPasswordToEmptyStringTest() throws InterruptedException, ExecutionException {

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    createUser(factory, socket, "8", "35");
    updateUser(factory, socket, "password", "");
    connection.disconnect();
  }

*/

}
