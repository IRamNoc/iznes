package com.setl.RESTAPITests.Fund.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Map;

import static SETLAPIHelpers.FundDetailsHelper.generateFundDetails;
import static junit.framework.TestCase.assertTrue;

public class createFundAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(300000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";
  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
  }



  @Test
  @Ignore
  public void createFundWithValidDataTest(){

    String [] fundDetails = generateFundDetails();
    String fundName = fundDetails[0];
    String fundProspectus = fundDetails[1];
    String fundReport = fundDetails[2];
    String fundShares = fundDetails[3];
    String lei = fundDetails[4];
    String sicav = fundDetails[5];
    String companyId = fundDetails[6];

    api.start(6, "LR6hDr++WJotI8W46BKwL4hKtc47wplHgGqM9JzRSWM=");

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newFund(fundName, fundProspectus, fundReport,
      fundShares, lei, sicav, companyId), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
    });
  }

}
