package com.setl.openCSDClarityTests.UI.Navigation;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDNavigationAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDNavigationAcceptanceTest.class);

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
    public void shouldNavigateToMessages() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
        verifyHomePageIsDisplayed();
        navigateToAddressesTab();
        verifyHomePageIsDisplayed();
    }
    @Test
    public void shouldNavigateToHome() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
        navigateToPage2("home");

    }
    @Ignore // test fails becuse it can't find the xpath
    @Test
    public void shouldNavigateToWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage2("wallets");

    }
    @Ignore
    @Test
    public void shouldNavigateToKYCAdmin() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage2("kyc-admin");

    }
    @Ignore
    @Test
    public void shouldNavigateToManageOrders() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage2("manage-orders");
    }
    @Test
    public void shouldNavigateToUsers() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage2("user-administration/users");
    }
    @Test
    public void shouldNavigateToUserWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage2("user-administration/wallets");
    }
    @Test
    public void shouldNavigateToPermissions() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage2("user-administration/permissions");
    }
    @Ignore
    @Test
    public void shouldNavigateToWizard() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage2("user-administration/wizard");
    }
    @Test
    public void shouldNavigateToRegisterIssuer() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage2("asset-servicing/register-issuer");
    }
    @Test
    public void shouldNavigateToRegisterAsset() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage2("asset-servicing/register-asset");
    }
    @Test
    public void shouldNavigateToIssueAsset() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage2("asset-servicing/issue-asset");
    }
    @Ignore
    @Test
    public void shouldNavigateToBalancesReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage2("reports/balances");
    }
    @Ignore
    @Test
    public void shouldNavigateToIssueReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage2("reports/issue");
    }
    @Ignore
    @Test
    public void shouldNavigateToTransactionReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage2("reports/transactions");
    }
    @Ignore
    @Test
    public void shouldNavigateToMember() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage2("chain-admin/manage-member");
    }
    @Ignore
    @Test
    public void shouldNavigateToChainMember() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage2("chain-admin/chain-membership");
    }
    @Ignore
    @Test
    public void shouldNavigateToFundHoldings() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-managment");
        navigateToPage2("asset-managment/fund-holdings");
    }
    @Ignore
    @Test
    public void shouldNavigateToMyAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/my-account");
    }
    @Ignore
    @Test
    public void shouldNavigateToRelationships() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/relationships");
    }
    @Ignore
    @Test
    public void shouldNavigateToDocuments() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage2("account/documents");
    }
    @Ignore
    @Test
    public void shouldNavigateToManagementCompany() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/management-company");
    }
    @Ignore
    @Test
    public void shouldNavigateToSICAV() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/sicav");
    }
    @Ignore
    @Test
    public void shouldNavigateToFund() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/fund");
    }
    @Ignore
    @Test
    public void shouldNavigateToNetAssetValue() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/net-asset-value");
    }
    @Ignore
    @Test
    public void shouldNavigateToCreateResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/create-resolution");
    }
    @Ignore
    @Test
    public void shouldNavigateToIssueResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/issue-resolution");
    }
    @Ignore
    @Test
    public void shouldNavigateToDistribution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/distribution");
    }
    @Ignore
    @Test
    public void shouldNavigateToMergerAbsorption() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/merger-absorption");
    }
    @Ignore
    @Test
    public void shouldNavigateToCouponPayment() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/coupon-payment");
    }
    @Ignore
    @Test
    public void shouldNavigateToSplit() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/split");
    }
    @Test
    public void shouldNavigateToMessagesFromTopButtons() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        try {
          driver.findElement(By.xpath("//a[@href='#/messages']")).click();
        }catch (Error e){
          System.out.println("logout button not present");
          fail();
        }
    }
}
