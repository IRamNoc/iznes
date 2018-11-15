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
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleAcceptanceTest {

    JavascriptExecutor jse = (JavascriptExecutor)driver;

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(130000);
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
        KYCProcessStep3ClassificationInfoComplete();
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
        KYCProcessStep3ClassificationInfoComplete();
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
        KYCProcessStep3ClassificationInfoComplete();
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
        KYCProcessStep3ClassificationInfoComplete();
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
        KYCProcessStep3ClassificationInfoComplete();
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
        KYCProcessStep3ClassificationInfoComplete();
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
        System.out.println(jaspTitle);
        assertTrue(jaspTitle.equals("Confirm Fund Share Access"));

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

        dropdownSelect("xpath", "//*[@id=\"new-user-account-select\"]", "Company");
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
        String generalInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        String lei = generateRandomLEI();


        assertTrue(identificationTitle.equals("Client's Identification as a Legal Entity"));
        assertTrue(generalInfoPercent.equals("0%"));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("registeredCompanyName")));
        driver.findElement(By.id("registeredCompanyName")).sendKeys(companyName);

        dropdownSelect("xpath", "//*[@id=\"legalForm\"]", "EARL: Entreprise agricole à responsabilité limitée");
        driver.findElement(By.xpath("//*[@id=\"leiCode\"]")).sendKeys(lei);
        driver.findElement(By.id("registeredCompanyAddressLine1")).sendKeys("21 Something Street");
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[5]/div[1]/input")).sendKeys("IP11EY");
        dropdownSelect("xpath", "//*[@id=\"countryTaxResidence\"]", "Jordan");
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[5]/div[2]/input")).sendKeys("Ipswich");

        String percentBarColourPre = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPre.equals("rgba(255, 183, 77, 1)"));

        dropdownSelect("xpath", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[5]/div[3]/ng-select", "Jordan");

        String percent9 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent9.equals("100%"));

        String percentBarColourPost = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPost.equals("rgba(102, 187, 106, 1)"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("registeredCompanyName")));
    }

    public static void dropdownSelect(String selectorType, String element, String input) throws IOException, InterruptedException{

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        if (selectorType.equals("xpath")){

            String dropdownOpen = element + "/div";
            String topOption = dropdownOpen + "/div[3]/ul/li[1]/div/a";
            String lowOption = dropdownOpen + "/div[3]/ul/li[2]/div/a";

            scrollElementIntoViewByXpath(dropdownOpen);

            driver.findElement(By.xpath(dropdownOpen)).click();

            wait.until(visibilityOfElementLocated(By.xpath(topOption)));

            driver.findElement(By.xpath(dropdownOpen + "/div[3]/div/input")).sendKeys(input);

            wait.until(invisibilityOfElementLocated(By.xpath(lowOption)));

            driver.findElement(By.xpath(topOption)).click();

            wait.until(invisibilityOfElementLocated(By.xpath(topOption)));

        }if (selectorType.equals("id")){

            String createdXpath = "//*[@id='" + element + "']";
            String dropdownOpenID = createdXpath + "/div";
            String topOption = dropdownOpenID + "/div[3]/ul/li[1]/div/a";
            String lowOption = dropdownOpenID + "/div[3]/ul/li[2]/div/a";

            //scrollElementIntoViewById(dropdownOpenID);

            driver.findElement(By.xpath(dropdownOpenID)).click();

            wait.until(visibilityOfElementLocated(By.xpath(topOption)));

            driver.findElement(By.xpath(dropdownOpenID + "/div[3]/div/input")).sendKeys(input);

            wait.until(invisibilityOfElementLocated(By.xpath(lowOption)));

            driver.findElement(By.xpath(topOption)).click();

            wait.until(invisibilityOfElementLocated(By.xpath(topOption)));
        }
    }public static void dropdownSelect2(String selectorType, String element, String input) throws IOException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        if (selectorType.equals("xpath")) {

            String dropdownOpen = element + "/div";
            String topOption = dropdownOpen + "/div[2]/ul/li[1]/div/a";
            String lowOption = dropdownOpen + "/div[2]/ul/li[2]/div/a";

            scrollElementIntoViewByXpath(dropdownOpen);

            driver.findElement(By.xpath(dropdownOpen)).click();

            wait.until(visibilityOfElementLocated(By.xpath(topOption)));

            driver.findElement(By.xpath(dropdownOpen + "/div[2]/div/input")).sendKeys(input);

            wait.until(invisibilityOfElementLocated(By.xpath(lowOption)));

            driver.findElement(By.xpath(topOption)).click();

            wait.until(invisibilityOfElementLocated(By.xpath(topOption)));

        }
    }

    public static void sendKeys(String selectorType, String element, String input) throws IOException, InterruptedException{

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        if (selectorType.equals("xpath")){

            scrollElementIntoViewByXpath(element);

            wait.until(visibilityOfElementLocated(By.xpath(element)));

            driver.findElement(By.xpath(element)).clear();
            Thread.sleep(250);
            driver.findElement(By.xpath(element)).sendKeys(input);

        }if (selectorType.equals("id")){

            scrollElementIntoViewById(element);

            wait.until(visibilityOfElementLocated(By.id(element)));

            driver.findElement(By.id(element)).clear();
            Thread.sleep(250);
            driver.findElement(By.id(element)).sendKeys(input);
        }
    }

    public static void click(String selectorType, String element) throws IOException, InterruptedException{

        if (selectorType.equals("xpath")){

            scrollElementIntoViewByXpath(element);

            driver.findElement(By.xpath(element)).click();
            Thread.sleep(250);

        }if (selectorType.equals("id")){

            scrollElementIntoViewById(element);

            driver.findElement(By.id(element)).click();
            Thread.sleep(250);
        }
    }

    public static void expandableForms(String openOrClose, String selectorType, String element) throws IOException, InterruptedException{

        if (selectorType.equals("xpath")){

            scrollElementIntoViewByXpath(element);

            if (openOrClose.equals("open")){
                driver.findElement(By.xpath(element)).click();
                Thread.sleep(500);
            }
        }
    }


    public static void KYCProcessStep3CompanyInfoComplete() throws IOException, InterruptedException{

        String companyInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(companyInfoPercent.equals("0%"));

        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2");

        dropdownSelect("xpath", "//*[@id=\"sectorActivity\"]", "Consumer Electronics");
        dropdownSelect("xpath", "//*[@id=\"geographicalAreaOfActivity\"]", "OECD outside the European Union");
        dropdownSelect("xpath", "//*[@id=\"activities\"]", "Own-account");
        dropdownSelect("xpath", "//*[@id=\"ownAccountinvestor\"]", "Embassies and Consulates");

        sendKeys("id", "geographicalAreaOfActivitySpecification", "Specified");
        sendKeys("id", "balanceSheetTotal", "9");
        sendKeys("id", "netRevenuesNetIncome", "9");
        sendKeys("id", "shareholderEquity", "9");

        dropdownSelect("id", "geographicalOrigin1", "Country");
        dropdownSelect("id", "geographicalOrigin2", "Jordan");
        dropdownSelect("id", "totalFinancialAssetsAlreadyInvested", "0 to 50 million €");

        click("id","premiumsAndContributions" );

        dropdownSelect("xpath", "//*[@id=\"beneficiaryType\"]", "Legal person");

        sendKeys("id", "legalName-benef-0", "Jordan Corparation Ltd");
        sendKeys("id", "leiCode-benef-0", generateRandomLEI());
        sendKeys("id", "address-benef-0", "159 Connextions");
        sendKeys("id", "zipCode-benef-0", "IP11QJ");
        sendKeys("id", "city-benef-0", "Ipswich");

        dropdownSelect("xpath", "//*[@id=\"country-benef-0\"]", "Jordan");
        dropdownSelect("xpath", "//*[@id=\"nationalIdNumber-benef-0\"]", "SIRET");

        sendKeys("xpath", "//*[@id=\"step-identification\"]/company-information/form/div[2]/div/div[11]/div[2]/beneficiary/div/div[2]/div[5]/div[2]/input", "12312341231232");
        sendKeys("id", "holdingPercentage-benef-0", "12");

        dropdownSelect("xpath", "//*[@id=\"holdingType-benef-0\"]", "Indirect holding");

        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2");
    }

    public static void KYCProcessStep3BankingInfoComplete(String companyName, String iBan) throws IOException, InterruptedException{

        Thread.sleep(500);

        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2");

        String companyNameRead = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[2]/div/div[1]/div/input")).getAttribute("value");
        assertTrue(companyNameRead.equals(companyName));

        sendKeys("id", "establishmentName-0", "Establishment Name");
        sendKeys("id", "iban-0", iBan);
        sendKeys("id", "bic-0", "asdfGAaaXXX");
        sendKeys("id", "establishmentAddress0", "159 Connextions");
        sendKeys("id", "zipCode-0", "IP1 1QJ");
        sendKeys("id", "city-0", "Ipswich");

        dropdownSelect("xpath", "//*[@id=\"country0\"]", "Jordan");

        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2");
    }

    public static void KYCProcessStep3ClassificationInfoComplete() throws IOException, InterruptedException{

        Thread.sleep(500);
        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/classification-information/div/div[1]/div[1]/a/h2");

        sendKeys("id", "firstName", "Jordan");
        sendKeys("id", "lastName", "Miller");
        sendKeys("id", "jobPosition", "Intern");
        sendKeys("id", "numberYearsExperienceRelatedFunction", "9");
        sendKeys("id", "numberYearsCurrentPosition", "9");

        dropdownSelect2("xpath", "//*[@id=\"financialInstruments\"]", "Money Market Securities");
        dropdownSelect2("xpath", "//*[@id=\"marketArea\"]", "OECD outside the European Union");
        dropdownSelect("xpath", "//*[@id=\"natureTransactionPerYear\"]", "0 to 1 000 €");
        dropdownSelect("xpath", "//*[@id=\"volumeTransactionPerYear\"]", "1 to 10 transactions");

        expandableForms("open", "xpath", "//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2");

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

            Thread.sleep(500);

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

        Thread.sleep(500);

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

