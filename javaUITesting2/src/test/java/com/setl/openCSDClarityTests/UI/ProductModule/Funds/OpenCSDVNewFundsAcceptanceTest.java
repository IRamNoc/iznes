package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDVNewFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);



    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldCreateFund() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/input")).sendKeys("TestUmbrellaFunds1");
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
        shouldFillOutFundDetailsStep2();
        try {
            driver.findElement(By.id("fund-submitfund-btn")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            System.out.println(popup);
            assertTrue(popup.equals("TestFund1 has been successfully created."));
        }catch (Exception e){
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldDisplayCorrectTitle() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        String pageHeading = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[1]/h1/span")).getText();
        assertTrue(pageHeading.equals("Add a New Fund"));
    }

    @Test
    public void shouldClickAddNewUmbrellaFundAndBeNavigatedAway() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        try {
            driver.findElement(By.id("fund-add-new-umbrella-btn")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        try{
            String pageHeading = driver.findElement(By.id("add-fund-title")).getText();
            assertTrue(pageHeading.equals("Add a New Umbrella Fund"));
        }catch (Exception e){
            fail("Page heading text was not correct : " + e.getMessage());
        }
        }

    @Test
    public void shouldBeAbleToCancelFundCreationStep1() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/input")).sendKeys("TestUmbrellaFunds1");
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-cancelUmbrella-btn")).click();
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        }catch (Exception e){
            fail(e.getMessage());
        }

    }

    @Test
    public void shouldDisplayUmbrellaFundInfoWhenUmbrellaFundIsSelected() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
            try {
                driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/input")).sendKeys("TestUmbrellaFunds1");
            }catch (Exception e){
                fail(e.getMessage());
            }
            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/ul/li[1]/div/a")).click();
        String fundName = driver.findElement(By.id("umbrellaFundName")).getAttribute("value");
        assertTrue(fundName.equals("TestUmbrellaFunds1"));
    }

    @Test
    public void shouldTakeUserToStep2WhenNextIsClicked() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/input")).sendKeys("TestUmbrellaFunds1");
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldBeAbleToCancelFundCreationStep2() throws InterruptedException, IOException{
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        driver.findElement(By.id("new-fund-btn")).click();
        driver.findElement(By.id("fund-umbrellaControl-select-1")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/input")).sendKeys("TestUmbrellaFunds1");
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.xpath("//*[@id=\"fund-umbrellaControl-select-1\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fund-submitUmbrella-btn")).click();
        try{
            driver.findElement(By.id("isFundStructure1")).isDisplayed();
        }catch (Error e){
            fail(e.getMessage());
        }
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0,500)");
        driver.findElement(By.id("fund-cancelfund-btn")).click();
        try {
            String pageHeading = driver.findElement(By.id("am-product-home")).getText();
            assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
        }catch (Exception e){
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldDisplayCreatedFundInFundsTable() throws InterruptedException, IOException{

    }

    @Test
    public void shouldQueryDatabaseForUmbrellaFund() throws InterruptedException, IOException{

    }

    @Test
    public void shouldQueryDatabaseForFunds() throws InterruptedException, IOException{

    }

    private void shouldFillOutFundDetailsStep2() throws InterruptedException {
        driver.findElement(By.id("fundName")).sendKeys("TestFund1");
        driver.findElement(By.id("AuMFund")).sendKeys("TestFund1");
        driver.findElement(By.id("AuMFundDate")).sendKeys("2018-04-04");
        driver.findElement(By.id("domicile")).click();
        driver.findElement(By.xpath("//*[@id=\"domicile\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isEuDirective2")).click();
        driver.findElement(By.id("legalForm")).click();
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fundCurrency")).click();
        driver.findElement(By.xpath("//*[@id=\"fundCurrency\"]/div/ul/li[1]/div/a")).click();
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0,500)");
        driver.findElement(By.id("managementCompanyID")).click();
        driver.findElement(By.xpath("//*[@id=\"managementCompanyID\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("custodianBank")).click();
        driver.findElement(By.xpath("//*[@id=\"custodianBank\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("portfolioCurrencyHedge")).click();
        driver.findElement(By.xpath("//*[@id=\"portfolioCurrencyHedge\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("fiscalYearEnd")).sendKeys("2018-04-04");
        driver.findElement(By.id("openOrCloseEnded2")).click();
        driver.findElement(By.id("isFundOfFund2")).click();
        driver.findElement(By.id("fundAdministrator")).click();
        driver.findElement(By.xpath("//*[@id=\"fundAdministrator\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("nationalNomenclatureOfLegalForm")).click();
        driver.findElement(By.xpath("//*[@id=\"nationalNomenclatureOfLegalForm\"]/div/ul/li[1]/div/a")).click();
        driver.findElement(By.id("isDedicatedFund1")).click();
        Thread.sleep(5000);
    }
}
