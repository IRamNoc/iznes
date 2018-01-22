package com.setl.RESTAPITests.Account.List;

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

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.RestAPI.AccountHelper.createAccountFailure;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class listAccountAcceptanceTest {

    @Rule
    public Timeout globalTimeout = new Timeout(30000);

    String localAddress = "http://localhost:9788/api";
    int userId = 4;
    String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";
    RestApi<MemberNodeMessageFactory> api;


    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }



    @Test
    @Ignore("Need to programatically determine Userid and API Key")
    public void listAccounts() throws ExecutionException, InterruptedException {

        api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getAccountList(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));

        });
    }
    @Test
    @Ignore("Need to programatically determine Userid and API Key")
    public void failToCreateArrangementWithIncorrectPermissions() throws ExecutionException, InterruptedException {
        String accountDetails[] = generateAccountDetails();
        String accountName = accountDetails[0];
        String accountDescription = accountDetails[1];

        createAccountFailure(localAddress, 17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=", accountDescription, accountName,1, "Permission Denied.");

    }
}
