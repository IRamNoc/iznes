package src.WebSocketAPITests.User.Update;


import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import SETLAPIHelpers.User;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.*;


@RunWith(JUnit4.class)
public class updateUserTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  String localAddress = "ws://localhost:9788/db/";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void updateUserEmailAddress() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), "test@test.com", "8", "35", "test@test.com", "emailAddress", 0);

    connection.disconnect();
  }

  @Test
  public void updateUserAccount() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), user.getEmailAddress(), "7", "35", "7", "accountID", 0);

    connection.disconnect();
  }

  @Test
  public void updateUserUserType() throws InterruptedException, ExecutionException {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);
    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), user.getEmailAddress(), user.getAccountID(), "36", "36", "userType", 0);

    connection.disconnect();
  }
}
