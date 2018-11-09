package com.setl.UI.common.SETLBusinessData;

import com.setl.UI.common.SETLUtils.RandomData;

import java.math.BigInteger;

public class IBAN
{


    private String countryCode;
    private String content;

    public IBAN(String countryCode, String content)
    {

        this.countryCode = countryCode;
        this.content = content;
    }

    public static String generateRandomIban(String countryCode)
    {
        String padding = "";
        if (countryCode.equals("FR")) padding = "000000";
        if (countryCode.equals("DE")) padding = "0";

        switch (countryCode)
        {
            case "FR":
                padding = "000000";
                break;
            case "DE":
                padding = "0";
                break;
            default:
                System.out.println("IBAN country code not supported yet, defaulting to French");
                countryCode = "FR";
                padding = "000000";
                break;
        }

        IBAN iban = new IBAN(countryCode, padding + RandomData.getDateTimeStampWithoutBadCharacters());
        return iban.generateIban();
    }


    public String generateIban()
    {
        return this.generateIban(this.countryCode, this.content);
    }

    public String generateIban(String countryCode, String content)
    {
        //Algorithm here: https://www.ibantest.com/en/how-is-the-iban-check-digit-calculated

        //it gets harder... https://github.com/arhs/iban.js/blob/master/demo/bower_components/iban/iban.js
        //Each country code has a specific format (mostly just length)  check line 218 of iban.js
        ///for now, let's just use FR


        String BBAN = content.toUpperCase(); //only support upper case for the moment, due to the ASCII code to int

        String iban_header = countryCode + "00";

        String changeOver = BBAN + iban_header;

        StringBuilder stringBuilder = new StringBuilder();
        for (char c: changeOver.toCharArray()   )
        {

            if ((int)c >= 48 && (int)c < 58 )
            {
                stringBuilder.append(c);
            }
            else
            {
                stringBuilder.append((int)c - 55); // e.g. ASCII 'A' - 55 = 10
            }
        }

        String bigNumberString = stringBuilder.toString();

        BigInteger bigInteger = new BigInteger(bigNumberString);

        BigInteger big97 = new BigInteger("97");

        BigInteger mod = bigInteger.mod(big97);

        BigInteger checkDigit = new BigInteger("98").subtract(mod);

        String paddedDigit = checkDigit.toString();
        if (paddedDigit.length() < 2) paddedDigit = "0" + paddedDigit;

        iban_header = iban_header.replace("00", paddedDigit);

        //System.out.println(iban_header + BBAN);
        return iban_header + BBAN;
    }

}
