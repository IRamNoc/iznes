package com.setl.RESTAPITests.Fund.Fetch;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Before;
import org.junit.Ignore;
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
    public void fetchUserDetails() throws ExecutionException, InterruptedException {


        api.start(userId, apiKey);

        MemberNodeMessageFactory msfFactory = api.getMessageFactory();

        api.sendMessage(msfFactory.getDetails(), claim -> {
            Map response = claim.get("data").asList(Map.class).get(0);
            System.out.println(response);
            assertEquals(userId, response.get("userID"));
            assertTrue("Admin_3".equals(response.get("displayName").toString()));

        });

    }
  }

