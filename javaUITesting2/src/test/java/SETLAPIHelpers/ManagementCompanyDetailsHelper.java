package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

public class ManagementCompanyDetailsHelper {

  //Comment

  public static String[] generateManagementCompanyDetails()
  {
    String str = randomAlphabetic(5);
    int entityId = Integer.parseInt(randomNumeric(1, 6));
    String managementCompanyName = "ManagementCoName_" + str;
    String country = "UK";
    String addressPrefix = "16";
    String postalAddrLine1 = "Stevenson Street";
    String postalAddrLine2 = "Gorgie";
    String city = "Edinburgh";
    String stateArea = "Midlothian";
    String postalCode = "EH1 8HM";
    String taxResidence = "UK";
    String regNum = "1258";
    String supervisoryAuth ="LCH";
    String numSiretOrSiren= "Test";
    String creationDate = "2017/01/01";
    String shareCapital = "120000";
    String commercialContact = "Bob";
    String operationalContact= "Bob's Uncle";
    String directorContact = "Bob's Mum";
    String lei = "12315";
    String bic = "BG1231354";
    String giinCode = "2525";
    String logoURL = "";


    return new String[] {String.valueOf(entityId), managementCompanyName, country, addressPrefix,
                         postalAddrLine1, postalAddrLine2, city, stateArea, postalCode,
                         taxResidence, regNum, supervisoryAuth, numSiretOrSiren,
                         creationDate, shareCapital, commercialContact, operationalContact,
                         directorContact, lei, bic, giinCode, logoURL};
  }
}
