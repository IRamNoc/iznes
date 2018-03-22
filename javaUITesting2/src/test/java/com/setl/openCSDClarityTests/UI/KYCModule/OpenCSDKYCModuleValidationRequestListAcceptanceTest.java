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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDKYCModuleValidationRequestListAcceptanceTest {

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
    public void shouldSeeCorrectFieldsOnKYCDocumentsPageTG_633() throws IOException, InterruptedException{
        loginAndVerifySuccess("am", "trb2017");
        driver.findElement(By.id("dropdown-user")).click();
        try {
            driver.findElement(By.id("top-menu-kyc-documents")).click();
        }catch (Exception e){
            fail("FAILED : " + e.getMessage());
        }
        validateKYCPageComponents();
    }

    private void validateKYCPageComponents() {
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-align-left")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[1]/h1/span")).getText().contentEquals("KYC Documents"));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[2]/p")));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[2]/p")).getText().contentEquals("Here's a list of all clients' KYC, organised by status:"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[3]/div[1]/div/a")).getText().contains("Waiting for Approval"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[4]/div[1]/div/a")).getText().contains("Accepted - Funds Access Authorizations"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[5]/div[1]/div/a")).getText().contains("Awaiting for more information from your client"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[6]/div[1]/div/a")).getText().contains("Rejected"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[7]/div[1]/div/a")).getText().contains("Started by your clients"));

        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/i")));
        assertTrue(isElementPresent(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")));
        System.out.println(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")).getText());
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a")).getText().contains("All your KYC and Client Folders"));
    }
}
