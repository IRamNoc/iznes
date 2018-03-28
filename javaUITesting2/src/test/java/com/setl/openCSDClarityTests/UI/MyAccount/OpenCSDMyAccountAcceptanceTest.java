package com.setl.openCSDClarityTests.UI.MyAccount;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.omg.PortableServer.THREAD_POLICY_ID;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;


import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.deleteUserFromDB;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.LoginToOutlook;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.clickForgottenPassword;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.createUserAndVerifySuccess;
import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


@RunWith(OrderedJUnit4ClassRunner.class)


public class OpenCSDMyAccountAcceptanceTest {

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

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
    }

    @Test
    public void deleteUser() throws IOException, InterruptedException, SQLException {
        deleteUserFromDB(username, password, "testops088@setl.io");
    }

    @Test
    public void shouldSeeCorrectFieldsOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).isDisplayed());
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-user")));

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().contains("My information:"));

        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_companyName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());

        assertTrue(driver.findElement(By.id("btnKycSubmit")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isDisplayed());
    }

    @Test
    public void shouldSaveDataOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Asset", "Manager", "am@setl.io", "SETL", "224", "235689", true);
    }


    @Test
    public void shouldNotSaveDataOnMyInformationPageWhenCancelled() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Asset", "Manager", "am@setl.io", "SETL", "224", "235689", false);
    }

    @Test
    public void shouldCreateUserAndResetPassword() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails[] = generateRandomUserDetails();
        createUserAndVerifySuccess(userDetails[0], "testops088@setl.io", "alex01");
        Thread.sleep(500);
        logout();
        clickForgottenPassword("testops088@setl.io");
        LoginToOutlook("test@setl.io", "Sphericals1057!");
        //Manually assert that email has been received
    }

    @Test
    public void shouldCreateUserAndLoginUsingEmailAddress() throws IOException, InterruptedException {
        loginAndVerifySuccessAdmin(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPageByID("menu-user-admin-users");
        String userDetails[] = generateRandomUserDetails();
        createUserAndVerifySuccess(userDetails[0], userDetails[1], "alex01");
        Thread.sleep(500);
        logout();
        loginAndVerifySuccess(userDetails[0], "alex01");
        logout();
        loginAndVerifySuccess(userDetails[1], "alex01");
    }

    private void populateMyInfoPage(String firstName, String lastName, String email, String companyName, String phoneCode, String phoneNumber, boolean save) throws InterruptedException {

        driver.findElement(By.id("kyc_additionnal_email")).clear();
        driver.findElement(By.id("kyc_additionnal_email")).sendKeys(email);
        driver.findElement(By.id("kyc_additionnal_firstName")).clear();
        driver.findElement(By.id("kyc_additionnal_firstName")).sendKeys(firstName);
        driver.findElement(By.id("kyc_additionnal_lastName")).clear();
        driver.findElement(By.id("kyc_additionnal_lastName")).sendKeys(lastName);
        driver.findElement(By.id("kyc_additionnal_companyName")).clear();
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys(companyName);

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
            assertTrue(driver.findElement(By.id("ofi-homepage")).isDisplayed());
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

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().contains("My information:"));

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
}


