package com.setl.RESTAPITests.ManagementCompany.Creation;

import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static SETLAPIHelpers.ManagementCompanyDetailsHelper.generateManagementCompanyDetails;
//import static SETLAPIHelpers.RestAPI.ManagementCompanyHelper.createManagementCompanyFailure;
import static junit.framework.TestCase.assertTrue;

@RunWith(JUnit4.class)
public class createManagementCompanyAcceptanceTest {

  @Rule
  public Timeout globalTimeout = Timeout.millis(30000);

  String localAddress = "http://si-opencsd01.dev.setl.io:9788/api";
  int userId = 9;
  String apiKey = "FDa/djrwLIXzbm/wMiEiLA1fvPFAXzfC9HJdykaR4DZ1";
  RestApi<MemberNodeMessageFactory> api;


  @Before
  public void setup(){
      api = new RestApi<MemberNodeMessageFactory>(localAddress, new MemberNodeMessageFactory());
  }


  @Test
  @Ignore
  public void createNewManagementCompany() throws ExecutionException, InterruptedException {
    String managementCompanyDetails[] = generateManagementCompanyDetails();
    String entityId = managementCompanyDetails[0];
    String managementCompanyName = managementCompanyDetails[1];
    String country = managementCompanyDetails[2];
    String addressPrefix = managementCompanyDetails[3];
    String postalAddrLine1 = managementCompanyDetails[4];
    String postalAddrLine2 = managementCompanyDetails[5];
    String city = managementCompanyDetails[6];
    String stateArea = managementCompanyDetails[7];
    String postalCode = managementCompanyDetails[8];
    String taxResidence = managementCompanyDetails[9];
    String regNum = managementCompanyDetails[10];
    String supervisoryAuth = managementCompanyDetails[11];
    String numSiretOrSiren = managementCompanyDetails[12];
    String creationDate = managementCompanyDetails[13];
    String shareCapital = managementCompanyDetails[14];
    String commercialContact = managementCompanyDetails[15];
    String operationalContact = managementCompanyDetails[16];
    String directorContact = managementCompanyDetails[17];
    String lei = managementCompanyDetails[18];
    String bic = managementCompanyDetails[19];
    String giinCode = managementCompanyDetails[20];
    String logoURL = managementCompanyDetails[21];




    api.start(userId, apiKey);

    MemberNodeMessageFactory msfFactory = api.getMessageFactory();

    api.sendMessage(msfFactory.newManagementCompany(entityId, managementCompanyName, country, addressPrefix,
                                                    postalAddrLine1, postalAddrLine2, city, stateArea, postalCode,
                                                    taxResidence, regNum, supervisoryAuth, numSiretOrSiren,
                                                    creationDate, shareCapital, commercialContact, operationalContact,
                                                    directorContact, lei, bic, giinCode, logoURL), claim -> {

        Map response = claim.get("data").asList(Map.class).get(0);
        assertTrue("OK".equals(response.get("Status").toString()));
        assertTrue(entityId.equals(response.get("entityId").toString()));
        assertTrue(managementCompanyName.equals(response.get("name").toString()));
    });
  }
  @Test
  @Ignore
  public void failToCreateManagementCompanyWithIncorrectPermissions() throws ExecutionException, InterruptedException {
    String managementCompanyDetails[] = generateManagementCompanyDetails();
    String managementCompanyName = managementCompanyDetails[0];
    String managementCompanyDescription = managementCompanyDetails[1];

     // createManagementCompanyFailure(localAddress, 17, "pnd0EbzRPYZLhumbxAAhklbotvEqhWgk7gL0OdTHUgU=", managementCompanyDescription, managementCompanyName,1, "Permission Denied.");

  }
}
