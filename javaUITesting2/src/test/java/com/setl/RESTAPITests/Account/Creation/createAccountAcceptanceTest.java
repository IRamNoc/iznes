package com.setl.RESTAPITests.Account.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.sql.*;
import java.util.Map;


import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.deleteAccountFromDatabase;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.validateDatabaseAccountTable;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.validateDatabaseCountRows;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

@RunWith(JUnit4.class)
public class createAccountAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);

    String localAddress = "http://uk-lon-li-006.opencsd.io/api";
    int userId = 42;
    String apiKey = "8hRWis4APGvOmgdUnhfLp8rNTh3Wp0h9EK2DcT5+YTiG";

    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup() {
        api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
    }

    @Test
    public void createNewAccount() throws SQLException {

        validateDatabaseCountRows("Accounts", 6);
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 3), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertTrue("OK".equals(response.get("Status").toString()));
            assertTrue(accountName.equals(response.get("accountName").toString()));
            assertTrue(accountDescription.equals(response.get("description").toString()));
        });
        validateDatabaseAccountTable(accountName, accountDescription, 1);
        validateDatabaseCountRows("Accounts", 7);
        deleteAccountFromDatabase(accountName);
        validateDatabaseCountRows("Accounts", 6);
    }

    @Test
    public void shouldNotCreateDuplicateAccount() throws SQLException {

        validateDatabaseCountRows("Accounts", 6);
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 3), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertTrue("OK".equals(response.get("Status").toString()));
            assertTrue(accountName.equals(response.get("accountName").toString()));
            assertTrue(accountDescription.equals(response.get("description").toString()));
        });
        validateDatabaseAccountTable(accountName, accountDescription, 1);
        validateDatabaseCountRows("Accounts", 7);

        deleteAccountFromDatabase(accountName);
        validateDatabaseCountRows("Accounts", 6);
    }


    @Test
    public void failToCreateAccountWithIncorrectPermissions() {
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.newAccount(accountDescription, accountName, 1), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("Fail".equals(response.get("Status").toString()));

        });
    }
}
