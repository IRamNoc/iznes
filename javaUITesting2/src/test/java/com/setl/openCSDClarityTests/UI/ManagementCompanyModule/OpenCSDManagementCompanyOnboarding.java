package com.setl.openCSDClarityTests.UI.ManagementCompanyModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;


import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.ManagementCompanyModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.*;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDManagementCompanyOnboarding {

    JavascriptExecutor jse = (JavascriptExecutor)driver;

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(60000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
        setDBTwoFAOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();

    }

    @Test
    public void TG2624_shouldCreateManagementCompanyAccount() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
    }
    @Test
    public void TG2624_shouldNavigateToManagementCompany() throws InterruptedException {
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
    public void TG2624_ShouldAssertLabelsOnForm() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertPage("Management Company");
        assertPageFormLabels();
    }
    @Test
    public void TG2624_shouldCheckManagementCompanyList() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertPage("Management Company");
        checkManagementCompanyList("Management Company", "am2");
    }
    @Test
    public void TG2624_shouldAssertAssetManagerCompanyDetails() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertManagementCompanyDetailsOnEdit();
    }
    @Test
    public void TG2624_shouldFilLInManagementCompanyForm() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        String[] country = generateAddressDetails();
        String[] SIRET = generateISOSpecificCodes();
        String[] LEI = generateISOSpecificCodes();
        String[] BIC = generateISOSpecificCodes();
        String[] GIIN = generateISOSpecificCodes();
        String[] Address1 = generateAddressDetails();
        String[] Address2 = generateAddressDetails();
        String[] postCode = generateAddressDetails();
        String[] city = generateAddressDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertPageFormLabels();
        fillInManagementCompanyFormData(email[1],country[4], SIRET[4], LEI[0], BIC[1], GIIN[2],Address1[0], Address2[1], postCode[2], city[3]);
    }
    @Test
    public void TG2624_shouldAssertRequiredField() throws InterruptedException {
        String[] password = generateManagementCompanyUserDetails();
        String[] loginName = generateManagementCompanyUserDetails();
        String[] email = generateManagementCompanyUserDetails();
        loginAndVerifySuccess("Emmanuel", "alex01");
        accountCreation(password[2], email[1], loginName[0]);
        logout();
        loginAndVerifySuccess(loginName[0], password[2]);
        navigateToDropdown("menu-management-company");
        assertRequiredFields();
    }
}
