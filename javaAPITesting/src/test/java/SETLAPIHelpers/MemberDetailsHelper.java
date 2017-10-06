package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class MemberDetailsHelper {

  public static String[] generateMemberDetails ()
  {
    String str = randomAlphabetic(5);
    String userName = "Test_Member_" + str;
    String email = userName + "@test.com";

    return new String[] {userName, email};
  }
}
