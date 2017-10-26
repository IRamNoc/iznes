package src.RESTAPITests.Account.Deletion;

import SETLAPIHelpers.Account;
import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.SocketClientEndpoint;
import io.setl.wsclient.shared.encryption.KeyHolder;
import io.setl.wsclient.socketsrv.SocketServerEndpoint;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.Description;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import src.WebSocketAPITests.io.setl.Container;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.UserHelper.*;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.createAccount;
import static SETLAPIHelpers.WebSocketAPI.AccountHelper.deleteAccount;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(10000);

  String localAddress = "http://localhost:9788/api";
  int userId = 17;
  String apiKey = "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=";

  @Test
  public void deleteAccount() throws ExecutionException, InterruptedException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);
    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 5), claim -> {

      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello = resp.get("accountID").toString();
      System.out.println(resp.toString());

    api.sendMessage(msfFactory.deleteAccount(hello), claime -> {
      Map resp2 = claime.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp2.get("Status")));
    });

  });}

  public static void deleteAccountSuccess(String localAddress, int userId, String apiKey, int memberId) throws InterruptedException {

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteAccount(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }

  public static User createAccountAndCaptureDetails(String localAddress, String description, String name, int memberId)

    throws InterruptedException {
    Container<User> container = new Container<>();

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(description, name, memberId), claim -> {

      Map resp = claim.get("data").asList(Map.class).get(0);
      System.out.println(resp.toString());
      try {
        User user = JsonToJava.convert(resp.toString(), User.class);
        container.setItem(user);
      } catch (IOException e) {
        e.printStackTrace();
      }

    });
    return container.getItem();
  }
}
