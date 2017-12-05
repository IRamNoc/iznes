package src.RESTAPITests.Arrangement.ListArrangement;

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
public class listArrangementAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(12000000);

    String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
    int userId = 6;
    String apiKey = "LR6hDr++WJotI8W46BKwL4hKtc47wplHgGqM9JzRSWM=";
    RestApi<MemberNodeMessageFactory> api;


    @Before
    public void setup(){
     api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }


    @Test
    public void listArrangementsByAssetAsAssetManager() throws ExecutionException, InterruptedException {

        api.start(userId, apiKey);

       MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(2, 0, 10, "1231|BTF5", "", 0, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void listArrangementsByArrangementTypeAsAssetManager() throws ExecutionException, InterruptedException {
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(2, 0, 10, "", "", 3, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }


    @Test
    public void listArrangementsByStatusAsAssetManager() throws ExecutionException, InterruptedException {

        api.start(userId, apiKey);

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(2, 0, 10, "", "", 0, -1, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void listAllArrangementsAsAssetManager() throws ExecutionException, InterruptedException {

        api.start(userId, apiKey);

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(2, 0, 10, "", "", 0, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void listAllArrangementsByAssetAsInvestor() throws ExecutionException, InterruptedException {

        api.start(11, "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=");

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(1, 0, 10, "1231|BTF5", "", 0, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void listAllArrangementsByArrangementTypeAsInvestor() throws ExecutionException, InterruptedException {

        api.start(11, "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=");

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(1, 0, 10, "", "", 3, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }


    @Test
    public void listAllArrangementsByStatusAsInvestor() throws ExecutionException, InterruptedException {

        api.start(11, "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=");

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(1, 0, 10, "", "", 0, 2, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void listAllArrangementsAsInvestor() throws ExecutionException, InterruptedException {

        api.start(11, "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=");

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getArrangementsList(1, 0, 10, "", "", 0, -3, ""), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }

    @Test
    public void insertArrangementAcceptanceTest() throws ExecutionException, InterruptedException {

        api.start(11, "34zzvRTMk8qE69IkTiBgLPza/jzKVTRzNE3KLVjeuoU=");

         MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.insertArrangementContractMap(4,20," 'SELECT * FROM setlnet.tblUsers;' ",1508860449), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));


        });
    }

    @Test
    public void failToCreateArrangementWithIncorrectPermissions() throws ExecutionException, InterruptedException {
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        createAccountFailure(localAddress, 17, "2p67Rh1j/+k/RelEArb8NCOhN2ctJklmnygJDvf+dUg=", accountDescription, accountName,1, "Permission Denied.");

    }
}
