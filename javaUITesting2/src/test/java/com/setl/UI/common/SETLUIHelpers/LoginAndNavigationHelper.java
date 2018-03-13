package com.setl.UI.common.SETLUIHelpers;

import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;

public class LoginAndNavigationHelper {

    public static void navigateToLoginPage() throws InterruptedException {
        driver.get(baseUrl);
        waitForLoginPageToLoad();
    }

    public static void navigateTo365Page() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.get("https://www.office.com/");
        WebElement page_heading = driver.findElement(By.id("hero-header"));
        wait.until(visibilityOf(page_heading));

    }

    public static void navigateToPage2(String pageHref) throws InterruptedException {
      Thread.sleep(750);
      try {
        driver.findElement(By.xpath("//a[@href='#/" + pageHref + "']")).click();
      }catch (Error e){
         fail(pageHref + "page not present");
      }
    }

    public static void navigateToPageByID(String pageID) throws InterruptedException {
      Thread.sleep(750);
      try {
        driver.findElement(By.id(pageID)).click();
      }catch (Error e){
         fail(pageID + "page not present");
      }
    }

    public static void navigateToPage(String pageHref) throws InterruptedException {
        Thread.sleep(750);
        try {
            driver.findElement(By.id("menu-" + pageHref)).click();
        }catch (Error e){
            fail(pageHref + "page not present");
        }
    }

    public static void navigateToPageXpath(String pageHref) throws InterruptedException {
        Thread.sleep(750);
        try {
            driver.findElement(By.xpath(pageHref)).click();
        }catch (Error e){
            fail(pageHref + "page not present");
        }
    }

    public static void waitForLoginPageToLoad() throws InterruptedException {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement usernameInput = driver.findElement(By.id("username-field"));
            wait.until(visibilityOf(usernameInput));
            wait.until(elementToBeClickable(usernameInput));
        }catch(Exception e){
            fail("Login page not ready - Username " + e.getMessage());
        }

        try {
            WebElement passwordInput = driver.findElement(By.id("password-field"));
            wait.until(visibilityOf(passwordInput));
            wait.until(elementToBeClickable(passwordInput));
        } catch (Exception i) {
            fail("Login page not ready - Password " + i.getMessage());
        }

        try {
            WebElement loginButton = driver.findElement(By.id("login-submit"));
            wait.until(visibilityOf(loginButton));
            wait.until(elementToBeClickable(loginButton));
        } catch (Exception o) {
            fail("Login page not ready - Button " + o.getMessage());
        }
    }

    public static void enterLoginCredentialsUserName(String username) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement name = driver.findElement(By.id("username-field"));
            wait.until(visibilityOf(name));
            wait.until(elementToBeClickable(name));
            name.clear();
            name.sendKeys(username);
        } catch (Exception e) {
            fail("User name field is not ready");
        }
    }
    public static void enterLoginCredentialsPassword(String password) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement login_password = driver.findElement(By.id("password-field"));
            wait.until(visibilityOf(login_password));
            wait.until(elementToBeClickable(login_password));
            login_password.clear();
            login_password.sendKeys(password);
        } catch (Exception e) {
            fail("User password field is not ready");
        }
    }

    public static void clickLoginButton(){
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement login = driver.findElement(By.id("login-submit"));
            wait.until(visibilityOf(login));
            wait.until(elementToBeClickable(login));
            login.click();
        }catch(Exception e)
            {
                fail("Login button not ready " + e.getMessage());
            }
    }

    public static void selectNewTabToNavigateTo(String newTabId) throws InterruptedException {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement tab = driver.findElement(By.xpath(".//*[@id='home-holding-" +
                    newTabId + "-select']/a/span"));
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

    public static void loginAndVerifySuccess(String username, String password) throws InterruptedException, IOException{
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();
      Thread.sleep(1500);
      try {
        driver.findElement(By.id("ofi-homepage")).isDisplayed();
      }catch (Exception e){
        fail("Page heading was not present " + e.getMessage());
      }
    }

    public static void loginAndVerifySuccessAdmin(String username, String password) throws InterruptedException, IOException{
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();
      Thread.sleep(1500);
      try {
        driver.findElement(By.id("ofi-homepage")).isDisplayed();
      }catch (Exception e){
        fail("Page heading was not present " + e.getMessage());
      }
    }

    public static void logout() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            driver.findElement(By.id("dropdown-settings")).click();
        }catch (Exception e){
            fail("Logout button not available " + e.getMessage());
        }
        WebElement logOff = driver.findElement(By.id("dropdown-btn-logout"));
        wait.until(visibilityOf(logOff));
        try {
            driver.findElement(By.id("dropdown-btn-logout")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
    }

  public static void navigateToDropdown(String dropdownID) throws InterruptedException {
    Thread.sleep(1500);
    try {
      driver.findElement(By.id(dropdownID)).click();
    }catch (Error e){
      System.out.println(dropdownID + "not present");
      fail();
    }
  }
  public static void navigateToDropdownXpath(String dropdownXpath) throws InterruptedException {
    Thread.sleep(1500);
    try {
      driver.findElement(By.xpath(dropdownXpath)).click();
    }catch (Error e){
      System.out.println(dropdownXpath + "not present");
      fail();
    }
  }
}
