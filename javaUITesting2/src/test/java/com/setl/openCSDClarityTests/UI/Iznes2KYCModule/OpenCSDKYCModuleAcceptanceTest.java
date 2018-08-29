package com.setl.openCSDClarityTests.UI.Iznes2KYCModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.openDropdownAndSelectOption;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleAcceptanceTest {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

    JavascriptExecutor jse = (JavascriptExecutor)driver;


    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(95000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteInvestorsFromTopbarNavigation() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops096@setl.io", "Jordan", "Miller", "Success!");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldEnterKYCInformationOnFirstLoginAsProfessionalInvestor() throws IOException, InterruptedException{
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToAddUser();
        String[] userDetails = generateRandomUserDetails();
        String newUserName = userDetails[0];
        enterAllUserDetails(newUserName, password);
        logout();
        loginAndVerifySuccessAdmin(newUserName, password);
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorAndReceiveEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops081@setl.io", "Jordan", "Miller", "Success!");
    }

    @Test
    @Ignore("Currently given a toaster, plans to change to a modal")
    public void shouldNotInviteAnInvestorIfUsedEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops081@setl.io", "Jordan", "Miller", "Failed!");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorAndInvestorCanLogin() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops096@setl.io", "TestUser", "One", "Success!");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorWithoutFirstname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops081@setl.io", "", "Miller", "Success!");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldInviteAnInvestorWithoutLastname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("testops083@setl.io", "Jordan", "", "Success!");
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldNotInviteAnInvestorWithoutEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestorExpectingFailed("", "Jordan", "Miller");
    }

    @Test
    public void shouldChangeKYCProcessIfAlreadyRegistered() throws IOException, InterruptedException, SQLException {
        String userNo = "001";
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "Yes", "False", "");
     }

    @Test
    public void shouldCreateKYCRequest() throws IOException, InterruptedException, SQLException {
        String userNo = "002";
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete();
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete();
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6("Jordan Miller", "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "No", "", "");
    }

    @Test
    public void shouldCreateKYCRequestWith2AMs() throws IOException, InterruptedException, SQLException {
        String userNo = "003";
        String managementCompEntered = "Management Company";
        String managementComp2Entered = "am2";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "True", managementComp2Entered);
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete();
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete();
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6("Jordan Miller", "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "Yes", "am2", "Waiting approval");
    }

    @Test
    public void shouldSetKYCStatusToDraftIfClosed() throws IOException, InterruptedException, SQLException {
        String userNo = "004";
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String phoneNo = "07956701992";

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessClose();
        KYCProcessRequestListValidation("No","Success!", managementCompEntered, "Draft", "No", "", "");
    }

    @Test
    public void shouldCompleteFullKYCProcess() throws IOException, InterruptedException, SQLException {
        String No = "2";
        String userNo = "00" + No;
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String firstName = "Jordan";
        String lastName = "Miller";
        String phoneNo = "07956701992";

        DateFormat dateFormat = new SimpleDateFormat("dd / MM / yyyy");
        Date date = new Date();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete();
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete();
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "No", "", "");

        logout();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("top-menu-my-clients");
        navigateToPageByID("top-menu-onboarding-management");
        verifyCorrectPage("On-boarding Management");
        String waitingCompanyName = driver.findElement(By.xpath("//*[@id=\"KYC-grid-CompName-0 \"]/span")).getText();
        assertTrue(waitingCompanyName.equals(companyName));
        System.out.println("Company name matches");
        driver.findElement(By.xpath("//*[@id=\"KYC-grid-CompName-0 \"]/span")).click();
        wait.until(visibilityOfElementLocated(By.id("waitingApprovalTab")));
        String KYCheading = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-waiting-approval/div/h1/span")).getText();
        assertTrue(KYCheading.contains(companyName));
        System.out.println("KYC Heading contains the company name");

        String generalInfoCompanyName = driver.findElement(By.id("companyName")).getAttribute("value");
        assertTrue(generalInfoCompanyName.equals(companyName));
        String generalInfoReference = driver.findElement(By.id("clientReference")).getAttribute("value");
        assertTrue(generalInfoReference.equals(No));
        String generalInfoFirstName = driver.findElement(By.id("firstName")).getAttribute("value");
        assertTrue(generalInfoFirstName.equals(firstName + userNo));
        String generalInfoLastName = driver.findElement(By.id("lastName")).getAttribute("value");
        assertTrue(generalInfoLastName.equals(lastName + userNo));
        String generalInfoEmail = driver.findElement(By.id("email")).getAttribute("value");
        assertTrue(generalInfoEmail.equals("testops" + userNo + "@setl.io"));
        String generalInfoDate = driver.findElement(By.id("approvalDateRequest")).getAttribute("value");
        assertTrue(generalInfoDate.equals(dateFormat.format(date)));
        String generalInfoPhone = driver.findElement(By.id("phoneNumber")).getAttribute("value");
        assertTrue(generalInfoPhone.equals("+7 840 " + phoneNo));

        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-10\"]/div[1]/div[2]/div[1]/div/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("clientReference")));
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldNotAllowSaveWithoutWorkPhoneNumber() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "");
        verifySaveButtonIsDisabled();
    }

    @Test
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldAllowSaveWithCompanyNameAndWorkPhoneNumber() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
    }

    @Test
    @Ignore
    public void shouldDisplayPopupMyInformationWhenKYCSaved() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops002@setl.io", "asdasd", "additionnal");
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
    public void shouldReceiveActionMessageFromInvestorIfCaseNO() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            wait.until(visibilityOfElementLocated(By.id("top-menu-kyc-documents")));
            wait.until(elementToBeClickable(By.id("top-menu-kyc-documents")));
            WebElement documents = driver.findElement(By.id("top-menu-kyc-documents"));
            documents.click();
        }catch (Exception e){
            fail(e.getMessage());
        }
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

    @Test
    public void shouldReceiveActionMessageFromInvestorIfCaseYES() throws IOException, InterruptedException {
        //loginAndVerifySuccessKYC("testops001@setl.io", "alex01");
    }

    @Test
    public void shouldAllowInvestorToGoBackToPreviousKYCStep() throws IOException, InterruptedException {
        //loginAndVerifySuccessKYC("testops001@setl.io", "alex01");
    }

    @Test
    public void shouldTakeAMToFundAuthPageAfterAcceptingKYC() throws IOException, InterruptedException {

    }

    public static void searchSelectTopOptionXpath(String value, String openDropdownXpath, String inputDropdownXpath, String clickTopOptionXpath) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath(openDropdownXpath)).click();
        wait.until(visibilityOfElementLocated(By.xpath(inputDropdownXpath)));
        driver.findElement(By.xpath(inputDropdownXpath)).sendKeys(value);
        driver.findElement(By.xpath(clickTopOptionXpath)).click();
    }

    public static void KYCProcessStep3GeneralInfoComplete() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        Thread.sleep(750);
        System.out.println("Step 3");

        String identificationTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[3]/kyc-step-identification/h3")).getText();
        assertTrue(identificationTitle.equals("CLIENT'S IDENTIFICATION AS A LEGAL ENTITY"));
        String generalInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(generalInfoPercent.equals("0%"));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("registeredCompanyName")));
        driver.findElement(By.id("registeredCompanyName")).sendKeys("Jordan Millers Company");
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
        driver.findElement(By.xpath("//*[@id=\"leiCode\"]")).sendKeys("16612312312312312312");
        String percent5 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent5.equals("60%"));
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input", "//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/ul/li[1]/div/a");
        String percent6 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent6.equals("70%"));
        searchSelectTopOptionXpath("Cosmetics", "//*[@id=\"sectorActivity\"]/div", "//*[@id=\"sectorActivity\"]/div/div[3]/div/input", "//*[@id=\"sectorActivity\"]/div/div[3]/ul/li[1]/div/a");
        String percent7 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent7.equals("80%"));
        searchSelectTopOptionXpath("Pension fund/mutual insurance institution", "//*[@id=\"legalStatusList\"]/div", "//*[@id=\"legalStatusList\"]/div/div[3]/div/input", "//*[@id=\"legalStatusList\"]/div/div[3]/ul/li[1]/div/a");
        String percent8 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent8.equals("90%"));
        String percentBarColourPre = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPre.equals("rgba(255, 183, 77, 1)"));
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"countryTaxResidence\"]/div", "//*[@id=\"countryTaxResidence\"]/div/div[3]/div/input", "//*[@id=\"countryTaxResidence\"]/div/div[3]/ul/li[1]/div/a");
        String percent9 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("General Info : " + percent9);
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

        ///////


        //////

        String percent0 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent0.equals("0%"));
        searchSelectTopOptionXpath("Own-account investor", "//*[@id=\"activities\"]/div", "//*[@id=\"activities\"]/div/div[3]/div/input", "//*[@id=\"activities\"]/div/div[3]/ul/li[1]/div/a");
        String percent1 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent1.equals("6%"));
        searchSelectTopOptionXpath("European union", "//*[@id=\"geographicalAreaOfActivity\"]/div", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/div/input", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/ul/li[1]/div/a");
        String percent2 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent2.equals("12%"));
        searchSelectTopOptionXpath("Embassies and Consulates", "//*[@id=\"ownAccountinvestor\"]/div", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/div/input", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/ul/li[1]/div/a");
        String percent3 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent3.equals("18%"));
        driver.findElement(By.id("balanceSheetTotal")).sendKeys("9");
        String percent4 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent4.equals("24%"));
        driver.findElement(By.id("netRevenuesNetIncome")).sendKeys("9");
        String percent5 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent5.equals("29%"));
        driver.findElement(By.id("shareholderEquity")).sendKeys("9");
        String percent6 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent6.equals("35%"));
        driver.findElement(By.id("firstName")).sendKeys("Jordan");
        String percent7 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent7.equals("41%"));
        driver.findElement(By.id("lastName")).sendKeys("Miller");
        String percent8 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent8.equals("47%"));
        driver.findElement(By.id("address")).sendKeys("159 Connextions");
        String percent9 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent9.equals("53%"));
        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/company-information/form/div[2]/div/div[7]/div[2]/button");
        Thread.sleep(1000);
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"nationality\"]/div", "//*[@id=\"nationality\"]/div/div[3]/div/input", "//*[@id=\"nationality\"]/div/div[3]/ul/li[1]/div/a");
        String percent10 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent10.equals("59%"));
        searchSelectTopOptionXpath("Jordan", "//*[@id=\"countryOfBirth-0\"]/div", "//*[@id=\"countryOfBirth-0\"]/div/div[3]/div/input", "//*[@id=\"countryOfBirth-0\"]/div/div[3]/ul/li[1]/div/a");
        String percent11 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent11.equals("65%"));
        driver.findElement(By.id("cityOfBirth-0")).sendKeys("Ipswich");
        String percent12 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent12.equals("71%"));
        driver.findElement(By.id("dateOfBirth-0")).sendKeys("1997-11-19");
        String percent13 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent13.equals("76%"));
        driver.findElement(By.id("holdingPercentage")).sendKeys("19");
        String percent14 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent14.equals("82%"));
        driver.findElement(By.id("generalAssets")).click();
        String percent15 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent15.equals("88%"));
        searchSelectTopOptionXpath("Area", "//*[@id=\"geographicalOrigin1\"]/div", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/ul/li[1]/div/a");
        String percent16 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent16.equals("89%"));
        searchSelectTopOptionXpath("European union", "//*[@id=\"geographicalOrigin2\"]/div", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/ul/li[1]/div/a");
        String percent17 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent17.equals("94%"));
        searchSelectTopOptionXpath("0 to 50 million €", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/div/input", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/ul/li[1]/div/a");

        String percent18 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Company Info : " + percent18);
        assertTrue(percent18.equals("100%"));

        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("activities")));
    }

    public static void KYCProcessStep3BankingInfoComplete() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String bankingInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(bankingInfoPercent.equals("0%"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("custodianHolderAccount")));

        String percent0 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(percent0.equals("0%"));
        searchSelectTopOptionXpath("Banco de Oro Unibank", "//*[@id=\"custodianHolderAccount\"]/div", "//*[@id=\"custodianHolderAccount\"]/div/div[3]/div/input", "//*[@id=\"custodianHolderAccount\"]/div/div[3]/ul/li[1]/div/a");

        String percent1 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Banking Info : " + percent1);
        assertTrue(percent1.equals("100%"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("activities")));
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
}

