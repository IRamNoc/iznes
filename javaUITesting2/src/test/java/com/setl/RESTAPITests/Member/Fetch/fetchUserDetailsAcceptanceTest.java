package com.setl.RESTAPITests.Member.Fetch;

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
import java.util.Objects;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class fetchUserDetailsAcceptanceTest {

  @Rule
  public Timeout globalTimeout = new Timeout(30000);

  String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
  int userId = 12;
  String apiKey = "VbMoQkpX422qAtkyNmMOoM6G/uQBYb96wXp7oq5rk5Mj";
    RestApi<MemberNodeMessageFactory> api;

    @Before
    public void setup(){
        api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
    }


    @Test
    @Ignore
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

