package com.setl.UI.common.SETLUIHelpers;


import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;

import java.util.Arrays;
import java.util.stream.Collectors;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static org.apache.commons.lang3.RandomStringUtils.*;
import static org.junit.Assert.assertTrue;



public class UserDetailsHelper extends LoginAndNavigationHelper {

    public static void populateUserDetailFields(String username, String email,
                                                     String accountIndex, String userTypeIndex,
                                                     String password, String repeatPassword, String[] adminGroups) throws InterruptedException {
        enterUsername(username);
        enterEmailAddress(email);
        selectAccount(accountIndex);
        selectUserType(userTypeIndex);
        enterPasswordAndVerificationPassword(password, repeatPassword);
        selectAdministrativeGroup(adminGroups);
        submitUserDetails();
    }

   public static void populateUserDetailFields(String username, String email,
                                                     String accountIndex, String userTypeIndex,
                                                     String password, String repeatPassword) throws InterruptedException {
        enterUsername(username);
        enterEmailAddress(email);
        selectAccount(accountIndex);
        selectUserType(userTypeIndex);
        enterPasswordAndVerificationPassword(password, repeatPassword);
        selectAdministrativeGroup(StandardUserGroup);
        submitUserDetails();
   }

    public static void enterUsername(String username) {
        driver.findElement(By.id("user-tab-1")).click();
        driver.findElement(By.id("new-user-username")).clear();
        driver.findElement(By.id("new-user-username")).sendKeys(username);
    }

    public static void enterEmailAddress(String email) {
        driver.findElement(By.id("new-user-email")).click();
        driver.findElement(By.id("new-user-email")).clear();
        driver.findElement(By.id("new-user-email")).sendKeys(email);
    }

    private static void selectAccount(String accountIndex) throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("Select an Option")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }

        driver.findElement(By.linkText("Select an Option")).click();
        driver.findElement(By.xpath("//div[@id='user-tab-2']" +
                "/div/form/div/div[3]/div/div/div/ul/li[" + accountIndex + "]")).click();
    }

    private static void selectUserType(String userTypeIndex) throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("choose type...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.linkText("choose type...")).click();
        driver.findElement(By.xpath("//div[@id='user-tab-2']" +
                "/div/form/div/div[4]/div/div/div/ul/li[" + userTypeIndex + "]")).click();
    }

    public static void enterPasswordAndVerificationPassword(String password, String repeatPassword) {
        driver.findElement(By.id("new-user-password")).clear();
        driver.findElement(By.id("new-user-password")).sendKeys(password);
        driver.findElement(By.id("new-user-password-repeat")).clear();
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
        driver.findElement(By.id("new-user-submit")).click();

    }

    private static void selectAdministrativeGroup(String... groups)
    {
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='user-tab-2']/div/form/div/div[7]/div/div/ul/li/a/span")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='user-tab-2-1']/div/div/ul/li/a/span")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        ((JavascriptExecutor) driver).executeScript("$('#user-tab-2-1-1 .chosen-select.adminGroup').val("+ Arrays.stream(groups).map(s->"'"+s+"'").collect(Collectors.joining(",","[","]"))+").trigger('chosen:updated').trigger('change')");
    }

    private static void submitUserDetails()
    {
        driver.findElement(By.xpath("(//button[@type='submit'])[10]")).click();
    }

    public static String[] generateRandomUserDetails() {
        String str = randomAlphabetic(10);
        String userName = "Test_User_" + str;
        String emailAddress = userName + "@" + str + ".com";
        String firstName = "John" + str;
        String lastName = "Smith" + str;
        String userReference = randomNumeric(10);
        String phoneNumber = "+44" + str;
        return new String[] {userName, emailAddress, firstName, lastName, userReference, phoneNumber};
    }

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}
