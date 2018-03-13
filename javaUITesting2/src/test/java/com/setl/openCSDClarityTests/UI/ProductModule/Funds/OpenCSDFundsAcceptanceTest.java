package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Ignore;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDFundsAcceptanceTest {

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
        createFundViaApi();
        screenshotRule.setDriver(driver);
    }

    private void createFundViaApi() {


    }

    @Test
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        //loginAndVerifySuccess(adminuser, adminuserPassword);
    }

    @Test
    @Ignore
    public void shouldCreateFundAsAMViewAsInvestor() throws  IOException, InterruptedException {
        double value = Math.random() * 501;
        int rounded = (int) Math.round(value);
        JavascriptExecutor jse = (JavascriptExecutor)driver;

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

        driver.findElement(By.id("isin_0_0")).sendKeys("TestISIN" + GetCurrentTimeStamp());
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

        scrollElementIntoViewByCss("#valuationFrequency_0_0 .ui-select-placeholder");

        driver.findElement(By.cssSelector("#valuationFrequency_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#valuationFrequency_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
        }
        driver.findElement(By.cssSelector("#applicableRight_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#applicableRight_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        ////////////
        driver.findElement(By.id("tabfundShareNav_Services_0_0")).click();
        ////////////

        driver.findElement(By.cssSelector("#assetManagementCompany_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#assetManagementCompany_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.id("managementCompanyAddress1_0_0")).sendKeys("TestLine1");
        driver.findElement(By.id("managementCompanyAddress3_0_0")).sendKeys("TestCityOrTown");
        driver.findElement(By.id("managementCompanyAddress4_0_0")).sendKeys("TestStateOrArea");
        driver.findElement(By.id("adminAccountManager_0_0")).sendKeys("TestAccountManager");
        driver.findElement(By.cssSelector("#administratorNav_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#administratorNav_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        ///////////
        driver.findElement(By.id("tabfundShareNav_Legal_0_0")).click();
        ///////////

        Thread.sleep(2000);
        driver.findElement(By.id("supervisoryAuthority_0_0")).sendKeys("supervisory");
        driver.findElement(By.cssSelector("#amfClassification_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#amfClassification_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#ucitsIVClassification_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#ucitsIVClassification_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#legalNature_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#legalNature_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#formOfOpcvm_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#formOfOpcvm_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        ///////////
        driver.findElement(By.id("tabfundShareNav_Fees_0_0")).click();
        ///////////

        Thread.sleep(2000);

        driver.findElement(By.id("maxIndirectFees_0_0")).sendKeys("12");
        driver.findElement(By.id("maxManagementFees_0_0")).sendKeys("12");
        driver.findElement(By.id("provisionedActualManagementFees_0_0")).sendKeys("12");
        driver.findElement(By.id("acquiredSubscriptionFees_0_0")).sendKeys("12");
        driver.findElement(By.id("acquiredRedemptionFees_0_0")).sendKeys("12");
        driver.findElement(By.id("maxSubscriptionFees_0_0")).sendKeys("12");
        driver.findElement(By.id("maxRedemptionFees_0_0")).sendKeys("12");

        ///////////
        driver.findElement(By.id("tabfundShareNav_Risk_0_0")).click();
        ///////////

        driver.findElement(By.id("srri_0_0")).sendKeys("1");

        ///////////
        driver.findElement(By.id("tabfundShareNav_Profile_0_0")).click();
        ///////////

        driver.findElement(By.cssSelector("#subscriberProfile_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#subscriberProfile_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        ///////////
        driver.findElement(By.id("tabfundShareNav_Characteristic_0_0")).click();
        ///////////

        driver.findElement(By.cssSelector("#decimalisation_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#decimalisation_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#formOfUnit_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#formOfUnit_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#formOfRedemption_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#formOfRedemption_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#formOfsubscription_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#formOfsubscription_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.id("minInitSubscription_0_0")).sendKeys("12");
        driver.findElement(By.id("minSubscriptionvalue_0_0")).sendKeys("12");
        driver.findElement(By.id("fundInitialEstimatedNav_0_0")).sendKeys("12");

        ///////////
        driver.findElement(By.id("tabfundShareNav_Calendar_0_0")).click();
        ///////////

        driver.findElement(By.cssSelector("#srSchedule_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#srSchedule_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#valuationPrice_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#valuationPrice_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#dateCalculationConditions_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#dateCalculationConditions_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#subscriptionCutOff_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#subscriptionCutOff_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#subscriptionCutOffHour_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#subscriptionCutOffHour_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#cashDeliveryDate_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#cashDeliveryDate_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#settlementDate_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#settlementDate_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#redemptionCutOff_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#redemptionCutOff_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }
        driver.findElement(By.cssSelector("#redemptionCutOffHour_0_0 .ui-select-placeholder")).click();
        try {
            driver.findElement(By.cssSelector("#redemptionCutOffHour_0_0 .dropdown-item")).click();
        }catch (Error e){
            System.out.println("dropdown not visible");
            fail();
        }

        driver.findElement(By.id("fundBtnSubmit_0")).click();

        Thread.sleep(1500);
        assertEquals("Waiting!", driver.findElement(By.className("jaspero__dialog-title")).getText());
        Thread.sleep(10000);
        assertEquals("Success!", driver.findElement(By.className("jaspero__dialog-title")).getText());

    }

    /*
        AM creates fund
        Logout
        Investor login
        Navigate to list of funds
        See fund AM created
    */

    public static String GetCurrentTimeStamp() {
        SimpleDateFormat sdfDate = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm:ss.SSS");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);
        return strDate;

    }
    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdownXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[1]");
        navigateToPageXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[2]/a");
        try {
            driver.findElement(By.cssSelector("#udDisplayName")).sendKeys("helloworld");
        }catch (Error e){
            System.out.println("lol");
            fail();
        }
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
