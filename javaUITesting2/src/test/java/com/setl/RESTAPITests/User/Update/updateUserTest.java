package com.setl.RESTAPITests.User.Update;


import SETLAPIHelpers.User;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.MessageFactory;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.createUserAndCaptureDetails;
import static SETLAPIHelpers.WebSocketAPI.UserHelper.updateUser;


@RunWith(JUnit4.class)
public class updateUserTest {

  @Rule
  public Timeout globalTimeout = new Timeout(30000);
  KeyHolder holder = new KeyHolder();
  MessageFactory factory = new MessageFactory(holder);
  SocketClientEndpoint socket = new SocketServerEndpoint(holder, factory, "emmanuel", "alex01");
  String localAddress = "ws://si-opencsd01.dev.setl.io:9788/db/";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://si-opencsd01.dev.setl.io:27017/db/";
  RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());}

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];
    Connection connection = login(socket, localAddress, LoginHelper::loginResponse);


  @After
  public void teardown(){
      connection.disconnect();
  }

  @Test
  @Ignore
  public void updateUserEmailAddress() throws InterruptedException, ExecutionException {



    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), "test@test.com", "8", "35", "test@test.com", "emailAddress", 0);

    connection.disconnect();
  }

  @Test
  @Ignore
  public void updateUserUserType() throws InterruptedException, ExecutionException {

    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), user.getEmailAddress(), user.getAccountID(), "36", "36", "userType", 0);

    connection.disconnect();
  }

  @Test
  @Ignore
  public void updateUserAccount() throws InterruptedException, ExecutionException {

    User user = createUserAndCaptureDetails(factory, socket, "8", "35", userName, email, password);
    updateUser(factory, socket, user.getUserID(), user.getEmailAddress(), "7", "35", "7", "accountID", 0);

    connection.disconnect();
  }
}
