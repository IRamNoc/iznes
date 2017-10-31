package src.RESTAPITests.Account.Creation;

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
import static SETLAPIHelpers.RestAPI.AccountHelper.createAccountFailure;
import static SETLAPIHelpers.RestAPI.MemberHelper.*;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(300000);

  String localAddress = "http://localhost:9788/api";
  int userId = 4;
  String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";


  @Test
  public void createNewAccount() throws ExecutionException, InterruptedException {
    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 1), claim -> {
        Map response = claim.get("data").asList(Map.class).get(0);
        assertTrue("OK".equals(response.get("Status").toString()));
        assertTrue(accountName.equals(response.get("accountName").toString()));
        assertTrue(accountDescription.equals(response.get("description").toString()));
    });
  }
  @Test
  public void failToCreateAccountWithIncorrectPermissions() throws ExecutionException, InterruptedException {
    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

      createAccountFailure(localAddress, 17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=", accountDescription, accountName,1, "Permission Denied.");

  }
}
