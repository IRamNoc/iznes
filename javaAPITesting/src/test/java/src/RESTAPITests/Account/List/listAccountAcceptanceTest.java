package src.RESTAPITests.Account.List;

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
import static SETLAPIHelpers.RestAPI.AccountHelper.createAccountFailure;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class listAccountAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(120000);

    String localAddress = "http://localhost:9788/api";
    int userId = 4;
    String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";


    @Test
    public void listAccounts() throws ExecutionException, InterruptedException {
        RestApi api = new RestApi(localAddress);
        api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

        MessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getAccountList(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }
    @Test
    public void failToCreateArrangementWithIncorrectPermissions() throws ExecutionException, InterruptedException {
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        createAccountFailure(localAddress, 17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=", accountDescription, accountName,1, "Permission Denied.");

    }
}
