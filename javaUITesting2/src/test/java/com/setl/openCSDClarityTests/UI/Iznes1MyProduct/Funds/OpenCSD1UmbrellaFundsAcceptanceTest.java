package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds;

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
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUmbrellaFundExists;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

import static org.junit.Assert.*;

import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSD1UmbrellaFundsAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldCreateUmbrellaFund() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(umbFundCount);

        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857432");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        getUmbrellaTableRow(umbFundCount, uFundDetails[0], "16616758475934857432", "Management Company", "Jordan");
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
    }

    @Test
    public void shouldUpdateUmbrellaFund() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String umbFundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[1]/div[1]/a/h2")).getText();
        int umbFundCount = Integer.parseInt(umbFundCountXpath.replaceAll("[\\D]", ""));
        System.out.println(umbFundCount);

        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], "16616758475934857431");
        searchAndSelectTopDropdownXpath("uf_domicile", "Afghanistan");
        submitUmbrellaFund();

        getUmbrellaTableRow(umbFundCount, umbFundDetails[0], "16616758475934857431", "Management Company", "Afghanistan");
        validateDatabaseUmbrellaFundExists(1, umbFundDetails[0]);

        driver.findElement(By.id("product-dashboard-link-umbrellaFundID-" + umbFundCount)).click();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-umbrella-fund/div/h1")));
        String [] updateChars = generateRandomDetails();

        driver.findElement(By.id("uf_umbrellaFundName")).sendKeys(updateChars);
        driver.findElement(By.id("uf_lei")).clear();
        driver.findElement(By.id("uf_lei")).sendKeys("16616758475934857600");
        driver.findElement(By.id("uf_registerOffice")).sendKeys(updateChars);
        driver.findElement(By.id("uf_registerOfficeAddress")).sendKeys(updateChars);
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).clear();
        driver.findElement(By.id("uf_umbrellaFundCreationDate")).sendKeys("2020-10-20");
        selectTopDropdown("uf_managementCompany");
        selectTopDropdown("uf_custodian");
        selectTopDropdown("uf_fundAdministrator");
        searchAndSelectTopDropdownXpath("uf_domicile", "Albania");
        scrollElementIntoViewById("mcBtnSubmitForm");
        wait.until(visibilityOfElementLocated(By.id("mcBtnSubmitForm")));
        wait.until(elementToBeClickable(driver.findElement(By.id("mcBtnSubmitForm"))));

        driver.findElement(By.id("mcBtnSubmitForm")).click();
        wait.until(visibilityOfElementLocated(By.id("am-product-home")));
        getUmbrellaTableRow(umbFundCount, umbFundDetails[0] + updateChars[0], "16616758475934857600", "Management Company", "Albania");

        validateDatabaseUmbrellaFundExists(1, umbFundDetails[0] + updateChars[0]);
        validateDatabaseUmbrellaFundExists(0, umbFundDetails[0]);

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
        navigateToPageByID("menu-product-home");
        validatePageLayout();
    }

    @Test
    public void shouldSeeCorrectHeadingsForUmbrellaFunds() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        validateUmbrellaFundsDataGridHeadings(umbrellaFundsHeadings);
    }

    @Test
    @Ignore("need to ensure that we have the correct Umbrella fund details")
    public void shouldCreateAnUmbrellaFundAndCheckDataBase() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857433");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        validateDatabaseUmbrellaFundExists(1, uFundDetails[0]);
        try {
            String umbFundName = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-umbrellaFundName\"]/span")).getText();
            String umbFundLEI = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-legalEntityIdentifier\"]/span")).getText();
            String umbFundManagement = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-managementCompany\"]/span")).getText();
            String umbFundCountry = driver.findElement(By.xpath("//*[@id=\"product-dashboard-umbrellaFundID-0-domicile\"]/span")).getText();
            System.out.println(umbFundName + ", " + umbFundLEI + ", " + umbFundManagement + ", " + umbFundCountry);
            System.out.println(uFundDetails[0]);
            assertTrue(umbFundName.equals(uFundDetails[0]));
            assertTrue(umbFundLEI.equals("16616758475934857433"));
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
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857434");
        searchAndSelectTopDropdownXpath("uf_domicile", "France");
        assertTrue(driver.findElement(By.id("uf_centralizingAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfLuxembourgIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857435");
        searchAndSelectTopDropdownXpath("uf_domicile", "Luxembourg");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldShowTransferAgentIfIrelandIsSelected() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857436");
        searchAndSelectTopDropdownXpath("uf_domicile", "Ireland");
        assertTrue(driver.findElement(By.id("uf_transferAgent")).isDisplayed());
    }

    @Test
    public void shouldIncreaseTitleNumberWhenUmbrellaFundIsCreated() throws InterruptedException, IOException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        String preCreationNo = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int i = Integer.parseInt(preCreationNo.replaceAll("[\\D]", ""));
        System.out.println(i);
        selectAddUmbrellaFund();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857437");
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
    public void shouldUpdateUmbrellaFunds() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("product-dashboard-umbrellaFundID-0-umbrellaFundName")));
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
