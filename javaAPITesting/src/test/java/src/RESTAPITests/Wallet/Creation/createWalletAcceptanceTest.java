package src.RESTAPITests.Wallet.Creation;

import SETLAPIHelpers.Wallet;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.WalletDetailsHelper.generateWalletDetails;

import static SETLAPIHelpers.RestAPI.WalletHelper.*;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createWalletAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(300000);

  String localAddress = "http://localhost:9788/api";
  int userId = 4;
  String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
    }



    @Test
  public void createNewCommercialWallet() throws ExecutionException, InterruptedException {
    String walletDetails[] = generateWalletDetails();
    String walletName = walletDetails[0];
    String email = walletDetails[1];


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newWallet(walletName,
                                         email,
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "" ), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      System.out.println(response);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(walletName.equals(response.get("WalletName").toString()));
      assertTrue(email.equals(response.get("emailAddress").toString()));

    });
  }

   @Test
  public void createNewResidentialWallet() throws ExecutionException, InterruptedException {
     String walletDetails[] = generateWalletDetails();
     String walletName = walletDetails[0];
     String email = walletDetails[1];

     api.start(userId, apiKey);

     MemberNodeMessageFactory msfFactory = api.getMessageFactory();

     api.sendMessage(msfFactory.newWallet(walletName,
                                          email,
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          "",
                                          ""), claim -> {
       Map response = claim.get("data").asList(Map.class).get(0);
       System.out.println(response);
       assertTrue("OK".equals(response.get("Status").toString()));
       assertTrue(walletName.equals(response.get("WalletName").toString()));
       assertTrue(email.equals(response.get("emailAddress").toString()));

     });
   }

  @Test
  public void createNewOtherWallet() throws ExecutionException, InterruptedException {
    String walletDetails[] = generateWalletDetails();
    String walletName = walletDetails[0];
    String email = walletDetails[1];


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newWallet(walletName,
                                         email,
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "",
                                        "" ), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      System.out.println(response);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(walletName.equals(response.get("WalletName").toString()));
      assertTrue(email.equals(response.get("emailAddress").toString()));

    });
  }
}

