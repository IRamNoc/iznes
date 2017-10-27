package src.RESTAPITests.Member.Deletion;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.User;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import src.WebSocketAPITests.io.setl.Container;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.AccountDetailsHelper.generateAccountDetails;
import static SETLAPIHelpers.MemberDetailsHelper.generateMemberDetails;
import static junit.framework.TestCase.assertTrue;


@RunWith(JUnit4.class)
public class deleteMemberAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(10000);

  String localAddress = "http://localhost:9788/api";
  int userId = 4;
  String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";

  @Test
  public void deleteMember() throws ExecutionException, InterruptedException {

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String memberEmail = memberDetails[1];

      RestApi api = new RestApi(localAddress);
      api.start(userId, apiKey);
      MessageFactory msfFactory = api.getMessageFactory();
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
  public void shouldNotDeleteMemberWithoutPermissions() throws ExecutionException, InterruptedException {

    String memberDetails[] = generateMemberDetails();
    String memberName = memberDetails[0];
    String memberEmail = memberDetails[1];

    int userId = 4;
    String apiKey = "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=";

      RestApi api = new RestApi(localAddress);
      api.start(userId, apiKey);
      MessageFactory msfFactory = api.getMessageFactory();
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
