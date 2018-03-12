package com.setl.openCSDClarityTests.UI.General;

import com.setl.UI.common.SETLUtils.Repeat;
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
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.xml.bind.SchemaOutputResolver;
import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToAddNewMemberTab;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDGeneralAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(4000000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldAutosaveInformation() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin("am", "trb2017");
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-admin-users");
        Thread.sleep(1000);
        driver.findElement(By.id("user-tab-1")).click();
        driver.findElement(By.id("new-user-username")).sendKeys("I wonder if this will stay here");
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-admin-users");
        Thread.sleep(1000);
        driver.findElement(By.id("user-tab-1")).click();
        String username = driver.findElement(By.id("new-user-username")).getAttribute("value");
        assertTrue(username.equals("I wonder if this will stay here"));
    }

    @Test
    public void shouldNotDisplayTitleInTextField() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdownXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[1]");
        navigateToPageXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[2]/a");
        //Manually check title is not displayed inside text field
    }

    @Test
    public void shouldHaveAsteriskDisplayedNextToTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdownXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[1]");
        navigateToPageXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/clr-dropdown/div[2]/a");
        //Manually check asterisks are displayed next to title
    }

    @Test
    public void shouldDisplayPopupWhenPageIsRefreshed() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        driver.navigate().refresh();
        checkAlert();
    }

    @Test
    public void shouldDisplayNavigationMenuOnLogin() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        assertTrue(driver.findElement(By.id("menu-account-module")).isDisplayed());
    }

    @Test
    public void shouldTakeUserToFirstTabWhenNavItemSelected() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        navigateToAddNewMemberTab();
        try {
            navigateToPageByID("menu-user-admin-users");
        } catch (Exception e) {
            fail("Exception : " + e.getMessage());
        }
        WebElement tab = driver.findElement(By.id("user-tab-0"));
        assertTrue(elementHasClass(tab, "active"));
    }

    @Test
    public void shouldCheckWorkflowMessagesIsNotPresent() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPage("messages");
        assertButtonIsNotPresent("messagesworkflow");
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
    public void shouldSeperateThousandsWithSpaces() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "1000000", "1 000 000.0000");
    }

    @Test
    public void shouldSeperateDecimalPlacesWithPoint() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
        clickID("fakeNewFundBtn");
        clickID("tabfundShareNav_Characteristic_0_0");
        fundCheckRoundingUp("minInitSubscription_0_0", "2000000", "2 000 000.0000");
    }

    @Test
    public void shouldHaveIZNESlogoOnLoginPage() throws IOException, InterruptedException {
        navigateToLoginPage();
        try {
            driver.findElement(By.id("logo-iznes")).isDisplayed();
        } catch (Error e) {
            fail("logo was not present");
        }
    }

    @Test
    public void shouldHaveIZNESinSubHeadingOnLoginPage() throws IOException, InterruptedException {
        navigateToLoginPage();
        try {
            String subHeadingText = driver.findElement(By.className("login-subheading")).getText();
            assertTrue(subHeadingText.equals("Log in to IZNES"));
        } catch (Error e) {
            fail("IZNES was not present in sub-heading");
        }
    }

    @Test
    public void shouldSendMessageToWallet() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        sendMessageToSelectedWallet("investor", "c5bg67a", "TextMessage", "Your message has been sent!");
        try {
            Thread.sleep(5000);
            logout();
        } catch (Error e) {
            fail("logout button was not clickable");
        }
        verifyMessageHasBeenReceived("investor", "trb2017", "c5bg67a");
    }

    @Test
    public void shouldNotSendMessageWithoutRecipient() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        sendMessageToSelectedWalletWithoutRecipient("c5bg66", "TextMessage", "Please fill out all fields");
    }

    @Test
    public void shouldNotSendMessageWithoutSubject() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        sendMessageToSelectedWallet("investor", "", "TextMessage", "Please fill out all fields");
    }

    @Test
    public void shouldNotSendMessageWithoutBodyText() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        sendMessageToSelectedWallet("investor", "c5bg66", "", "Please fill out all fields");
    }

    @Test
    @Ignore("Broken while work is being done for this section of the site.")
    public void shouldCreateUserAndResetPassword() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        createUserAndVerifySuccess("Jordan", "user1@setl.io", "alex01");
        logout();
        clickForgottenPassword("user1@setl.io");
        //Manually assert that email has been received
    }

    @Test
    public void shouldInviteInvestorsFromTopbarNavigation() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
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
        enterAllUserDetails("JordanInvestor7", "password");
        logout();
        loginAndVerifySuccessAdmin("JordanInvestor7", "password");
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



    public static void enterAllUserDetails(String username, String password) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver , timeoutInSeconds);
        enterManageUserUsername(username);
        enterManageUserEmail(username + "@setl.io");
        selectInvestorOnManageUserAccountDropdown();
        selectInvestorOnManageUserUserDropdown();
        enterManageUserPassword(password);
        enterManageUserPasswordRepeat(password);
        clickManageUserSubmit();
        Thread.sleep(2000);
        WebElement FundTitle = driver.findElement(By.className("jaspero__dialog-title"));
        wait.until(visibilityOf(FundTitle));
        assertTrue(FundTitle.getText().equals("Success!"));
        Thread.sleep(2000);
        try {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        Thread.sleep(2000);
    }

    public static void enterManageUserUsername(String username){
        driver.findElement(By.id("new-user-username")).sendKeys(username);

    }
    public static void enterManageUserEmail(String email){
        driver.findElement(By.id("new-user-email")).sendKeys(email);
    }

    public static void enterManageUserPassword(String password){
        driver.findElement(By.id("new-user-password")).sendKeys(password);
    }
    public static void enterManageUserPasswordRepeat(String password){
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
    }

    public static void navigateToAddUser() throws IOException, InterruptedException {
        driver.findElement(By.id("menu-user-administration")).click();
        WebDriverWait wait = new WebDriverWait(driver , timeoutInSeconds);
        WebElement dropdownItem = driver.findElement(By.id("menu-user-admin-users"));
        wait.until(visibilityOf(dropdownItem));
        try{
            driver.findElement(By.id("menu-user-admin-users")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        WebElement tabItem = driver.findElement(By.id("user-tab-1"));
        wait.until(visibilityOf(tabItem));
        try {
            driver.findElement(By.id("user-tab-1")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
    }
    public static void clickManageUserSubmit(){
        driver.findElement(By.id("new-user-submit")).click();
    }

    @Test
    public void shouldInviteAnInvestorAndReceiveEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "Jordan", "Miller");
    }

    @Test
    public void shouldInviteAnInvestorWithoutFirstname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "", "Miller");
    }

    @Test
    public void shouldInviteAnInvestorWithoutLastname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "Jordan", "");
    }

    @Test
    public void shouldNotInviteAnInvestorWithoutEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestorExpectingFailed("", "Jordan", "Miller");
    }

    @Test
    public void shouldPopupWarningIfValidatedIsSelectedOnNAV() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");

    }

    @Test
    public void shouldNotPopupWarningIfTechnicalIsSelectedOnNAV() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");

    }
    @Test
    public void shouldNotPopupWarningIfEstimatedIsSelectedOnNAV() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");

    }

    @Test
    public void shouldLoginToOffice365() throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver , timeoutInSeconds);
        navigateTo365Page();
        driver.findElement(By.className("msame_Header_name")).click();
        WebElement signInEmail = driver.findElement(By.id("i0116"));
        wait.until(visibilityOf(signInEmail));
        signInEmail.sendKeys("test@setl.io");
        try{
            driver.findElement(By.id("idSIButton9")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        Thread.sleep(750);
        WebElement signInPassword2 = driver.findElement(By.id("displayName"));
        wait.until(visibilityOf(signInPassword2));

        WebElement signInPassword = driver.findElement(By.id("i0118"));
        signInPassword.sendKeys("Sphericals1057!");
        try {
            driver.findElement(By.id("idSIButton9")).click();
            Thread.sleep(15000);
        }catch (Error e){
            fail();
        }
    }


    public static void navigateToTopbarItem(String toplevelID, String itemID, String headingID) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id(toplevelID)).click();
        WebElement profileDropdown = driver.findElement(By.id(itemID));
        wait.until(visibilityOf(profileDropdown));
        driver.findElement(By.id(itemID)).click();
        try{
            assertTrue(driver.findElement(By.id(headingID)).isDisplayed());
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void inviteAnInvestor(String email, String firstname, String lastname) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("kyc_email_0")).sendKeys(email);
        driver.findElement(By.id("kyc_firstName_0")).sendKeys(firstname);
        driver.findElement(By.id("kyc_lastName_0")).sendKeys(lastname);
        try {
            driver.findElement(By.id("btnKycSubmit")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
        WebElement popupSuccess = driver.findElement(By.className("modal-header"));
        wait.until(visibilityOf(popupSuccess));
        try{
            String success = driver.findElement(By.className("modal-title")).getText();
            assertTrue(success.equals("Success!"));
        }catch (Exception e){
            fail("success message did not match : " + e.getMessage());
        }
    }

    public static void inviteAnInvestorExpectingFailed(String email, String firstname, String lastname) throws IOException, InterruptedException{
        driver.findElement(By.id("kyc_email_0")).sendKeys(email);
        driver.findElement(By.id("kyc_firstName_0")).sendKeys(firstname);
        driver.findElement(By.id("kyc_lastName_0")).sendKeys(lastname);
        try {
               String test = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
            assertTrue(test.equals("true"));
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void createUserAndVerifySuccess(String username, String email, String password) throws IOException, InterruptedException{
        driver.findElement(By.id("user-tab-1")).click();
        driver.findElement(By.id("new-user-username")).sendKeys(username);
        driver.findElement(By.id("new-user-email")).sendKeys(email);
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        driver.findElement(By.id("new-user-password")).sendKeys(password);
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
        driver.findElement(By.id("new-user-submit")).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement jasperoPopup = driver.findElement(By.className("jaspero__dialog-title"));
        wait.until(visibilityOf(jasperoPopup));
        try{
            String success = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(success.equals("Success!"));
        }catch (Exception e){
            fail("success message did not match : " + e.getMessage());
        }
        try {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        }catch (Exception e){
            fail("Could not close alert : " + e.getMessage());
        }
    }

    public static void clickForgottenPassword(String email) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement forgottenPassword = driver.findElement(By.id("forgotten-password-link"));
        wait.until(visibilityOf(forgottenPassword));
        try {
            driver.findElement(By.id("forgotten-password-link")).click();
            driver.findElement(By.xpath("//*[@id=\"forgotten-password-link\"]")).click();
        }catch (Exception e){
            fail("could not click forgotten password link " + e.getMessage());
        }
        driver.findElement(By.id("fp-email-field")).sendKeys(email);
        driver.findElement(By.id("fp-submit-sendemail-button")).click();
    }
    public static void sendMessageToSelectedWallet(String recipient, String subject, String message, String toasterMessage) throws InterruptedException {
        navigateToPageByID("menu-messages");
        driver.findElement(By.id("messagescompose")).click();
        driver.findElement(By.id("messagesRecipients")).click();
        driver.findElement(By.xpath("//*[@id=\"messagesRecipients\"]/div/div[2]/div/input")).sendKeys(recipient);
        driver.findElement(By.xpath("//*[@id=\"messagesRecipients\"]/div/div[2]/ul/li[1]/div/a")).click();
        driver.findElement(By.id("messagesSubject")).sendKeys(subject);
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).click();
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).sendKeys(message);
        driver.findElement(By.id("messagesSendMessage")).click();
        Thread.sleep(750);
        String JasperoModel = driver.findElement(By.className("toast-title")).getText();
        try {
            assertTrue(JasperoModel.equals(toasterMessage));
        } catch (Error e) {
            fail("toaster message did not match");
        }
    }

    public static void selectManageUserAccountDropdown(){
        driver.findElement(By.id("new-user-account-select")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectManageUserUserDropdown(){
        driver.findElement(By.id("new-user-usertype-select")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectInvestorOnManageUserAccountDropdown(){
        driver.findElement(By.id("new-user-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/div/input")).sendKeys("investor");
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectInvestorOnManageUserUserDropdown(){
        driver.findElement(By.id("new-user-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/div/input")).sendKeys("investor");
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void sendMessageToSelectedWalletWithoutRecipient (String subject, String message, String toasterMessage) throws InterruptedException {
        navigateToPageByID("menu-messages");
        driver.findElement(By.id("messagescompose")).click();
        driver.findElement(By.id("messagesSubject")).sendKeys(subject);
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).click();
        driver.findElement(By.xpath("//*[@id=\"messagesBody\"]/div[2]/div[1]")).sendKeys(message);
        driver.findElement(By.id("messagesSendMessage")).click();
        Thread.sleep(750);
        String JasperoModel = driver.findElement(By.className("toast-title")).getText();
        try {
            assertTrue(JasperoModel.equals(toasterMessage));
            }catch (Error e){
            fail("toaster message did not match");
            }
        }

    public static void verifyMessageHasBeenReceived(String recipientUsername, String recipientPassword, String subject) throws InterruptedException, IOException {
        loginAndVerifySuccess(recipientUsername, recipientPassword);
        navigateToPageByID("menu-messages");
        String subjectMessage = driver.findElement(By.id("message_list_subject_0_0")).getText();
        System.out.println(subjectMessage + subject);
        assertTrue(subjectMessage.equals(subject));
    }

    public static void fundCheckRoundingUp(String enteringField, String value, String expected) throws InterruptedException {
        Thread.sleep(2000);
        driver.findElement(By.id(enteringField)).clear();
        driver.findElement(By.id(enteringField)).sendKeys(value);
        driver.findElement(By.id("fundName_0")).sendKeys("");
        String unitsField = driver.findElement(By.id(enteringField)).getAttribute("value");
        assertTrue(unitsField.equals(expected));
    }

    public static void assertFalseIdDisplayed(String element, String value){
        WebElement displayedElement = driver.findElement(By.id(value));
        assertFalse(displayedElement.isDisplayed());
    }

    public static void assertButtonIsNotPresent(String text) {
        try {
            driver.findElement(By.id(text));
            fail("Button with ID <" + text + "> is present");
        } catch (NoSuchElementException ex) {
            /* do nothing, button is not present, assert is passed */
        }
    }

    public void checkAlert() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, 2);
            wait.until(ExpectedConditions.alertIsPresent());
            Alert alert = driver.switchTo().alert();
            alert.accept();
        } catch (Exception e) {
            fail("Alert not present");
        }
    }

    public void clickID(String id) {
        try {
            driver.findElement(By.id(id)).click();
        } catch (Exception e) {
            fail(id + "not present");
        }
    }

    public boolean elementHasClass(WebElement element, String active) {
        return element.getAttribute("class").contains(active);
    }

}
