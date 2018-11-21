package com.setl.openCSDClarityTests.UI.MyAccount;

import com.setl.UI.common.SETLUtils.Repeat;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;


import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomEmail;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.LoginToOutlook;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.clickForgottenPassword;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.createUserAndVerifySuccess;
import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;


@RunWith(OrderedJUnit4ClassRunner.class)


public class OpenCSDMyAccountAcceptanceTest {

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

    JavascriptExecutor jse = (JavascriptExecutor) driver;

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
        setDBTwoFAOff();
    }
    @After
    public void teardown() {

    }


    @Test
    public void shouldSeeCorrectFieldsOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
    }

    @Test
    public void shouldSaveDataOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Peter", "Piper", "PP@setl.io", "222", "669669", true);
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyUpdatedMyInfoPage("PP@setl.io", "", "Peter", "Piper",  "Ukraine (+380)", "669669");
        populateMyInfoPage("Asset", "Manager", "am@setl.io", "224", "235689", true);

    }

    @Test
    public void shouldNotSaveDataOnMyInformationPageWhenCancelled() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Fred", "Custodian", "fred@setl.io",  "222", "111111", false);
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyUpdatedMyInfoPage("am@setl.io", "", "Asset", "Manager",  "United Kingdom (+44)", "235689");
    }

    @Test
    //@Ignore
    public void shouldCreateUserAndResetPassword() throws IOException, InterruptedException {
        String[] email = generateRandomEmail();


        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails[] = generateRandomUserDetails();
        //TODO - this next step fails, I believe because "testops034@setl.io" already exists.  not yet possible to user a bracketed '(randomData)test@seetl.io' address
        //Requested for brackets - http://si-taiga01.dev.setl.io/project/paul-opencsd-reconfiguration-and-factorisation-project/issue/469
        createUserAndVerifySuccess(userDetails[0], "testops034@setl.io", "asdasd");
        logout();
        clickForgottenPassword(email[0]);
        //LoginToOutlook("test@setl.io", "Sphericals1057!");
        //Manually assert that email has been received
    }

    @Test
    public void shouldCreateUserAndLoginUsingEmailAddress() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails[] = generateRandomUserDetails();
        createUserAndVerifySuccess(userDetails[0], userDetails[1], "alex01");
        logout();
        loginAndVerifySuccess(userDetails[0], "alex01");
    }

    private void populateMyInfoPage(String firstName, String lastName, String email, String phoneCode, String phoneNumber, boolean save) {

        driver.findElement(By.id("kyc_additionnal_email")).clear();
        driver.findElement(By.id("kyc_additionnal_email")).sendKeys(email);
        driver.findElement(By.id("kyc_additionnal_firstName")).clear();
        driver.findElement(By.id("kyc_additionnal_firstName")).sendKeys(firstName);
        driver.findElement(By.id("kyc_additionnal_lastName")).clear();
        driver.findElement(By.id("kyc_additionnal_lastName")).sendKeys(lastName);

        try {
            driver.findElement(By.id("kyc_additionnal_phoneCode")).click();
            driver.findElement(By.xpath("//*[@id=\"kyc_additionnal_phoneCode\"]/div/div[3]/ul/li[" + phoneCode + "]/div/a/div")).click();

        } catch (Exception e) {
            fail(e.getMessage());
        }
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).clear();
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(phoneNumber);
        assertTrue(driver.findElement(By.id("btnKycClose")).isEnabled());
        assertTrue(driver.findElement(By.id("btnKycSubmit")).isEnabled());
        String msgText = null;
        String btnToClick = null;

        if (save == false) {
            msgText = null;
            btnToClick = "btnKycClose";
        } else {
            msgText = "Saved changes";
            btnToClick = "btnKycSubmit";
        }

        driver.findElement(By.id(btnToClick)).click();
        if (btnToClick == "btnKycClose") {
            assertTrue(driver.findElement(By.id("topBarMenu")).isDisplayed());
        } else {
            try {
                assertTrue(driver.findElement(By.className("toast-title")).isDisplayed());
            } catch (Error et) {
                fail("Popup is not displayed" + et.getMessage());

                String popup = driver.findElement(By.className("toast-title")).getText();

                try {
                    assertTrue(popup.equals(msgText));
                } catch (Error e) {
                    fail("Toaster message did not match: Expected Message = " + msgText + "  /  Actual message =  " + popup);
                }
            }
        }
    }

    private void verifyMyInfoPage() {
        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).isDisplayed());
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-user")));

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().equals("My Information"));

        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_companyName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneCode")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());

        assertTrue(driver.findElement(By.id("btnKycSubmit")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isDisplayed());
    }

    private void verifyUpdatedMyInfoPage(String email, String invitedBy, String firstName, String lastName,  String phoneCode, String phoneNumber) {
        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).isDisplayed());
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-user")));

        String test = driver.findElement(By.id("ofi-welcome-additionnal")).getText();

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().equals("My Information"));

        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).getAttribute("value").equals(email));

        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).getAttribute("value").equals(invitedBy));

        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value").equals(firstName));

        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value").equals(lastName));

        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneCode")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneCode")).getText().equals(phoneCode));

        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).getAttribute("value").equals(phoneNumber));
    }
}



