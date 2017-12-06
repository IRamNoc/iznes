package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class AccountDetailsHelper {

  //Comment

  public static String[] generateAccountDetails()
  {
    String str = randomAlphabetic(5);
    String accountName = "Test_Account_" + str;
    String description = "Test_Account_Desc_" + str;


    return new String[] {description, accountName};
  }
}
