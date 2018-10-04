package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

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

    public static void navigateToPage2(String pageHref) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement page2 = driver.findElement(By.xpath("//a[@href='#/" + pageHref + "']"));
        try {
            wait.until(visibilityOf(page2));
            wait.until(elementToBeClickable(page2));
            page2.click();

        } catch (Error e) {

            fail(pageHref + "page not present");
        }
    }

    public static void navigateToPage(String pageHref) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
        WebElement messagesLink = driver.findElement(By.xpath("//a[@href='#/" + pageHref + "']"));
            wait.until(visibilityOf(messagesLink));
            wait.until(elementToBeClickable(messagesLink));
            messagesLink.click();

        } catch (Error e) {

            fail(pageHref + "page not present");
        }
    }

    public static void navigateToPageByID(String pageID) {
       final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
       try {
           wait.until(ExpectedConditions.refreshed(ExpectedConditions.visibilityOfElementLocated(By.id(pageID))));
           wait.until(ExpectedConditions.refreshed(ExpectedConditions.elementToBeClickable(By.id(pageID))));
           driver.findElement(By.id(pageID)).click();
           System.out.println("Status : Navigated to " + pageID);
       }catch (WebDriverException wde) {
           fail(wde.getMessage()); }
    }


    public static void navigateToPageXpath(String pageHref) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement pageXpath = driver.findElement(By.xpath(pageHref));

        try {
            wait.until(visibilityOf(pageXpath));
            wait.until(elementToBeClickable(pageXpath));
            pageXpath.click();
        } catch (Error e) {
            fail(pageHref + "page not present");
        }
    }

    public static void waitForLoginPageToLoad() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement usernameInput = driver.findElement(By.id("username-field"));
            wait.until(visibilityOf(usernameInput));
            wait.until(elementToBeClickable(usernameInput));
        } catch (Exception e) {
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
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement name = driver.findElement(By.id("username-field"));
        try {
            wait.until(visibilityOf(name));
            wait.until(elementToBeClickable(name));
            name.clear();
            name.sendKeys(username);
        } catch (Exception e) {
            fail("User name field is not ready");
        }
    }

    public static void enterLoginCredentialsPassword(String password) {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement login_password = driver.findElement(By.id("password-field"));
            wait.until(visibilityOf(login_password));
            wait.until(elementToBeClickable(login_password));
            login_password.clear();
            login_password.sendKeys(password);
        } catch (Exception e) {
            fail("User password field is not ready");
        }
    }

    public static void clickLoginButton() {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement login = driver.findElement(By.id("login-submit"));
            wait.until(visibilityOf(login));
            wait.until(elementToBeClickable(login));
            login.click();
        } catch (Exception e) {
            fail("Login button not ready " + e.getMessage());
        }
    }

    public static void selectNewTabToNavigateTo(String newTabId) throws InterruptedException {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
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
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement addressesTab = driver.findElement(By.xpath(".//*[@id='home-addresses-select']/a/span"));
            wait.until(visibilityOf(addressesTab));
            wait.until(elementToBeClickable(addressesTab));
            addressesTab.click();
        } catch (Exception e) {
            System.out.println("Link to Addresses is not ready" + e);
        }
    }

    public static void acceptCookies() throws InterruptedException {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            WebElement cookies = driver.findElement(By.linkText("Got it!"));
            wait.until(visibilityOf(cookies));
            wait.until(elementToBeClickable(cookies));
            cookies.click();
        } catch (Exception e) {
            System.out.println("Cookies message is not present " + e.getMessage());
        }
    }

    public static void loginAndVerifySuccess(String username, String password) throws InterruptedException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);
        clickLoginButton();
        waitForHomePageToLoad();
        System.out.println("Status : Successfully logged in as '" + username + "'");
        System.out.println("=======================================================");
    }

    public static void loginAndVerifyFailure(String username, String password) throws InterruptedException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);
        clickLoginButton();
        waitForLoginFailPopup();
    }

    public static void waitForHomePageToLoad() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {

            wait.until(visibilityOfElementLocated(By.id("topBarMenu")));

        } catch (Exception e) {
            fail("Page heading was not present " + e.getMessage());
        }
    }

    public static void waitForLoginFailPopup(){
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            wait.until(visibilityOf(driver.findElement(By.className("jaspero__dialog-title"))));

            String loginFail = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(loginFail.equals("Warning!"));
            String loginMsg = driver.findElement(By.xpath("//jaspero-alerts/jaspero-alert/div[2]/div[3]/span")).getText();
            assertTrue(loginMsg.equals("Invalid email address or password!"));

        } catch (Exception e) {
            fail("Page heading was not present " + e.getMessage());
        }
    }


    public static void loginAndVerifySuccessAdmin(String username, String password) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        Thread.sleep(2000);
        try {
            WebElement menuBar = driver.findElement(By.id("topBarMenu"));
            wait.until(visibilityOf(menuBar));
            wait.until(elementToBeClickable(menuBar));
            menuBar.click();
        } catch (Exception e) {
            fail("Page heading was not present " + e.getMessage());
        }
    }

    public static void loginAndVerifySuccessKYC(String username, String password, String headingID) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
        WebElement homePage = driver.findElement(By.id("ofi-welcome-" + headingID));

            wait.until(visibilityOf(homePage));
        } catch (Exception e) {
            System.out.println("=========================================================");
            System.out.println("FAILED : user " + username + " already used");
            System.out.println("Try a different user");
            fail("Page heading was not present " + e.getMessage());
        }
        assertTrue(driver.findElement(By.id("ofi-welcome-" + headingID)).getText().contentEquals("Welcome to IZNES"));
    }

    public static void loginCompleteKYC(String username, String password) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
        WebElement modal = driver.findElement(By.className("modal-title"));
            wait.until(visibilityOf(modal));
            String headingKYC = modal.getText();
            assertTrue(headingKYC.equals("CONFIRMATION SCREEN"));
        } catch (Exception e) {
            fail("Invited investor not being taken to completed KYC page : " + e.getMessage());
        }
    }

    public static void loginKYCConfirmationScreen(String username, String password) throws InterruptedException, IOException {
        navigateToLoginPage();
        enterLoginCredentialsUserName(username);
        enterLoginCredentialsPassword(password);

        clickLoginButton();

    }

    public static void logout() throws InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")));
        Thread.sleep(750);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")).click();

        } catch (Exception e) {
            fail("Settings dropdown not available " + e.getMessage());
        }
        System.out.println("Status : Successfully Logged out");
        System.out.println("=======================================================");
    }


    public static void navigateToKYCPage() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("top-menu-my-clients")));
        wait.until(elementToBeClickable(By.id("top-menu-my-clients")));
        driver.findElement(By.id("top-menu-my-clients")).click();
        wait.until(visibilityOfElementLocated(By.id("top-menu-onboarding-management")));
        wait.until(elementToBeClickable(By.id("top-menu-onboarding-management")));

        try {
            driver.findElement(By.id("top-menu-onboarding-management")).click();

        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void navigateToNAVPageFromFunds() {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
//        wait.until(visibilityOfElementLocated(By.id("menu-my-products")));
//        wait.until(elementToBeClickable(By.id("menu-my-products")));
//        driver.findElement(By.id("menu-my-products")).click();
        wait.until(visibilityOfElementLocated(By.id("menu-nav")));
        wait.until(elementToBeClickable(By.id("menu-nav")));

        try {
            driver.findElement(By.id("menu-nav")).click();

        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void navigateToNAVPage() throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("menu-my-products")));
        wait.until(elementToBeClickable(By.id("menu-my-products")));
        driver.findElement(By.id("menu-my-products")).click();
        Thread.sleep(500);
        wait.until(visibilityOfElementLocated(By.id("menu-nav")));
        wait.until(elementToBeClickable(By.id("menu-nav")));

        try {
            driver.findElement(By.id("menu-nav")).click();

        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void navigateToDropdown(String dropdownID) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id(dropdownID));
        try {
            wait.until(ExpectedConditions.refreshed(ExpectedConditions.visibilityOfElementLocated(By.id(dropdownID))));
            wait.until(ExpectedConditions.refreshed(ExpectedConditions.elementToBeClickable(By.id(dropdownID))));
            WebElement dropdown = driver.findElement(By.id(dropdownID));
            dropdown.click();
        }catch (WebDriverException wde) {
            fail(wde.getMessage());
        }
    }

    public static void navigateToDropdownXpath(String dropdownXpath) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
        WebElement dropdown = driver.findElement(By.xpath(dropdownXpath));
            wait.until(visibilityOf(dropdown));
            wait.until(elementToBeClickable(dropdown));
            dropdown.click();
        } catch (Error e) {
            System.out.println(dropdownXpath + "not present");
            fail();
        }
    }

    public static void validateKYCPageComponents() {
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-align-left")));
        assertTrue(isElementPresent(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1")));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1")).getText().contentEquals("On-boarding Management"));
        assertTrue(isElementPresent(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[2]/p")));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[2]/p")).getText().contentEquals("Here's a list of all clients' KYC, organised by status"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")).getText().contains("Waiting for Approval"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")).getText().contains("Accepted - Funds Access Authorizations"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")).getText().contains("Awaiting for more information from your client"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")).getText().contains("Rejected"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")).getText().contains("Started by your clients"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")).getText().contains("All your KYC and Client Folders"));
    }
    public static void validateHeadersOnHomePageTableTG1376(){
        String orderRef = driver.findElement(By.xpath("//*[@id=\"Order-REF\"]/div/button")).getText();
        assertTrue(orderRef.equals("Order REF"));
        String orderType = driver.findElement(By.xpath("//*[@id=\"Order-Type\"]/div/button")).getText();
        assertTrue(orderType.equals("Order type"));
        String investor = driver.findElement(By.xpath("//*[@id=\"Order-Investor\"]/div/button")).getText();
        assertTrue(investor.equals("Investor"));
        String iSIN = driver.findElement(By.xpath("//*[@id=\"Order-ISIN\"]/div/button")).getText();
        assertTrue(iSIN.equals("ISIN"));
        String shareName = driver.findElement(By.xpath("//*[@id=\"Order-Share-Name\"]/div/button")).getText();
        assertTrue(shareName.equals("Share Name"));
        String shareCurrency = driver.findElement(By.xpath("//*[@id=\"Order-Share-Currency\"]/div/button")).getText();
        assertTrue(shareCurrency.equals("Share Currency"));
        String quantity = driver.findElement(By.xpath("//*[@id=\"Order-Quantity\"]/div/button")).getText();
        assertTrue(quantity.equals("Quantity"));
        String tradeAmount = driver.findElement(By.xpath("//*[@id=\"Order-Trade-Amount\"]/div/button")).getText();
        assertTrue(tradeAmount.equals("Trade Amount"));
        String orderDate = driver.findElement(By.xpath("//*[@id=\"Order-Order-Date\"]/div/button")).getText();
        assertTrue(orderDate.equals("Order Date"));
        String cutOffDate = driver.findElement(By.xpath("//*[@id=\"Order-Cut-Off-Date\"]/div/button")).getText();
        assertTrue(cutOffDate.equals("Cut-off date"));
        String settlementDate = driver.findElement(By.xpath("//*[@id=\"Order-Settlement-Date\"]/div/button")).getText();
        assertTrue(settlementDate.equals("Settlement Date"));
        String status = driver.findElement(By.xpath("//*[@id=\"Order-Status\"]/div/button")).getText();
        assertTrue(status.equals("Status"));
        String actions = driver.findElement(By.xpath("//*[@id=\"Order-Action\"]/div/span/span")).getText();
        assertTrue(actions.equals("Actions"));
    }

}
