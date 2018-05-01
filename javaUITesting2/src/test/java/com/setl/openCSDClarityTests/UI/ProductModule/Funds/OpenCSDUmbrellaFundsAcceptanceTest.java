package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

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
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;

import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUmbrellaFundExists;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.openCSDClarityTests.UI.General.OpenCSDGeneralAcceptanceTest.fundCheckRoundingUp;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDUmbrellaFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldNavigateToSharesFundsUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String pageHeading = driver.findElement(By.id("am-product-home")).getText();
        assertTrue(pageHeading.equals("Shares / Funds / Umbrella funds"));
    }

    @Test
    public void shouldDisplaySameTitleIconAsNavIcon() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String headingIcon = driver.findElement(By.xpath("//*[@id=\"am-product-home\"]/i")).getAttribute("class");
        String navIcon = driver.findElement(By.xpath("//*[@id=\"menu-product-home\"]/i")).getAttribute("class");
        assertTrue(headingIcon.equals(navIcon));
    }

    @Test
    public void shouldSeeCorrectFieldsOnSharesFundsUmbrellaFundsPage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        validatePageLayout();
    }

    @Test
    public void shouldSeeCorrectHeadingsForUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        validateUmbrellaFundsDataGridHeadings(umbrellaFundsHeadings);
    }

    @Test
    public void shouldCreateAnUmbrellaFundAndCheckDataBase() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
        try {
            String umbFundName = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).getText();
            String umbFundLEI = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-legalEntityIdentifier\"]/span")).getText();
            String umbFundManagement = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-managementCompany\"]/span")).getText();
            String umbFundCountry = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-domicile\"]/span")).getText();
            System.out.println(umbFundName + ", " + umbFundLEI + ", " + umbFundManagement + ", " + umbFundCountry);
            assertTrue(umbFundName.equals(uFundDetails[0]));
            assertTrue(umbFundLEI.equals("testLei"));
            assertTrue(umbFundManagement.equals("Management Company"));
            assertTrue(umbFundCountry.equals("Jordan"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void shouldShowTransferAgentIfFranceIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "France");
        assertTrue(driver.findElement(By.id("uf_centralizingAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfLuxembourgIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Luxembourg");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfIrelandIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Ireland");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldIncreaseTitleNumberWhenUmbrellaFundIsCreated() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        String preCreationNo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int i = Integer.parseInt(preCreationNo.replaceAll("[\\D]", ""));
        System.out.println(i);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0]);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")));

            String postCreationNo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
            assertNotEquals(postCreationNo, preCreationNo + 1);
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    public void shouldUpdateUmbrellaFund() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPage("product-module");
        String umbFundNamePrev = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
        try {
            driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }
        assertTrue(driver.findElement(By.id("uf_umbrellaFundName")).isDisplayed());
        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys("Updated");
        driver.findElement(By.id("mcBtnSubmitForm")).click();
        try {
            String popup = driver.findElement(By.className("toast-title")).getText();
            assertTrue(popup.contains("has been successfully updated!"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
        try {
            String umFundName = driver.findElement(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")).getText();
            assertTrue(umFundName.equals(umbFundNamePrev + "Updated"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
