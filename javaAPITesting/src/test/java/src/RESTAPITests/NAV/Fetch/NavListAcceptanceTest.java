package src.RESTAPITests.NAV.Fetch;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Map;

import static SETLAPIHelpers.UserDetailsHelper.generateUserDetails;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public class NavListAcceptanceTest {


  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  String localAddress = "http://localhost:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void getValidNavList(){

    int expectedPrice = 1200000;
    int expectedstatus = -1;
    int expectedTotal = 1;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.getNavList("TEST1|OFI RS Dynamique C D ", "2017-07-05", "-1", 0, 100), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response.get("fundName")));
    assertTrue("2017-07-04T23:00:00.000Z".equals(response.get("navDate")));
    assertEquals(expectedPrice, response.get("price"));
    assertEquals(expectedstatus, response.get("status"));
    assertTrue("FR0000970097".equals(response.get("isin")));
    assertEquals(expectedTotal, response.get("total"));
   });
  }


  @Test
  public void getValidNavListUsingEmptyStringForDate(){

    int expectedPrice1 = 1200000;
    int expectedPrice2 = 1000000;
    int expectedPrice5 = 1100000;

    int expectedstatus = -1;
    int expectedTotal = 6;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.getNavList("TEST1|OFI RS Dynamique C D ", "", "-1", 0, 100), claim -> {
    Map response1 = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response1.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response1.get("fundName")));
    assertTrue("2017-07-05 00:00:00".equals(response1.get("navDate")));
    assertEquals(expectedPrice1, response1.get("price"));
    assertEquals(expectedstatus, response1.get("status"));
    assertTrue("FR0000970097".equals(response1.get("isin")));
    assertEquals(expectedTotal, response1.get("total"));

    Map response2 = claim.get("data").asList(Map.class).get(1);
    assertTrue("OK".equals(response2.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response2.get("fundName")));
    assertTrue("2017-06-30 00:00:00".equals(response2.get("navDate")));
    assertEquals(expectedPrice2, response2.get("price"));
    assertEquals(expectedstatus, response2.get("status"));
    assertTrue("FR0000970097".equals(response2.get("isin")));
    assertEquals(expectedTotal, response2.get("total"));

    Map response3 = claim.get("data").asList(Map.class).get(2);
    assertTrue("OK".equals(response3.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response3.get("fundName")));
    assertTrue("2017-06-29 00:00:00".equals(response3.get("navDate")));
    assertEquals(expectedPrice2, response3.get("price"));
    assertEquals(expectedstatus, response3.get("status"));
    assertTrue("FR0000970097".equals(response3.get("isin")));
    assertEquals(expectedTotal, response3.get("total"));

    Map response4 = claim.get("data").asList(Map.class).get(3);
    assertTrue("OK".equals(response4.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response4.get("fundName")));
    assertTrue("2017-06-20 00:00:00".equals(response4.get("navDate")));
    assertEquals(expectedPrice2, response4.get("price"));
    assertEquals(expectedstatus, response4.get("status"));
    assertTrue("FR0000970097".equals(response4.get("isin")));
    assertEquals(expectedTotal, response4.get("total"));

    Map response5 = claim.get("data").asList(Map.class).get(4);
    assertTrue("OK".equals(response5.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response5.get("fundName")));
    assertTrue("2017-05-24 00:00:00".equals(response5.get("navDate")));
    assertEquals(expectedPrice5, response5.get("price"));
    assertEquals(expectedstatus, response5.get("status"));
    assertTrue("FR0000970097".equals(response5.get("isin")));
    assertEquals(expectedTotal, response5.get("total"));

    Map response6 = claim.get("data").asList(Map.class).get(5);
    assertTrue("OK".equals(response6.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response6.get("fundName")));
    assertTrue("2017-05-22 00:00:00".equals(response6.get("navDate")));
    assertEquals(expectedPrice2, response6.get("price"));
    assertEquals(expectedstatus, response6.get("status"));
    assertTrue("FR0000970097".equals(response6.get("isin")));
    assertEquals(expectedTotal, response6.get("total"));
   });
  }

  @Test
  public void getValidNavListUsingNullForDate(){

    int userId = 17;
    String apiKey = "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=";
    int expectedPrice1 = 1200000;
    int expectedPrice2 = 1000000;
    int expectedPrice5 = 1100000;

    int expectedstatus = -1;
    int expectedTotal = 6;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.getNavList("TEST1|OFI RS Dynamique C D ", null, "-1", 0, 100), claim -> {
      Map response1 = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response1.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response1.get("fundName")));
      assertTrue("2017-07-05 00:00:00".equals(response1.get("navDate")));
      assertEquals(expectedPrice1, response1.get("price"));
      assertEquals(expectedstatus, response1.get("status"));
      assertTrue("FR0000970097".equals(response1.get("isin")));
      assertEquals(expectedTotal, response1.get("total"));

      Map response2 = claim.get("data").asList(Map.class).get(1);
      assertTrue("OK".equals(response2.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response2.get("fundName")));
      assertTrue("2017-06-30 00:00:00".equals(response2.get("navDate")));
      assertEquals(expectedPrice2, response2.get("price"));
      assertEquals(expectedstatus, response2.get("status"));
      assertTrue("FR0000970097".equals(response2.get("isin")));
      assertEquals(expectedTotal, response2.get("total"));

      Map response3 = claim.get("data").asList(Map.class).get(2);
      assertTrue("OK".equals(response3.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response3.get("fundName")));
      assertTrue("2017-06-29 00:00:00".equals(response3.get("navDate")));
      assertEquals(expectedPrice2, response3.get("price"));
      assertEquals(expectedstatus, response3.get("status"));
      assertTrue("FR0000970097".equals(response3.get("isin")));
      assertEquals(expectedTotal, response3.get("total"));

      Map response4 = claim.get("data").asList(Map.class).get(3);
      assertTrue("OK".equals(response4.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response4.get("fundName")));
      assertTrue("2017-06-20 00:00:00".equals(response4.get("navDate")));
      assertEquals(expectedPrice2, response4.get("price"));
      assertEquals(expectedstatus, response4.get("status"));
      assertTrue("FR0000970097".equals(response4.get("isin")));
      assertEquals(expectedTotal, response4.get("total"));

      Map response5 = claim.get("data").asList(Map.class).get(4);
      assertTrue("OK".equals(response5.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response5.get("fundName")));
      assertTrue("2017-05-24 00:00:00".equals(response5.get("navDate")));
      assertEquals(expectedPrice5, response5.get("price"));
      assertEquals(expectedstatus, response5.get("status"));
      assertTrue("FR0000970097".equals(response5.get("isin")));
      assertEquals(expectedTotal, response5.get("total"));

      Map response6 = claim.get("data").asList(Map.class).get(5);
      assertTrue("OK".equals(response6.get("Status").toString()));
      assertTrue("TEST1|OFI RS Dynamique C D ".equals(response6.get("fundName")));
      assertTrue("2017-05-22 00:00:00".equals(response6.get("navDate")));
      assertEquals(expectedPrice2, response6.get("price"));
      assertEquals(expectedstatus, response6.get("status"));
      assertTrue("FR0000970097".equals(response6.get("isin")));
      assertEquals(expectedTotal, response6.get("total"));
   });
  }
}