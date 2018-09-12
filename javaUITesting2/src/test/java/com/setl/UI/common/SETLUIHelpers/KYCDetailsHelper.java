package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.openDropdownAndSelectOption;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.WalletsDetailsHelper.selectLEIFromLEISearch;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.searchSelectTopOptionXpath;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class KYCDetailsHelper extends LoginAndNavigationHelper {

    public static void KYCProcessWelcomeToIZNES(String testUserNo, String companyName, String phoneNumber) throws SQLException, InterruptedException {
        String kycEmail = driver.findElement(By.id("kyc_additionnal_email")).getAttribute("value");
        assertTrue(kycEmail.equals("testops" + testUserNo + "@setl.io"));

        String kycInvitedBy = driver.findElement(By.id("kyc_additionnal_invitedBy")).getAttribute("value");
        assertTrue(kycInvitedBy.equals("Management Company"));

        String kycFirstName = driver.findElement(By.id("kyc_additionnal_firstName")).getAttribute("value");
        assertTrue(kycFirstName.equals("Jordan" + testUserNo));

        String kycLastName = driver.findElement(By.id("kyc_additionnal_lastName")).getAttribute("value");
        assertTrue(kycLastName.equals("Miller" + testUserNo));

        if(companyName.equals("")){
            driver.findElement(By.id("btnKycSubmit")).click();
            String disabled = driver.findElement(By.xpath("//*[@id=\"btnKycSubmit\"]")).getAttribute("disabled");
            assertTrue(disabled.equals("true"));
        }else{
            if(phoneNumber.equals("")){
                driver.findElement(By.id("btnKycSubmit")).click();
                String disabled = driver.findElement(By.xpath("//*[@id=\"btnKycSubmit\"]")).getAttribute("disabled");
                assertTrue(disabled.equals("true"));
            }else {
                driver.findElement(By.id("kyc_additionnal_companyName")).sendKeys(companyName);
                openDropdownAndSelectOption("kyc_additionnal_phoneCode", 1);
                String disabled = driver.findElement(By.id("btnKycSubmit")).getAttribute("disabled");
                assertTrue(disabled.equals("true"));
                driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(phoneNumber);
                driver.findElement(By.id("btnKycSubmit")).click();
                try {
                    String header2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
                    assertTrue(header2.equals("My Information"));
                } catch (Exception e) {
                    fail(e.getMessage());
                }
                driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button")).click();
            }
        }
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

    public static void KYCProcessStep1(String managementCompanyEntered, String alreadyRegistered, String multipleAMs, String managementCompany2Entered) throws SQLException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")));
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")).sendKeys(managementCompanyEntered);
        driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/ul/li[1]/div/a")).click();

        if (multipleAMs.equals("True")){
            driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select")).click();
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")));
            driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/div/input")).sendKeys(managementCompany2Entered);
            driver.findElement(By.xpath("//*[@id=\"step-selection\"]/div[1]/div/ng-select/div/div[2]/ul/li[1]/div/a")).click();
        }

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

    public static void KYCProcessRequestListValidation(String modalPresent, String modalTitles, String managementCompanyEntered, String expectedStatus, String multipleAMs, String managementCompany2Entered, String expectedStatus2) throws SQLException, InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);


        if (modalPresent.equals("Yes")){
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
            String modalTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")).getText();
            assertTrue(modalTitle.equals(modalTitles));
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")));
        }else {
            System.out.println("Failed to created KYC Request");
            fail();}
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/ng-component/div[1]/h1")).getText().equals("My requests"));
        String managementComp = driver.findElement(By.cssSelector("my-requests-list > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row:nth-child(1) > div > clr-dg-cell:nth-child(1)")).getText();
        assertTrue(managementComp.equals(managementCompanyEntered));
        String kycStatus = driver.findElement(By.cssSelector("my-requests-list > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(2) > span")).getText();
        System.out.println("Expected " + expectedStatus + ", Resulted in " + kycStatus);
        assertTrue(kycStatus.equals(expectedStatus));
        System.out.println("AM1 name and status matched");
        if (multipleAMs.equals("Yes")){
            String managementComp2 = driver.findElement(By.xpath("//*[@id=\"companyName_cell_1\"]")).getText();
            assertTrue(managementComp2.equals(managementCompany2Entered));
            String kycStatus2 = driver.findElement(By.cssSelector("#status_cell_1 > span")).getText();
            assertTrue(kycStatus2.equals(expectedStatus2));
            System.out.println("Expected " + expectedStatus2 + ", Resulted in " + kycStatus2);
            System.out.println("AM2 name and status matched");
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

    public static void KYCAcceptMostRecentRequest(String companyName, String No, String firstName, String lastName, String userNo, String phoneNo) throws SQLException, InterruptedException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        DateFormat dateFormat = new SimpleDateFormat("dd / MM / yyyy");
        Date date = new Date();

        logout();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("top-menu-my-clients");
        navigateToPageByID("top-menu-onboarding-management");
        verifyCorrectPage("On-boarding Management");
        String waitingCompanyName = driver.findElement(By.xpath("//*[@id=\"KYC-grid-CompName-0 \"]/span")).getText();
        assertTrue(waitingCompanyName.equals(companyName));
        System.out.println("Company name matches");
        driver.findElement(By.xpath("//*[@id=\"KYC-grid-CompName-0 \"]/span")).click();
        wait.until(visibilityOfElementLocated(By.id("waitingApprovalTab")));
        String KYCheading = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-waiting-approval/div/h1/span")).getText();
        assertTrue(KYCheading.contains(companyName));
        System.out.println("KYC Heading contains the company name");
        String generalInfoCompanyName = driver.findElement(By.id("companyName")).getAttribute("value");
        assertTrue(generalInfoCompanyName.equals(companyName));
        String generalInfoReference = driver.findElement(By.id("clientReference")).getAttribute("value");
        System.out.println(generalInfoReference);
        System.out.println(No);
        assertTrue(generalInfoReference.equals(No));
        String generalInfoFirstName = driver.findElement(By.id("firstName")).getAttribute("value");
        assertTrue(generalInfoFirstName.equals(firstName + userNo));
        String generalInfoLastName = driver.findElement(By.id("lastName")).getAttribute("value");
        assertTrue(generalInfoLastName.equals(lastName + userNo));
        String generalInfoEmail = driver.findElement(By.id("email")).getAttribute("value");
        assertTrue(generalInfoEmail.equals("testops" + userNo + "@setl.io"));
        String generalInfoDate = driver.findElement(By.id("approvalDateRequest")).getAttribute("value");
        assertTrue(generalInfoDate.equals(dateFormat.format(date)));
        String generalInfoPhone = driver.findElement(By.id("phoneNumber")).getAttribute("value");
        assertTrue(generalInfoPhone.equals("+7 840 " + phoneNo));
        driver.findElement(By.cssSelector("div.mb-1.ng-star-inserted > div.well > div.row.panel-header > div > a > h2")).click();
        wait.until(invisibilityOfElementLocated(By.id("clientReference")));
        scrollElementIntoViewById("backButton");
        Thread.sleep(750);
        wait.until(visibilityOfElementLocated(By.id("backButton")));
        wait.until(elementToBeClickable(By.id("backButton")));
        driver.findElement(By.id("checkbox")).click();
        try {
            driver.findElement(By.id("submitButton")).click();
        }catch (Exception e){
            fail(e.getMessage()); }
        Thread.sleep(1000);
//        try {
//            wait.until(visibilityOfElementLocated(By.id("clr-tab-link-10")));
//        }catch (Exception e){
//            System.out.println("Client Referential page was not visible");
//            fail(); }
    }


}
