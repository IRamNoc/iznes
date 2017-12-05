package src.RESTAPITests.Account.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.AccountHelper.createAccountFailure;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);

  String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
  int userId = 4;
  String apiKey = "/bKH2sZuYyQXUAPia1iHQOEq57HdZbDFAzAruU+6xQg=";
  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }


  @Test
  public void createNewAccount() throws ExecutionException, InterruptedException {
    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();

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

      createAccountFailure("http://localhost:9788.api", 17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=", accountDescription, accountName,1, "Permission Denied.");

  }
}
