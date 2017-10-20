package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class WalletDetailsHelper {

  //Comment

  public static String[] generateWalletDetails()
  {
    String str = randomAlphabetic(5);
    String userName = "Test_User_" + str;
    String password = randomAlphabetic(12);
    String email = userName + "@test.com";

    return new String[] {userName, password, email};
  }
}
