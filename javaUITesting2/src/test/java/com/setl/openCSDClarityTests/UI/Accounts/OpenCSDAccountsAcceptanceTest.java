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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

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
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


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
    public Timeout globalTimeout = new Timeout(30000);
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
    //@Ignore("not sure why this is failing, look into it")
    public void shouldCreateUserWithNullInfo() throws IOException, InterruptedException, SQLException {
        createHoldingUserAndLogin();
        logout();
        loginAndVerifySuccess("TestUserNullInfo", "Testpass123");
        setLoggedInUserAccountInfoToNull();
        scrollElementIntoViewById("udSubmit");
        try {
            clickMyAccountSubmit();
        }catch (Error e){
            System.out.println("updating account information was not successful");
            fail();
        }
        Thread.sleep(750);
        searchDatabaseFor("tblUserDetails","firstName", "blanketyblank");
    }

    public static void assureSubmitBtnIsInView() throws IOException, InterruptedException {
        WebElement submitBtn = driver.findElement(By.id("udSubmit"));
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOf(submitBtn));
    }

    @Test
    public void shouldEditDisplayname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","displayName", "TestUserNullInfo");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("DisplayName");
        myAccountSendKeys("DisplayName", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();

        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","displayName", "Testing");
    }
  @Test
  public void shouldEditFirstname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","firstName", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("FirstName");
        myAccountSendKeys("FirstName", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","firstName", "Testing");
  }

  @Test
  public void shouldEditLastname() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","lastName", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("LastName");
        myAccountSendKeys("LastName", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","lastName", "Testing");
  }

  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","mobilePhone", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MobilePhone");
        myAccountSendKeys("MobilePhone", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","mobilePhone", "Testing");
  }

  @Test
  public void shouldEditAddress() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","address1", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address1");
        myAccountSendKeys("Address1", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","address1", "Testing");
  }

  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","addressPrefix", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("AddressPrefix");
        myAccountSendKeys("AddressPrefix", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","addressPrefix", "Testing");
  }

  @Test
  public void shouldEditCity() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","address3", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address3");
        myAccountSendKeys("Address3", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","address3", "Testing");
  }

  @Test
  public void shouldEditState() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","address4", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address4");
        myAccountSendKeys("Address4", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","address4", "Testing");
  }

  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","postalCode", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("PostalCode");
        myAccountSendKeys("PostalCode", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","postalCode", "Testing");
  }

  @Test
  @Ignore
  public void shouldEditCountry() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","country", "Afghanistan");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("Address3");
        myAccountSendKeys("Address3", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","country", "Testing");
  }

  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","memorableQuestion", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MemorableQuestion");
        myAccountSendKeys("MemorableQuestion", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","memorableQuestion", "Testing");
  }

  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException, SQLException {
        searchDatabaseFor("tblUserDetails","memorableAnswer", "blanketyblank");
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("MemorableAnswer");
        myAccountSendKeys("MemorableAnswer", "Testing");
        scrollElementIntoViewById("udSubmit");
        assureSubmitBtnIsInView();
        clickMyAccountSubmit();
        searchDatabaseFor("tblUserDetails","memorableAnswer", "Testing");
  }
}
