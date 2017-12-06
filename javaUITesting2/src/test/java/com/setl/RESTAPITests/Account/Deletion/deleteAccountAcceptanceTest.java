package com.setl.RESTAPITests.Account.Deletion;

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
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(10000);

  int userId = 17;
  String localAddress = "http://localhost:9788/api";
  String apiKey = "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=";
  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }


  @Test
  public void deleteAccount() throws ExecutionException, InterruptedException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    api.start(userId, apiKey);
    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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


    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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
