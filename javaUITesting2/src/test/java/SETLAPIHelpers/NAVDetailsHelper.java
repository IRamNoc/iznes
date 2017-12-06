package SETLAPIHelpers;

import java.time.LocalDate;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

public class NAVDetailsHelper {

  public static String[] generateNAVDetails ()
  {
    String str = randomAlphabetic(5);
    String fundName = "Test_Fund_" + str;
      LocalDate startDate = LocalDate.of(2017, 1, 1); //start date
      long start = startDate.toEpochDay();
      System.out.println(start);

      LocalDate endDate = LocalDate.now(); //end date
      long end = endDate.toEpochDay();
      System.out.println(end);

      long fundDate = ThreadLocalRandom.current().longs(start, end).findAny().getAsLong();
      System.out.println(LocalDate.ofEpochDay(fundDate));


    int price = Integer.parseInt(randomNumeric(1, 5));
    int priceStatus = -1;
    int force = 0;


    return new String[] {fundName, String.valueOf(fundDate), String.valueOf(price),
        String.valueOf(priceStatus), String.valueOf(force)};
  }
}
