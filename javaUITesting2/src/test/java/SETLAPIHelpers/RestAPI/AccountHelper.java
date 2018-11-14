package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.Container;
import SETLAPIHelpers.JsonToJava;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;

import java.io.IOException;
import java.util.Map;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertTrue;



public class AccountHelper {


    static RestApi<MemberNodeMessageFactory> api;

    public static Account createAccountAndCaptureDetails(String localAddress, String description, String name, String member, int userId, String apiKey) throws InterruptedException {

      Container<Account> container = new Container<>();

        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.newAccount(description, name, member), claim -> {
          Map resp = claim.get("data").asList(Map.class).get(0);
          try {
            Account account = JsonToJava.convert(resp.toString(), Account.class);
            container.setItem(account);
          } catch (IOException e) {
            e.printStackTrace();
          }

         });
    return container.getItem();
    }

  public static void createAccountSuccess(String localAddress, String description, String name, String member, int userId, String apiKey) throws InterruptedException {

    api = new RestApi<>(localAddress, new MemberNodeMessageFactory());

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(description, name, member), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }

  public static void createAccountFailure(String localAddress, int userId, String apiKey, String description, String name, int member, String expectedError) throws InterruptedException{

    api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(description, name, member), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue(expectedError.equals(resp.get("Message")));
    });
  }

  public static void createAccount(String localAddress, int userId, String apiKey, String description, String name, String member, int noOfUsers) throws InterruptedException {
    for (int i = 0; i < noOfUsers; i++) {
      String [] memberDetails = generateMemberDetails();
      String memberName = memberDetails[0];
      String email = memberDetails[1];

      api.start(userId, apiKey);

      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newAccount(description, name, member), claim -> {
        Map resp = claim.get("data").asList(Map.class).get(0);
        assertTrue("OK".equals(resp.get("Status")));
      });
    }
  }


  public static void deleteAccountSuccess(String localAddress, int userId, String apiKey, String memberId) throws InterruptedException {

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteAccount(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }

  public static void deleteAccountFailure(String localAddress, int userId, String apiKey, String memberId) throws InterruptedException {

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteAccount(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue("".equals(resp.get("Message")));
    });
  }

}
