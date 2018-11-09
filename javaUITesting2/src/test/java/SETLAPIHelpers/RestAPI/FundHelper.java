package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.Container;
import SETLAPIHelpers.Fund;
import SETLAPIHelpers.JsonToJava;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;

import java.io.IOException;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;


public class FundHelper {


    String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    static RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }



    public static Fund createFundAndCaptureDetails(String localAddress,
                              String fundName,
                              String fundProspectus,
                              String fundReport,
                              String fundShares,
                              String fundLei,
                              String sicavId,
                              String companyId,
                              int userId,
                              String apiKey
                               )
                               throws InterruptedException{
  Container<Fund> container = new Container<>();

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newFund(fundName, fundProspectus, fundReport, fundShares, fundLei, sicavId, companyId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      try {
        Fund fund = JsonToJava.convert(resp.toString(), Fund.class);
        container.setItem(fund);
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
                                       String userLocked
                                       //int userId,
                                       //String apiKey
                               )
                               throws InterruptedException {



    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newUser(account, userName, email, userType, password, userLocked), claim -> {
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
                                       String userLocked
                                       //int userId,
                                       //String apiKey
                               )
                               throws InterruptedException {


    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

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
