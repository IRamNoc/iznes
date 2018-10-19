package com.setl.openCSDClarityTests.UI.PortfolioManagerOnboarding;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;

import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDPortfolioManagerOnboarding {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

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
        setDBTwoFAOff();
    }

    @Test
    //TODO Sprint 14
    public void TG3065_shouldInviteUserWithPortfolioManagerType()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3067_shouldAssertCompanyNameEqualsNameOfAssociatedFund()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3068_shouldAssetClientReferentialDataGridInformationPostInvite()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3070_shouldAssertRowIsClickableUnderClientReferential()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3070_shouldAssertPageRedirectAndTabLayout()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3063_shouldAssertOnClientReferentialInviteInvestorTypePM()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3064_shouldAssertSelectingPMTypeDisplaysFundListing()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3071_shouldAssertInvitationOnFundListUpdateToPM()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }
}
