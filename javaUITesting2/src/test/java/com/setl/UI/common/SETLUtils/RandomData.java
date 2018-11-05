package com.setl.UI.common.SETLUtils;

import org.joda.time.DateTime;

import java.util.Random;

public class RandomData
{

    private static void randomSleep()
    {
        try
        {
            Random random = new Random(DateTime.now().getMillis());
            Thread.sleep(random.nextInt(100));
        }
        catch (InterruptedException e)
        {

        }
    }

    public static String getDateTimeStamp()
    {
        randomSleep();
        DateTime dateTime = DateTime.now();
        return dateTime.toString("yyyy-MM-dd HH:mm:ss.SSS");
    }

    public static String getDateTimeStampWithoutBadCharacters()
    {
        randomSleep();
        DateTime dateTime = DateTime.now();
        return dateTime.toString("yyyyMMddHHmmssSSS");
    }

    public static String getTimeStamp()
    {
        randomSleep();
        DateTime dateTime = DateTime.now();
        return dateTime.toString("HH:mm:ss.SSS");
    }

    public static String getTimeStampWithoutBadCharacters()
    {
        randomSleep();
        DateTime dateTime = DateTime.now();
        return dateTime.toString("HHmmssSSS");
    }



}
