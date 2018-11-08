package SETLAPIHelpers.RestAPI;

import SETLAPIHelpers.Container;
import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.Member;
import SETLAPIHelpers.Container;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;

import java.io.IOException;
import java.util.Map;

import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertTrue;

public class MemberHelper {

    static RestApi<MemberNodeMessageFactory> api;

    public static Member createMemberAndCaptureDetails(String localAddress, String memberName, String email) throws InterruptedException {

      Container<Member> container = new Container<>();


        MemberNodeMessageFactory msfFactory = api.getMessageFactory();
        api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
          Map resp = claim.get("data").asList(Map.class).get(0);
          try {
            Member member = JsonToJava.convert(resp.toString(), Member.class);
            container.setItem(member);
          } catch (IOException e) {
            e.printStackTrace();
          }

         });
    return container.getItem();
    }

  public static void createMemberSuccess(int userId, String apiKey, String memberName, String email) {


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));


    });
  }

  public static void createMemberFailure(int userId, String apiKey, String memberName, String email, String expectedError) {

    RestApi<MemberNodeMessageFactory> api = null;    
    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue(expectedError.equals(resp.get("Message")));
    });
  }

  public static void createMember(String localAddress, int noOfUsers) throws InterruptedException {
    for (int i = 0; i < noOfUsers; i++) {
      String [] memberDetails = generateMemberDetails();
      String memberName = memberDetails[0];
      String email = memberDetails[1];

      //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
      api.start(4, "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=");
      //api.start(userId, apiKey);

      MemberNodeMessageFactory msfFactory = api.getMessageFactory();
      api.sendMessage(msfFactory.newMember(memberName, email), claim -> {
        Map resp = claim.get("data").asList(Map.class).get(0);
        assertTrue("OK".equals(resp.get("Status")));
      });
    }
  }


  public static void deleteMemberSuccess(String localAddress, String memberId) throws InterruptedException {

    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteMember(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(resp.get("Status")));
    });
  }

  public static void deleteMemberFailure(String localAddress, String memberId) throws InterruptedException {

    //api.start(14, "rL8pvhh/g19nUTUCwfJVXSx4aoUOWW0sZ4Tx8wD4H38=");
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");
    //api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.deleteMember(memberId), claim -> {
      Map resp = claim.get("data").asList(Map.class).get(0);
      assertTrue("Fail".equals(resp.get("Status")));
      assertTrue("".equals(resp.get("Message")));
    });
  }

}
