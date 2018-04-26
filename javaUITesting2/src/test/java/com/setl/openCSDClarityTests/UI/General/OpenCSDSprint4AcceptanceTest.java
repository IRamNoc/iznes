package com.setl.openCSDClarityTests.UI.General;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;



import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint4AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (300000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }


    @Test
    public void shouldCreateUmbrellaFundAndAssertDetailsAreDisplayedInTable() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(umbFundCount);

        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        getUmbrellaTableRow(umbFundCount, uFundDetails[0], "testLei", "Management Company", "Jordan");
    }

    @Test
    public void shouldCreateUmbrellaFundAndAssertDetailsInTableAreUpdated() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(umbFundCount);

        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Afghanistan");
        submitUmbrellaFund();

        getUmbrellaTableRow(umbFundCount, uFundDetails[0], "testLei", "Management Company", "Afghanistan");

        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-" + umbFundCount)).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/div/h1")));

        String [] updateChars = generateRandomFundsDetails();

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(updateChars);
        driver.findElement(By.id("uf_lei")).sendKeys(updateChars);
        driver.findElement(By.id("uf_registerOffice")).sendKeys(updateChars);
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys(updateChars);
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).clear();
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2020-10-20");
        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
        searchAndSelectTopDropdownXpath("uf_domicile", "Albania");

        scrollElementIntoViewById("mcBtnSubmitForm");
        wait.until(visibilityOfElementLocated(By.id("mcBtnSubmitForm")));
        wait.until(elementToBeClickable(driver.findElement(By.id("mcBtnSubmitForm"))));

        driver.findElement(By.id("mcBtnSubmitForm")).click();

        wait.until(visibilityOfElementLocated(By.id("am-product-home")));

        getUmbrellaTableRow(umbFundCount, uFundDetails[0] + updateChars, "testLei" + updateChars, "Management Company", "Albania");

    }

    @Test
    public void shouldCreateFundAndAssertDetailsInTableAreUpdated() throws InterruptedException {

        //Login and navigate to Product Module

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");

        //Create umbrella fund for later use

        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        //Store title number count for Funds

        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(fundCount);

        //Navigate to fund creation and create a fund with umbFund

        String [] uFundDetails = generateRandomFundsDetails();

        shouldFillOutFundDetailsStep1(umbFundDetails[0]);
        shouldFillOutFundDetailsStep2(uFundDetails[0]);

        //Assert fund table displays the information for the fund created previously, including umbFund

        getFundTableRow(fundCount, uFundDetails[0], "12345678901234567890", "EUR Euro", "Management Company", "Afghanistan","Contractual Fund", umbFundDetails[0]);

        //Navigate to the fund previously created

        driver.findElement(By.id("product-dashboard-link-fundID-" + fundCount)).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1")));

        //Update all fund information with random chars at the end

        String [] updateChars = generateRandomDetails();

        driver.findElement(By.id("fundName")).sendKeys(updateChars[0]);
        driver.findElement(By.id("legalEntityIdentifier")).clear();
        driver.findElement(By.id("legalEntityIdentifier")).sendKeys("92345678901234567890");

        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/div[2]/span/a")).click();

        searchAndSelectFundDropdown("domicile", "Albania");
        searchAndSelectLegalFormDropdown("legalForm", "Unit Trust");
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/div[3]/ul/li[2]/div/a")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/div[3]/ul/li[1]/div/a")).click();
        searchAndSelectFundsDropdown("nationalNomenclatureOfLegalForm", "GB Authorised unit trust (AUT)");

        scrollElementIntoViewById("fund-submitfund-btn");
        wait.until(visibilityOfElementLocated(By.id("fund-submitfund-btn")));
        wait.until(elementToBeClickable(driver.findElement(By.id("fund-submitfund-btn"))));

        driver.findElement(By.id("fund-submitfund-btn")).click();

        wait.until(visibilityOfElementLocated(By.id("am-product-home")));

        //Assert that table displays the fund details with random chars at the end.

        getFundTableRow(fundCount, uFundDetails[0] + updateChars[0], "92345678901234567890", "USD US Dollar", "Management Company", "Albania","Unit Trust", umbFundDetails[0]);

    }

    @Test
    public void shouldAssertThatFundsTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatFundShareTableDisplaysAllInformation(){
    }

    @Test
    public void shouldAssertThatUmbrellaFundsHas2ExpandableFields() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectUmbrellaFund();
        verifyOptInfoPageContents();
        verifyUmbrellaFundMainInfoPageContents();
    }

    @Test
    public void shouldAssertThatFundsHas3ExpandableFields() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectFund();
        verifyFundDropdownElements();
    }

    private void shouldFillOutFundDetailsStep1(String umbFundName){
        driver.findElement(By.id("new-fund-btn")).click();

        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(umbFundName);
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/div[3]/div/input")).sendKeys(Keys.ENTER);

        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try {
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        } catch (Error e) {
            fail(e.getMessage());}
    }


    private void verifyFundDropdownElements() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/div[2]/div[1]/div/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/form/div[2]/div[2]/div/div/div[1]/div[1]/div/a/h2")));
    }

    @Test
    public void shouldAssertThatAnUmbrellaFundTabIsPresent(){
    }

    @Test
    public void shouldAssertThatAFundsTabIsPresent(){
    }

    @Test
    public void shouldAssertThatAFundSharesTabIsPresent(){
    }

    @Test
    public void shouldAssertThatFundSharesHas2ExpandableFields(){
    }

    @Test
    public void shouldCreateAndSetWalletWhenFundIsCreated(){
    }

    @Test
    public void shouldCreateFundShareAndCheckDatabase(){
    }

    @Test
    public void shouldUpdateFundShareAndCheckDatabase(){
    }



}
