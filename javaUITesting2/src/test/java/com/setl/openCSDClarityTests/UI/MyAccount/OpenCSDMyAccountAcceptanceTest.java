package com.setl.openCSDClarityTests.UI.MyAccount;

import SETLUIHelpers.SetUp;
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
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertTrue;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDMyAccountAcceptanceTest {

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
    public Timeout globalTimeout = new Timeout(3000000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldSeeCorrectFieldsOnMyinformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_companyName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());

        assertTrue(driver.findElement(By.id("btnKycSubmit")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isDisplayed());
    }

}
