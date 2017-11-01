package src.RESTAPITests.NAV.Update;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Map;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public class NavListUpdateAcceptanceTest {


  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  String localAddress = "http://localhost:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void failToUpdateNavPriceWhenNavIsFinalised(){

    int expectedPrice = 1200000;
    int expectedstatus = -1;
    int expectedTotal = 1;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", "25000", 0, 0), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("Fail".equals(response.get("Status").toString()));
    assertTrue("Nav is finaled.".equals(response.get("Message").toString()));
   });
  }

  @Test
  public void forceUpdateNavPriceWhenNavIsFinalised(){

    int expectedPrice = 1200005;
    int expectedStatus = 0;
    int expectedTotal = 1;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", 1200005, 0, 1), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response.get("fundName")));
    assertTrue("2017-07-05 00:00:00".equals(response.get("navDate")));
    assertEquals(expectedPrice, response.get("price"));
    assertEquals(expectedStatus, response.get("status"));
    });
    resetPrice();
  }

  @Test
  public void UpdateNavFundDate(){

    int expectedPrice = 1200000;
    int expectedStatus = 0;
    int expectedTotal = 1;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-08", 1200000, 0, 1), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D ".equals(response.get("fundName")));
    assertTrue("2017-07-07 00:00:00".equals(response.get("navDate")));
    assertEquals(expectedPrice, response.get("price"));
    assertEquals(expectedStatus, response.get("status"));
    });
    resetDate();
  }

  @Test
  public void UpdateNavFundName(){

    int expectedPrice = 1200000;
    int expectedStatus = 0;
    int expectedTotal = 1;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D 1", "2017-07-08", 1200000, 0, 1), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue("TEST1|OFI RS Dynamique C D 1".equals(response.get("fundName")));
    assertTrue("2017-07-08 00:00:00".equals(response.get("navDate")));
    assertEquals(expectedPrice, response.get("price"));
    assertEquals(expectedStatus, response.get("status"));
    });
    resetDate();
  }

  @Test
  public void createNav(){

    int expectedPrice = 9999;
    int expectedStatus = 0;

    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST2", "2017-10-08", 9999, -1, 0), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue("TEST2".equals(response.get("fundName")));
    assertTrue("2017-10-08 00:00:00".equals(response.get("navDate")));
    assertEquals(expectedPrice, response.get("price"));
    assertEquals(expectedStatus, response.get("status"));
    });
    resetDate();
  }

  private void resetPrice() {
    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", 1200000, 0, 1), claim -> {
    });
  }

  private void resetDate() {
    RestApi api = new RestApi(localAddress);
    api.start(17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", 1200000, 0, 1), claim -> {
    });
  }
}
