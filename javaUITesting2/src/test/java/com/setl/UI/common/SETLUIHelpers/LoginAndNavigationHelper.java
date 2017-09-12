package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;

public class LoginAndNavigationHelper {

    public static void navigateToLoginPage() throws InterruptedException {
        driver.get(baseUrl);
        waitForLoginPageToLoad();
    }

    public static void navigateToPhoenixLoginPage() throws InterruptedException, IOException {
        driver.get(phoenixBaseUrl);
        waitForLoginPageToLoad();

    }

    public static void navigateToIncorrectUrl(String restOfURL, String headerText) throws InterruptedException {
        driver.get(baseUrl + restOfURL);
        assertEquals(headerText, driver.findElement(By.cssSelector("h1")).getText());
        assertEquals("You don't have permission to access /.git/ on this server.", driver.findElement(By.cssSelector("p")).getText());
    }

    public static void waitForLoginPageToLoad() throws InterruptedException {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement usernameInput = driver.findElement(By.id("login_username"));
            wait.until(visibilityOf(usernameInput));
            wait.until(elementToBeClickable(usernameInput));
        }catch(Exception e){
            System.out.println("Login page not ready - Username " + e.getMessage());
        }

        try {
            WebElement passwordInput = driver.findElement(By.id("login_password"));
            wait.until(visibilityOf(passwordInput));
            wait.until(elementToBeClickable(passwordInput));
        } catch (Exception i) {
            System.out.println("Login page not ready - Password " + i.getMessage());
        }

        try {
            WebElement loginButton = driver.findElement(By.id("login_btn"));
            wait.until(visibilityOf(loginButton));
            wait.until(elementToBeClickable(loginButton));
        } catch (Exception o) {
            System.out.println("Login page not ready - Button " + o.getMessage());
        }
    }

    public static void enterLoginCredentialsUserName(String username) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement name = driver.findElement(By.id("login_username"));
            wait.until(visibilityOf(name));
            wait.until(elementToBeClickable(name));
            name.clear();
            name.sendKeys(username);
        } catch (Exception e) {
            System.out.println("User name field is not ready");
        }
    }
    public static void enterLoginCredentialsPassword(String password) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement login_password = driver.findElement(By.id("login_password"));
            wait.until(visibilityOf(login_password));
            wait.until(elementToBeClickable(login_password));
            login_password.clear();
            login_password.sendKeys(password);
        } catch (Exception e) {
            System.out.println("User password field is not ready");
        }
    }

    public static void clickLoginButton(){
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement login = driver.findElement(By.id("login_btn"));
            wait.until(visibilityOf(login));
            wait.until(elementToBeClickable(login));
            login.click();
        }catch(Exception e)
            {
                System.out.println("Login button not ready " + e.getMessage());
            }
    }

    public static boolean verifyHomePageIsDisplayed() throws InterruptedException {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement LogoffButton = driver.findElement(By.id("menu_logoff"));
                wait.until(visibilityOf(LogoffButton));
                wait.until(elementToBeClickable(LogoffButton));
                driver.findElement(By.xpath(".//*[@id='page-wrapper']/div[2]/div/h2/span[2]"));
                driver.findElement(By.xpath(".//*[@id='page-wrapper']/div[1]/nav/ul/li[3]/a/span"));
            } catch (Exception e) {
                return false;
        }
            return true;
    }

    public static boolean verifyUserNameIsDisplayedInTitle(String username) throws InterruptedException {

        if (username.equals("Bank1_User1")) {
            username = "FX_Bank1_User1";
        }

        if (username.equals("Bank2_User1")) {
            username = "FX_Bank2_User1";
        }

        if (username.equals("Bank3_User1")) {
            username = "FX_Bank3_User1";
        }

        try {
            driver.getTitle().contains(username.toUpperCase());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static void selectNewTabToNavigateTo(String newTabId) throws InterruptedException {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement tab = driver.findElement(By.xpath(".//*[@id='home-holding-" + newTabId + "-select']/a/span")) ;
                wait.until(visibilityOf(tab));
                wait.until(elementToBeClickable(tab));
                tab.click();

            } catch (Exception e) {
                System.out.println("Link to " + newTabId + " is not ready" + e);
            }
    }

    public static void navigateToAddressesTab() throws InterruptedException {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement addressesTab = driver.findElement(By.xpath(".//*[@id='home-addresses-select']/a/span"));
                wait.until(visibilityOf(addressesTab));
                wait.until(elementToBeClickable(addressesTab));
                addressesTab.click();
            } catch (Exception e)
                {
                    System.out.println("Link to Addresses is not ready" + e);
                }
    }

    public static void acceptCookies() throws InterruptedException
    {
       try {
           WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
           WebElement cookies = driver.findElement(By.linkText("Got it!"));
           wait.until(visibilityOf(cookies));
           wait.until(elementToBeClickable(cookies));
           cookies.click();
       } catch (Exception e)
       {
           System.out.println("Cookies message is not present " + e.getMessage());
       }
    }

    public static void loginAndVerifySuccess(String username, String password) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);
        clickLoginButton();
        assertTrue(verifyHomePageIsDisplayed());
        assertTrue(verifyUserNameIsDisplayedInTitle(username));
    }

    public static void loginToPhoenixAndVerifySuccess(String username, String password) throws InterruptedException, IOException {
        navigateToPhoenixLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);
        clickLoginButton();
        assertTrue(verifyHomePageIsDisplayed());
        assertTrue(verifyUserNameIsDisplayedInTitle(username));
    }

    public static void logout() throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement logOff = driver.findElement(By.cssSelector("#menu_logoff > span.nav-label > span.ml"));
            wait.until(visibilityOf(logOff));
            wait.until(elementToBeClickable(logOff));
            logOff.click();
        }catch (Exception e){
            System.out.println("Logout button not available " + e.getMessage());
        }
        try {
            assertTrue(isElementPresent(By.id("login_btn")));
        } catch (Error e) {
            verificationErrors.append(e.toString());

        }
    }
}
