package com.setl.RESTAPITests.Account.List;

import com.setl.UI.common.SETLUtils.Repeat;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.AccountHelper.createAccountFailure;
import static SETLAPIHelpers.RestAPI.DatabaseHelper.validateDatabaseCountRows;
import static java.util.Objects.isNull;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class listAccountAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);

    String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
    int userId = 9;
    String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";
    RestApi<MemberNodeMessageFactory> api;


    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }



    @Test
    public void listAccounts() throws SQLException {

        validateDatabaseCountRows("Accounts", 6);
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getAccountList(), claim -> {

            String header = claim.get("status").asString();
            assertTrue("OK".equals(header));
            Map account1 = claim.get("data").asList(Map.class).get(0);

            assertEquals(2, claim.get("data").asList(Map.class).size());
            assertTrue("3".equals(account1.get("accountID").toString()));
            assertTrue("TestMembertFlK9Sr8wa_Admin_Account".equals(account1.get("accountName").toString()));
            assertTrue("TestMembertFlK9Sr8wa admin account".equals(account1.get("description").toString()));
            assertTrue("3".equals(account1.get("parent").toString()));
            assertTrue(isNull(account1.get("billingWallet")));

        });
    }

    @Test
    public void createAccount() throws SQLException {

        validateDatabaseCountRows("Accounts", 6);
        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getAccountList(), claim -> {

            String header = claim.get("status").asString();
            assertTrue("OK".equals(header));
            Map account1 = claim.get("data").asList(Map.class).get(0);

            assertEquals(2, claim.get("data").asList(Map.class).size());
            assertTrue("3".equals(account1.get("accountID").toString()));
            assertTrue("TestMembertFlK9Sr8wa_Admin_Account".equals(account1.get("accountName").toString()));
            assertTrue("TestMembertFlK9Sr8wa admin account".equals(account1.get("description").toString()));
            assertTrue("3".equals(account1.get("parent").toString()));
            assertTrue(isNull(account1.get("billingWallet")));

        });
    }
}

