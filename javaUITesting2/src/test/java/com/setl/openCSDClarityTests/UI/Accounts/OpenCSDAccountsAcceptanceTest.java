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

import java.io.IOException;
import java.sql.*;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
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
  public void shouldEditDisplayname() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("DisplayName");
    myAccountSendKeys("DisplayName", "Testing");
    clickMyAccountSubmit();
  }
  @Ignore
  @Test
  //Looks like theres a problem connecting to the database, ignored for now
  public void shouldEditFirstname() throws IOException, InterruptedException, SQLException {



            Connection conn = DriverManager.getConnection(connectionString, username, password);
            ResultSet rs;
            Statement stmt = conn.createStatement();
            conn.createStatement();

            rs = stmt.executeQuery("select * FROM tblUserDetails where firstName = \"null\" ");

            int rows = 0;

            // check there is only one result( there should be!! )
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


    loginAndVerifySuccess(adminuser, adminuserPassword);
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
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("LastName");
    myAccountSendKeys("LastName", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MobilePhone");
    myAccountSendKeys("MobilePhone", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditAddress() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address1");
    myAccountSendKeys("Address1", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("AddressPrefix");
    myAccountSendKeys("AddressPrefix", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditCity() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditState() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address4");
    myAccountSendKeys("Address4", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("PostalCode");
    myAccountSendKeys("PostalCode", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditCountry() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    Thread.sleep(2);
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableQuestion");
    myAccountSendKeys("MemorableQuestion", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableAnswer");
    myAccountSendKeys("MemorableAnswer", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditProfileText() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    //myAccountClearField("ProfileText");
    //myAccountSendKeys("ProfileText", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldResetAllMyAccountDetails() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("FirstName");
    myAccountSendKeys("FirstName", "null");
    myAccountClearField("LastName");
    myAccountSendKeys("LastName", "null");
    myAccountClearField("MobilePhone");
    myAccountSendKeys("MobilePhone", "null");
    myAccountClearField("Address1");
    myAccountSendKeys("Address1", "null");
    myAccountClearField("AddressPrefix");
    myAccountSendKeys("AddressPrefix", "null");
    myAccountClearField("Address3");
    myAccountSendKeys("Address3", "null");
    myAccountClearField("Address4");
    myAccountSendKeys("Address4", "null");
    myAccountClearField("PostalCode");
    myAccountSendKeys("PostalCode", "null");
    myAccountClearField("MemorableQuestion");
    myAccountSendKeys("MemorableQuestion", "null");
    myAccountClearField("MemorableAnswer");
    myAccountSendKeys("MemorableAnswer", "null");
    clickMyAccountSubmit();
  }
}
