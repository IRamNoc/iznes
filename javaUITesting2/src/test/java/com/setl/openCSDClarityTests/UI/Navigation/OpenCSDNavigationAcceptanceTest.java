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
    public Timeout globalTimeout = Timeout.seconds(300);
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
        navigateToPage("home");
        clickLoginButton();
    }
    @Test
    public void shouldNavigateToWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("wallets");
        clickLoginButton();
    }
    @Test
    public void shouldNavigateToKYCAdmin() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("kyc-admin");

    }
    @Test
    public void shouldNavigateToManageOrders() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("orders");
    }
    @Test
    public void shouldNavigateToUsers() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/users");
    }
    @Test
    public void shouldNavigateToUserWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/wallets");
    }
    @Test
    public void shouldNavigateToPermissions() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/permissions");
    }
    @Test
    public void shouldNavigateToWizard() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administration");
        navigateToPage("user-administration/wizard");
    }
    @Test
    public void shouldNavigateToRegisterIssuer() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage("asset-servicing/register-issuer");
    }
    @Test
    public void shouldNavigateToRegisterAsset() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage("asset-servicing/register-asset");
    }
    @Test
    public void shouldNavigateToIssueAsset() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-servicing");
        navigateToPage("asset-servicing/issue-asset");
    }
    @Test
    public void shouldNavigateToBalancesReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage("reports/balances");
    }
    @Test
    public void shouldNavigateToIssueReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage("reports/issue");
    }
    @Test
    public void shouldNavigateToTransactionReports() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-reports");
        navigateToPage("reports/transactions");
    }
    @Test
    public void shouldNavigateToMember() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-member");
    }
    @Test
    public void shouldNavigateToAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/manage-account");
    }
    @Test
    public void shouldNavigateToChainMember() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-chain-administration");
        navigateToPage("chain-admin/chain-membership");
    }
    @Test
    public void shouldNavigateToFundHoldings() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-asset-managment");
        navigateToPage("asset-managment/fund-holdings");
    }
    @Test
    public void shouldNavigateToMyAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/my-account");
    }
    @Test
    public void shouldNavigateToRelationships() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/relationships");
    }
    @Test
    public void shouldNavigateToDocuments() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/documents");
    }
    @Test
    public void shouldNavigateToManagementCompany() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-module/management-company");
    }
    @Test
    public void shouldNavigateToSICAV() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-module/sicav");
    }
    @Test
    public void shouldNavigateToFund() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-module/fund");
    }
    @Test
    public void shouldNavigateToNetAssetValue() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-product-module");
        navigateToPage("product-module/net-asset-value");
    }
    @Ignore
    @Test
    public void shouldNavigateToCreateResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/create-resolution");
    }
    @Ignore
    @Test
    public void shouldNavigateToIssueResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/issue-resolution");
    }
    @Ignore
    @Test
    public void shouldNavigateToDistribution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/distribution");
    }
    @Ignore
    @Test
    public void shouldNavigateToMergerAbsorption() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/merger-absorption");
    }
    @Ignore
    @Test
    public void shouldNavigateToCouponPayment() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/coupon-payment");
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
