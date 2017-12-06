package com.setl.RESTAPITests.Fund.Fetch;

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
import java.util.concurrent.ExecutionException;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class fetchUserFundAccessDetailsAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);

  String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
  int userId = 6;
  String apiKey = "LR6hDr++WJotI8W46BKwL4hKtc47wplHgGqM9JzRSWM=";
    RestApi<MemberNodeMessageFactory> api;


    @Before
    public void setup(){
        api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
    }



    @Test
    public void fetchUserDetails() throws ExecutionException, InterruptedException {


        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getDetails(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertEquals(userId, response.get("userID"));
            assertTrue("am".equals(response.get("displayName").toString()));
            assertTrue("Asset".equals(response.get("firstName").toString()));
            assertTrue("Manager".equals(response.get("lastName").toString()));
            assertTrue("078474 4555 ".equals(response.get("mobilePhone").toString()));
            assertTrue("".equals(response.get("addressPrefix").toString()));
            assertTrue("Add !".equals(response.get("address1").toString()));
        });

    }
  }

