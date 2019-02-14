package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewBy;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class PageHelper extends LoginAndNavigationHelper {

    public static void selectNewPageToNavigateTo(String newPageId) throws InterruptedException {
        try{
            WebElement newPageLink = driver.findElement(By.id(newPageId));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(newPageLink));
            wait.until(elementToBeClickable(newPageLink));
            newPageLink.click();

        }catch (Exception e){
            System.out.println(newPageId + " was not available " + e.getMessage());
        }
    }

    public static void waitForLinkText(String text, WebElement link) {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(link));
            wait.until(elementToBeClickable(link));
        } catch (Exception e)
        {
            System.out.println(text +  " was not available " + e);
        }
    }

    public static void verifyCorrectPage(String expected) {
        String test = driver.findElement(By.className("header-breadcrumbs")).getText();
        System.out.println(test);

        String actual = driver.findElement(By.className("header-breadcrumbs")).getText();
        assert actual.equals(expected) : String.format("Expected '%s' but was '%s'", expected, actual);
    }

    public static void verifyCorrectPageContains(String title) {
        assertTrue(driver.findElement(By.className("header-breadcrumbs")).getText().contains(title));
    }

    public static void verifyCorrectPageById(String title) {
        assertTrue(driver.findElement(By.id("pageTitle")).getText().equals(title));

    }

    public static void waitForNewFundShareTitle() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-1\"]/h3/span")));
            String shareTitle = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/h3/span")).getText();

            assertTrue(shareTitle.equals("Please enter following information to create a new Fund Share"));
        }catch (Error e){
            fail(e.getMessage());
        }
    }

    public static void waitForNewShareButton() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {

            Thread.sleep(500);

            //By bye = By.id("new-share-btn"); // maybe Selenium doesn't like this
            By bye = By.xpath("//button[contains(@id,'new-share-btn')]");

            wait.until(visibilityOfElementLocated((bye)));
            wait.until(elementToBeClickable(bye));
            scrollElementIntoViewBy(bye);
            WebElement newShare = driver.findElement(bye);

            wait.until(invisibilityOfElementLocated(By.className("toast-title")));
            newShare.click();
        }catch (Error e){
            fail(e.getMessage());
        }
    }

    public static void setTime(String time, String timeField){

        WebElement id = driver.findElement(By.id(timeField));
        ((JavascriptExecutor) driver).executeScript("arguments[0].value = '" + time + "';", id);
        id.sendKeys(Keys.ARROW_UP);


    }


    public static void verifyOptInfoPageContents() {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/section/div[1]/div[1]/div/a/h2"));
        mainInfo.click();
        WebElement optInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-1\"]/form/section/div[2]/div[1]/div/a/h2"));
        optInfo.click();
        wait.until(visibilityOfElementLocated(By.id("uf_giin")));
        wait.until(visibilityOfElementLocated(By.id("uf_delegatedManagementCompany")));
        wait.until(visibilityOfElementLocated(By.id("uf_auditor")));
        wait.until(visibilityOfElementLocated(By.id("uf_taxAuditor")));
        wait.until(visibilityOfElementLocated(By.id("uf_principalPromoter")));
        wait.until(visibilityOfElementLocated(By.id("uf_legalAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("uf_directors")));
        wait.until(visibilityOfElementLocated(By.id("uf_internalReference")));
        wait.until(visibilityOfElementLocated(By.id("uf_additionalNotes")));
        optInfo.click();

        wait.until(invisibilityOfElementLocated(By.id("uf_giin")));
        wait.until(invisibilityOfElementLocated(By.id("uf_delegatedManagementCompany")));
        wait.until(invisibilityOfElementLocated(By.id("uf_auditor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_taxAuditor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_principalPromoter")));
        wait.until(invisibilityOfElementLocated(By.id("uf_legalAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_directors")));
        wait.until(invisibilityOfElementLocated(By.id("uf_internalReference")));
        wait.until(invisibilityOfElementLocated(By.id("uf_additionalNotes")));
    }

    public static void verifyFundOptInfoPageContents() {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2")));
        WebElement fundInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[1]/div/a/h2"));
        fundInfo.click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2")));
        WebElement fundMainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2"));
        fundMainInfo.click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[2]/div[1]/div/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[2]/div[1]/div/a/h2")));

        WebElement optInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-2\"]/form/div[2]/div[2]/div/div/div[2]/div[1]/div/a/h2"));
        optInfo.click();
        wait.until(visibilityOfElementLocated(By.id("globalIntermediaryIdentification")));
        wait.until(visibilityOfElementLocated(By.id("delegatedManagementCompany")));
        wait.until(visibilityOfElementLocated(By.id("investmentAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("auditor")));
        wait.until(visibilityOfElementLocated(By.id("taxAuditor")));
        wait.until(visibilityOfElementLocated(By.id("legalAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("directors")));
        wait.until(visibilityOfElementLocated(By.id("internalReference")));
        wait.until(visibilityOfElementLocated(By.id("additionalNotes")));
        optInfo.click();


        wait.until(invisibilityOfElementLocated(By.id("globalIntermediaryIdentification")));
        wait.until(invisibilityOfElementLocated(By.id("delegatedManagementCompany")));
        wait.until(invisibilityOfElementLocated(By.id("investmentAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("auditor")));
        wait.until(invisibilityOfElementLocated(By.id("taxAuditor")));
        wait.until(invisibilityOfElementLocated(By.id("legalAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("directors")));
        wait.until(invisibilityOfElementLocated(By.id("internalReference")));
        wait.until(invisibilityOfElementLocated(By.id("additionalNotes")));

    }

    public static void verifyMainInfoPageContents() {

        WebElement mainInfo = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/section/div[1]/div[1]/div/a/h2"));
        mainInfo.click();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundName")));
        wait.until(visibilityOfElementLocated(By.id("uf_lei")));
        wait.until(visibilityOfElementLocated(By.id("uf_registerOffice")));
        wait.until(visibilityOfElementLocated(By.id("uf_registerOfficeAddress")));
        wait.until(visibilityOfElementLocated(By.id("uf_domicile")));
        wait.until(visibilityOfElementLocated(By.id("uf_umbrellaFundCreationDate")));
        wait.until(visibilityOfElementLocated(By.id("uf_managementCompany")));
        wait.until(visibilityOfElementLocated(By.id("uf_fundAdministrator")));
        wait.until(visibilityOfElementLocated(By.id("uf_custodian")));
        wait.until(visibilityOfElementLocated(By.id("uf_investmentManager")));
        wait.until(visibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(visibilityOfElementLocated(By.id("uf_payingAgent")));
        mainInfo.click();

        wait.until(invisibilityOfElementLocated(By.id("uf_umbrellaFundName")));
        wait.until(invisibilityOfElementLocated(By.id("uf_lei")));
        wait.until(invisibilityOfElementLocated(By.id("uf_registerOffice")));
        wait.until(invisibilityOfElementLocated(By.id("uf_registerOfficeAddress")));
        wait.until(invisibilityOfElementLocated(By.id("uf_domicile")));
        wait.until(invisibilityOfElementLocated(By.id("uf_umbrellaFundCreationDate")));
        wait.until(invisibilityOfElementLocated(By.id("uf_managementCompany")));
        wait.until(invisibilityOfElementLocated(By.id("uf_fundAdministrator")));
        wait.until(invisibilityOfElementLocated(By.id("uf_custodian")));
        wait.until(invisibilityOfElementLocated(By.id("uf_investmentManager")));
        wait.until(invisibilityOfElementLocated(By.id("uf_investmentAdvisor")));
        wait.until(invisibilityOfElementLocated(By.id("uf_payingAgent")));


    }

}
