package com.setl.openCSDClarityTests.UI.Accounts;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Ignore;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.Rule;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;
import java.sql.*;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static junit.framework.Assert.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.fail;



@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDAccountsAcceptanceTest {

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
    public Timeout globalTimeout = Timeout.seconds(300);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);

    }
    @Test
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
    }

    @Test
    public void shouldLoginAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
    }

    @Test
    public void shouldLogoutAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        logout();
    }

    @Test
    public void shouldRequirePasswordToLogin() throws IOException, InterruptedException {
        navigateToLoginPage();
        enterLoginCredentialsUserName("Emmanuel");
        driver.findElement(By.id("login-submit")).click();
    }

    @Test
    public void shouldCreateUserWithNullInfo() throws IOException, InterruptedException, SQLException {
        createHoldingUserAndLogin();
        setLoggedInUserAccountInfoToNull();
        scrollElementIntoViewById("udSubmit");
        try {
            clickMyAccountSubmit();
        }catch (Error e){
            System.out.println("updating account information was not successful");
            fail();
        }
        Thread.sleep(2000);
        searchDatabaseFor("firstName", "null");
    }

    @Test
    @Ignore
    public void shouldEditDisplayname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("displayName", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("DisplayName");
        myAccountSendKeys("DisplayName", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("displayName", "Testing");
    }
  @Test
  public void shouldEditFirstname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("firstName", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("FirstName");
        myAccountSendKeys("FirstName", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("firstName", "Testing");
  }

  @Test
  public void shouldEditLastname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("lastName", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("LastName");
        myAccountSendKeys("LastName", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("lastName", "Testing");
  }

  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("mobilePhone", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MobilePhone");
        myAccountSendKeys("MobilePhone", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("mobilePhone", "Testing");
  }

  @Test
  public void shouldEditAddress() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("address1", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address1");
        myAccountSendKeys("Address1", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("address1", "Testing");
  }

  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("addressPrefix", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("AddressPrefix");
        myAccountSendKeys("AddressPrefix", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("addressPrefix", "Testing");
  }

  @Test
  public void shouldEditCity() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("address3", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address3");
        myAccountSendKeys("Address3", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("address3", "Testing");
  }

  @Test
  public void shouldEditState() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("address4", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address4");
        myAccountSendKeys("Address4", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("address4", "Testing");
  }

  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("postalCode", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("PostalCode");
        myAccountSendKeys("PostalCode", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("postalCode", "Testing");
  }

  @Test
  @Ignore
  public void shouldEditCountry() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("country", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address3");
        myAccountSendKeys("Address3", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("country", "Testing");
  }

  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("memorableQuestion", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MemorableQuestion");
        myAccountSendKeys("MemorableQuestion", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("memorableQuestion", "Testing");
  }

  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("memorableAnswer", "null");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MemorableAnswer");
        myAccountSendKeys("MemorableAnswer", "Testing");
        Thread.sleep(1000);
        scrollElementIntoViewById("udSubmit");
        clickMyAccountSubmit();
        searchDatabaseFor("memorableAnswer", "Testing");
  }
}
