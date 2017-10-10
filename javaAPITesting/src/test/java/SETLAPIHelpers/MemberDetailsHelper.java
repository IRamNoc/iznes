package SETLAPIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class MemberDetailsHelper {

  public static String[] generateMemberDetails ()
  {
    String str = randomAlphabetic(5);
    String memberName = "Test_Member_" + str;
    String email = memberName + "@test.com";

    return new String[] {memberName, email};
  }
}
