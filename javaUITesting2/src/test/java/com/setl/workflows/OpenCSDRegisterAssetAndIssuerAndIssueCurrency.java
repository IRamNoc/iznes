package com.setl.workflows;

import com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper;
import com.setl.UI.common.SETLUIHelpers.SetUp;
import com.setl.UI.common.SETLUIHelpers.WalletDetailsHelper;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.junit.*;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;

public class OpenCSDRegisterAssetAndIssuerAndIssueCurrency {
    public static final Logger logger = (Logger) LogManager.getLogger(OpenCSDRegisterAssetAndIssuerAndIssueCurrency.class);

    @Rule
    public ScreenshotRule screenShotRule = new ScreenshotRule();

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenShotRule.setDriver(SetUp.driver);
        LoginAndNavigateToPage.loginAndNavigateToPage("Payment_Bank1_User1", "alex01", "menu_wallet");
        LoginAndNavigationHelper.acceptCookies();
        WalletDetailsHelper.navigateToActionsTab();
    }
    @After
    public void teardown() {

    }

    public void shouldAssignChainToMember() throws InterruptedException {
        WalletDetailsHelper.selectRegisterIssuer();
        WalletDetailsHelper.actionRegisterIssuerWithNewAddress("Payment_Bank1_Issuer1");
        WalletDetailsHelper.selectRegisterAsset();
        WalletDetailsHelper.actionRegisterAsset("GBP ", "ISIN", "GBP", "GBP", "Pounds Sterling", "Test Co 301 ", "301","Equity", "HKD");
        WalletDetailsHelper.selectNewIssue();
        WalletDetailsHelper.actionNewIssueWithOwnedAddress("1", "10000000", "2", "2");
    }
}
