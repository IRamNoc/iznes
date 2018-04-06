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
import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.*;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToAddNewMemberTab;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.createUserAndVerifySuccess;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
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
    public void shouldAutosaveInformation() throws IOException, InterruptedException, SQLException {
        String userDetails[] = generateRandomUserDetails();
        String userName = userDetails[0];
        String email = userDetails[1];
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-admin-users");
        Thread.sleep(1000);
        driver.findElement(By.id("user-tab-1")).click();
        driver.findElement(By.id("new-user-username")).clear();
        driver.findElement(By.id("new-user-username")).sendKeys(userName);
        driver.findElement(By.id("new-user-email")).clear();
        driver.findElement(By.id("new-user-email")).sendKeys(email);
        navigateToDropdown("topBarMenu");
        navigateToPageByID("topBarMyAccount");
        navigateToPage("user-admin-users");
        Thread.sleep(1000);
        driver.findElement(By.id("user-tab-1")).click();
        String screenUserName = driver.findElement(By.id("new-user-username")).getAttribute("value");
        assertTrue(screenUserName.equals(userName));
        validatePopulatedDatabaseUsersFormdataTable("1", "8", userName, email);
    }

    @Test
    public void shouldNotPersistInformationAfterSave() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        int persist = databaseCountRows("UsersFormdata");
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails[] = generateRandomUserDetails();
        createUserAndVerifySuccess(userDetails[0], userDetails[1], "alex01");
        validateDatabaseUsersFormdataTable(0, "1" , "8");
    }

    @Test
    public void shouldNotDisplayTitleInTextField() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("topBarMenu");
        navigateToPageByID("topBarMyAccount");
        //Manually check title is not displayed inside text field
    }

    @Test
    public void shouldHaveAsteriskDisplayedNextToTitle() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("topBarMenu");
        navigateToPageByID("topBarMyAccount");
        //Manually check asterisks are displayed next to title
    }

    @Test
    public void shouldDisplayPopupWhenPageIsRefreshed() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.navigate().refresh();
        checkAlert();
    }

    @Test
    public void shouldDisplayNavigationMenuOnLogin() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        assertTrue(driver.findElement(By.id("ofi-homepage")).isDisplayed());
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
        loginAndVerifySuccess("am", "alex01");
        navigateToPage("messages");
        assertButtonIsNotPresent("messagesworkflow");
    }

    @Test
    public void shouldHaveIZNESlogoOnLoginPage() throws InterruptedException {
        navigateToLoginPage();
        try {
            driver.findElement(By.id("logo-iznes")).isDisplayed();
        } catch (Error e) {
            fail("logo was not present");
        }
    }

    @Test
    public void shouldHaveIZNESinSubHeadingOnLoginPage() throws InterruptedException {
        navigateToLoginPage();
        try {
            String subHeadingText = driver.findElement(By.className("login-subheading")).getText();
            assertTrue(subHeadingText.equals("Log in to IZNES"));
        } catch (Error e) {
            fail("IZNES was not present in sub-heading");
        }
    }

    @Test
    public void shouldPopupWarningIfValidatedIsSelectedOnNAV() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");
    }

    @Test
    public void shouldNotPopupWarningIfTechnicalIsSelectedOnNAV() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");
    }

    @Test
    public void shouldNotPopupWarningIfEstimatedIsSelectedOnNAV() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToTopbarItem("menu-product-module", "menu-nav", "pageTitle");
    }

    @Test
    public void shouldLoginToOffice365() throws InterruptedException {
        LoginToOutlook("test@setl.io", "Sphericals1057!");
    }

    @Test
    public void shouldDisplayFirstnameInMyInformationScreen() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails [] = generateUserDetails();
        createUserAndVerifySuccess(userDetails[0], "testops063@setl.io", "asdasd");
        Thread.sleep(500);
        logout();
        Thread.sleep(750);
        loginAndUpdateMyAccount("Test_User_063","asdasd", "Jordan", "Miller");
        loginAndAssertMyInfomation("Test_User_063", "asdasd", "Jordan", "Miller");
    }

    public static String[] generateUserDetails() {
        String userName = "Test_User_063";
        String emailAddress = "testops063@setl.io";
        return new String[] {userName, emailAddress};
    }

    public static void loginAndUpdateMyAccount(String username, String password, String firstname, String lastname) throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(username, password);
        try {
            driver.findElement(By.id("topBarMenu")).click();
        }catch (Exception e) {
            fail(e.getMessage());
        }
        driver.findElement(By.id("topBarMyAccount")).click();
        Thread.sleep(1000);
        driver.findElement(By.id("udDisplayName")).clear();
        driver.findElement(By.id("udDisplayName")).sendKeys(firstname + lastname);
        driver.findElement(By.id("udFirstName")).clear();
        driver.findElement(By.id("udFirstName")).sendKeys(firstname);
        driver.findElement(By.id("udLastName")).clear();
        driver.findElement(By.id("udLastName")).sendKeys(lastname);
        driver.findElement(By.id("udMobilePhone")).clear();
        driver.findElement(By.id("udMobilePhone")).sendKeys("07956701992");
        driver.findElement(By.id("udAddress1")).clear();
        driver.findElement(By.id("udAddress1")).sendKeys("postal");
        driver.findElement(By.id("udAddress3")).clear();
        driver.findElement(By.id("udAddress3")).sendKeys("town");
        driver.findElement(By.id("udPostalCode")).clear();
        driver.findElement(By.id("udPostalCode")).sendKeys("code");
        driver.findElement(By.xpath("//*[@id=\"country\"]/ng-select/div/div[2]/span")).click();
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"country\"]/ng-select/div/div[3]/ul/li[1]/div/a")).click();
        Thread.sleep(500);
        driver.findElement(By.id("udSubmit")).click();
        try {
            String success = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(success.equals("Success!"));
        } catch (Exception e) {
            fail("success message did not match : " + e.getMessage());
        }
        driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        logout();
    }

    public static void loginAndAssertMyInfomation(String username, String password, String firstname, String lastname) throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(username, password);
        driver.findElement(By.id("dropdown-user")).click();
        try{
            driver.findElement(By.id("top-menu-my-info")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        String firstnameMyInfo = driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value");
        assertTrue(firstnameMyInfo.equals(firstname));
        String lastnameMyInfo = driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value");
        assertTrue(lastnameMyInfo.equals(lastname));
    }

    public static void LoginToOutlook(String email, String password) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        navigateTo365Page();
        driver.findElement(By.className("msame_Header_name")).click();
        WebElement signInEmail = driver.findElement(By.id("i0116"));
        wait.until(visibilityOf(signInEmail));
        signInEmail.sendKeys(email);
        try {
            driver.findElement(By.id("idSIButton9")).click();
        } catch (Exception e1) {
            fail(e1.getMessage());
        }
        Thread.sleep(850);
        WebElement displayName = driver.findElement(By.id("displayName"));
        wait.until(visibilityOf(displayName));
        WebElement signInPassword = driver.findElement(By.id("i0118"));
        signInPassword.sendKeys(password);
        try {
            driver.findElement(By.id("idSIButton9")).click();
        } catch (Exception e2) {
            fail(e2.getMessage());
        }
        try {
            driver.findElement(By.id("idSIButton9")).click();
        } catch (Exception e3) {
            fail(e3.getMessage());
        }
        Thread.sleep(850);

        WebElement shellMail = driver.findElement(By.id("ShellMail_link"));
        wait.until(visibilityOf(shellMail));
        wait.until(elementToBeClickable(shellMail));
        shellMail.click();

    }

    public static void navigateToTopbarItem(String toplevelID, String itemID, String headingID) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id(toplevelID)).click();
        WebElement profileDropdown = driver.findElement(By.id(itemID));
        wait.until(visibilityOf(profileDropdown));
        driver.findElement(By.id(itemID)).click();
        try {
            assertTrue(driver.findElement(By.id(headingID)).isDisplayed());
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void inviteAnInvestor(String email, String firstname, String lastname, String expectedResult) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("kyc_email_0")).sendKeys(email);
        driver.findElement(By.id("kyc_language_0")).click();
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(2) > div > a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
        driver.findElement(By.id("kyc_firstName_0")).sendKeys(firstname);
        driver.findElement(By.id("kyc_lastName_0")).sendKeys(lastname);
        try {
            driver.findElement(By.id("btnKycSubmit")).click();
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
        try {
            WebElement popupSuccess = driver.findElement(By.className("jaspero__dialog-title"));
            wait.until(visibilityOf(popupSuccess));
        } catch (Error e) {
            fail(e.getMessage());
        }
        try {
            String success = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(success.equals(expectedResult));
        } catch (Exception e) {
            fail("success message did not match : " + e.getMessage());
        }
    }

    public static void inviteAnInvestorExpectingFailed(String email, String firstname, String lastname) {
        driver.findElement(By.id("kyc_email_0")).sendKeys(email);
        driver.findElement(By.id("kyc_firstName_0")).sendKeys(firstname);
        driver.findElement(By.id("kyc_lastName_0")).sendKeys(lastname);
        try {
            String test = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
            assertTrue(test.equals("true"));
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void createUserAndVerifySuccess(String username, String email, String password) {
        driver.findElement(By.id("user-tab-1")).click();
        driver.findElement(By.id("new-user-username")).clear();
        driver.findElement(By.id("new-user-username")).sendKeys(username);
        driver.findElement(By.id("new-user-email")).clear();
        driver.findElement(By.id("new-user-email")).sendKeys(email);
        selectManageUserAccountDropdown();
        selectManageUserUserDropdown();
        driver.findElement(By.id("new-user-password")).clear();
        driver.findElement(By.id("new-user-password")).sendKeys(password);
        driver.findElement(By.id("new-user-password-repeat")).clear();
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
        driver.findElement(By.id("new-user-submit")).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement jasperoPopup = driver.findElement(By.className("jaspero__dialog-title"));
        wait.until(visibilityOf(jasperoPopup));
        try {
            String success = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(success.equals("Success!"));
        } catch (Exception e) {
            fail("success message did not match : " + e.getMessage());
        }
        try {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        } catch (Exception e) {
            fail("Could not close alert : " + e.getMessage());
        }
    }

    public static void clickForgottenPassword(String email) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement forgottenPassword = driver.findElement(By.id("forgotten-password-link"));
        wait.until(visibilityOf(forgottenPassword));
        try {
            driver.findElement(By.id("forgotten-password-link")).click();
            driver.findElement(By.xpath("//*[@id=\"forgotten-password-link\"]")).click();
        } catch (Exception e) {
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

    public static void selectManageUserAccountDropdown() {
        driver.findElement(By.id("new-user-account-select")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectManageUserUserDropdown() {
        driver.findElement(By.id("new-user-usertype-select")).click();
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectInvestorOnManageUserAccountDropdown() {
        driver.findElement(By.id("new-user-account-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/div/input")).sendKeys("investor");
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void selectInvestorOnManageUserUserDropdown() {
        driver.findElement(By.id("new-user-usertype-select")).click();
        driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/div/input")).sendKeys("investor");
        try {
            driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li[1]/div/a")).click();
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }
    }

    public static void sendMessageToSelectedWalletWithoutRecipient(String subject, String message, String toasterMessage) throws InterruptedException {
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
        } catch (Error e) {
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

    public static void assertFalseIdDisplayed(String element, String value) {
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

    public static void enterAllUserDetails(String username, String password) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
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
        } catch (Exception e) {
            fail(e.getMessage());
        }
        Thread.sleep(2000);
    }

    public static void enterManageUserUsername(String username) {
        driver.findElement(By.id("new-user-username")).sendKeys(username);

    }

    public static void enterManageUserEmail(String email) {
        driver.findElement(By.id("new-user-email")).sendKeys(email);
    }

    public static void enterManageUserPassword(String password) {
        driver.findElement(By.id("new-user-password")).sendKeys(password);
    }

    public static void enterManageUserPasswordRepeat(String password) {
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
    }

    public static void navigateToAddUser() {
        driver.findElement(By.id("menu-user-administration")).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement dropdownItem = driver.findElement(By.id("menu-user-admin-users"));
        wait.until(visibilityOf(dropdownItem));
        try {
            driver.findElement(By.id("menu-user-admin-users")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        WebElement tabItem = driver.findElement(By.id("user-tab-1"));
        wait.until(visibilityOf(tabItem));
        try {
            driver.findElement(By.id("user-tab-1")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    public static void clickManageUserSubmit() {
        driver.findElement(By.id("new-user-submit")).click();
    }
}
