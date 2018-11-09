package com.setl.RESTAPITests.Wallet.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.WalletDetailsHelper.generateWalletDetails;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createWalletAcceptanceTest {

  @Rule
  public Timeout globalTimeout = new Timeout(30000);

    String localAddress = "http://si-opencsd01.opencsd.io:9788/api";
    int userId = 9;
    String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
    }



  @Test
  @Ignore
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
   @Ignore
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
  @Ignore
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

