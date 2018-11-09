package com.setl.RESTAPITests.Member.Deletion;

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

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteMemberAcceptanceTest {

  @Rule
  public Timeout globalTimeout = new Timeout(30000);

  String localAddress = "http://localhost:9788/api";
  int userId = 4;
  String apiKey = "VbMoQkpX422qAtkyNmMOoM6G/uQBYb96wXp7oq5rk5Mj";
  RestApi<MemberNodeMessageFactory> api;

  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }

  @Test
  @Ignore
  public void deleteMember() throws ExecutionException, InterruptedException {

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String memberEmail = memberDetails[1];

      api.start(userId, apiKey);
      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newMember(memberName, memberEmail), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      System.out.println(response);
      assertTrue("OK".equals(response.get("Status").toString()));
      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello = resp.get("parent").toString();
      api.sendMessage(msfFactory.deleteMember(hello), claime -> {
      Map resp2 = claime.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp2.get("Status")));
    });
  });
  }

  @Test
  @Ignore
  public void shouldNotDeleteMemberWithoutPermissions() throws ExecutionException, InterruptedException {

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String memberEmail = memberDetails[1];

    int userId = 4;
    String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";

      api.start(userId, apiKey);
      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newMember(memberName, memberEmail), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
      Map resp = claim.get("data").asList(Map.class).get(0);
      String hello = resp.get("parent").toString();

      api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
      api.sendMessage(msfFactory.deleteMember(hello), claime -> {
      Map resp2 = claime.get("data").asList(Map.class).get(0);
      assertTrue("Permission denied.".equals(resp2.get("Message")));
    });
  });
  }
}
