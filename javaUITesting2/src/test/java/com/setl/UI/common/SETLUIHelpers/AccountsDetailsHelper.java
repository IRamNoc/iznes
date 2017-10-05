package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToLegalEntitiesCreateSelection;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;

public class AccountsDetailsHelper extends LoginAndNavigationHelper {

    public static void populateNewAccountFields(String accountName, String description, String memberIndex) throws InterruptedException {
        enterAccountName(accountName);
        enterAccountDescription(description);
        selectMember(memberIndex);
        submitAccountDetails();
    }

    public static void populateNewAccountFieldsViaLEISearch(String LEI, String description, String memberIndex) throws InterruptedException {
        navigateToLegalEntitiesCreateSelection(LEI);
        clickCreateAccount();
        enterAccountDescription(description);
        selectMember(memberIndex);
        submitLEIAccountDetails();
    }

    public static void populateDuplicateAccountFieldsViaLEISearch(String description, String memberIndex) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement submitOne = driver.findElement(By.xpath("(//button[@type='submit'])[11]"));
        wait.until(visibilityOf(submitOne));
        wait.until(elementToBeClickable(submitOne));
        submitOne.click();

        WebElement submitTwo = driver.findElement(By.xpath("(//button[@type='submit'])[6]"));
        wait.until(visibilityOf(submitTwo));
        wait.until(elementToBeClickable(submitTwo));
        submitTwo.click();

