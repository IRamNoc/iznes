package src.RESTAPITests.User.Creation;

import java.util.Map;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertTrue;

public class createUserTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  String localAddress = "http://localhost:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void createUserWithValidDataTest(){

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = userDetails[2];

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(userName.equals(response.get("userName").toString()));
      assertTrue(email.equals(response.get("emailAddress").toString()));
      assertTrue(account.equals(response.get("accountID").toString()));
      });
  }

  @Test
  public void failToCreateUserWithNoUserName(){

    String userDetails[] = generateUserDetails();
    String userName = "";
    String password = userDetails[1];
    String email = userDetails[2];

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    System.out.println(claim.get("data").asList(Map.class));
    assertTrue("Fail".equals(response.get("Status").toString()));
    assertTrue("Invalid User Name / Email Address.".equals(response.get("Message")));

    });
  }

  @Test
  public void failToCreateUserWithEmptyStringPassword(){

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = "";
    String email = userDetails[2];

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    System.out.println(claim.get("data").asList(Map.class));
    assertTrue("Fail".equals(response.get("Status").toString()));

    });
  }

  @Test
  public void failToCreateUserWithNullPassword(){

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = null;
    String email = userDetails[2];

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("Fail".equals(response.get("Status").toString()));

    });
  }

  @Test
  public void failToCreateUserWithNoEmailAddress() {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = "";

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(response.get("Status").toString()));
      assertTrue("Invalid User Name / Email Address.".equals(response.get("Message")));

    });
  }

  @Test
  public void failToCreateUserWithInvalidEmailAddress() {

    String userDetails[] = generateUserDetails();
    String userName = userDetails[0];
    String password = userDetails[1];
    String email = "test@test";

    String userType = "35";
    String account = "8";

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(response.get("Status").toString()));
      assertTrue("Invalid User Name / Email Address.".equals(response.get("Message")));

    });
  }
}
