package com.setl.openCSDClarityTests.UI.KYCModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.password;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleAcceptanceTest {

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

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
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldInviteInvestorsFromTopbarNavigation() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.id("dropdown-user")).click();
        try {
            driver.findElement(By.id("top-menu-invite-investors")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    @Test
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
    public void shouldInviteAnInvestorAndReceiveEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("testops081@setl.io", "Jordan", "Miller", "Success!");
    }

    @Test
    @Ignore("Currently given a toaster, plans to change to a modal")
    public void shouldNotInviteAnInvestorIfUsedEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("testops081@setl.io", "Jordan", "Miller", "Failed!");
    }

    @Test
    public void shouldInviteAnInvestorAndInvestorCanLogin() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("testops080@setl.io", "TestUser", "One", "Success!");
    }

    @Test
    public void shouldInviteAnInvestorWithoutFirstname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("testops082@setl.io", "", "Miller", "Success!");
    }

    @Test
    public void shouldInviteAnInvestorWithoutLastname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("testops083@setl.io", "Jordan", "", "Success!");
    }

    @Test
    public void shouldNotInviteAnInvestorWithoutEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestorExpectingFailed("", "Jordan", "Miller");
    }

    @Test
    public void shouldShowKYCLandingPageOnFirstLoginAsInvestor() throws IOException, InterruptedException{
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        //assert title equals Welcome To Iznes
        //assert subtitle equals Lets start with KYC
    }

    @Test
    public void shouldNotAllowSaveWithoutCompanyName() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        String header = driver.findElement(By.id("ofi-welcome-additionnal")).getText();
        assertTrue(header.equals("Welcome to IZNES"));
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("", "07956701992");
        verifySaveButtonIsDisabled();
    }

    @Test
    public void shouldNotAllowSaveWithoutWorkPhoneNumber() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        String header = driver.findElement(By.id("ofi-welcome-additionnal")).getText();
        assertTrue(header.equals("Welcome to IZNES"));
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "");
        verifySaveButtonIsDisabled();
    }

    @Test
    public void shouldAllowSaveWithCompanyNameAndWorkPhoneNumber() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        String header = driver.findElement(By.id("ofi-welcome-additionnal")).getText();
        assertTrue(header.equals("Welcome to IZNES"));
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
    }

    @Test
    public void shouldDisplayPopupMyInformationWhenKYCSaved() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops002@setl.io", "asdasd", "additionnal");
    }

    @Test
    public void shouldDisplayPopupConfirmationScreenIfCaseNO() throws IOException, InterruptedException {
        loginKYCConfirmationScreen("testops001@setl.io", "asdasd");
        //fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        //fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        //saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("no");
        selectOptionNoValidatePopup();
    }

    @Test
    public void shouldNotBeAskedToEnterKycAfterFillingItOutOnce() throws IOException, InterruptedException {
        //loginAndVerifySuccessKYC("testops002@setl.io", "alex01");
        //fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        //fillKYCLowerFields("SETL Developments Ltd", "07956701992");
        //saveKYCAndVerifySuccessPageOne();
        //selectOptionAndSubmitKYC("no");
        //logout();
        loginCompleteKYC("testops001@setl.io", "asdasd");
    }

    @Test
    public void shouldReceiveActionMessageFromInvestorIfCaseNO() throws IOException, InterruptedException {
//        loginAndVerifySuccessKYC("testops002@setl.io", "alex01");
//        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
//        fillKYCLowerFields("SETL Developments Ltd", "07956701992");
//        saveKYCAndVerifySuccessPageOne();
//        selectOptionAndSubmitKYC("no");
//        logout();
        loginAndVerifySuccess("am", "alex01");
        try {
            driver.findElement(By.id("top-menu-kyc-documents")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")).click();
        //assert kyc is awaiting approval
    }

    @Test
    public void shouldTakeInvestorToAwaitingPageIfCaseYES() throws IOException, InterruptedException {
        loginAndVerifySuccessKYC("testops003@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
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

    public static void selectOptionAndSubmitKYC(String option) throws IOException, InterruptedException{
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
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys(companyName);
        driver.findElement(By.id("kyc_additionnal_phoneCode")).click();
        WebElement phoneCode = driver.findElement(By.xpath("//*[@id=\"kyc_additionnal_phoneCode\"]/div/div[3]/ul/li[1]/div/a"));
        wait.until(elementToBeClickable(phoneCode));
        wait.until(visibilityOf(phoneCode));
        try {
            phoneCode.click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(phoneNumber);
    }

    public static void saveKYCAndVerifySuccessPageOne() throws IOException, InterruptedException{
        driver.findElement(By.id("btnKycSubmit")).click();
        String header2 = driver.findElement(By.className("modal-title")).getText();
        assertTrue(header2.equals("MY INFORMATION"));
        try{
            driver.findElement(By.id("addInfo-ok-button")).click();
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