        enterAccountDescription(description);
        selectMember(memberIndex);
        submitLEIAccountDetails();
    }

    public static void clickCreateAccount() {

        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement submit = driver.findElement(By.xpath("(//button[@type='submit'])[6]"));
            wait.until(visibilityOf(submit));
            wait.until(elementToBeClickable(submit));
            submit.click();
        }catch(Exception e){
            System.out.println("Submit button not ready " + e.getMessage());
        }
    }

    public static void navigateToAddAccountTab() throws InterruptedException
    {
        String text = "Add Account Name";
        WebElement link = driver.findElement(By.linkText(text));
        Thread.sleep(1000);
        waitForLinkText(text, link);
        link.click();
    }

    public static void navigateToAccountSearchTab() throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 60) fail("timeout");
            try {
                if ("Search".equals(driver.findElement
                        (By.xpath("//a[contains(@href, '#account-tab-1')]")).getText()))
                    break;
            } catch (Exception e) {
                System.out.println("timed out " + e);
            }
            Thread.sleep(1000);
        }
        driver.findElement(By.xpath("//a[contains(@href, '#account-tab-1')]")).click();
    }

    private static void enterAccountName(String nodeName) throws InterruptedException {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement accName = driver.findElement(By.cssSelector("input.form-control.accountname"));
            wait.until(visibilityOf(accName));
            wait.until(elementToBeClickable(accName));
            accName.clear();
            accName.sendKeys(nodeName);
        }catch(Exception e){
            System.out.println("Account Name field is not ready " +e.getMessage());
            }
    }

    private static void enterAccountDescription(String nodeIpAddress) throws InterruptedException {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement accDes = driver.findElement(By.cssSelector("input.form-control.accountdes"));
            wait.until(visibilityOf(accDes));
            wait.until(elementToBeClickable(accDes));
            accDes.clear();
            accDes.sendKeys(nodeIpAddress);

        }catch(Exception e){
            System.out.println("Account description field not ready " +e.getMessage());
        }
    }

    public static void confirmNoAccount() {
        assertTrue(isElementPresent(By.cssSelector("td.dataTables_empty")));
    }

    public static void confirmSearchResults(String expected) {
        assertEquals(expected, driver.findElement(By.cssSelector("td.accountName")).getText());
    }

    private static void selectMember(String memberIndex) throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("choose member...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement link = driver.findElement(By.linkText("choose member..."));
            wait.until(visibilityOf(link));
            wait.until(elementToBeClickable(link));
            link.click();
        }catch(Exception e){
            System.out.println("Link not available " +e.getMessage());
        }
        try{
            String xpathToMember = ".//*[@id='account-tab-2']/div/form/div/div[5]/div/div/div/ul/li[" + memberIndex + "]";
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement member = driver.findElement(By.xpath(xpathToMember));
            wait.until(visibilityOf(member));
            wait.until(elementToBeClickable(member));
            member.click();
        }catch (Exception e){
            System.out.println("Member not present " + e.getMessage());
        }
    }

    public static String[] generateRandomAccountDetails()
    {
        String str = RandomStringUtils.randomAlphanumeric(10);
        String accountName = "Test_Account_" + str;
        String description = accountName + "_Desc";
        return new String[] {accountName, description};
    }

    private static void submitAccountDetails() throws InterruptedException {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement accDet = driver.findElement(By.xpath("(//button[@type='submit'])[9]"));
            wait.until(visibilityOf(accDet));
            wait.until(elementToBeClickable(accDet));
            accDet.click();
        }catch(Exception e){
            System.out.println("Submit button not ready" +e.getMessage());
        }
    }

    private static void submitLEIAccountDetails() throws InterruptedException {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement accDet = driver.findElement(By.xpath("(//button[@type='submit'])[12]"));
            wait.until(visibilityOf(accDet));
            wait.until(elementToBeClickable(accDet));
            accDet.click();
        }catch(Exception e){
            System.out.println("Submit button not ready" +e.getMessage());
        }
    }


    public static void navigateToEditAccountViaSearch(String account) throws InterruptedException {
        selectNewPageToNavigateTo("menu_accounts");
        driver.findElement(By.cssSelector("#account-search > a")).click();

        for (int second = 0; ; second++) {
            if (second >= 5) fail("timeout");
            try {
                if (isElementPresent(By.xpath("//table[@id='account-table']/tbody/tr/td/div/button"))) break;
            } catch (Exception e) {
                System.out.println("Timed out" + e);
            }
            Thread.sleep(500);
        }

        driver.findElement(By.cssSelector("#account-table_filter > label > input.form-control.input-sm")).clear();
        driver.findElement(By.cssSelector("#account-table_filter > label > input.form-control.input-sm")).sendKeys(account);
        driver.findElement(By.xpath("//table[@id='account-table']/tbody/tr/td/div/button[1]")).click();
    }

    public static void searchForAccount(String account) throws InterruptedException {
        selectNewPageToNavigateTo("menu_accounts");
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement accSearch = driver.findElement(By.cssSelector("#account-search > a"));
            wait.until(visibilityOf(accSearch));
            wait.until(elementToBeClickable(accSearch));
            driver.findElement(By.cssSelector("#account-table_filter > label > input.form-control.input-sm")).clear();
            driver.findElement(By.cssSelector("#account-table_filter > label > input.form-control.input-sm")).sendKeys(account);
            accSearch.click();
        }catch(Exception e){

        }
    }

    public static void actionAccountDeletion(String button) throws InterruptedException {
        WebElement deleteButton = driver.findElement(By.xpath("//table[@id='account-table']/tbody/tr/td/div/button[" + button + "]"));

            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                wait.until(visibilityOf(deleteButton));
                wait.until(elementToBeClickable(deleteButton));

            } catch (Exception e) {
                System.out.println("Timed out " + e);
            }
        driver.findElement(By.xpath("//table[@id='account-table']/tbody/tr/td/div/button[" + button + "]")).click();
    }

    public static void enterFirstName(String PopulateFirstName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement populateFirstName = driver.findElement(By.id("details_FirstName"));
        wait.until(visibilityOf(populateFirstName));
        wait.until(elementToBeClickable(populateFirstName));
        populateFirstName.clear();
        populateFirstName.sendKeys(PopulateFirstName);
    }


    public static void enterLastName(String PopulateLastName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement populateLastName = driver.findElement(By.id("details_LastName"));
        wait.until(visibilityOf(populateLastName));
        wait.until(elementToBeClickable(populateLastName));
        populateLastName.clear();
        populateLastName.sendKeys(PopulateLastName);
    }

    public static void selectCountry() {
        driver.findElement(By.id("details_country_select_chosen")).click();
        driver.findElement(By.xpath("/html/body/div[5]/div[1]/div[3]/div[17]/div/div/div/div[1]/div/div/div[5]/div/div/div/div/ul/li[2]")).click();
    }

    public static void enterDisplayName(String populateDisplayName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement DisplayName = driver.findElement(By.id("details_DisplayName"));
        wait.until(visibilityOf(DisplayName));
        wait.until(elementToBeClickable(DisplayName));
        DisplayName.clear();
        DisplayName.sendKeys(populateDisplayName);
    }

    public static void enterEmailAddress(String populateEmailAddress) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement emailAddress = driver.findElement(By.id("details_in_emailAddress"));
        wait.until(visibilityOf(emailAddress));
        wait.until(elementToBeClickable(emailAddress));
        emailAddress.clear();
        emailAddress.sendKeys(populateEmailAddress);
    }

    public static void enterAddressPrefix(String populateAddressPrefix) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement addressPrefix = driver.findElement(By.id("details_AddressPrefix"));
        wait.until(visibilityOf(addressPrefix));
        wait.until(elementToBeClickable(addressPrefix));
        addressPrefix.clear();
        addressPrefix.sendKeys(populateAddressPrefix);
    }

    public static void enterPostalAddress(String populatePostalAddress) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement postalAddress = driver.findElement(By.id("details_Address1"));
        wait.until(visibilityOf(postalAddress));
        wait.until(elementToBeClickable(postalAddress));
        postalAddress.clear();
        postalAddress.sendKeys(populatePostalAddress);
    }

    public static void enterPostalAddress2(String populatePostalAddress2) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement postalAddress2 = driver.findElement(By.id("details_Address2"));
        wait.until(visibilityOf(postalAddress2));
        wait.until(elementToBeClickable(postalAddress2));
        postalAddress2.clear();
        postalAddress2.sendKeys(populatePostalAddress2);
    }

    public static void enterTown(String populateTown) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement town = driver.findElement(By.id("details_Address3"));
        wait.until(visibilityOf(town));
        wait.until(elementToBeClickable(town));
        town.clear();
        town.sendKeys(populateTown);
    }

    public static void enterArea(String populateArea) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement area = driver.findElement(By.id("details_Address4"));
        wait.until(visibilityOf(area));
        wait.until(elementToBeClickable(area));
        area.clear();
        area.sendKeys(populateArea);
    }

    public static void enterPostcode(String populatePostcode) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement postcode = driver.findElement(By.id("details_PostalCode"));
        wait.until(visibilityOf(postcode));
        wait.until(elementToBeClickable(postcode));
        postcode.clear();
        postcode.sendKeys(populatePostcode);
    }

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
  public static void clickMyAccountSubmit(){
//    try {
//      driver.findElement(By.id("udSubmit")).click();
//    }catch (Error e){
//      System.out.println("udSubmit was not found");
//      fail();
//    }
  }
  public static void myAccountSendKeys(String field, String text){
    driver.findElement(By.id("ud" + field)).sendKeys(text);
  }
  public static void myAccountClearField(String field){
    driver.findElement(By.id("ud" + field)).clear();
  }
}
