package com.setl.openCSDClarityTests.UI.ProductModule.Funds;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestRule;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewFundShareTitle;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDNAVAcceptanceTest {

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
    public void shouldDisplayCorrectFieldsOnNAVPageTG204() throws InterruptedException {
        navigateToNAVPage("am", "alex01");
        validateNAVPageLayout();
        validateNAVDataGridHeadings(NAVHeadings);
    }
}
