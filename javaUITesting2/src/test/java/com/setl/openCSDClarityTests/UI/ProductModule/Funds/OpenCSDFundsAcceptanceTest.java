package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = Timeout.seconds(300);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }
    @Test
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
    }
    @Ignore
    @Test
    public void shouldCreateFundAsAMViewAsInvestor() throws  IOException, InterruptedException {
        double value = Math.random() * 501;
        int rounded = (int) Math.round(value);

        loginAndVerifySuccess("am", "alex01");
        System.out.println(rounded);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-fund");
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/section/button")).click();
        driver.findElement(By.id("fundName_0")).sendKeys("TestFundJordan" + rounded);
        driver.findElement(By.id("fundLei_0")).sendKeys("TestFundJordan" + rounded);
        driver.findElement(By.cssSelector("#fundSicavFcp_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#fundSicavFcp_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#fundSicavId_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#fundSicavId_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        //////////

        driver.findElement(By.id("isin_0_0")).sendKeys("TestISIN");
        driver.findElement(By.id("shareName_0_0")).sendKeys("TestShare");
        driver.findElement(By.cssSelector("#fundShareStatus_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#fundShareStatus_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.id("fundAddress1_0_0")).sendKeys("TestLine1");
        driver.findElement(By.id("fundAddress3_0_0")).sendKeys("TestCityOrTown");
        driver.findElement(By.id("fundAddress4_0_0")).sendKeys("TestStateOrArea");
        driver.findElement(By.id("fundCodePostal_0_0")).sendKeys("TestPostalCode");

        driver.findElement(By.cssSelector("#shareType_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#shareType_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        driver.findElement(By.cssSelector("#shareCurrency_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#shareCurrency_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        driver.findElement(By.cssSelector("#portfolioCurrency_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#portfolioCurrency_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        Thread.sleep(2000);
        driver.findElement(By.cssSelector("#valuationFrequency_0_0 .ui-select-placeholder")).click();
        Thread.sleep(2000);
//        try {
//            driver.findElement(By.cssSelector("#valuationFrequency_0_0 .dropdown-item")).click();
//        }catch (Error e){
//            System.out.println("dropdown not visible");
//            fail();
//        }
//        driver.findElement(By.cssSelector("#applicableRight_0_0 .ui-select-placeholder")).click();
//        try {
//            driver.findElement(By.cssSelector("#applicableRight_0_0 .dropdown-item")).click();
//        }catch (Error e){
//            System.out.println("dropdown not visible");
//            fail();
//        }

        ////////////
        driver.findElement(By.id("tabfundShareNav_Services_0_0")).click();
        ////////////

//        try {
//            driver.findElement(By.cssSelector("#assetManagementCompany .dropdown-item")).click();
//        }catch (Error e){
//            System.out.println("dropdown not visible");
//            fail();
//        }
        //driver.findElement(By.id("managementCompanyAddress1")).sendKeys("TestLine1");
        //driver.findElement(By.id("managementCompanyAddress3")).sendKeys("TestCityOrTown");
        //driver.findElement(By.id("managementCompanyAddress4")).sendKeys("TestStateOrArea");
        //driver.findElement(By.id("adminAccountManager")).sendKeys("TestAccountManager");
//        try {
//            driver.findElement(By.cssSelector("#administratorNav .dropdown-item")).click();
//        }catch (Error e){
//            System.out.println("dropdown not visible");
//            fail();
//        }

        ///////////
        driver.findElement(By.id("tabfundShareNav_Category_0_0")).click();
        ///////////

        ///////////
        //driver.findElement(By.id("")).click();
        ///////////

//        driver.findElement(By.id("maxIndirectFees")).sendKeys("12");
//        driver.findElement(By.id("maxManagementFees")).sendKeys("12");
//        driver.findElement(By.id("provisionedActualManagementFees")).sendKeys("12");
//        driver.findElement(By.id("acquiredSubscriptionFees")).sendKeys("12");
//        driver.findElement(By.id("acquiredRedemptionFees")).sendKeys("12");
//        driver.findElement(By.id("maxSubscriptionFees")).sendKeys("12");
//        driver.findElement(By.id("maxRedemptionFees")).sendKeys("12");
//
//        driver.findElement(By.id("srri")).sendKeys("TestSRRI");
//
//        driver.findElement(By.id("minInitSubscription")).sendKeys("12");
//        driver.findElement(By.id("minSubscriptionvalue")).sendKeys("12");
//        driver.findElement(By.id("fundInitialEstimatedNav")).sendKeys("12");
//        Thread.sleep(20000);

    /*
        AM creates fund
        Logout
        Investor login
        Navigate to list of funds
        See fund AM created
    */
    }
    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan0() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        try {
            driver.findElement(By.cssSelector("#udDisplayName")).sendKeys("helloworld");
        }catch (Error e){
            System.out.println("lol");
            fail();
        }
        driver.findElement(By.cssSelector("#country .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#country .dropdown-item")).click();
        }catch (Error e){
            System.out.println("lol");
            fail();
        }
        Thread.sleep(5000);

        /*
        Login as AM
        Edit a fund characteristic
        Store decimalisation value

        Login as Investor
        List of funds
        Subscribe to the same fund
        Set quantity 1 order of magnitude smaller than stored decimalisation
        Save
     */
    }
    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan10() throws IOException, InterruptedException {
        /*

         */
    }
}
