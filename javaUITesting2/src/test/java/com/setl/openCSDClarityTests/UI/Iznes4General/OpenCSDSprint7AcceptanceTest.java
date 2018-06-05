package com.setl.openCSDClarityTests.UI.Iznes4General;

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
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUmbrellaFundExists;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyFundOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds.OpenCSD2FundsAcceptanceTest.validateDatabaseShareExists;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint7AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldInviteInvestorAndCheckDBTG659() throws InterruptedException, SQLException {
        String investorEmail = "jordan.miller@setl.io";

        validateDatabaseInvestorInvited(0, investorEmail);

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Jordan", "Miller", "Success!");

        validateDatabaseInvestorInvited(1, investorEmail);

    }
    @Test
    public void shouldAssertTrueInvitesRecapTG658() throws InterruptedException {
        String investorEmail = "michael.bindley@setl.io";

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Michael", "Bindley", "Success!");

        String email = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-invite-investors/div[2]/section/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[1]/div/clr-dg-cell[3]")).getText();
        assertTrue(email.equals(investorEmail));

    }

    @Test
    public void shouldHaveNextAndPreviousButtonsTG1090() throws IOException, InterruptedException, SQLException {
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = "16614748475934658531";

        validateDatabaseShareExists(0, uShareDetails[0]);

        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("none");
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShareWithoutCharacteristics(uFundDetails[0], uShareDetails[0], uIsin[0]);
    }

    public static void validateDatabaseInvestorInvited ( int expectedCount, String UInvestorEmail) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("select * from setlnet.tblIznInvestorInvitation where email =  " + "\"" + UInvestorEmail + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

}
