package src.RESTAPITests.Account.Deletion;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(10000);

  int userId = 17;
  String localAddress = "http://localhost:9788/api";
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
  });
  }

  @Test
  public void shouldNotDeleteAccountWithoutPermissions() throws ExecutionException, InterruptedException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 5), claim -> {

      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello1 = resp.get("accountID").toString();
      System.out.println(resp.toString());

      api.start(4, "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=");
      api.sendMessage(msfFactory.deleteAccount(hello1), claime -> {
        Map resp3 = claime.get("data").asList(Map.class).get(0);
        System.out.println(resp3.toString());
        assertTrue("FAIL".equals(resp3.get("Status")));
      });
    });
  }

  @Test
  public void shouldNotDeleteAccountWithoutPermissions2() throws ExecutionException, InterruptedException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 5), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello = resp.get("parent").toString();

      api.start(4, "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=");
      api.sendMessage(msfFactory.deleteAccount(hello), claime -> {
        Map resp2 = claime.get("data").asList(Map.class).get(0);
        assertTrue("FAIL".equals(resp2.get("Status")));
      });
    });
  }
}
