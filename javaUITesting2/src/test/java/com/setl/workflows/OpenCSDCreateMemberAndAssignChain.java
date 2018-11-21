package com.setl.workflows;

import com.setl.UI.common.SETLUIHelpers.*;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.workflows.LoginAndNavigateToPage.*;

public class OpenCSDCreateMemberAndAssignChain {
    public static final Logger logger = (Logger) LogManager.getLogger(OpenCSDCreateMemberAndAssignChain.class);

    @Rule
    public ScreenshotRule screenShotRule = new ScreenshotRule();

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenShotRule.setDriver(SetUp.driver);
        loginAndNavigateToPage(SetUp.adminuser, SetUp.adminuserPassword, "menu_members");
        acceptCookies();
        MemberDetailsHelper.navigateToAddNewMemberTab();
    }
    @After
    public void teardown() {

    }
  
    public static void shouldAssignChainToMember() throws InterruptedException {
        PageHelper.selectNewPageToNavigateTo("menu_member_chain_access");
        ChainDetailsHelper.populateChainAccessFields("22", "17", "1", "3");
    }
}
