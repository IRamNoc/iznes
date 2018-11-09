package com.setl.openCSDClarityTests.UI.Iznes2KYCModule;

import SETLAPIHelpers.DatabaseHelper;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomEmail;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomLEI;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomIBAN;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static SETLAPIHelpers.DatabaseHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleAcceptanceTest {

    JavascriptExecutor jse = (JavascriptExecutor)driver;

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(105000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
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
    public void shouldAcceptKYCwithRandomEmail() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();
        String uSubIBANDetails = "FR7630006000011234567890189";

        System.out.println(email[0]);

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, uSubIBANDetails);
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting Approval", "No", "", "");
        Thread.sleep(750);
        logout();
        KYCAcceptMostRecentRequest2(AMUsername, AMPassword, companyName, firstName, lastName, phoneNo, "accept");
    }

    @Test
    public void shouldAskForMoreInfoKYCwithRandomEmail() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();
        String iban = generateRandomIBAN();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, iban);
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting Approval", "No", "", "");
        Thread.sleep(750);
        logout();
        KYCAcceptMostRecentRequest2(AMUsername, AMPassword, companyName, firstName, lastName, phoneNo, "more");
    }

    @Test
    public void shouldRejectKYCwithRandomEmail() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();
        String iban = generateRandomIBAN();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, iban);
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting Approval", "No", "", "");
        Thread.sleep(750);
        logout();
        KYCAcceptMostRecentRequest2(AMUsername, AMPassword, companyName, firstName, lastName, phoneNo, "reject");
        //accept//askForMoreInfo//reject//
    }

    @Test
    public void shouldChangeKYCProcessIfAlreadyRegistered() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "Yes", "False", "");
    }

    @Test
    @Ignore("no method for multiple beneficarys")
    public void shouldCreateKYCRequestWith2AMs() throws Exception
    {
        String managementCompEntered = "Management Company";
        String managementComp2Entered = "am";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();
        String iban = generateRandomIBAN();


        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);

        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);

        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "True", managementComp2Entered);
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, iban);
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6("Jordan Miller", "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", companyName, "Waiting approval", "Yes", "am2", "Waiting approval");
    }

    @Ignore
    @Test
    public void shouldSetKYCStatusToDraftIfClosed() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";
        String iban = generateRandomIBAN();


        String[] email = generateRandomEmail();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);

        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, iban);
        KYCProcessStep4();
        KYCProcessClose();
        KYCProcessRequestListValidation("No","Success!", companyName, "Draft", "No", "", "");
    }

    @Test
    public void shouldCompleteFullKYCProcess() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();
        String iban = generateRandomIBAN();


        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);

        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete(companyName);
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete(companyName, iban);
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "No", "", "");
        Thread.sleep(750);
        logout();
        KYCAcceptMostRecentRequest2(AMUsername, AMPassword, companyName, firstName, lastName, phoneNo, "accept");
    }

    public static void validateClientReferentialAndGrantFundAccess(String companyName, String No, String isin) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        Thread.sleep(2000);
        String clientRefTitle = driver.findElement(By.xpath("//*[@id=\"ofi-client-referential\"]")).getText();
        System.out.println();
        try{
            System.out.println(clientRefTitle);
            //assertTrue(clientRefTitle.equals("Client Referential: " + companyName));
        }catch (Exception e){
            System.out.println("=======================================================");
            System.out.println("FAILED : Client Referential heading did not match expected heading.");
            fail(e.getMessage());
        }

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-client-referential/clr-tabs/ul/button[2]")).click();

        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        Thread.sleep(250);
        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(isin);
        Thread.sleep(250);
        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/button")).click();

        driver.findElement(By.xpath("//*[@id=\"access_slider_row_0\"]/div/label/span")).click();

        scrollElementIntoViewById("client_folder_validate");
        driver.findElement(By.id("client_folder_validate")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]")));
        String jaspTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(jaspTitle.equals("Confirm Fund Share Access:"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        wait.until(visibilityOfElementLocated(By.id("invite-investors-btn")));
        wait.until(elementToBeClickable(By.id("invite-investors-btn")));
        System.out.println("Status : Successfully accepted KYC request");
    }

    public static void newInvestorSignUp(String email, String investorPassword) throws Exception
    {
        String token = getInvestorInvitationToken(email);
        String url = "https://uk-lon-li-006.opencsd.io/#/redirect/en/" + token;

        driver.get(url);
        Thread.sleep(1000);
        driver.findElement(By.id("su-password-field")).sendKeys(investorPassword);
        driver.findElement(By.id("su-passwordConfirm-field")).sendKeys(investorPassword);
        try {
            driver.findElement(By.id("signup-submit")).click();
        }catch (Exception e){
            fail();
        }
        Thread.sleep(1000);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button")).click();
        }catch (Exception e){
            fail();
        }
    }


    @Test
    public void shouldNotAllowSaveWithoutPhoneNumber() throws IOException, InterruptedException, SQLException {
        String userNo = "006";
        String companyName = "Jordan Corporation";
        String managementCompEntered = "Management Company";


        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, "", managementCompEntered);
    }

    @Test
    public void shouldNotAllowSaveWithoutCompanyName() throws Exception
    {
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";
        String managementCompEntered = "Management Company";


        String[] email = generateRandomEmail();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);

        KYCProcessWelcomeToIZNES2(email[0], "", phoneNo, firstName, lastName, managementCompEntered);
    }

    @Test
    public void shouldNotAllowSaveWithoutCompanyNameAndPhoneNumber() throws IOException, InterruptedException, SQLException {
        String userNo = "008";
        String managementCompEntered = "Management Company";


        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, "", "", managementCompEntered);
    }


    @Test
    @Ignore("Currently given a toaster, plans to change to a modal")
    public void shouldNotInviteAnInvestorIfUsedEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops081@setl.io", "Jordan", "Miller", "Failed!", "Institutional Investor");
    }


    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorWithoutFirstname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops081@setl.io", "", "Miller", "Success!", "Institutional Investor");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorWithoutLastname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops083@setl.io", "Jordan", "", "Success!", "Institutional Investor");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldNotInviteAnInvestorWithoutEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestorExpectingFailed("", "Jordan", "Miller");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldDisplayPopupConfirmationScreenIfCaseNO() throws IOException, InterruptedException {
        loginKYCConfirmationScreen("testops005@setl.io", "asdasd");
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("no");
        selectOptionNoValidatePopup();
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldNotBeAskedToEnterKycAfterFillingItOutOnce() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops006@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops006@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("no");
        selectOptionNoValidatePopup();
        logout();
        loginCompleteKYC("testops006@setl.io", "asdasd");
    }


    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldTakeInvestorToAwaitingPageIfCaseYES() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops003@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops003@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("yes");
        logout();
    }


    public static void searchSelectTopOptionXpath(String value, String openDropdownXpath, String inputDropdownXpath, String clickTopOptionXpath) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath(openDropdownXpath)).click();
        wait.until(visibilityOfElementLocated(By.xpath(inputDropdownXpath)));
        driver.findElement(By.xpath(inputDropdownXpath)).sendKeys(value);
        driver.findElement(By.xpath(clickTopOptionXpath)).click();
    }

    public static void KYCProcessStep3GeneralInfoComplete(String companyName) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        Thread.sleep(750);

        String identificationTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[3]/kyc-step-identification/h3")).getText();
        assertTrue(identificationTitle.equals("CLIENT'S IDENTIFICATION AS A LEGAL ENTITY"));
        String generalInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(generalInfoPercent.equals("0%"));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("registeredCompanyName")));
        driver.findElement(By.id("registeredCompanyName")).sendKeys(companyName);
        String percent0 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent0.equals("10%"));
        searchSelectTopOptionXpath("EARL : Entreprise agricole à responsabilité limitée", "//*[@id=\"legalForm\"]/div", "//*[@id=\"legalForm\"]/div/div[3]/div/input", "//*[@id=\"legalForm\"]/div/div[3]/ul/li[1]/div/a");
        String percent1 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent1.equals("20%"));
        driver.findElement(By.id("registeredCompanyAddressLine1")).sendKeys("21 Something Street");
        String percent2 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent2.equals("30%"));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[1]/input")).sendKeys("IP11EY");
        String percent3 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent3.equals("40%"));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[2]/input")).sendKeys("Ipswich");
        String percent4 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent4.equals("50%"));
        String lei = generateRandomLEI();
        driver.findElement(By.xpath("//*[@id=\"leiCode\"]")).sendKeys(lei);
        String percent5 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent5.equals("60%"));
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/ul/li[1]/div/a");
        String percent6 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent6.equals("70%"));
        searchSelectTopOptionXpath("Cosmetics", "//*[@id=\"sectorActivity\"]/div", "//*[@id=\"sectorActivity\"]/div/div[3]/div/input", "//*[@id=\"sectorActivity\"]/div/div[3]/ul/li[1]/div/a");
        String percent7 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent7.equals("80%"));
        searchSelectTopOptionXpath("Credit Institution", "//*[@id=\"legalStatusList\"]/div", "//*[@id=\"legalStatusList\"]/div/div[3]/div/input", "//*[@id=\"legalStatusList\"]/div/div[3]/ul/li[1]/div/a");
        String percent8 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent8.equals("90%"));
        String percentBarColourPre = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPre.equals("rgba(255, 183, 77, 1)"));
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"countryTaxResidence\"]/div", "//*[@id=\"countryTaxResidence\"]/div/div[3]/div/input", "//*[@id=\"countryTaxResidence\"]/div/div[3]/ul/li[1]/div/a");
        String percent9 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent9.equals("100%"));

        String percentBarColourPost = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPost.equals("rgba(102, 187, 106, 1)"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("registeredCompanyName")));
    }

    public static void KYCProcessStep3CompanyInfoComplete() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String companyInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(companyInfoPercent.equals("0%"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("activities")));

        searchSelectTopOptionXpath("Own-account investor", "//*[@id=\"activities\"]/div", "//*[@id=\"activities\"]/div/div[3]/div/input", "//*[@id=\"activities\"]/div/div[3]/ul/li[1]/div/a");

        searchSelectTopOptionXpath("European union", "//*[@id=\"geographicalAreaOfActivity\"]/div", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/div/input", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/ul/li[1]/div/a");

        searchSelectTopOptionXpath("Embassies and Consulates", "//*[@id=\"ownAccountinvestor\"]/div", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/div/input", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/ul/li[1]/div/a");

        driver.findElement(By.id("balanceSheetTotal")).sendKeys("9");

        driver.findElement(By.id("netRevenuesNetIncome")).sendKeys("9");

        driver.findElement(By.id("shareholderEquity")).sendKeys("9");

        searchSelectTopOptionXpath("Legal person", "//*[@id=\"beneficiaryType\"]/div", "//*[@id=\"beneficiaryType\"]/div/div[3]/div/input", "//*[@id=\"beneficiaryType\"]/div/div[3]/ul/li[1]/div/a");


        driver.findElement(By.id("legalName-benef-0")).sendKeys("Jordan Corparation Ltd");

        driver.findElement(By.id("leiCode-benef-0")).sendKeys(generateRandomLEI());

        driver.findElement(By.id("address-benef-0")).sendKeys("159 Connextions");

        driver.findElement(By.id("zipCode-benef-0")).sendKeys("IP11QJ");

        driver.findElement(By.id("city-benef-0")).sendKeys("Ipswich");


        searchSelectTopOptionXpath("Jordan", "//*[@id=\"country-benef-0\"]/div", "//*[@id=\"country-benef-0\"]/div/div[3]/div/input", "//*[@id=\"country-benef-0\"]/div/div[3]/ul/li[1]/div/a");

        searchSelectTopOptionXpath("SIRET", "//*[@id=\"nationalIdNumber-benef-0\"]/div", "//*[@id=\"nationalIdNumber-benef-0\"]/div/div[3]/div/input", "//*[@id=\"nationalIdNumber-benef-0\"]/div/div[3]/ul/li[1]/div/a");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[2]/div/div[7]/div[2]/beneficiary/div/div[2]/div[5]/div[2]/input")).sendKeys("12312341231232");

        driver.findElement(By.id("holdingPercentage-benef-0")).sendKeys("12");

        searchSelectTopOptionXpath("Direct holding", "//*[@id=\"holdingType-benef-0\"]/div", "//*[@id=\"holdingType-benef-0\"]/div/div[3]/div/input", "//*[@id=\"holdingType-benef-0\"]/div/div[3]/ul/li[1]/div/a");

        driver.findElement(By.id("premiumsAndContributions")).click();

        searchSelectTopOptionXpath("Country", "//*[@id=\"geographicalOrigin1\"]/div", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/ul/li[1]/div/a");
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"geographicalOrigin2\"]/div", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/ul/li[1]/div/a");
        searchSelectTopOptionXpath("0 to 50 million €", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/div/input", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/ul/li[1]/div/a");


        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("activities")));
    }

    public static void KYCProcessStep3BankingInfoComplete(String companyName, String iBan) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        Thread.sleep(500);

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2")).click();
        Thread.sleep(1500);

        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/banking-information/div/div[2]/div/div[2]/div[2]/button");

        String companyNameRead = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[2]/div/div[1]/div/input")).getAttribute("value");
        assertTrue(companyNameRead.equals(companyName));

        driver.findElement(By.id("establishmentName-0")).sendKeys("Establishment Name");

        driver.findElement(By.id("iban-0")).sendKeys(iBan);

        driver.findElement(By.id("bic-0")).sendKeys("asdfGAaaXXX");

        driver.findElement(By.id("establishmentAddress0")).sendKeys("159 Connextions");

        driver.findElement(By.id("zipCode-0")).sendKeys("IP1 1QJ");

        driver.findElement(By.id("city-0")).sendKeys("Ipswich");

        searchSelectTopOptionXpath("Jordan", "//*[@id=\"country0\"]/div", "//*[@id=\"country0\"]/div/div[3]/div/input", "//*[@id=\"country0\"]/div/div[3]/ul/li[1]/div/a");


        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("activities")));
        System.out.println("Status : KYC Step 3 completed");

    }

    public static void selectOptionAndSubmitKYC(String option) throws IOException, InterruptedException{
        Thread.sleep(2000);
        driver.findElement(By.id("opt-" + option)).click();
        driver.findElement(By.id("btnKycSubmit")).click();
    }

    public static void selectOptionNoValidatePopup() {
        String modalHeader = driver.findElement(By.className("modal-title")).getText();
        assertTrue(modalHeader.equals("CONFIRMATION SCREEN"));
        try {
            Thread.sleep(2000);
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-kyc-already-done/clr-modal/div/div[1]/div/div[1]/div/div[2]/button")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
    }

    public static void fillKYCTopFields(String email, String firstname, String lastname) throws IOException, InterruptedException{
        driver.findElement(By.id("kyc_additionnal_email")).clear();
        driver.findElement(By.id("kyc_additionnal_email")).sendKeys(email);
        driver.findElement(By.id("kyc_additionnal_firstName")).clear();
        driver.findElement(By.id("kyc_additionnal_firstName")).sendKeys(firstname);
        driver.findElement(By.id("kyc_additionnal_lastName")).clear();
        driver.findElement(By.id("kyc_additionnal_lastName")).sendKeys(lastname);
    }

    public static void fillKYCLowerFields(String companyName, String phoneNumber) throws IOException, InterruptedException{
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys(companyName);
        driver.findElement(By.id("kyc_additionnal_phoneCode")).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"kyc_additionnal_phoneCode\"]/div/div[3]/ul/li[1]/div/a")));
        driver.findElement(By.xpath("//*[@id=\"kyc_additionnal_phoneCode\"]/div/div[3]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(phoneNumber);
    }

    public static void saveKYCAndVerifySuccessPageOne() throws IOException, InterruptedException{
        driver.findElement(By.id("btnKycSubmit")).click();
        try {
            Thread.sleep(750);
            String header2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(header2.equals("My Information"));
        }catch (Exception e){
            fail(e.getMessage());
        }
        try{

            driver.findElement(By.xpath("//jaspero-confirmation/div[2]/div[4]/button")).click();

        }catch (Exception e){
            fail(e.getMessage());
        }
    }
    public static void verifySaveButtonIsDisabled() throws IOException, InterruptedException{
        try {
            String test = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
            assertTrue(test.equals("true"));
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }
    @Test
    public void TG3099_shouldAssertKYCButtonEqualsCancel() throws Exception
    {
            String managementCompEntered = "Management Company";
            String companyName = "Jordan Corporation";
            String phoneNo = "07956701992";
            String firstName = "Jordan";
            String lastName = "Miller";
            String AMUsername = "am";
            String AMPassword = "alex01";
            String INVPassword = "asdASD123";

            String[] email = generateRandomEmail();

            loginAndVerifySuccess(AMUsername, AMPassword);
            waitForHomePageToLoad();
            navigateToInviteInvestorPage();
            investorInviteOption(email[0], firstName, lastName ,"ClientRef", "Institutional Investor");
            logout();
            newInvestorSignUp(email[0], INVPassword);
            KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
            Thread.sleep(500);
            assert getKYCCancelButton().getText().equals("Cancel") : "TG3099 failed, button name is incorrect";
    }

    @Test
    public void TG3099_shouldAssertCancelButtonRedirectToCorrectPage()throws InterruptedException, SQLException {
        try {
            String managementCompEntered = "Management Company";
            String companyName = "Jordan Corporation";
            String phoneNo = "07956701992";
            String firstName = "Jordan";
            String lastName = "Miller";
            String AMUsername = "am";
            String AMPassword = "alex01";
            String INVPassword = "asdASD123";

            String[] email = generateRandomEmail();

            loginAndVerifySuccess(AMUsername, AMPassword);
            waitForHomePageToLoad();
            navigateToInviteInvestorPage();
            investorInviteOption(email[0], firstName, lastName ,"ClientRef", "Institutional Investor");
            logout();
            newInvestorSignUp(email[0], INVPassword);
            KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
            Thread.sleep(250);
            getKYCCancelButton().click();

            Thread.sleep(250);
            assert driver.findElement(By.id("kyc-newRequestBtn")).isDisplayed() : "did not got back to the my requests page";

        } catch (Exception e) {
            fail("Not yet implemented");
        }
    }

    @Test
    public void TG2987_shouldKYCInDraftStatusHasDeleteButton()throws InterruptedException, SQLException {
        try {
            String managementCompEntered = "Management Company";
            String companyName = "Jordan Corporation";
            String phoneNo = "07956701992";
            String firstName = "Jordan";
            String lastName = "Miller";
            String AMUsername = "am";
            String AMPassword = "alex01";
            String INVPassword = "asdASD123";

            String[] email = generateRandomEmail();

            loginAndVerifySuccess(AMUsername, AMPassword);
            waitForHomePageToLoad();
            navigateToInviteInvestorPage();
            investorInviteOption(email[0], firstName, lastName ,"ClientRef", "Institutional Investor");
            logout();
            newInvestorSignUp(email[0], INVPassword);
            KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
            KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");

            System.out.println("Cancelling KYC");
            getKYCCancelButton().click();

            Thread.sleep(500);

            assert driver.findElement(By.cssSelector("#status_cell_0 > span")).getText().equals("Draft") : "Draft KYC not found";
            assert driver.findElement(By.cssSelector("#draft_delete_btn_0")).isEnabled() : "Delete button not present";


        } catch (Exception e) {
            fail("Not yet implemented");
        }
    }

    @Test
    public void TG2987_shouldAssertKYCIsRemovedFromListWhenDeleted() throws Exception
    {
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";
        String firstName = "Jordan";
        String lastName = "Miller";
        String AMUsername = "am";
        String AMPassword = "alex01";
        String INVPassword = "asdASD123";

        String[] email = generateRandomEmail();

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        investorInviteOption(email[0], firstName, lastName, "ClientRef", "Institutional Investor");
        logout();
        newInvestorSignUp(email[0], INVPassword);
        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
        KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");

        System.out.println("Cancelling KYC");
        getKYCCancelButton().click();

        Thread.sleep(250);
        assert driver.findElement(By.cssSelector("#status_cell_0 > span")).getText().equals("Draft") : "Draft KYC not found";
        assert driver.findElement(By.cssSelector("#draft_delete_btn_0")).isEnabled() : "Delete button not present";

        assert DatabaseHelper.isUserInKYCTable(email[0]) == true : "Investor should be in the DB";
        System.out.println("User is in KYC DB");

        driver.findElement(By.cssSelector("#draft_delete_btn_0")).click();

        Thread.sleep(500);
        assert driver.findElement(By.className("jaspero__dialog-title")).getText().equals("Delete Request");
        System.out.println("Delete popup presented");

        WebElement deleteButton = driver.findElement(By.className("primary"));
        assert deleteButton.getText().equals("Delete") : "delete button text incorrect";
        deleteButton.click();
        System.out.println("Delete clicked");

        Thread.sleep(500);
        List<WebElement> toasts = driver.findElements(By.className("toast-title"));
        assert toasts.size() > 0 : "There was no toast :(";
        assert toasts.get(0).getText().equals("The request has been successfully deleted");
        System.out.println("Toast was raised");

        Thread.sleep(500);
        assert driver.findElement(By.className("datagrid-placeholder-image")).isDisplayed() : "KYC was not deleted.  Test expected table to be empty";
        System.out.println("Delete confirmed");

        Thread.sleep(500);
        assert DatabaseHelper.isUserInKYCTable(email[0]) == false : "Investor should have been deleted from the DB";
        System.out.println("User not now in KYC DB");
    }


    @Test
    @Ignore
    public void TG2987_shouldAssertPopUpAppearsAfterSelectingDeleteKYC()throws InterruptedException, SQLException {
        System.out.println("done as part of TG2987_shouldAssertKYCIsRemovedFromListWhenDeleted");
    }

    @Test
    public void TG2988_shouldAssertKYCIsNotDeletedIfCancelIsSelected()throws InterruptedException, SQLException {
        try {
            String managementCompEntered = "Management Company";
            String companyName = "Jordan Corporation";
            String phoneNo = "07956701992";
            String firstName = "Jordan";
            String lastName = "Miller";
            String AMUsername = "am";
            String AMPassword = "alex01";
            String INVPassword = "asdASD123";

            String[] email = generateRandomEmail();

            loginAndVerifySuccess(AMUsername, AMPassword);
            waitForHomePageToLoad();
            navigateToInviteInvestorPage();
            investorInviteOption(email[0], firstName, lastName, "ClientRef", "Institutional Investor");
            logout();
            newInvestorSignUp(email[0], INVPassword);
            KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);
            KYCProcessStep1Alternate(managementCompEntered, "No", "False", "");

            System.out.println("Cancelling KYC");
            getKYCCancelButton().click();

            Thread.sleep(250);
            assert driver.findElement(By.cssSelector("#status_cell_0 > span")).getText().equals("Draft") : "Draft KYC not found";
            assert driver.findElement(By.cssSelector("#draft_delete_btn_0")).isEnabled() : "Delete button not present";

            assert DatabaseHelper.isUserInKYCTable(email[0]) == true : "Investor should be in the DB";
            System.out.println("User is in KYC DB");

            driver.findElement(By.cssSelector("#draft_delete_btn_0")).click();

            Thread.sleep(500);
            assert driver.findElement(By.className("jaspero__dialog-title")).getText().equals("Delete Request");
            System.out.println("Delete popup presented");

            WebElement cancelButton = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[1]"));
            assert cancelButton.getText().equals("Cancel") : "Cancel button text incorrect";
            cancelButton.click();
            System.out.println("Delete clicked");

            Thread.sleep(500);
            assert driver.findElement(By.cssSelector("#draft_delete_btn_0")).isEnabled() : "Delete button not present";
            System.out.println("Draft was not deleted");

            Thread.sleep(500);
            assert DatabaseHelper.isUserInKYCTable(email[0]) == true : "Investor should be in the DB";
            System.out.println("User is still in KYC DB");

        }catch (Exception e){
            fail("Not yet implemented");
        }

    }

    @Test
    @Ignore
    public void TG2988_shouldAssertSuccessToasterOnKYCDeletionSuccess ()throws InterruptedException, SQLException {
        System.out.println("done in TG2987_shouldAssertKYCIsRemovedFromListWhenDeleted");
    }


}

