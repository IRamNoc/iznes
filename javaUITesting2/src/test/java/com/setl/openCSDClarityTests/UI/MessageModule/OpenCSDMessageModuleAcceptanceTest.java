package com.setl.openCSDClarityTests.UI.MessageModule;

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

import java.io.IOException;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.logout;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.sendMessageToSelectedWallet;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.sendMessageToSelectedWalletWithoutRecipient;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.verifyMessageHasBeenReceived;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDMessageModuleAcceptanceTest {

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
    public void shouldSendMessageToWallet() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        sendMessageToSelectedWallet("investor", "c5bg67a", "Hello Investor, please send me all your money", "Your message has been sent!");
        try {
            Thread.sleep(5000);
            logout();
        } catch (Error e) {
            fail("logout button was not clickable");
        }
        verifyMessageHasBeenReceived("investor", "alex01", "c5bg67a");
    }

    @Test
    public void shouldNotSendMessageWithoutRecipient() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        sendMessageToSelectedWalletWithoutRecipient("c5bg66", "TextMessage", "Please fill out all fields");
    }

    @Test
    public void shouldNotSendMessageWithoutSubject() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        sendMessageToSelectedWallet("investor", "", "TextMessage", "Please fill out all fields");
    }

    @Test
    public void shouldNotSendMessageWithoutBodyText() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        sendMessageToSelectedWallet("investor", "c5bg66", "", "Please fill out all fields");
    }


}
