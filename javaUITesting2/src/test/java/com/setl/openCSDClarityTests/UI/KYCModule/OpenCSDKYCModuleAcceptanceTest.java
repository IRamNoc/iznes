package com.setl.openCSDClarityTests.UI.KYCModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccessAdmin;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.logout;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.password;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleAcceptanceTest {

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

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
    }

    @Test
    public void shouldInviteInvestorsFromTopbarNavigation() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        driver.findElement(By.id("dropdown-user")).click();
        try {
            driver.findElement(By.id("top-menu-invite-investors")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
    }

    @Test
    public void shouldEnterKYCInformationOnFirstLoginAsProfessionalInvestor() throws IOException, InterruptedException{
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToAddUser();
        String[] userDetails = generateRandomUserDetails();
        String newUserName = userDetails[0];
        enterAllUserDetails(newUserName, password);
        logout();
        loginAndVerifySuccessAdmin(newUserName, password);

//        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys("JordanCompany");
//        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07956701992");
//        try {
//            driver.findElement(By.id("btnKycSubmit")).click();
//        }catch (Exception e){
//            fail("FAILED : " +e.getMessage());
//        }
//        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
//        WebElement KYCPopups = wait.until(elementToBeClickable(By.id("addInfo-ok-button")));
//        WebElement KYCPopup = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-my-informations/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3"));
//        assertTrue(KYCPopup.getText().equals("MY INFORMATION"));
//        KYCPopups.click();
    }

    @Test
    public void shouldInviteAnInvestorAndReceiveEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "Jordan", "Miller");
    }

    @Test
    public void shouldInviteAnInvestorWithoutFirstname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "", "Miller");
    }

    @Test
    public void shouldInviteAnInvestorWithoutLastname() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestor("User1@setl.io", "Jordan", "");
    }

    @Test
    public void shouldNotInviteAnInvestorWithoutEmail() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        navigateToTopbarItem("dropdown-user", "top-menu-invite-investors", "ofi-kyc-invite-investors" );
        inviteAnInvestorExpectingFailed("", "Jordan", "Miller");
    }
}
