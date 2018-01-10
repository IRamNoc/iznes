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
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static junit.framework.Assert.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.fail;



@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDAccountsAcceptanceTest {

    static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";


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
        loginAndVerifySuccess(testusername, testpassword);
    }

    @Test
    public void shouldLoginAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(testusername, testpassword);
    }

    @Test
    public void shouldLogoutAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(testusername, testpassword);
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
        JavascriptExecutor jse = (JavascriptExecutor)driver;
        createHoldingUserAndLogin();
        setLoggedInUserAccountInfoToNull();
        jse.executeScript("window.scrollBy(0, 500);");
        try {
            clickMyAccountSubmit();
        }catch (Error e){
            System.out.println("updating account information was not succesful");
            fail();
        }
        Thread.sleep(2000);
        Connection conn = DriverManager.getConnection(connectionString, username, password);
        ResultSet rs;
        Statement stmt = conn.createStatement();
        conn.createStatement();

        rs = stmt.executeQuery("select * FROM tblUserDetails where firstName = \"null\" ");

        int rows = 0;

        // checek there is only one result( there should be!! )
        if (rs.last()) {
            rows = rs.getRow();
            // Move to back to the beginning
            rs.beforeFirst();
        }
        assertEquals("there should be exactly one record", 1, rows );

        while (rs.next()) {
            assertEquals("Expecting username to be null","null", rs.getString("firstName"));
            // check each parameter meets the field in the database
        }
    }
    @Test
    public void shouldEditDisplayname() throws IOException, InterruptedException {
        loginAndVerifySuccess(testusername, testpassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("my-account");
        myAccountClearField("DisplayName");
        myAccountSendKeys("DisplayName", "Testing");
        clickMyAccountSubmit();
    }
  @Test
  public void shouldEditFirstname() throws IOException, InterruptedException, SQLException {



            Connection conn = DriverManager.getConnection(connectionString, username, password);
            ResultSet rs;
            Statement stmt = conn.createStatement();
            conn.createStatement();

            rs = stmt.executeQuery("select * FROM tblUserDetails where firstName = \"null\" ");

            int rows = 0;

            // checek there is only one result( there should be!! )
            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning
                rs.beforeFirst();
            }
            assertEquals("there should be exactly one record", 1, rows );

            while (rs.next()) {
                assertEquals("Expecting username to be null","null", rs.getString("firstName"));
                // check each parameter meets the field in the database
            }


    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("FirstName");
    myAccountSendKeys("FirstName", "Testing");
    clickMyAccountSubmit();


    rs = stmt.executeQuery("select * FROM tblUserDetails where firstName = \"Testing\" ");

            rows = 0;

            // check there is only one result( there should be!! )
            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning
                rs.beforeFirst();
            }
            assertEquals("there should be exactly one record", 1, rows );

            while (rs.next()) {
                assertEquals("Expecting username to be Testing","Testing", rs.getString("firstName"));
                // check each parameter meets the field in the database
            }

  }

  @Test
  public void shouldEditLastname() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("LastName");
    myAccountSendKeys("LastName", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MobilePhone");
    myAccountSendKeys("MobilePhone", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditAddress() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address1");
    myAccountSendKeys("Address1", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("AddressPrefix");
    myAccountSendKeys("AddressPrefix", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditCity() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditState() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address4");
    myAccountSendKeys("Address4", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("PostalCode");
    myAccountSendKeys("PostalCode", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditCountry() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    Thread.sleep(2);
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableQuestion");
    myAccountSendKeys("MemorableQuestion", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException {
    loginAndVerifySuccess(testusername, testpassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableAnswer");
    myAccountSendKeys("MemorableAnswer", "Testing");
    clickMyAccountSubmit();
  }
}
