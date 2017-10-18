package SETLAPIHelpers.RestAPI;

import java.io.IOException;
import java.util.Map;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;


import src.WebSocketAPITests.io.setl.Container;

import static junit.framework.TestCase.assertTrue;


public class UserHelper {


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

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
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

  public static void deleteUser(String localAddress, String userID) {

    RestApi api = new RestApi(localAddress);
    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteUser(userID), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      System.out.println(claim.get("data").asList(Map.class));
      String deletedUser = resp.get("userID").toString();
      assertTrue(deletedUser.equals(userID));

    });

  }

}
