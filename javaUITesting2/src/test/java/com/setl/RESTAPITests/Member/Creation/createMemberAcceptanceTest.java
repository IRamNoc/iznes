package com.setl.RESTAPITests.Member.Creation;

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

import static SETLAPIHelpers.RestAPI.MemberHelper.createMember;
import static SETLAPIHelpers.RestAPI.MemberHelper.createMemberFailure;
import static SETLAPIHelpers.RestAPI.MemberHelper.createMemberSuccess;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createMemberAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);

  String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
  int userId = 11;
  String apiKey = "1PvRajV2LOOyuqW0lSeQx73fx0JyJXR3G/UKW9f+SNuG";
  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }



  @Test

  public void createNewMember() throws ExecutionException, InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      System.out.println(response);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(memberName.equals(response.get("memberName").toString()));
      assertTrue(email.equals(response.get("emailAddress").toString()));

    });
  }

  @Test
  @Ignore
  public void createMultipleMembers() throws ExecutionException, InterruptedException {
      createMember(localAddress,5);
    }

  @Test
  public void failToCreateMemberWithIncorrectPermissions() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    int userId = 9;
    String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";

      api.start(userId, apiKey);

      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
          Map resp = claim.get("data").asList(Map.class).get(0);
          assertTrue("Fail".equals(resp.get("Status")));
          assertTrue("Permission denied.".equals(resp.get("Message")));
    });
  }

  @Test
  @Ignore
  public void failToCreateMemberWithNullUserName() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";
    createMemberFailure(userId, apiKey, null, email, expectedError);
    }

  @Test
  @Ignore
  public void failToCreateMemberWithEmptyStringUserName() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";
    createMemberFailure(userId, apiKey, "", email, expectedError);
    }

  @Test
  @Ignore
  public void failToCreateDuplicateUser() throws InterruptedException {
    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String email = memberDetails[1];

    String expectedError = "SQL Error returned.";

    createMemberSuccess(userId, apiKey, memberName, email);
    createMemberFailure(userId, apiKey, memberName, email, expectedError);
    }
  }

