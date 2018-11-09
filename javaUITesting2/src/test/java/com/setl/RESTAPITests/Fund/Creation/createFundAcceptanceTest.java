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
import static junit.framework.TestCase.assertEquals;
public class createFundAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);
  String localAddress = "http://uk-lon-li-006.opencsd.io:9788/api";
  RestApi<MemberNodeMessageFactory> api;

  @Before
  public void setup(){
      api = new RestApi<>(localAddress, new MemberNodeMessageFactory());
  }

  @Test
  public void createFundWithValidDataTest(){

    String [] fundDetails = generateFundDetails();
    String fundName = fundDetails[0];
    String fundProspectus = fundDetails[1];
    String fundReport = fundDetails[2];
    String fundShares = fundDetails[3];
    String lei = fundDetails[4];
    String sicav = fundDetails[5];
    String companyId = fundDetails[6];

    api.start(11, "IVGbY9KQSOTRSF6ZEWq4TCY9LjWgCS9nx4e9P5HWmUtX");

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newFund(fundName, fundProspectus, fundReport,fundShares, lei, sicav, companyId), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
        assertEquals("OK", response.get("Status").toString());
    });
  }

}
