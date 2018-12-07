package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.WalletsDetailsHelper.selectLEIFromLEISearch;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class MemberDetailsHelper extends LoginAndNavigationHelper {

    public static void navigateToAddNewMemberTab() throws InterruptedException {

        driver.findElement(By.id("user-tab-1")).click();

    }

    public static void navigateToAddNewPhoenixMemberTab() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.cssSelector("#menu_chain_adminitration_parent > a > span.nav-label > span.ml")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.cssSelector("#menu_chain_adminitration_parent > a > span.fa.arrow")).click();
        try {
            assertTrue(isElementPresent(By.cssSelector("#menu_members > span.nav-label > span.ml")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement menuMember = driver.findElement(By.cssSelector("#menu_members > span.nav-label > span.ml"));
            wait.until(visibilityOf(menuMember));
            wait.until(elementToBeClickable(menuMember));
            menuMember.click();
            driver.findElement(By.xpath("//div[@id='members-tabs']/ul/li[2]/a/span")).click();
        } catch (Exception e) {
            System.out.println("Menu member link not available " + e.getMessage());
        }
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement memberTab = driver.findElement(By.xpath("//div[@id='members-tabs']/ul/li[2]/a/span"));
            wait.until(visibilityOf(memberTab));
            wait.until(elementToBeClickable(memberTab));
            memberTab.click();
        } catch (Exception e) {
            System.out.println("Member Tab not available " + e.getMessage());
        }

    }

    public static void populateMemberDetailFields(String memberName, String memberEmail) throws InterruptedException {
        enterMemberName(memberName);
        enterMemberEmailAddress(memberEmail);
        submitMemberDetails();
    }

    public static void populatePhoenixMemberDetailFields(String memberName, String memberEmail) throws InterruptedException {
        enterMemberName(memberName);
        enterMemberEmailAddress(memberEmail);
        submitPhoenixMemberDetails();
    }

    public static void populateMemberDetailFieldsFromLEISearch(String LEI, String memberName, String memberEmail) throws InterruptedException {
        navigateToSelectMemberFromLEISearch();
        selectLEIFromLEISearch(LEI);
        navigateToMemberCreation();
        enterMemberName(memberName);
        enterMemberEmailAddress(memberEmail);
        submitLEIMemberDetails();

    }

    public static void navigateToSelectMemberFromLEISearch() {
        assertEquals("Create From LEI Search", driver.findElement(By.xpath("(//button[@type='submit'])[5]")).getText());
        driver.findElement(By.xpath("(//button[@type='submit'])[5]")).click();
        driver.findElement(By.id("leiSearch-btn")).click();
    }

    public static void navigateToMemberCreation() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            scrollElementIntoViewByXpath("(//button[@type='submit'])[5]");
            WebElement submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[5]"));
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();
        } catch (Exception e) {
            System.out.println("Submit button not ready " + e.getMessage());
            fail();
        }
    }

    public static void closeMemberDetailsConfirmation() throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement closeButton = driver.findElement(By.cssSelector(("div.modal-footer > button.btn.btn-white")));
            Thread.sleep(500);
            wait.until(visibilityOf(closeButton));
            wait.until(elementToBeClickable(closeButton));
            closeButton.click();
        } catch (Exception e) {
            System.out.println(" Close button not ready " + e.getMessage());
            fail();
        }
    }

    public static void enterMemberName(String memberName) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement memberField = driver.findElement(By.cssSelector("input.form-control.membername"));
            wait.until(visibilityOf(memberField));
            wait.until(elementToBeClickable(memberField));
            memberField.clear();
            memberField.sendKeys(memberName);
        } catch (Exception e) {
            System.out.println(" Member name field not ready " + e.getMessage());
        }
    }

    public static void enterMemberEmailAddress(String memberEmail) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement emailField = driver.findElement(By.cssSelector("input.form-control.email"));
            wait.until(visibilityOf(emailField));
            wait.until(elementToBeClickable(emailField));
            emailField.clear();
            driver.findElement(By.cssSelector("input.form-control.email")).clear();
            driver.findElement(By.cssSelector("input.form-control.email")).sendKeys(memberEmail);
        } catch (Exception e) {
            System.out.println("Email Address Field not ready");
        }
    }

    private static void submitMemberDetails() throws InterruptedException {
        try {
            WebElement submitButton = (driver.findElement(By.xpath("(//button[@type='submit'])[6]")));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();

        } catch (Exception e) {
            System.out.println("Member Submit Button Not Available" + e.getMessage());
        }
    }

    private static void submitPhoenixMemberDetails() throws InterruptedException {
        try {
            WebElement submitButton = (driver.findElement(By.xpath("(//button[@type='submit'])[38]")));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();

        } catch (Exception e) {
            System.out.println("Member Submit Button Not Available" + e.getMessage());
        }
    }


    public static void navigateToLegalEntitiesCreateSelection(String LEI) throws InterruptedException {
        driver.findElement(By.xpath("(//button[@type='submit'])[8]")).click();
        driver.findElement(By.id("lei-search-input")).click();
        driver.findElement(By.id("lei-search-input")).clear();
        driver.findElement(By.id("lei-search-input")).sendKeys(LEI);
        driver.findElement(By.id("leiSearch-btn")).click();
        for (int second = 0; ; second++) {
            if (second >= 10) fail("Edit Button Not Available");
            try {
                if (isElementPresent(By.xpath("//table[@id='legalentities-table']/tbody/tr/td/div/button"))) break;
            } catch (Exception e) {
                System.out.println("Edit Button Not Available " + e);
            }
            Thread.sleep(200);
        }
        driver.findElement(By.xpath("//table[@id='legalentities-table']/tbody/tr/td/div/button")).click();
    }

    public static void clickCreateMember() {
        assertTrue(isElementPresent(By.xpath("(//button[@type='submit'])[5]")));
        driver.findElement(By.xpath("(//button[@type='submit'])[5]")).click();
    }


    public static void submitLEIMemberDetails() throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement submitButton = driver.findElement(By.xpath("(//button[@type='submit'])[9]"));
            wait.until(visibilityOf(submitButton));
            wait.until(elementToBeClickable(submitButton));
            submitButton.click();
        } catch (Exception e) {
            System.out.println("Submit button not ready " + e.getMessage());
        }
    }

    public static void navigateToSelectChain() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("choose chains...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
    }

    public static void selectChain(String chainIndex) throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#member_chain_access  .chosen-select.chain').val('" + chainIndex + "').trigger('chosen:updated').trigger('change')");
        try{
            WebElement chain = driver.findElement(By.xpath(".//*[@id='member_chain_access']/div/div/div/div/div[6]/div/button[1]"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(chain));
            wait.until(elementToBeClickable(chain));
            chain.click();
        }catch(Exception e)
        {
            System.out.println("Chain is not present" +e.getMessage());
        }

    }

    public static void selectMember(String memberIndex) {
        try{
            assertTrue(isElementPresent(By.linkText("Choose Member...")));
        }catch (Error e) {
            verificationErrors.append(e.toString());
        }
        ((JavascriptExecutor) driver).executeScript("$('#member_chain_access  .chosen-select.member').val('" + memberIndex + "').trigger('chosen:updated')");
    }

    public static void selectMemberType(String memberTypeIndex) {
        try {
            assertTrue(isElementPresent(By.linkText("Choose member type...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        ((JavascriptExecutor) driver).executeScript("$('#member_chain_access  .chosen-select.membertype').val('" + memberTypeIndex + "').trigger('chosen:updated')");
    }


    public static void selectWalletNode(String walletNodeIndex) {
        try {
            assertTrue(isElementPresent(By.linkText("Choose Wallet Node...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        ((JavascriptExecutor) driver).executeScript("$('#member_chain_access  .chosen-select.walletNode').val('" + walletNodeIndex + "').trigger('chosen:updated')");
    }

    public static void saveChainAccess() throws InterruptedException {
        driver.findElement(By.xpath("(//button[@type='submit'])[7]")).click();
    }

    public static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public static void scrollElementIntoViewBy(By bye){
        WebElement element = driver.findElement(bye);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static void scrollElementIntoViewByWebElement(WebElement WebElement){
        WebElement element = WebElement;
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static void scrollElementIntoViewById(String elementId){
        WebElement element = driver.findElement(By.id(elementId));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static void scrollElementIntoViewByXpath(String xpath){
        WebElement element = driver.findElement(By.xpath(xpath));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static void scrollElementIntoViewByCss(String css){
        WebElement element = driver.findElement(By.cssSelector(css));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static void scrollElementIntoViewByClassName(String className){
        WebElement element = driver.findElement(By.className(className));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",element);
    }

    public static String generateMemberName() {
        String str = RandomStringUtils.randomAlphabetic(12);
        String memberName = "Test_Member_" + str;
        return memberName;
    }

    public static void validateCSSOnNavigationBarByID(String elementId){
        driver.findElement(By.id(elementId));
        String cssNav = driver.findElement(By.id(elementId)).getAttribute("class");
        assertTrue(cssNav.contains("nav-link active"));
    }
    public static void validateColourOfElementByCSS(String cssSelector, String rgba){
        driver.findElement(By.cssSelector(cssSelector));
        String Color = driver.findElement(By.cssSelector(cssSelector)).getCssValue("background-color");
        System.out.println(Color);
        assertTrue(Color.equals(rgba));
    }
}
