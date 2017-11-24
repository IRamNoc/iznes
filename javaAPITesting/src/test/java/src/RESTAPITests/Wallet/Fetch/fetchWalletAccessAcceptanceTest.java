package src.RESTAPITests.Wallet.Fetch;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class fetchWalletAccessAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);

  String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
  int userId = 6;
  String apiKey = "LR6hDr++WJotI8W46BKwL4hKtc47wplHgGqM9JzRSWM=";

    @Test
    public void fetchWalletAccessDetails() throws ExecutionException, InterruptedException {

        RestApi api = new RestApi(localAddress);
        api.start(userId, apiKey);

        MessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getMyWalletsAccess(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertEquals(userId, response.get("userID"));
            assertEquals(3, response.get("walletID"));
            assertEquals(3, response.get("permission"));
            assertTrue("".equals(response.get("permissionDetail")));
            assertEquals(3, response.get("accountID"));
            assertTrue("AMWallet".equals(response.get("walletName")));
            assertTrue("FgPKlXh/MDru8FWQM/vPKk8nV/XmbxPSkEZkOBzyF14=".equals(response.get("commuPub")));
            assertEquals(3, response.get("walletType"));
            assertEquals(0, response.get("walletLocked"));
            assertEquals(null,(response.get("walletTypeName")));
            assertEquals(null,(response.get("GLEI")));
            assertEquals(null,(response.get("bankWalletID")));
            assertEquals(null,(response.get("CorrespondenceAddressD")));
        });

    }
  }

