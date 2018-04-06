package com.setl.UI.common.SETLUIHelpers;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;

public class FundsDetailsHelper extends LoginAndNavigationHelper {

    public static String[] generateRandomUmbrellaFundsDetails() {
        String str = randomAlphabetic(5);
        String umbrellaFundName = "Test_Umbrella_Fund_" + str;
        return new String[] {umbrellaFundName};
    }

}
