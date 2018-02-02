package com.setl.UI.common.SETLUIHelpers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


public class ExpiryDateHelper {

        public static String calculateExpiryDate(int numberOfDaysToAdd) throws InterruptedException {

        LocalDate nextWeek = LocalDate.now().plusDays(numberOfDaysToAdd);
        String expiryDate = nextWeek.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        return expiryDate;
    }
}
