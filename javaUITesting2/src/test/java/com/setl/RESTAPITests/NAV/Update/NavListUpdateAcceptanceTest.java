package com.setl.RESTAPITests.NAV.Update;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import jnr.x86asm.Mem;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

public class NavListUpdateAcceptanceTest {


  @Rule
  public Timeout globalTimeout = new Timeout(30000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  //String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
  String localAddress = "http://localhost:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://si-opencsd01.dev.setl.io:27017/db/";
  int userId = 9;
  String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";
  RestApi<MemberNodeMessageFactory> api;

  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }


  @Test
  @Ignore
  public void failToUpdateNavPriceWhenNavIsFinalised(){


    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", "25000", 0, 0), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("Fail".equals(response.get("Status").toString()));
    assertTrue("Nav is finalised.".equals(response.get("Message").toString()));
   });
  }

  @Test
  @Ignore
  public void forceUpdateNavPriceWhenNavIsFinalised(){

    int expectedPrice = 1200005;
    int expectedStatus = 0;
    int expectedTotal = 1;

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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
  @Ignore
  public void UpdateNavFundDate(){

    int expectedPrice = 1200000;
    int expectedStatus = 0;
    int expectedTotal = 1;

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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
  @Ignore
  public void UpdateNavFundName(){

    int expectedPrice = 1200000;
    int expectedStatus = 0;
    int expectedTotal = 1;

    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
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
  @Ignore
  public void createNav(){

      String str = randomAlphabetic(5);
      String fundName = "Test_Fund_" + str;
      LocalDate startDate = LocalDate.of(2017, 1, 1); //start date
      long start = startDate.toEpochDay();

      LocalDate endDate = LocalDate.now(); //end date
      long end = endDate.toEpochDay();

      long randomDate = ThreadLocalRandom.current().longs(start, end).findAny().getAsLong();

      String fundDate = String.valueOf(LocalDate.ofEpochDay(randomDate));
      String fundTime = "00:00:00";
      String fundDateTime = fundDate + " " + fundTime;

      int price = Integer.parseInt(randomNumeric(1, 5));
      int priceStatus = -1;
      int force = 0;


    api.start(195, "3TNmTB37bn/A836LgdVsNaaY7iwJmqleeeswHBPOGb0=");

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav(fundName, fundDate, price, priceStatus, force), claim -> {
    Map response = claim.get("data").asList(Map.class).get(0);
    assertTrue("OK".equals(response.get("Status").toString()));
    assertTrue(fundName.equals(response.get("fundName")));
    assertEquals(fundDateTime, response.get("navDate"));
    assertEquals(price, response.get("price"));
    assertEquals(priceStatus, response.get("status"));
    });
  }

  private void resetPrice() {
      api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", 1200000, 0, 1), claim -> {
    });
  }

  private void resetDate() {
        api.start(17, "3TNmTB37bn/A836LgdVsNaaY7iwJmqleeeswHBPOGb0=");

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.updateNav("TEST1|OFI RS Dynamique C D ", "2017-07-05", 1200000, 0, 1), claim -> {
    });
  }
}
