package com.setl.openCSDClarityTests.UI.Iznes2KYCModule;

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

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.openDropdownAndSelectOption;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
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
    public Timeout globalTimeout = new Timeout(85000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    @Ignore("Needs to be revisited in the future")
    public void shouldFillKYCAndGrantFundAccess() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops005@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops005@setl.io", "FundFlow", "Testing");
        fillKYCLowerFields("JORDAN Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("yes");
        logout();

        //Login as AM and accept KYC
        loginAndVerifySuccess("am", "alex01");
        navigateToKYCPage();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"Waiting-Expandable-KYC\"]/i")).click();

        wait.until(visibilityOfElementLocated(By.id("Waiting-Status-KYC-0")));
        driver.findElement(By.xpath("//*[@id=\"Waiting-Status-KYC-0\"]/a")).click();

//        wait.until(visibilityOfElementLocated(By.id("waitingApprovalTab")));
//        String reviewedByColumn = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row//*[text()[contains(.,'FundFlow')]]/parent::clr-dg-cell")).getAttribute("id");
//        System.out.println(reviewedByColumn);
//        int clientRowNo = Integer.parseInt(reviewedByColumn.replaceAll("[\\D]", ""));
//        System.out.println(clientRowNo);
//        driver.findElement(By.id("AllClients-Status-KYC-" + clientRowNo)).click();
//        wait.until(visibilityOfElementLocated(By.id("clr-tab-content-0")));
        driver.findElement(By.id("checkbox")).click();

        try{
            wait.until(elementToBeClickable(By.id("submitButton")));
            driver.findElement(By.id("submitButton")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        wait.until(visibilityOfElementLocated(By.id("am-fund-holdings-tab")));
//        scrollElementIntoViewByXpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[1]");
//        wait.until(visibilityOfAllElementsLocatedBy(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[1]")));
//        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[1]")));
//        String isin = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/div/div[3]/form/div[1]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[3]")).getAttribute("value");
//        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/div/div[3]/form/div[1]/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]/div/label")).click();
//        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")));
//        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")).click();
//        try{
//            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
//            String confirmAccessTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
//            assertTrue(confirmAccessTitle.equals("Confirm Fund Share Access:"));
//        }catch (Exception e){
//            fail(e.getMessage());
//        }
//
//        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
//
//        try {
//            String permissionToaster = driver.findElement(By.className("toast-title")).getText();
//            assertTrue(permissionToaster.equals("Share Permissions Saved"));
//        } catch (Exception e) {
//            fail(e.getMessage());
//        }

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
    public void shouldShowKYCLandingPageOnFirstLoginAsInvestor() throws IOException, InterruptedException, SQLException {
        String userNo = "003";
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");

        String kycEmail = driver.findElement(By.id("kyc_additionnal_email")).getAttribute("value");
        assertTrue(kycEmail.equals("testops" + userNo + "@setl.io"));
        String kycInvitedBy = driver.findElement(By.id("kyc_additionnal_invitedBy")).getAttribute("value");
        assertTrue(kycInvitedBy.equals("Management Company"));
        String kycFirstName = driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value");
        assertTrue(kycFirstName.equals("Jordan" + userNo));
        String kycLastName = driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value");
        assertTrue(kycLastName.equals("Miller" + userNo));

        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys("Jordan Corp");
        openDropdownAndSelectOption("kyc_additionnal_phoneCode", 1);

        String disabled = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
        assertTrue(disabled.equals("true"));
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07956701992");
        driver.findElement(By.id("btnKycSubmit")).click();

        try {
            String header2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(header2.equals("My Information"));
        }catch (Exception e){
            fail(e.getMessage());}

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")));
        String myRequests = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText();
        assertTrue(myRequests.equals("My requests"));
        driver.findElement(By.id("kyc-newRequestBtn")).click();
        String newRequests = driver.findElement(By.id("new-request-title")).getText();
        assertTrue(newRequests.equals("Make a new request"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")).sendKeys("Management Company");
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/ul/li[1]/div/a")).click();

        try {
            String selectionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[1]/div/div[1]")).getAttribute("class");
            assertTrue(selectionStepKYC.equals("fs-active"));
        }catch (Exception e){
            fail(e.getMessage());}

        js.executeScript("document.getElementById('registered_1').click();");

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[2]")).click();
     }

    @Test
    public void shouldCompleteFullKYCProcess() throws IOException, InterruptedException, SQLException {
        String userNo = "006";
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");

        String kycEmail = driver.findElement(By.id("kyc_additionnal_email")).getAttribute("value");
        assertTrue(kycEmail.equals("testops" + userNo + "@setl.io"));
        String kycInvitedBy = driver.findElement(By.id("kyc_additionnal_invitedBy")).getAttribute("value");
        assertTrue(kycInvitedBy.equals("Management Company"));
        String kycFirstName = driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value");
        assertTrue(kycFirstName.equals("Jordan" + userNo));
        String kycLastName = driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value");
        assertTrue(kycLastName.equals("Miller" + userNo));
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys("Jordan Corp");
        openDropdownAndSelectOption("kyc_additionnal_phoneCode", 1);
        String disabled = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
        assertTrue(disabled.equals("true"));
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07956701992");
        driver.findElement(By.id("btnKycSubmit")).click();

        try {
            String header2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(header2.equals("My Information"));
        }catch (Exception e){fail(e.getMessage());}

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")));
        String myRequests = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText();
        assertTrue(myRequests.equals("My requests"));
        driver.findElement(By.id("kyc-newRequestBtn")).click();
        String newRequests = driver.findElement(By.id("new-request-title")).getText();
        assertTrue(newRequests.equals("Make a new request"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")).sendKeys("Management Company");
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/ul/li[1]/div/a")).click();

        try {
            String selectionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[1]/div/div[1]")).getAttribute("class");
            assertTrue(selectionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[2]/kyc-step-introduction")));
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e){fail(e.getMessage());}
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[3]/kyc-step-identification/h3")));
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[2]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}

        String generalInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(generalInfoPercent.equals("0%"));
        String companyInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(companyInfoPercent.equals("0%"));
        String bankingInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(bankingInfoPercent.equals("0%"));

        KYCProcessStep3GeneralInfoComplete();
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete();

        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e){fail(e.getMessage());}
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[4]/kyc-step-risk-profile/h3")));
        String subHeadingStep4 = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[4]/kyc-step-risk-profile/h3")).getText();
        assertTrue(subHeadingStep4.equals(" RISK PROFILE DEFINITION"));

        /////////////////////////////////////////////////////////////////////////////

        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("withAdviceOfAuthorisedThirdPartyInstitution")));
        String investmentsNaturePercent = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(investmentsNaturePercent.equals("0%"));
        driver.findElement(By.id("withAdviceOfAuthorisedThirdPartyInstitution")).click();
        driver.findElement(By.id("Weekly")).click();
        driver.findElement(By.id("MoneymarketsecuritiesTreasury")).click();
        String investmentsNaturePercentPost = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(investmentsNaturePercentPost.equals("100%"));
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
        assertTrue(percent9.equals("100%"));
        String percentBarColourPost = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div")).getCssValue("background-color");
        assertTrue(percentBarColourPost.equals("rgba(102, 187, 106, 1)"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("registeredCompanyName")));
    }

    public static void KYCProcessStep3CompanyInfoComplete() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("activities")));

        String percent0 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent0);
        assertTrue(percent0.equals("0%"));

        searchSelectTopOptionXpath("Own-account investor", "//*[@id=\"activities\"]/div", "//*[@id=\"activities\"]/div/div[3]/div/input", "//*[@id=\"activities\"]/div/div[3]/ul/li[1]/div/a");


        String percent1 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent1);
        assertTrue(percent1.equals("6%"));

        searchSelectTopOptionXpath("European union", "//*[@id=\"geographicalAreaOfActivity\"]/div", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/div/input", "//*[@id=\"geographicalAreaOfActivity\"]/div/div[3]/ul/li[1]/div/a");

        String percent2 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent2);
        assertTrue(percent2.equals("11%"));

        searchSelectTopOptionXpath("Embassies and Consulates", "//*[@id=\"ownAccountinvestor\"]/div", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/div/input", "//*[@id=\"ownAccountinvestor\"]/div/div[3]/ul/li[1]/div/a");

        String percent3 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent3);
        assertTrue(percent3.equals("17%"));

        driver.findElement(By.id("balanceSheetTotal")).sendKeys("9");

        String percent4 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent4);
        assertTrue(percent4.equals("22%"));

        driver.findElement(By.id("netRevenuesNetIncome")).sendKeys("9");

        String percent5 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent5);
        assertTrue(percent5.equals("28%"));

        driver.findElement(By.id("shareholderEquity")).sendKeys("9");

        String percent6 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent6);
        assertTrue(percent6.equals("33%"));

        driver.findElement(By.id("firstName")).sendKeys("Jordan");

        String percent7 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent7);
        assertTrue(percent7.equals("39%"));

        driver.findElement(By.id("lastName")).sendKeys("Miller");

        String percent8 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent8);
        assertTrue(percent8.equals("44%"));

        driver.findElement(By.id("address")).sendKeys("159 Connextions");

        String percent9 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent9);
        assertTrue(percent9.equals("50%"));

        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/company-information/form/div[2]/div/div[7]/div[2]/button");

        searchSelectTopOptionXpath("Jordan", "//*[@id=\"nationality\"]/div", "//*[@id=\"nationality\"]/div/div[3]/div/input", "//*[@id=\"nationality\"]/div/div[3]/ul/li[1]/div/a");

        String percent10 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent10);
        assertTrue(percent10.equals("56%"));

        searchSelectTopOptionXpath("Jordan", "//*[@id=\"countryOfBirth-0\"]/div", "//*[@id=\"countryOfBirth-0\"]/div/div[3]/div/input", "//*[@id=\"countryOfBirth-0\"]/div/div[3]/ul/li[1]/div/a");


        String percent11 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent11);
        assertTrue(percent11.equals("61%"));

        driver.findElement(By.id("cityOfBirth-0")).sendKeys("Ipswich");

        String percent12 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent12);
        assertTrue(percent12.equals("67%"));

        driver.findElement(By.id("dateOfBirth-0")).sendKeys("1997-11-19");

        String percent13 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent13);
        assertTrue(percent13.equals("72%"));

        driver.findElement(By.id("holdingPercentage")).sendKeys("19");

        String percent14 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent14);
        assertTrue(percent14.equals("78%"));

        driver.findElement(By.id("generalAssets")).click();

        String percent15 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent15);
        assertTrue(percent15.equals("83%"));

        searchSelectTopOptionXpath("Area", "//*[@id=\"geographicalOrigin1\"]/div", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin1\"]/div/div[3]/ul/li[1]/div/a");

        String percent16 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent16);
        assertTrue(percent16.equals("84%"));

        searchSelectTopOptionXpath("European union", "//*[@id=\"geographicalOrigin2\"]/div", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/div/input", "//*[@id=\"geographicalOrigin2\"]/div/div[3]/ul/li[1]/div/a");

        String percent17 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent17);
        assertTrue(percent17.equals("89%"));

        searchSelectTopOptionXpath("0 to 50 million €", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/div/input", "//*[@id=\"totalFinancialAssetsAlreadyInvested\"]/div/div[3]/ul/li[1]/div/a");

        String percent18 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent18);
        assertTrue(percent18.equals("95%"));

        scrollElementIntoViewByXpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2");
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[1]/a/h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("activities")));
    }

    public static void KYCProcessStep3BankingInfoComplete() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[1]/a/h2")).click();
        wait.until(visibilityOfElementLocated(By.id("custodianHolderAccount")));

        String percent0 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent0);
        assertTrue(percent0.equals("0%"));

        searchSelectTopOptionXpath("Banco de Oro Unibank", "//*[@id=\"custodianHolderAccount\"]/div", "//*[@id=\"custodianHolderAccount\"]/div/div[3]/div/input", "//*[@id=\"custodianHolderAccount\"]/div/div[3]/ul/li[1]/div/a");

        String percent1 = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println(percent1);
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

