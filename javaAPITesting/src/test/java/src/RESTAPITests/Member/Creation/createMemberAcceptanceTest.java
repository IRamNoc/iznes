package src.RESTAPITests.Member.Creation;

import SETLAPIHelpers.Member;

import SETLAPIHelpers.WebSocketAPI.LoginHelper;
import SETLAPIHelpers.WebSocketAPI.MemberHelper;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import io.setl.wsclient.shared.Connection;
import io.setl.wsclient.shared.Message;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;

import static SETLAPIHelpers.RestAPI.MemberHelper.*;
import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static SETLAPIHelpers.WebSocketAPI.LoginHelper.login;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createMemberAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(300000);

  String localAddress = "http://localhost:9788/api";
  int userId = 4;
  String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";


  @Test
  public void createNewMember() throws ExecutionException, InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    RestApi api = new RestApi(localAddress);
    api.start(userId, apiKey);

    MessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      System.out.println(response);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(memberName.equals(response.get("memberName").toString()));
      assertTrue(email.equals(response.get("emailAddress").toString()));

    });
  }

  @Test
  public void createMultipleMembers() throws ExecutionException, InterruptedException {
      createMember(localAddress,5);
    }

  @Test
  public void failToCreateMemberWithIncorrectPermissions() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    int userId = 17;
    String apiKey = "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=";
    String expectedError = "Permission denied.";

    createMemberFailure(localAddress, userId, apiKey, memberName, email, expectedError);
    }

  @Test
  public void failToCreateMemberWithNullUserName() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";
    createMemberFailure(localAddress, userId, apiKey, null, email, expectedError);
    }

  @Test
  public void failToCreateMemberWithEmptyStringUserName() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";
    createMemberFailure(localAddress, userId, apiKey, "", email, expectedError);
    }

  @Test
  public void failToCreateDuplicateUser() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";

    createMemberSuccess(localAddress,userId, apiKey, memberName, email);
    createMemberFailure(localAddress,userId, apiKey, memberName, email, expectedError);
    }
  }

