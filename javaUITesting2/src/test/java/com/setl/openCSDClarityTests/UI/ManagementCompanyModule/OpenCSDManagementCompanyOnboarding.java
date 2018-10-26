package com.setl.openCSDClarityTests.UI.ManagementCompanyModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;

import org.apache.xpath.SourceTree;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;

import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomEmail;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomLEI;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomSubPortfolioIBAN;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds.OpenCSD2FundsAcceptanceTest.getInvestorInvitationToken;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDManagementCompanyOnboarding {

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
    //TODO Sprint 14
    public void TG3113_shouldNavigateManagementCompanyAndViewFormStructure()throws InterruptedException, SQLException {
        try{
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("management-company");
            assertPage("management-company");
            assertPageFrom();
        }catch (Exception e) {
            fail("Not yet implemented");
        }
    }
    
    private void assertPageFrom() {
        /*
        Email Address - Test Field - email
        Management Company Name - Text Field
        Legal Form - List
        Registered Company's Headquarters address - Address Field
        ZIP/Postal code - Address Field
        City - Text Field
        County - List
        County of Tax Residence - List
        Supervisory Authority - Text Field
        RCS Matriculation - Text Field
        Identification Number (SIRENT/ SIREN) - Text Field
        Share Capital - €
        LEI Code - Text Field
        BIC Code - Text Field
        Commercial Contract - Text Field
        Operational Contract - Text Field
        Director Contract - Text Field
        Management Company Website Address - Text Field
        Management Company Phone Number - Text Field
        **There are 2 Mandatory document Fields, these will be turned off in the DB Prod**
        */
    }

    private void assertPage(String pageHeader) {
        /*
            Make this resuable if possible
        */
    }

    @Test
    //TODO Sprint 14
    public void TG2676_shouldFillInManagementCompanyFormData()throws InterruptedException, SQLException {
        try{
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("management-company");
            assertPage("management-company");
            fillInManagementCompanyFormData(/*insert static data*/);
            assertPageFrom();
        }catch (Exception e){
            fail("Not yet implemented");
        }
    }

    private void fillInManagementCompanyFormData(/*User static Data, does not need to be dynamic*/) {
        /*
        Email Address - Test Field - (email validation)
        Management Company Name - Text Field - (no validation)
        Legal Form - List - (Select from dropdown)
        Registered Company's Headquarters address - Address Field
        ZIP/Postal code - Address Field
        City - Text Field - (no validation)
        County - List - (Select from dropdown)
        County of Tax Residence - List - (Select from dropdown)
        Supervisory Authority - Text Field - (no validation)
        RCS Matriculation - Text Field - (no validation)
        Identification Number (SIRENT/ SIREN) - Text Field - (no validation)
        Share Capital - € - (currency validation)
        LEI Code - Text Field - (LEI Validation) - "2594007XIACKNMUAW223"
        BIC Code - Text Field - (BIC Validation) - "TBNFFR43PAR"
        Commercial Contract - Text Field - (no validation)
        Operational Contract - Text Field - (no validation)
        Director Contract - Text Field - (no validation)
        Management Company Website Address - Text Field - (no validation)
        Management Company Phone Number - Text Field - (no validation)
        There are 2 Mandatory document Fields, these will be turned off in the db Prod
        */
    }

    @Test
    //TODO Sprint 14
    public void TG2680_shouldSendInvitationToSuperAdminUser()throws InterruptedException, SQLException {
        try{
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("management-company");
            assertPage("management-company");
            fillInManagementCompanyFormData(/*insert static data*/);
            assertPageFrom();
            submitManagementCompanyForm();
            assertEmailBodySentToManagementCompany("email");
        }catch (Exception e) {
            fail("Not yet implemented");
        }
    }
    private void assertEmailBodySentToManagementCompany(String email) {
        /*
        Subject: "Invitation provenant de IZNES pour créer votre compte"
        Body:   "Bonjour,

                Vous recevez cet e-mail suite à la demande de création de votre compte sur la plateforme IZNES.
                Nous avons créer le compte de votre société de gestion dont vous êtes l'administrateur.
                Plus que quelques étapes avant de rejoindre la communauté IZNES:
                Votre username est [emailAddress]
                [CLIQUER ICI POUR COMMENCER]
                Merci de votre confiance, et à très bientôt sur IZNES.
                L'équipe IZNES."
        Link Button: should re-direct to iZNES login Page
        */
    }
    private void submitManagementCompanyForm() {
        /*
        not sure what the sumbit method will be or if there is any confirmation modal, include any confirmation popups or toasters in this method please.
         */
    }
    @Test
    //TODO Sprint 14
    public void TG2684_shouldValidatePasswordAndSignupRedirect()throws InterruptedException, SQLException {
        try{
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("management-company");
            assertPage("management-company");
            fillInManagementCompanyFormData(/*insert static data*/);
            assertPageFrom();
            submitManagementCompanyForm();
            assertEmailBodySentToManagementCompany("email");
            accountCreationStepOne("password", "userName/emailAddress"); //TG2882 added to the same test as it is a require process
            //<---insert 2FA login here if applicable
            accountCreationStepTwo("email", "invitedBy", "companyName", "firstName", "lastName", "phoneNumber"); //TG2684
        }catch (Exception e) {
            fail("not yet implemented");
        }
    }
    private void accountCreationStepOne(String password, String email) {
        /*
        For this step (1) we need to have the same process as the investor invite, username = email is already prfilled and read only, user must enter a password that complies with existing validation "asdASD123"
        */
    }

    private void accountCreationStepTwo(String email, String invitedBy, String companyName, String firstName,
            String lastName, String phoneNumber) {
        /*
        For this step (2) we need to pass the required fields for the sign up process, once the user is on the "CompanyDetails" similiar to the investor creation page.
        */
    }

    @Test
    //TODO Sprint 14
    public void TG2831_shouldAssertPageFormDataOnOrderBook()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2832_shouldAssertActionsColumnIsRemoved()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2833_shouldAssertExportButtonIsVisibleAndClickable()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2974_shouldAssertOptionalFieldAssetManagementCompany()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2975_shouldAssertOptionalFilterInvestor()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2976_shouldAssertOptionalFilterPortfolio()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG2977_shouldAssertPortfolioFilterResult()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

}
