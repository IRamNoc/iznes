package com.setl.RESTAPITests.User.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.wsclient.shared.ResponseHandler;
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
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class createUserAcceptanceTest {

    @Rule
    public Timeout globalTimeout = Timeout.millis(30000);;

    String localAddress = "http://localhost:9788/api";
    int userId = 4;
    String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup() {
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }


    @Test
    //@Ignore
    public void createNewUser() throws ExecutionException, InterruptedException {
        String userDetails[] = generateUserDetails();
        String userName = userDetails[0];
        String password = userDetails[1];
        String email = userDetails[2];


        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.newUser("8", userName, email, "35", password ), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            assertTrue("OK".equals(response.get("Status").toString()));
            assertTrue(userName.equals(response.get("userName").toString()));
            assertTrue(email.equals(response.get("email").toString()));
        });
    }
}

