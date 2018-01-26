package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


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

    public static void navigateToAddNewUserTab() throws InterruptedException {
        String text = "Add New User";
        WebElement link = driver.findElement(By.linkText(text));
        waitForLinkText(text, link);
        link.click();
    }

    private static void enterUsername(String username) {
        driver.findElement(By.cssSelector("input.form-control.username")).clear();
        driver.findElement(By.cssSelector("input.form-control.username")).sendKeys(username);
    }

    public static void enterEmailAddress(String email) {
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[2]/div/input")).clear();
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[2]/div/input")).sendKeys(email);
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

    private static void enterPasswordAndVerificationPassword(String password, String repeatPassword) {
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[5]/div/input"));
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[5]/div/input")).sendKeys(password);
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[6]/div/input"));
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[6]/div/input")).sendKeys(repeatPassword);
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

    public static void navigateToSearchUserTab() throws InterruptedException {
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement searchUserTab = driver.findElement(By.cssSelector("#user-search > a"));
                wait.until(visibilityOf(searchUserTab));
                wait.until(elementToBeClickable(searchUserTab));
                searchUserTab.click();
            } catch (Exception e) {
                System.out.println("Search User link not present " + e);
            }
    }

    public static void navigateToEditUser() throws InterruptedException {
        selectNewPageToNavigateTo("menu_um");
        driver.findElement(By.cssSelector("#user-search > a")).click();
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement editUserButton = driver.findElement(By.xpath("//table[@id='um-table']/tbody/tr/td/div/button"));
                wait.until(visibilityOf(editUserButton));
                wait.until(elementToBeClickable(editUserButton));
                editUserButton.click();
            }
            catch (Exception e)
            {
                System.out.println("Edit user button is not ready" + e);
            }
    }

    public static void navigateToEditUserViaSearch(String user) throws InterruptedException {
            try{
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement search = driver.findElement(By.cssSelector("#user-search > a"));
                WebElement input = driver.findElement(By.cssSelector("#um-table_filter > label > input.form-control.input-sm"));

                wait.until(visibilityOf(search));
                wait.until(elementToBeClickable(search));
                search.click();
                wait.until(visibilityOf(input));
                wait.until(elementToBeClickable(input));
                input.sendKeys(user);
            }catch(Exception e){
                System.out.println("Search function not available" + e.getMessage());
            }

            try{
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                WebElement button = driver.findElement(By.xpath(".//*[@id='um-table']/tbody/tr/td[1]/div/button[1]"));
                wait.until(visibilityOf(button));
                wait.until(elementToBeClickable(button));
                button.click();
            }catch (Exception e){
                System.out.println("Button not ready " + e.getMessage());
            }
    }

    public static void navigateToUserSearchTab() throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 60) fail("timeout");
            try {
                if ("Search".equals(driver.findElement
                        (By.xpath("//a[contains(@href, '#user-tab-1')]")).getText()))
                    break;
            } catch (Exception e) {
                System.out.println("Timed out " + e);
            }
            Thread.sleep(1000);
        }
        driver.findElement(By.xpath("//a[contains(@href, '#user-tab-1')]")).click();
    }

    public static void searchForUser(String userId) throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement usersPage = driver.findElement(By.id("menu_um"));
            wait.until(visibilityOf(usersPage));
            wait.until(elementToBeClickable(usersPage));
            usersPage.click();
            driver.findElement(By.cssSelector("#user-search > a")).click();
            driver.findElement(By.cssSelector("#um-table_filter > label > input.form-control.input-sm")).clear();
            driver.findElement(By.cssSelector("#um-table_filter > label > input.form-control.input-sm")).sendKeys(userId);

        }catch (Exception e){
            System.out.println("User page not ready " +e.getMessage());
        }
    }

    public static void confirmNoUser() {
        assertTrue(isElementPresent(By.cssSelector("td.dataTables_empty")));
    }

    public static void confirmUserSearchResults(String expected) {
        assertEquals(expected, driver.findElement(By.cssSelector("td.username.sorting_1")).getText());
    }

    public static void actionUserDeletion(String button) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement deleteButton = driver.findElement(By.xpath("//table[@id='um-table']/tbody/tr/td/div/button[" + button + "]"));
            try {
                wait.until(visibilityOf(deleteButton));
                wait.until(elementToBeClickable(deleteButton));
                deleteButton.click();
                } catch (Exception e)
                    {
                        System.out.println("User deletion button was not ready " + e);
                    }
    }

    public static void navigateToUserWalletsTab() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("//a[contains(text(),'Wallets')]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.xpath("//a[contains(text(),'Wallets')]")).click();
    }

    public static void navigateToUserChainsTab() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("//a[contains(text(),'Chains')]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.xpath("//a[contains(text(),'Chains')]")).click();
    }

    public static void selectUserFullWallet(String userID){
        driver.findElement(By.xpath(".//*[@id='user-tab-user-" + userID + "-3']/div/div[1]/div/div/ul/li/input")).click();
        String xpathToWallet = ".//*[@id='user-tab-user-" + userID + "-3']/div/div[1]/div/div/div/ul/li[1]";
        driver.findElement(By.xpath(xpathToWallet)).click();
    }

    public static void selectUserReadOnlyWallet(String userID){
        driver.findElement(By.xpath(".//*[@id='user-tab-user-" + userID + "-3']/div/div[2]/div/div/ul/li/input")).click();
        String xpathToReadOnlyWallet = ".//*[@id='user-tab-user-" + userID + "-3']/div/div[2]/div/div/div/ul/li[2]";
        driver.findElement(By.xpath(xpathToReadOnlyWallet)).click();
    }

    public static void selectUserChain(String userID, String chainId){
        driver.findElement(By.xpath(".//*[@id='user-tab-user-" + userID + "-4']/div/div/div/div/ul/li/input")).click();
        ((JavascriptExecutor)driver).executeScript("$('#user-tab-user-" + userID + "-4 .chain-access').val('" + chainId + "').trigger('chosen:updated').trigger('change')");
    }

    public static void deselectUserChain(String userID){
        driver.findElement(By.xpath(".//*[@id='user-tab-user-" + userID + "-4']/div/div/div/div/ul/li/input")).click();
        ((JavascriptExecutor)driver).executeScript("$('#user-tab-user-" + userID + "-4 .chain-access').val('').trigger('chosen:updated').trigger('change')");
    }

    public static void submitUserWalletSelections() throws InterruptedException {
        WebElement walletSelectionSubmit = null;
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                walletSelectionSubmit = driver.findElement(By.xpath("(//button[@type='submit'])[11]"));
                wait.until(visibilityOf(walletSelectionSubmit));
                wait.until(elementToBeClickable(walletSelectionSubmit));
                walletSelectionSubmit.click();
            } catch (Exception e) {
                System.out.println("User Wallet Success not ready " + e);
            }
    }

    public static void submitUserChainSelections() throws InterruptedException {
        scrollElementIntoViewByXpath("(//button[@type='submit'])[11]");
        WebElement submitButton = null;
            try{
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[11]"));
                wait.until(visibilityOf(submitButton));
                wait.until(elementToBeClickable(submitButton));
                submitButton.click();
            }catch (Exception e){
           System.out.println("Submit Button was not ready " + e.getMessage() );
        }
    }

    public static String[] generateRandomUserDetails() {
        String str = RandomStringUtils.randomAlphabetic(10);
        String userName = "Test_User_" + str;
        String emailAddress = userName + "@" + str + ".com";
        return new String[] {userName, emailAddress};
    }

    public static void submitUpdatedUserDetails() {
        try{
            WebElement submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[11]"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();
        }catch (Exception e) {
            System.out.println("Submit button not ready " + e.getMessage());
        }
    }

    public static void editEmailAddress(String emailAddress) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement emailAddressField = driver.findElement(By.xpath("(//input[@value=''])[2]"));
            wait.until(visibilityOf(emailAddressField));
            wait.until(elementToBeClickable(emailAddressField));
            emailAddressField.clear();
            emailAddressField.sendKeys(emailAddress);
        }catch(Exception e){
            System.out.println("Email address field not available " + e.getMessage());
        }
    }


    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

  public static void navigateToAddUser() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-user-administration");
    navigateToPage2("user-administration/users");
    Thread.sleep(500);
    driver.findElement(By.id("user-tab-1")).click();
    try {
      driver.findElement(By.id("manage-users")).isDisplayed();
    }catch (Error e){
      fail();
      System.out.println("Manage User page not displayed");
    }
  }
  public static void enterManageUserUsername(String username){
    driver.findElement(By.id("new-user-username")).sendKeys(username);
  }
  public static void enterManageUserEmail(String email){
    driver.findElement(By.id("new-user-email")).sendKeys(email);
  }
  public static void selectManageUserAccountDropdown(){
    driver.findElement(By.id("new-user-account-select")).click();
    driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li[1]")).click();
    driver.findElement(By.id("new-user-account-select")).click();
  }
  public static void selectManageUserUserDropdown(){
      driver.findElement(By.id("new-user-username")).click();
      try {
          driver.findElement(By.id("new-user-usertype-select")).click();
      }catch (Error e){
          System.out.println("fail");
          fail();
      }
    driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li[2]")).click();
  }
  public static void enterManageUserPassword(String password){
    driver.findElement(By.id("new-user-password")).sendKeys(password);
  }
  public static void enterManageUserPasswordRepeat(String password){
    driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
  }
  public static void clickManageUserSubmit(){
    driver.findElement(By.id("new-user-submit")).click();
  }
  public static void navigateToPage5(){
    driver.findElement(By.className("pagination-next")).click();
    driver.findElement(By.className("pagination-next")).click();
    driver.findElement(By.className("pagination-next")).click();
    driver.findElement(By.className("pagination-next")).click();
  }

  public static void navigateToUserSearch(){
    driver.findElement(By.id("user-tab-0")).click();
  }

  public static void navigateToEditUsers(){
    driver.findElement(By.id("edit-1")).click();
    driver.findElement(By.id("user-tab-2")).isDisplayed();
  }

  public static void editUserEmail(String email){
    driver.findElement(By.id("edit-user2-email")).clear();
    driver.findElement(By.id("edit-user2-email")).sendKeys(email);
  }

  public static void closeUserDetails(){
    driver.findElement(By.xpath("//*[@id=\"edit-user2-form\"]/div/div[5]/div/button[2]")).click();
  }
  public static void saveUserDetails(){
    driver.findElement(By.xpath("//*[@id=\"edit-user2-form\"]/div/div[5]/div/button[1]")).click();
  }
  public static void clickDeleteUser(String delNo){
    driver.findElement(By.id("delete-"+ delNo)).click();
  }
  public static void enterAllUserDetails(String randomNumber){
    enterManageUserUsername("TestUser" + randomNumber);
    enterManageUserEmail("TestEmail" + randomNumber + "@setl.io");
    selectManageUserAccountDropdown();
    selectManageUserUserDropdown();
    enterManageUserPassword("Testpass123");
    enterManageUserPasswordRepeat("Testpass123");
  }


}
