package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.openDropdownAndSelectOption;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.WalletsDetailsHelper.selectLEIFromLEISearch;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.searchSelectTopOptionXpath;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class KYCDetailsHelper extends LoginAndNavigationHelper {

    public static void KYCProcessWelcomeToIZNES(String testUserNo) throws SQLException, InterruptedException {
        String kycEmail = driver.findElement(By.id("kyc_additionnal_email")).getAttribute("value");
        assertTrue(kycEmail.equals("testops" + testUserNo + "@setl.io"));
        String kycInvitedBy = driver.findElement(By.id("kyc_additionnal_invitedBy")).getAttribute("value");
        assertTrue(kycInvitedBy.equals("Management Company"));
        String kycFirstName = driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value");
        assertTrue(kycFirstName.equals("Jordan" + testUserNo));
        String kycLastName = driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value");
        assertTrue(kycLastName.equals("Miller" + testUserNo));
        driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys("Jordan Corp");
        openDropdownAndSelectOption("kyc_additionnal_phoneCode", 1);
        String disabled = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
        assertTrue(disabled.equals("true"));
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07956701992");
        driver.findElement(By.id("btnKycSubmit")).click();
        try {
            String header2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(header2.equals("My Information"));
        }catch (Exception e){fail(e.getMessage());}
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button")).click();
    }

    public static void KYCProcessMakeNewRequest() throws SQLException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")));
        String myRequests = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText();
        assertTrue(myRequests.equals("My requests"));
        driver.findElement(By.id("kyc-newRequestBtn")).click();
        String newRequests = driver.findElement(By.id("new-request-title")).getText();
        assertTrue(newRequests.equals("Make a new request"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")));
    }

    public static void KYCProcessStep1(String managementCompanyEntered, String alreadyRegistered) throws SQLException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")).sendKeys(managementCompanyEntered);
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/ul/li[1]/div/a")).click();
        if (alreadyRegistered.equals("Yes")){
            js.executeScript("document.getElementById('registered_1').click();");
            Thread.sleep(1500);
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[3]")));
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[4]")));
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[5]")));
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[6]")));
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[2]")));
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[1]")));
            String warning = driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[2]/div/div/span[2]")).getText();
            assertTrue(warning.equals("Warning: if you select Yes in the following table, you will not be able to benefit from all the KYC features of IZNES."));
        }

        try {
            String selectionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[1]/div/div[1]")).getAttribute("class");
            assertTrue(selectionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
    }

    public static void KYCProcessStep2() throws SQLException, InterruptedException {
        Thread.sleep(750);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e){fail(e.getMessage());}
        Thread.sleep(1000);
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[2]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
    }

    public static void KYCProcessStep4() throws SQLException, InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[3]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
        Thread.sleep(750);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e){fail(e.getMessage());}
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[4]/kyc-step-risk-profile/h3")));
        String subHeadingStep4 = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[4]/kyc-step-risk-profile/h3")).getText();
        assertTrue(subHeadingStep4.equals("RISK PROFILE DEFINITION"));
        Thread.sleep(750);
        System.out.println("Step 4");
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[1]/a/h2")).click();
        Thread.sleep(1000);
        String investmentsNaturePercent = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        assertTrue(investmentsNaturePercent.equals("0%"));
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.getElementById('Weekly').click();");
        js.executeScript("document.getElementById('internalManagement').click();");
        js.executeScript("document.getElementById('Bonds').click();");
        String investmentsNaturePercentPost = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Investments' Nature : " + investmentsNaturePercentPost);
        assertTrue(investmentsNaturePercentPost.equals("100%"));
        Thread.sleep(1000);
        try {
            driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-nature/div/div[1]/div[1]/a/h2")).click();
        }catch (Exception e){
            fail(e.getMessage()); }
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[1]/div[1]/a/h2")).click();
        Thread.sleep(750);
        js.executeScript("document.getElementById('Capitalpreservation-0').click();");
        js.executeScript("document.getElementById('PortfolioComponentDiversification-0').click();");
        js.executeScript("document.getElementById('Notimeconstraints-0').click();");
        searchSelectTopOptionXpath("Guaranteed Capital", "//*[@id=\"riskProfile-0\"]/div", "//*[@id=\"riskProfile-0\"]/div/div[3]/div/input", "//*[@id=\"riskProfile-0\"]/div/div[3]/ul/li[1]/div/a");
        scrollElementIntoViewByXpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[2]/div/div/investment-objective-form/div/div[5]/table");
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[2]/div/div/investment-objective-form/div/div[5]/table/tbody/tr[1]/td[1]/input")).sendKeys("25");
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[2]/div/div/investment-objective-form/div/div[5]/table/tbody/tr[2]/td[1]/input")).sendKeys("25");
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[2]/div/div/investment-objective-form/div/div[5]/table/tbody/tr[3]/td[1]/input")).sendKeys("25");
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[2]/div/div/investment-objective-form/div/div[5]/table/tbody/tr[4]/td[1]/input")).sendKeys("25");
        String investmentsObjectivesPercentPost = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Investments' Objectives : " + investmentsObjectivesPercentPost);
        assertTrue(investmentsObjectivesPercentPost.equals("100%"));
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-objective/div/div[1]/div[1]/a/h2")).click();
        String investmentsConstraintsPercentPost = driver.findElement(By.xpath("//*[@id=\"step-risk-profile\"]/investment-constraint/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Investments' Constraints : " + investmentsConstraintsPercentPost);
        assertTrue(investmentsConstraintsPercentPost.equals("100%"));
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[4]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e){
            fail(e.getMessage());}
    }
    public static void KYCProcessStep5() throws SQLException, InterruptedException, IOException {
        Thread.sleep(750);
        System.out.println("Step 5");
        String documentsPercentPost = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[2]/div/section[5]/kyc-step-documents/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Documents : " + documentsPercentPost);
        assertTrue(documentsPercentPost.equals("100%"));
        Thread.sleep(750);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[3]/button[3]")).click();
        }catch (Exception e) {
            fail(e.getMessage());}
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[5]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
    }

    public static void KYCProcessStep6(String fullName, String behalfName, String cityName, String repTitle) throws SQLException, InterruptedException, IOException {
        driver.findElement(By.xpath("//*[@id=\"step-validation\"]/div/div/p[1]/input[1]")).sendKeys(fullName);
        driver.findElement(By.xpath("//*[@id=\"step-validation\"]/div/div/p[1]/input[2]")).sendKeys(behalfName);
        driver.findElement(By.id("doneAt")).sendKeys(cityName);
        driver.findElement(By.id("positionRepresentative")).sendKeys(repTitle);
        String validationPercentPost = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[2]/div/section[6]/kyc-step-validation/div/div[1]/div[2]/div/div[1]/div/div/div/span")).getText();
        System.out.println("Validation : " + validationPercentPost);
        assertTrue(validationPercentPost.equals("100%"));
        try {
            String introductionStepKYC = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[3]/div[1]/div/div[6]")).getAttribute("class");
            assertTrue(introductionStepKYC.equals("fs-active"));
        }catch (Exception e){fail(e.getMessage());}
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[3]/button[4]")).click();
        }catch (Exception e){
            fail(e.getMessage());}
    }

    public static void KYCProcessRequestListValidation(String modalPresent, String modalTitles, String managementCompanyEntered, String expectedStatus) throws SQLException, InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        if (modalPresent.equals("Yes")){
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
            String modalTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")).getText();
            assertTrue(modalTitle.equals(modalTitles));
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")));
        }else {
            assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText().equals("My requests"));
            String managementComp = driver.findElement(By.cssSelector("my-requests-list > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row:nth-child(1) > div > clr-dg-cell:nth-child(1)")).getText();
            assertTrue(managementComp.equals(managementCompanyEntered));
            String kycStatus = driver.findElement(By.cssSelector("my-requests-list > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(2) > span")).getText();
            System.out.println("Expected Waiting approval, Resulted in " + kycStatus);
            assertTrue(kycStatus.equals(expectedStatus));
        }
    }

    public static void KYCProcessClose() throws SQLException, InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/ng-component/div[3]/div[3]/button[2]")).click();
        }catch (Exception e){
            fail(e.getMessage());}
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")));
        String pageHeading = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText();
        assertTrue(pageHeading.equals("My requests"));
    }


}