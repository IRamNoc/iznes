package com.setl.openCSDClarityTests.UI.ManagementCompanyModule;

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
import org.openqa.selenium.JavascriptExecutor;

import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.generateEmail;
import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.generateUser;
import static com.setl.UI.common.SETLUIHelpers.ManagementCompanyModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.*;
import com.setl.UI.common.SETLUIHelpers.ManagementCompanyModuleHelper;

import javax.xml.soap.Text;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDManagementCompanyOnboarding {

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
    public void TG3113_shouldNavigateToManagementCompany() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertPage("Management Company");
    }
    @Test
    public void TG3113_ShouldAssertLabelsOnForm() throws InterruptedException {
        TG3113_shouldNavigateToManagementCompany();
        assertPageFormLabels();
    }
}
