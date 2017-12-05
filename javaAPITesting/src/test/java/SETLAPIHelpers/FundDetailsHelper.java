package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

public class FundDetailsHelper {

  //Comment

  public static String[] generateFundDetails()
  {
    String str = randomAlphabetic(5);
    String fundName = "Test_Fund_" + str;
    String fundProspectus = "prospectus_" + randomAlphabetic(7);
    String fundReport = "report_" + randomAlphabetic(7);
    String fundShares = "shares_" + randomAlphabetic(4);
    String fundLei = "lei_" + randomAlphabetic(5);
    int sicavId = Integer.parseInt(randomNumeric(1, 6));
    int companyId = Integer.parseInt(randomNumeric(1, 3));


    return new String[] {fundName, fundProspectus, fundReport, fundShares, fundLei, String.valueOf(sicavId), String.valueOf(companyId) };
  }
}
