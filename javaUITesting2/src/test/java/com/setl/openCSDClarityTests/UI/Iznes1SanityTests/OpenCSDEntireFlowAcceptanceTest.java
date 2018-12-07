package com.setl.openCSDClarityTests.UI.Iznes1SanityTests;

import com.setl.UI.common.SETLBusinessData.IBAN;
import com.setl.UI.common.SETLUtils.Repeat;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.DisableOnDebug;
import org.junit.rules.TestRule;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomISIN;


import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep1Alternate;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessWelcomeToIZNES2;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep2;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep4;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep5;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep6;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCAcceptMostRecentRequest2;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessRequestListValidation;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;
import static org.junit.Assert.assertTrue;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDEntireFlowAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public TestRule timeout = new DisableOnDebug(Timeout.seconds(60*10));
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {

        boolean isDebug =
            java.lang.management.ManagementFactory.getRuntimeMXBean().
                getInputArguments().toString().indexOf("-agentlib:jdwp") > 0;

        if (!isDebug) {
            System.out.println("Waiting to make sure system has had a chance to wake up");
            Thread.sleep(20000);
        }

        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
        setDBTwoFAOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();

    }

    @Test
    public void shouldTest_EntireIZNESPlatform() throws Exception {
        //-----------------------------------------------------------
        String No = "11"; String userNo = "0" + No;
        String[] email = generateRandomEmail();
        String AMUsername = "am"; String AMPassword = "alex01";
        String InvUsername = email[0]; String InvPassword = "asdASD123";
        //String InvUsername = "therealjordanmiller@gmail.com"; String InvPassword = "asdASD123";
        String managementCompEntered = "Management Company"; String managementCompExpected = "Management Company";
        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String umbFundDetails = generateRandomUmbrellaFundName();
        String[] uIsin = generateRandomISIN();
        String umbLei = generateRandomLEI(); String fundLei = generateRandomLEI();
        String shareCurrency = "EUR"; int latestNav = 14;
        String companyName = "Jordan Corporation";
        String firstName = "Jordan"; String lastName = "Miller";
        String phoneNo = "07956701992";
        String[] uSubNameDetails = generateRandomSubPortfolioName();
        String[] uAmount = generateRandomAmount();
        String uSubIBANDetails = "FR7630006000011234567890189";
        //-----------------------------------------------------------

        alert("IZNES Entire Flow Test Now Starting...");

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails, umbLei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(umbFundDetails);
        getUmbrellaTableRow(0, umbFundDetails, umbLei, managementCompExpected, "Jordan");
        fillOutFundDetailsStep1("yes", umbFundDetails);
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        getFundTableRow(0, uFundDetails[0], fundLei, "EUR", managementCompExpected, "Afghanistan", "Contractual Fund", umbFundDetails);

        createShare(uFundDetails[0], uShareDetails[0], uIsin[0], IBAN.generateRandomIban("FR"));
        searchSharesTable(uShareDetails[0]);
        getShareTableRow(0, uShareDetails[0], uIsin[0], uFundDetails[0], shareCurrency, managementCompExpected, "", "share class", "Open");

        setSharesNAVandValidate(uShareDetails[0], latestNav);
        logout();

        System.out.println("Status : Inviting investor - " + email[0]);
        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();

        setDBToProdOff(); // really need this to be off when an investor logs in!

        newInvestorSignUp(email[0], InvPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);

        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, uSubIBANDetails);
        KYCProcessStep3ClassificationInfoComplete();
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "No", "", "");
        logout();

        System.out.println("Status : AM Accepting Investor");
        KYCAcceptMostRecentRequest2(AMUsername, AMPassword, companyName, firstName, lastName, phoneNo, "accept");

        validateClientReferentialAndGrantFundAccess(companyName, No, uIsin[0]);
        System.out.println("Status : Granted access to " + uShareDetails[0] + " for investor : " + InvUsername);

        logout();

        loginAndVerifySuccess(InvUsername, InvPassword);
        System.out.println("Status : Investor creates Sub Portfolio");
        createSubPortfolio(uSubNameDetails[0], uSubIBANDetails);

        System.out.println("Status : Placing order");
        navigateToDropdown("menu-order-module");
        navigateToPageByID("menu-list-of-fund");
        placeOrder(uIsin[0], uShareDetails[0], managementCompEntered, shareCurrency, latestNav, uAmount[0]);
        validatePlacedOrder(companyName, uIsin[0], uShareDetails[0], shareCurrency, uAmount[0]);

        alert("Login as '" + AMUsername + "' to view the order.");
    }

    public static void validatePlacedOrder(String companyName, String isin, String shareNames, String currency, String amount) throws IOException, InterruptedException{
        Thread.sleep(1000);
        String orderType = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[3]/span")).getText();
        assertTrue(orderType.equals("Subscription"));
        String investor = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]")).getText();
        System.out.println(investor);
        System.out.println(companyName);
        assertTrue(investor.equals(companyName));
        String orderIsin = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[5]/button")).getText();
        assertTrue(orderIsin.equals(isin));
        String shareName = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[6]/button")).getText();
        assertTrue(shareName.equals(shareNames));
        String orderCurrency = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[8]")).getText();
        assertTrue(orderCurrency.equals(currency));
        String quantity = driver.findElement(By.xpath("//*[@id=\"search-orders-form\"]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[9]")).getText();
        assertTrue(quantity.equals(amount + ".00000"));

        System.out.println("Status : Order details all displayed correctly");
        System.out.println("Status : Order will now be cut off in 1 minute");

    }

    public static void alert(String message) throws IOException, InterruptedException{
        System.out.println("=======================================================");
        System.out.println(message);
        System.out.println("=======================================================");

    }
}
