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
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfAllElementsLocatedBy;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


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
    public Timeout globalTimeout = new Timeout(45000);
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

//        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys("JordanCompany");
//        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07956701992");
//        try {
//            driver.findElement(By.id("btnKycSubmit")).click();
//        }catch (Exception e){
//            fail("FAILED : " +e.getMessage());
//        }
//        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
//        WebElement KYCPopups = wait.until(elementToBeClickable(By.id("addInfo-ok-button")));
//        WebElement KYCPopup = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-my-informations/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3"));
//        assertTrue(KYCPopup.getText().equals("MY INFORMATION"));
//        KYCPopups.click();
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
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldShowKYCLandingPageOnFirstLoginAsInvestor() throws IOException, InterruptedException{
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
     }

    @Test
    @Ignore("waiting for id to be added")
    public void shouldNotAllowSaveWithoutCompanyName() throws IOException, InterruptedException, SQLException {
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
        }catch (Exception e){
            fail(e.getMessage());
        }

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
            fail(e.getMessage());
        }

        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.getElementById('registered_1').click();");



        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[2]")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[2]/kyc-step-introduction")));
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[2]")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[3]/kyc-step-identification/h3")));
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[2]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){
            fail(e.getMessage());
        }

        String generalInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(generalInfoPercent.equals("0%"));
        String companyInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/company-information/form/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(companyInfoPercent.equals("0%"));
        String bankingInfoPercent = driver.findElement(By.xpath("//*[@id=\"step-identification\"]/banking-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(bankingInfoPercent.equals("0%"));

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[1]/a/h2")).click();

        wait.until(visibilityOfElementLocated(By.id("registeredCompanyName")));

        driver.findElement(By.id("registeredCompanyName")).sendKeys("Jordan Millers Company");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("10%");

        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/div/input")).sendKeys("EARL : Entreprise agricole à responsabilité limitée");
        driver.findElement(By.xpath("//*[@id=\"legalForm\"]/div/div[3]/ul/li[1]/div/a")).click();

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("20%");

        driver.findElement(By.id("registeredCompanyAddressLine1")).sendKeys("21 Something Street");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("30%");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[1]/input")).sendKeys("IP11EY");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("40%");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[2]/input")).sendKeys("Ipswich");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("50%");

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input")).sendKeys("Jordan");
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/ul/li[1]/div/a")).click();

        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText().equals("60%");

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

    public static void searchSelectTopOptionXpath(String option) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/div/input")).sendKeys("Jordan");
        driver.findElement(By.xpath("//*[@id=\"step-identification\"]/general-information/div/div[2]/div/div[4]/div[3]/ng-select/div/div[3]/ul/li[1]/div/a")).click();
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

