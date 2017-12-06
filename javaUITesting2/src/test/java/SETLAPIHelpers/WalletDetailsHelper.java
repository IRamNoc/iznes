package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class WalletDetailsHelper {

  //Comment

  public static String[] generateWalletDetails()
  {
    String str = randomAlphabetic(5);
    String walletName = "Test_Wallet_" + str;
    String walletAccount = randomAlphabetic(12);

    return new String[] {walletName, walletAccount};
  }
}
