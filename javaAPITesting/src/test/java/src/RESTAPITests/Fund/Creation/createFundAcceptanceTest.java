package src.RESTAPITests.Fund.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Map;

import static SETLAPIHelpers.FundDetailsHelper.generateFundDetails;
import static junit.framework.TestCase.assertTrue;

public class createFundAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(3000);
  //String localAddress = "http://apidev.iznes.io:9788/api";
  String localAddress = "http://localhost:9788/api";
  //String jenkinsAddress = "ws://si-jenkins01.dev.setl.io:9788/db/";
  //String testAddress = "ws://uk-lon-li-006.opencsd.io:27017/db/";

  @Test
  public void createFundWithValidDataTest(){

    String [] fundDetails = generateFundDetails();
    String fundName = fundDetails[0];
    String fundProspectus = "432a709ccb6a728192d67f916b41e815ddf75b101bc684142740102f49bdfbd4";
    String fundReport = "432a709ccb6a728192d67f916b41e815ddf75b101bc684142740102f49bdfbd4";
    String fundShares = fundDetails[3];
    String lei = fundDetails[4];
    String sicav = fundDetails[5];
    String companyId = fundDetails[6];


    RestApi api = new RestApi(localAddress);
    api.start(4, "gV6Il3IAP0ML1WQ4jNkmYAb5FRExrAfWcGCaKzYMQ24=");

    MessageFactory msfFactory = api.getMessageFactory();
    api.sendMessage(msfFactory.newFund(fundName, "432a709ccb6a728192d67f916b41e815ddf75b101bc684142740102f49bdfbd4",
      "432a709ccb6a728192d67f916b41e815ddf75b101bc684142740102f49bdfbd4", fundShares, "test002", "2", companyId), claim -> {
      Map response = claim.get("data").asList(Map.class).get(0);
      assertTrue("OK".equals(response.get("Status").toString()));
      assertTrue(fundName.equals(response.get("fundName").toString()));
      assertTrue(fundProspectus.equals(response.get("fundProspectus").toString()));
      assertTrue(fundReport.equals(response.get("fundReport").toString()));
    });
  }

}
