package com.setl.RESTAPITests.Account.Deletion;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.validateDatabaseAccountTable;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteAccountAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);


  String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    int userId = 9;
    String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";

  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }


  @Test
  public void deleteAccount() throws SQLException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];

    api.start(userId, apiKey);
    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(accountName, accountDescription, 3), claim -> {

      Map resp = claim.get("data").asList(Map.class).get(0);
      String accountId  = resp.get("accountID").toString();
      String accName = resp.get("accountName").toString();
      String accDesc = resp.get("description").toString();


    api.sendMessage(msfFactory.deleteAccount(accountId), claime -> {
      Map resp2 = claime.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp2.get("Status")));
      System.out.println("Response 2 " + resp2);
      assertTrue(accName.equals(resp2.get("accountName")));
      assertTrue(accDesc.equals(resp2.get("description")));
    });
  });

    validateDatabaseAccountTable(accountName, accountDescription, 0);
  }


  @Test
  public void shouldNotDeleteAccountWithoutPermissions() throws SQLException {

    String accountDetails[] = generateAccountDetails();
    String accountName = accountDetails[0];
    String accountDescription = accountDetails[1];


    api.start(userId, apiKey);
    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 3), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello = resp.get("parent").toString();

      api.start(9, apiKey);
      api.sendMessage(msfFactory.deleteAccount(hello), claime -> {
        Map resp2 = claime.get("data").asList(Map.class).get(0);
        assertTrue("Fail".equals(resp2.get("Status")));
      });
    });

      validateDatabaseAccountTable(accountName, accountDescription, 1);
  }
}
