package com.setl.openCSDClarityTests.UI.Iznes0Navigation;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.DisableOnDebug;
import org.junit.rules.TestRule;
import org.junit.rules.Timeout;

import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOn;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.logout;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;

public class OpenCSDLoginAccetpanceTests
{
    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public TestRule timeout = new DisableOnDebug(Timeout.seconds(60));
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        //setDBTwoFAOff();
    }
    @After
    public void teardown() throws SQLException
    {
        setDBTwoFAOff();
    }


    @Test
    public void shouldLogInWith2FA() throws InterruptedException, SQLException
    {
        setDBTwoFAOn();
        loginAndVerifySuccess("am", "alex01");
        logout();
        loginAndVerifySuccess("am", "alex01");

    }

    //@Test
    public void ON() throws SQLException
    {
        setDBTwoFAOn();
    }
    //@Test
    public void OFF() throws SQLException
    {
        setDBTwoFAOff();
    }


}
