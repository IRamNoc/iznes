package com.setl.UI.common.SETLUIHelpers;

import com.gargoylesoftware.htmlunit.html.HtmlListing;
import com.google.common.collect.ImmutableList;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.logout;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;

public class ManagementCompanyModuleHelper {

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    public static String[] generateManagementCompanyUserDetails() {
        String loginName = "McUser" + randomAlphabetic(5);
        String email = "McUserEmail." + randomAlphabetic(4) + "@email.com";
        String password = "asdASD123";
        return new String[]{loginName, email, password};
    }

    public static void assertPageFormLabels() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("mcTabAddNewMc")).click();
        List<String> expectedLabels = Arrays.asList("Management Company Name", "Email Address of the Super Admin", "Legal Form", "Country of tax residence", "Supervisory Authority", "RCS matriculation", "Identification number (SIRET / SIREN)", "Share Capital", "LEI Code", "BIC Code", "GIIN Code", "Registered Company’s Headquarters address", "Address line 2", "ZIP Code", "City", "Country", "Commercial Contact", "Operational Contact", "Director Contact", "Management Company Website Address", "Management Company Phone Number", "Document Signature to be displayed on the Certification of Book Entry", "Document Logo of the Management Company");
        List<String> actualLabels = new ArrayList<>();
        List<WebElement> elements = driver.findElements(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[*]/clr-tab-content/form/section/div[*]/div[*]/label"));
        for (WebElement element : elements) {
            actualLabels.add(element.getText());
        }
        assertEquals(expectedLabels, actualLabels);
    }

    /*
    Email Address - Text Field - email
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
    public static void fillInManagementCompanyFormData(/*User static Data, does not need to be dynamic*/) {
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

    public static void assertEmailBodySentToManagementCompany(String email) {
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

    public static void submitManagementCompanyForm() {
        /*
        not sure what the sumbit method will be or if there is any confirmation modal, include any confirmation popups or toasters in this method please.
         */
    }

    public static void accountCreation(String password, String email, String loginName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        String homePageIdentifier = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText();
        assertEquals("Home", homePageIdentifier);
        driver.findElement(By.id("menu-user-administration")).click();
        wait.until(visibilityOfElementLocated(By.id("menu-user-admin-users"))).click();
        wait.until(elementToBeClickable(By.id("user-tab-1"))).click();
        driver.findElement(By.id("new-user-username")).sendKeys(loginName);
        driver.findElement(By.id("new-user-email")).sendKeys(email);
        driver.findElement(By.id("new-user-password")).sendKeys(password);
        //Selecting Account Type
        driver.findElement(By.id("new-user-password-repeat")).sendKeys(password);
        driver.findElement(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[2]/span/span")).click();
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/div/input"))).sendKeys("SETL Private Admin");
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"new-user-account-select\"]/div/div[3]/ul/li"))).click();
        //Selecting User Type
        driver.findElement(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[2]/span/span")).click();
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/div/input"))).sendKeys("System admin");
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"new-user-usertype-select\"]/div/div[3]/ul/li"))).click();
        //Selecting Administrative Group
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[1]/clr-tab-content/div/ng-select/div/span")).click();
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[1]/clr-tab-content/div/ng-select/div/div[2]/div/input"))).sendKeys("System Admin Group");
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[1]/clr-tab-content/div/ng-select/div/div[2]/ul/li/div/a"))).click();
        //Selecting CHAIN2700
        driver.findElement(By.id("clr-tab-link-14")).click();
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[4]/clr-tab-content/div/ng-select/div/span")).click();
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[4]/clr-tab-content/div/ng-select/div/div[2]/div/input"))).sendKeys("Chain2700");
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[4]/clr-tab-content/div/ng-select/div/div[2]/ul/li/div/a/div"))).click();
        //Selecting Menu
        driver.findElement(By.id("clr-tab-link-15")).click();
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[5]/clr-tab-content/div/ng-select/div/div[2]/span/span")).click();
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[5]/clr-tab-content/div/ng-select/div/div[3]/div/input"))).sendKeys("IZNES Admin");
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[5]/clr-tab-content/div/ng-select/div/div[3]/ul/li/div/a/div"))).click();
        //Save = Invite New Management User
        driver.findElement(By.id("new-user-submit")).click();
        //Validate User Was Created With Success Modal
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[3]/div[1]")));
        String modalHeader = driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[3]/div[1]")).getText();
        assertEquals("Success!", modalHeader);
        //Selecting close
        driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[3]/div[4]/button")).click();
    }

    public static void accountCreationStepTwo(String email, String invitedBy, String companyName, String firstName, String lastName, String phoneNumber) {
        /*
        For this step (2) we need to pass the required fields for the sign up process, once the user is on the "CompanyDetails" similiar to the investor creation page.
        */
    }

    public static void assertPage(String pageHeader) {
        String pageTitle = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/div/h1/span")).getText();
        assertEquals(pageHeader, pageTitle);
    }

}


