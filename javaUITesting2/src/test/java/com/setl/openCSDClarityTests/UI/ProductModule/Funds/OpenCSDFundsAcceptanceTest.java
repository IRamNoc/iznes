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
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.fundCheckRoundingUp;
import static org.junit.Assert.*;


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
        loginAndVerifySuccess("am", "trb2017");
    }

    @Test
    public void shouldSeeCorrectFieldsOnSharesFundsUmbrellaFundsPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage("product-home");
        validatePageLayout();
    }

    private void validatePageLayout() {
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-align-left")));
        assertTrue(isElementPresent(By.id("am-product-home")));
        assertTrue(driver.findElement(By.id("am-product-home")).getText().contentEquals("Shares / Funds / Umbrella funds"));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/div")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/div")).getText().contentEquals("Display only active Shares"));
        assertTrue(isElementPresent(By.id("switchActiveShares")));
        assertTrue(driver.findElement(By.id("switchActiveShares")).isEnabled());

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]")).getText().contentEquals("Shares"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-down.reverse")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[2]")).getText().contentEquals("Add new Share"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[1]/div[1]")).getText().contentEquals("Funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-down.reverse")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[1]/div[2]")).getText().contentEquals("Add new Fund"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[5]/div[1]/div[1]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[5]/div[1]/div[1]")).getText().contentEquals("Umbrella Funds"));
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-chevron-down.reverse")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[5]/div[1]/div[2]")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[5]/div[1]/div[2]")).getText().contentEquals("Add new Umbrella Fund"));



        }

        private void closeShares(){
            driver.findElement(By.cssSelector("i.fa.fa-chevron-down.reverse")).click();
            assertTrue(isElementPresent(By.id("switchActiveShares")));

        }

    @Test
    @Ignore
    public void shouldCreateFundAsAMViewAsInvestor() throws  IOException, InterruptedException {
        double value = Math.random() * 501;
        int rounded = (int) Math.round(value);
        JavascriptExecutor jse = (JavascriptExecutor)driver;

        loginAndVerifySuccess("am", "trb2017");
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

    public void clickID(String id) {
        try {
            driver.findElement(By.id(id)).click();
        } catch (Exception e) {
            fail(id + "not present");
        }
    }

    @Test
    public void shouldNotAcceptFundWithQuantityLowerThan0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("topBarMenu");
        navigateToPageByID("topBarMyAccount");
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

    @Test
    public void shouldChangeFundShareTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPage("asset-manager-dashboard");
        WebElement FundTitle = driver.findElement(By.id("fund-share-label"));
        assertTrue(FundTitle.getText().equals("Please select a fund share in this list"));
    }

    @Test
    public void shouldRoundAllQuantitiesUnder5DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.2", "1.20000");
    }

    @Test
    public void shouldRoundAllQuantitiesOver5DecimalPlacesTo5DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minsubscriptionUnits_0_0", "1.255555", "1.25556");
    }

    @Test
    public void shouldRoundAllAmountsUnder4DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.2", "1.2000");
    }

    @Test
    public void shouldRoundAllAmountsOver4DecimalPlacesTo4DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1.25555", "1.2556");
    }

    @Test
    public void shouldRoundAllNAVUnder2DecimalPlacesToNearest0() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.2", "1.20");
    }

    @Test
    public void shouldRoundAllNAVOver2DecimalPlacesTo2DecimalPlaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("fundInitialEstimatedNav_0_0", "1.255", "1.25");
    }

    @Test
    public void shouldSeparateThousandsWithSpaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1000000", "1 000 000.0000");
    }

    @Test
    public void shouldSeparateDecimalPlacesWithPoint() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "2000000", "2 000 000.0000");
    }

}
