package SETLAPIHelpers.RestAPI;

import java.io.IOException;
import java.util.Map;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;


import org.junit.Before;
import src.WebSocketAPITests.io.setl.Container;

import static junit.framework.TestCase.assertTrue;


public class UserHelper {

    String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
    static RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }




    public static User createUserAndCaptureDetails(String localAddress,
                              String account,
                              String userName,
                              String email,
                              String userType,
                              String password
                              //int userId,
                              //String apiKey
                               )
                               throws InterruptedException{
  Container<User> container = new Container<>();

    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      try {
        User user = JsonToJava.convert(resp.toString(), User.class);
        container.setItem(user);
      } catch (IOException e) {
        e.printStackTrace();
      }

    });

  return container.getItem();
  }

  public static void createUserSuccess(String localAddress,
                                       String account,
                                       String userName,
                                       String email,
                                       String userType,
                                       String password,
                                       int userId,
                                       String apiKey
                               )
                               throws InterruptedException {



    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });

  }

  public static void createUserFailure(String localAddress,
                                       String account,
                                       String userName,
                                       String email,
                                       String userType,
                                       String password,
                                       int userId,
                                       String apiKey
                               )
                               throws InterruptedException {


    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue("User Name / Email Address already exists.".equals(resp.get("Message")));
    });

  }

  public static void deleteUserSuccess(String localAddress, String userID) {

    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteUser(userID), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      String deletedUser = resp.get("userID").toString();
      assertTrue("OK".equals(resp.get("Status")));
      assertTrue(deletedUser.equals(userID));
    });

  }

  public static void deleteUserError(String localAddress, String userID) {

    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteUser(userID), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
    });

  }

}
