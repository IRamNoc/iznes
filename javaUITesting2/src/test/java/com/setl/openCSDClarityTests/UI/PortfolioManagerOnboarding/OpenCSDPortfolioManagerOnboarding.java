package com.setl.openCSDClarityTests.UI.PortfolioManagerOnboarding;import com.setl.UI.common.SETLBusinessData.IBAN;import com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper;import com.setl.UI.common.SETLUtils.RandomData;import com.setl.UI.common.SETLUtils.RepeatRule;import com.setl.UI.common.SETLUtils.ScreenshotRule;import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;import custom.junit.runners.OrderedJUnit4ClassRunner;import org.junit.Before;import org.junit.Ignore;import org.junit.Rule;import org.junit.Test;import org.junit.rules.Timeout;import org.junit.runner.RunWith;import org.openqa.selenium.By;import org.openqa.selenium.JavascriptExecutor;import org.openqa.selenium.Keys;import org.openqa.selenium.WebElement;import org.openqa.selenium.support.ui.WebDriverWait;import java.io.IOException;import java.sql.SQLException;import java.util.ArrayList;import java.util.List;import static SETLAPIHelpers.DatabaseHelper.connectionString;import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.generateEmail;import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.generateRandomTeamReference;import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.generateUser;import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCAcceptMostRecentRequest2;import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessWelcomeToIZNES2;import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.navigateToMemberCreation;import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByClassName;import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.assertPopupNextFundNo;import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.createShare;import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.searchFundsTable;import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAPortfolioManager;import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;import static org.junit.Assert.assertTrue;import static org.junit.Assert.fail;import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;@RunWith(OrderedJUnit4ClassRunner.class)public class OpenCSDPortfolioManagerOnboarding {    @Rule    public ScreenshotRule screenshotRule = new ScreenshotRule();    @Rule    public RepeatRule repeatRule = new RepeatRule();    @Rule    public Timeout globalTimeout = new Timeout(90000);    @Rule    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);    @Before    public void setUp() throws Exception {        testSetUp();        screenshotRule.setDriver(driver);        setDBTwoFAOff();        setDBToProdOff();    }    @Test    public void TG3065_shouldInviteUserWithPortfolioManagerType() throws InterruptedException, SQLException, IOException {        String firstName = "Jordan";String lastName = "Miller";        String AMUsername = "am";String AMPassword = "alex01";        String[] email = generateRandomEmail();        loginAndVerifySuccess(AMUsername, AMPassword);        waitForHomePageToLoad();        navigateToInviteInvestorPage();        inviteAnInvestor(email[0], firstName, lastName, "Success!", "Portfolio Manager");    }    @Test    public void TG3061_shouldSmokeTestPortfolioManagerInvitation() throws Exception {        String managementCompEntered = "Management Company";        String companyName = "PM_Co " + RandomData.getDateTimeStampWithoutBadCharacters();        String phoneNo = "07956701992";        String firstName = "Jordan";        String lastName = "Miller";        String AMUsername = "am";        String AMPassword = "alex01";        String INVPassword = "asdASD123";        String[] email = generateRandomEmail();        loginAndVerifySuccess(AMUsername, AMPassword);        //create Fund and Share for PM        navigateToDropdown("menu-my-products");        navigateToPageByID("menu-product-home");        String[] uFundDetails = generateRandomFundsDetails();        String randomLEI = generateRandomLEI();        String[] uShareDetails = generateRandomShareDetails();        String[] uIsin = generateRandomISIN();        String iban = IBAN.generateRandomIban("FR");        fillOutFundDetailsStep1("no", "none");        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);        assertPopupNextFundNo("Share");        searchFundsTable(uFundDetails[0]);        getFundTableRow(0, uFundDetails[0], randomLEI, "EUR", "Management Company", "Afghanistan","Contractual Fund", "");        createShare(uFundDetails[0], uShareDetails[0], uIsin[0], iban);        ///Invite PM and allocate Fund        navigateToInviteInvestorPage();        List<String> funds = new ArrayList<String>();        funds.add(uFundDetails[0]);        inviteAPortfolioManager(email[0], firstName, lastName, "Success!", funds );        logout();        newInvestorSignUp(email[0], INVPassword);        KYCProcessWelcomeToIZNES2(email[0], companyName, phoneNo, firstName, lastName, managementCompEntered);        //TG3067 - Check the created wallet name is derived from the allocated fund        Thread.sleep(1000); //allow wallet to load if needed        String loadedWalletName = driver.findElement(By.xpath("//span[@class='ui-select-match-text pull-left ng-star-inserted']")).getText();        String[] split = funds.get(0).split(" ");        String walletAccronym = "";        for (String s : split )        {            walletAccronym += s.substring(0,1).toUpperCase();        }        //TG3066 - Checck the automatically created sub portfolio        //Name is EUR account"        //IBAN == Share's IBAN        driver.findElement(By.xpath("//span[@class='sidenav-label'][contains(.,'Sub-portfolio')]")).click();        boolean correctSubPortfolioAccountCreated = driver.findElements(By.xpath("//clr-dg-cell[@class='datagrid-cell ng-star-inserted'][contains(.,'EUR account')]")).size() > 0;        boolean correctIbanPresent = driver.findElements(By.xpath("//span[contains(text(),'"+ iban +"')]")).size() > 0;        logout();        loginAndVerifySuccess(AMUsername, AMPassword);        navigateToDropdown("top-menu-my-clients");        navigateToPageByID("top-menu-onboarding-management");        //click magnifying glass on 'Accepted - Funds Access' grid, company name        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter")).click();        driver.findElement(By.xpath("//input[@name='search']")).sendKeys(companyName + Keys.ENTER);        WebElement parentTable = driver.findElement(By.xpath("//ng-component[@class='ng-star-inserted']//div[4]"));        String companyNameText = parentTable.findElement(By.xpath("//*[@id=\"KYC-grid-CompName-0 \"]")).getText();        assert loadedWalletName.equals("IZN" + "00" + walletAccronym) : String.format("TG3067 Failed. Loaded Wallet name '%s' did not end with expected suffix '%s'", loadedWalletName, "IZN" + "00" + walletAccronym);        assert correctSubPortfolioAccountCreated : "TG3066 Failed. Sub portfolio default name was incorrect";        assert correctIbanPresent : "TG3066 Failed. Sub Portfolio default IBAN is incorrect";        assert companyNameText.equals(companyName) : "TG 3067 Failed. PM's Company name not found";    }    @Test    public void TG3067_shouldAssertCompanyNameEqualsNameOfAssociatedFund()    {    }    @Test    public void TG3068_shouldAssetClientReferentialDataGridInformationPostInvite()throws InterruptedException, SQLException {        System.out.println("Test fulfilled in kyc tests");    }    @Test    //TODO Sprint 14    public void TG3070_shouldAssertRowIsClickableUnderClientReferential()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3070_shouldAssertPageRedirectAndTabLayout()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3063_shouldAssertOnClientReferentialInviteInvestorTypePM()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3064_shouldAssertSelectingPMTypeDisplaysFundListing()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3071_shouldAssertInvitationOnFundListUpdateToPM()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3063_shouldAssertNewInvestorTypeOnInviteScreenPortfolioManager()throws InterruptedException, SQLException {        try {            loginAndVerifySuccess("am", "alex01");            navigateToDropdown("top-menu-my-clients");            navigateToDropdown("top-menu-client-referential");            invitePortfolioManager("Type", "email", "firstName", "lastName", "reference", "language");            assertSendEmailInvitationPopUp();        }catch (Exception e) {            fail("not yet implemented");        }    }    private void assertSendEmailInvitationPopUp() {        /*            Just check that the success pop up is given the user when they have sent the invitation        */    }    private void invitePortfolioManager(String type, String email, String firstName, String lastName, String reference,            String language) {        /*            For this step we want to invite a user type added called Portfolio Manager            Assert the new type is under Investor Type            Assert system allows for the investor to be invited        */    }    @Test    //TODO Sprint 14    public void TG3064_shouldAssertListOfFundsAppearOnSelectingPMType()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3064_shouldAssertInformationInNewFields()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }    @Test    //TODO Sprint 14    public void TG3064_shouldAssertAMMustSelectOneFundFromField()throws InterruptedException, SQLException {        System.out.println("Not Yet Implemented");    }}