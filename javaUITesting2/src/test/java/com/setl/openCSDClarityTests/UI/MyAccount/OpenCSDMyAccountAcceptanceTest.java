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

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


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
    public Timeout globalTimeout = new Timeout(300000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldSeeCorrectFieldsOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).isDisplayed());
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-user")));

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().contentEquals("My informations:"));

        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_companyName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());

        assertTrue(driver.findElement(By.id("btnKycSubmit")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isEnabled());
        assertFalse(driver.findElement(By.id("btnKycSubmit")).isEnabled());
    }

    @Test
    public void shouldSaveDataOnMyInformationPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Asset", "Manager", "am@setl.io", "SETL","224", "235689", true);
    }


    @Test
    public void shouldNotSaveDataOnMyInformationPageWhenCancelled() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
        verifyMyInfoPage();
        populateMyInfoPage("Asset", "Manager", "am@setl.io", "SETL","224", "235689", false);
    }

    private void populateMyInfoPage(String firstName, String lastName, String email, String companyName, String phoneCode, String phoneNumber, boolean save) throws InterruptedException {

        driver.findElement(By.id("kyc_additionnal_email")).sendKeys(email);
        driver.findElement(By.id("kyc_additionnal_firstName")).sendKeys(firstName);
        driver.findElement(By.id("kyc_additionnal_lastName")).sendKeys(lastName);
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys(companyName);

        try {
            driver.findElement(By.id("kyc_additionnal_phoneCode")).click();
            driver.findElement(By.xpath("//*[@id=\"kyc_additionnal_phoneCode\"]/div/div[3]/ul/li[" + phoneCode + "]/div/a/div")).click();

        } catch (Exception e) {
            fail(e.getMessage());
        }
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(phoneNumber);
        assertTrue(driver.findElement(By.id("btnKycClose")).isEnabled());
        assertTrue(driver.findElement(By.id("btnKycSubmit")).isEnabled());
        String msgText = null;
        String btnToClick = null;

        if(save == false)
        { msgText = null;
                btnToClick = "btnKycClose";
        }else {
            msgText = "Saved changes";
            btnToClick = "btnKycSubmit";
        }

        driver.findElement(By.id(btnToClick)).click();
        if (btnToClick == "btnKycClose"){
                assertTrue(driver.findElement(By.id("ofi-homepage")).isDisplayed());
        }else {
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

        assertTrue(driver.findElement(By.id("ofi-welcome-additionnal")).getText().contentEquals("My informations:"));

        assertTrue(driver.findElement(By.id("kyc_additionnal_email")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_invitedBy")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_firstName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_lastName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_companyName")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneCode")).isDisplayed());
        assertTrue(driver.findElement(By.id("kyc_additionnal_phoneNumber")).isDisplayed());

        assertTrue(driver.findElement(By.id("btnKycSubmit")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isDisplayed());
        assertTrue(driver.findElement(By.id("btnKycClose")).isEnabled());
        assertFalse(driver.findElement(By.id("btnKycSubmit")).isEnabled());

    }

}
