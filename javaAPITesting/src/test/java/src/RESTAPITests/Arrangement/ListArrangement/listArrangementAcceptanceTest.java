package src.RESTAPITests.Arrangement.ListArrangement;

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
public class listArrangementAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(120000);

    String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
    int userId = 11;
    String apiKey = "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=";



    @Test
    public void listAllArrangements() throws ExecutionException, InterruptedException {
        RestApi api = new RestApi(localAddress);
        api.start(userId, apiKey);

        MessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList("", 1, 10, "", "", "", "", ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void insertArrangementAcceptanceTest() throws ExecutionException, InterruptedException {
        RestApi api = new RestApi(localAddress);
        api.start(userId, apiKey);

        MessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.insertArrangementContractMap(4,20,"31wi6uso8KKoshPx6QhmAcER92imR4dzyJ",1512900800), claim -> {
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
