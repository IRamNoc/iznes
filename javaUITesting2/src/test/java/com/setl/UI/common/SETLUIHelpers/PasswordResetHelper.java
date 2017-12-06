package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static com.setl.workflows.OpenCSDCreateMemberAndCaptureDetails.createRandomMemberAndCaptureDetails;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class PasswordResetHelper extends LoginAndNavigationHelper {


    public static void navigateToPasswordReset(String userName) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(userName);
        enterLoginCredentialsPassword(" ");
        clickLoginButton();
        selectForgottenPassword();
        verifyPopupMessageText("A message to reset the password has been sent", "Password Reset message not displayed");
    }

    public static void loginToGmail() throws InterruptedException {
        loginToGmail("billtestsetl@gmail.com", "jD5qQ#82D59E");
    }

    public static void reconnectToGMailAndClickPasswordResetLink() throws InterruptedException {
        loginToGmailAgain();
        navigateToGmailInbox();
        selectPasswordResetEmail();
        String resetUrl = capturePasswordResetLink("http://uk-lon-li-002.opencsd.io");
        navigateToPasswordResetURL(resetUrl);
    }

    public static void deleteEmails() throws InterruptedException {
        navigateToGmailInbox();
        deleteAllEmails();
    }

    public static void enterNewPassword(String newPassword, String verifyPassword) {
        driver.findElement(By.id("newpassword1")).clear();
        driver.findElement(By.id("newpassword1")).sendKeys(newPassword);
        driver.findElement(By.id("newpassword2")).clear();
        driver.findElement(By.id("newpassword2")).sendKeys(verifyPassword);
        driver.findElement(By.id("np_login")).click();
    }

    public static void navigateToPasswordResetURL(String resetUrl) {
        driver.get(resetUrl);
    }

    public static void selectPasswordResetEmail() {
        List<WebElement> email = driver.findElements(By.cssSelector("div.xT>div.y6>span>b"));

        for (WebElement emailsub : email) {
            if (emailsub.getText().equals("Setl Password Reset") == true) {

                emailsub.click();
                break;
            }
        }
    }

    public static String capturePasswordResetLink(String env) {
        String passwordResetLink = driver.findElement(By.partialLinkText(env + "/reset.php?")).getText();
        return passwordResetLink;
    }

    public static void loginToGmailOld(String emailAddress, String password) throws InterruptedException {
        //Open gmail
        driver.get("http://www.gmail.com");
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        driver.findElement(By.id("Email")).clear();
        driver.findElement(By.id("Email")).sendKeys("billtestsetl@gmail.com");
        driver.findElement(By.id("next")).click();
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if (isElementPresent(By.id("link-forgot-passwd"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }
        driver.findElement(By.id("Passwd")).clear();
        driver.findElement(By.id("Passwd")).sendKeys("jD5qQ#82D59E");
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if (isElementPresent(By.id("signIn"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }

        driver.findElement(By.id("signIn")).click();
    }

    public static void loginToGmail(String emailAddress, String password) throws InterruptedException {
        driver.get("http://www.gmail.com");
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if (isElementPresent(By.id("Email"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }

        driver.findElement(By.id("Email")).clear();
        driver.findElement(By.id("Email")).sendKeys(emailAddress);
        driver.findElement(By.id("next")).click();
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if (isElementPresent(By.id("Passwd"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }

        driver.findElement(By.id("Passwd")).clear();
        driver.findElement(By.id("Passwd")).sendKeys(password);
        driver.findElement(By.id("signIn")).click();
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if ("Your Primary tab is empty.\nPersonal messages and messages that don't appear in other tabs will be shown here.\nTo add or remove tabs, click inbox settings.".equals(driver.findElement(By.cssSelector("div.aRs")).getText())) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }

    }

    public static void loginToGmailAgain() throws InterruptedException {
        //Open gmail
        driver.get("http://www.gmail.com");
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        for (int second = 0;; second++) {
            if (second >= 60) fail("timeout");
            try { if (isElementPresent(By.xpath("//div[@id=':3o']/div/div"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }


    }

    public static void navigateToGmailInbox() throws InterruptedException {
        driver.get("http://www.gmail.com");

    }

    public static void deleteAllEmails() throws InterruptedException {

            for (int count = 0;; count++) {
            if (count >= 60) fail("timeout");
            if (driver.findElement(By.cssSelector("div.aRv")).getText().equals("Your Primary tab is empty.")) {
            return;

        } else {
            driver.findElement(By.cssSelector("div.T-Jo-auh")).click();
            for (int second = 0; ; second++) {
                if (second >= 20) fail("timeout");
                try {
                    if (isElementPresent(By.xpath("//div[@id=':5']/div/div/div/div/div/div[2]/div[3]/div/div"))) break;
                } catch (Exception e) {
                }
                Thread.sleep(1000);
            }

            driver.findElement(By.xpath("//div[@id=':5']/div/div/div/div/div/div[2]/div[3]/div/div")).click();
            }
        }
    }

    public static String resetLockedAccount(String username)
    {
        //TODO : write code to reset member password.
        String newPassword = "";
        return newPassword;

    }

    public static void enterIncorrectPasswordFast(String[] memberDetails, int count) throws InterruptedException {
        boolean run = true;

        int i;
        for (i = 0; i < count && run; i++) {
            String cracker = generatePassword();
            System.out.println("Generated password is " + cracker);
            enterLoginCredentialsUserName(memberDetails[0]);
            enterLoginCredentialsPassword(cracker);

            boolean lock = false;
            if (driver.findElement(By.cssSelector("label.loginerror")).getText().equals("Sorry, your account has been locked. Please contact Setl support.")) {
                lock = true;
            }

            if (lock) {
                run = false;
                System.out.println("Account Locked");
            }

            try {
                navigateToLoginPage();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void enterIncorrectPassword(String[] memberDetails, int count) throws InterruptedException {
        boolean run = true;

        int i;
        for (i = 0; i < count && run; i++) {
            String cracker = generatePassword();
            enterLoginCredentialsUserName(memberDetails[0]);
            enterLoginCredentialsPassword(cracker);
            clickLoginButton();
            waitForInvalidCredentialsMessage();

            boolean lock = false;
                if (driver.findElement(By.cssSelector("label.loginerror")).getText().equals("Sorry, your account has been locked. Please contact Setl support.")) {
                lock = true;
            }

            if (lock) {
                run = false;
                System.out.println("Account Locked");
            }

            try {
                navigateToLoginPage();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void enterIncorrectOpenCSDPassword(String[] memberDetails, int count) throws InterruptedException {
        boolean run = true;

        int i;
        for (i = 0; i < count && run; i++) {
            String cracker = generatePassword();

            enterLoginCredentialsUserName(memberDetails[0]);
            enterLoginCredentialsPassword(cracker);
            clickLoginButton();
            waitForInvalidCredentialsMessage();

            boolean lock = false;

            if (driver.findElement(By.cssSelector("label.loginerror")).getText().equals("Sorry, your account has been locked. Please contact Setl support.")) {
                lock = true;
            }

            if (lock) {
                run = false;
                System.out.println("Account Locked");
            }

            try {
                navigateToLoginPage();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void bruteForceOpenCSDPassword(String[] memberDetails) throws InterruptedException, IOException {
        boolean run = true;
        while(run) {
            String cracker = generatePassword();
            loginWithWrongPasswordAndReceiveInvalidCredentialsMessage(memberDetails, cracker);

            boolean lock = false;

            if (driver.findElement(By.cssSelector("label.loginerror")).getText().equals("Sorry, your account has been locked. Please contact Setl support."))
            {
                lock = true;
            }

            if(lock)
            {
                run = false;
            }

            try {
                driver.navigate().refresh();


            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static void verifyLockedAccountErrorText() {
        assertTrue(driver.findElement(By.cssSelector("label.loginerror")).getText().equals("Sorry, your account has been locked. Please contact Setl support."));
    }

    public static void disableUserAccount() throws InterruptedException {
        for (int second = 0;; second++) {
            if (second >= 5) fail("Disable Button not Present");
            try { if (isElementPresent(By.cssSelector("i.fa.fa-unlock"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }
        driver.findElement(By.cssSelector("i.fa.fa-unlock")).click();

        for (int second = 0;; second++) {
            if (second >= 5) fail("OK button is not p");
            try { if (isElementPresent(By.cssSelector("span.bootstrap-switch-handle-off.bootstrap-switch-default"))) break; } catch (Exception e) {}
            Thread.sleep(1000);
        }

        driver.findElement(By.xpath("(//button[@type='submit'])[11]")).click();
    }

    public static boolean accountLockTest(){
        return "Sorry, your account has been locked. Please contact Setl support.".equals(driver.findElement(By.xpath("//div[@id='loginerror']/div")).getText());
    }

    public static void waitForAccountLockedMessage() throws InterruptedException
    {
        for (int second = 0;; second++)
        {
            if (second >= 60) fail("Account locked message not displayed");
            try { if (accountLockTest()) break; } catch (Exception e) {}

        }
    }

    public static void waitForInvalidCredentialsMessage() throws InterruptedException
    {
                try{
                    if ("Sorry, login details incorrect, please try again.".equals(driver.findElement(By.xpath("//div[@id='loginerror']/div")).getText()))
                   return;

                }catch (Exception e)
                    {
                        if (!accountLockTest())
                            fail("Invalid credentials message not displayed");
                    }
                    return;
    }

    public static void loginWithWrongPasswordAndReceiveInvalidCredentialsMessage(String[] memberDetails, String cracker) throws InterruptedException {
        enterLoginCredentialsUserName(memberDetails[0]);
        enterLoginCredentialsPassword(cracker);
        clickLoginButton();
        waitForInvalidCredentialsMessage();
    }

    public static String generatePassword()
    {
        String str = RandomStringUtils.randomAlphanumeric(12);
        return str;
    }

    public static void verifyAccountLockedMessageDisplayed()
    {
        //TODO : Write code for Account Locked Message handling
    }

    public static void selectForgottenPassword()
    {
        driver.findElement(By.cssSelector("small > span.ml")).click();
    }



    public static void navigateToSecurityTab() throws Exception{
        try {
            WebElement secTab = driver.findElement(By.xpath("//div[@id='user-account']/div/div/ul/li[2]/a/span"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(secTab));
            wait.until(elementToBeClickable(secTab));
            secTab.click();
        }catch (Exception e){
            System.out.println("Security Tab is not ready");
        }
    }

    public static void clickSavePasswordButton() {
        try {
            WebElement saveButton = driver.findElement(By.id("security_savePassword"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(saveButton));
            wait.until(elementToBeClickable(saveButton));

            saveButton.click();
        }catch (Exception e){
            System.out.println("Password Button is not ready");
        }
    }

    public static void enterExistingPassword(String ExistingPassword) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement existingPassword = driver.findElement(By.id("security_OldPassword"));
        wait.until(visibilityOf(existingPassword));
        wait.until(elementToBeClickable(existingPassword));
        existingPassword.clear();
        existingPassword.sendKeys(ExistingPassword);
    }

    public static void enterNewPassword(String NewPassword) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement newPassword = driver.findElement(By.id("security_NewPassword1"));
        wait.until(visibilityOf(newPassword));
        wait.until(elementToBeClickable(newPassword));
        newPassword.clear();
        newPassword.sendKeys(NewPassword);
    }

    public static void retypeNewPassword(String RetypeNewPassword) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement retypeNewPassword = driver.findElement(By.id("security_NewPassword2"));
        wait.until(visibilityOf(retypeNewPassword));
        wait.until(elementToBeClickable(retypeNewPassword));
        retypeNewPassword.clear();
        retypeNewPassword.sendKeys(RetypeNewPassword);
    }

    public static String[] createMemberAndLogsIntoMembersAccount() throws Exception {
        String [] memberDetails = createRandomMemberAndCaptureDetails();
        logout();
        loginAndNavigateToPage(memberDetails[0], memberDetails[1], "menu_user_account");
        navigateToSecurityTab();
        return memberDetails;
    }

    public static boolean isElementPresent(By by)
    {

        try {
            driver.findElement(by);
            return true;
            } catch (NoSuchElementException e) {
            return false;
        }
    }
}
