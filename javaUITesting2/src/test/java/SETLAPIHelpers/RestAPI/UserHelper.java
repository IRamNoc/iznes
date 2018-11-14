package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.Container;
import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;


public class UserHelper {

    static RestApi<MemberNodeMessageFactory> api;

    public static User createUserAndCaptureDetails(
        String localAddress,
        String account,
        String userName,
        String email,
        String userType,
        String password,
        String userLocked,
        int userId,
        String apiKey){
  Container<User> container = new Container<>();

    api = new RestApi<>(localAddress, new MemberNodeMessageFactory());

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email,userType, password, userLocked), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      try {

        User user = JsonToJava.convert(JSONObject.toJSONString(resp), User.class);
        container.setItem(user);
      } catch (IOException e) {
        e.printStackTrace();
      }

    });

  return container.getItem();
  }

  public static void createUserSuccess( String localAddress,
                                        String account,
                                        String userName,
                                        String email,
                                        String userType,
                                        String password,
                                        String userLocked,
                                        int userId,
                                        String apiKey){


      api = new RestApi<>(localAddress, new MemberNodeMessageFactory());

      api.start(userId, apiKey);

      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newUser(account, userName, email,userType, password, userLocked), claim -> {
          Map response = claim.get("data").asList(Map.class).get(0);
          assertTrue("OK".equals(response.get("Status").toString()));
          assertTrue(userName.equals(response.get("userName").toString()));
          assertTrue(email.equals(response.get("emailAddress").toString()));
      });
  }

  public static void createUserFailure(String localAddress,
                                       String account,
                                       String userName,
                                       String email,
                                       String userType,
                                       String password,
                                       String userLocked,
                                       int userId,
                                       String apiKey
                               )
                               throws InterruptedException {


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password, userLocked), claim -> {
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
