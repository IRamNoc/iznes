package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;


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
    public static String [] generateISOSpecificCodes(){
        String LEI = randomNumeric(7) + randomAlphabetic(10).toUpperCase() + randomNumeric(3);
        String BIC = randomAlphabetic(6).toUpperCase() + randomNumeric(2) + randomAlphabetic(3).toUpperCase();
        String GIIN = randomAlphabetic(1).toUpperCase() + randomNumeric(3) + randomAlphabetic(1).toUpperCase() + randomNumeric(1) + "." + randomNumeric(5) + "." + randomAlphabetic(2).toUpperCase() + "." + randomNumeric(3);
        String SIREN = randomNumeric(3) + randomNumeric(3) + randomNumeric(3);
        String SIRET = randomNumeric(3) + randomNumeric(3) + randomNumeric(3) + randomNumeric(4);
        return new String[]{LEI, BIC, GIIN, SIREN, SIRET};
    }
    public static String[] generateAddressDetails(){
        String RCHA = "3rd Floor, ConneXions";
        String AddressLine2 = "159 Princes Street";
        String ZIPCODE = "IP1 1QJ";
        String City = "Ipswich";
        String County = "United Kingdom";
        return new String[]{RCHA, AddressLine2, ZIPCODE, City, County};
    }
    public static void assertPageFormLabels() {
        driver.findElement(By.id("mcTabAddNewMc")).click();
        List<String> expectedLabels = Arrays.asList("Management Company Name", "Email Address of the Super Admin", "Legal Form", "Country of tax residence", "Supervisory Authority", "RCS matriculation", "Identification number (SIRET / SIREN)", "Share Capital", "LEI Code", "BIC Code", "GIIN Code", "Registered Company’s Headquarters address", "Address line 2", "ZIP Code", "City", "Country", "Commercial Contact", "Operational Contact", "Director Contact", "Management Company Website Address", "Management Company Phone Number", "Document Signature to be displayed on the Certification of Book Entry", "Document Logo of the Management Company");
        List<String> actualLabels = new ArrayList<>();
        List<WebElement> elements = driver.findElements(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[*]/clr-tab-content/form/section/div[*]/div[*]/label"));
        for (WebElement element : elements) {
            actualLabels.add(element.getText());
        }
        assertEquals(expectedLabels, actualLabels);
    }
    public static void fillInManagementCompanyFormData(String email, String country, String SIRENT, String LEI, String BIC, String GIIN, String Address1, String Address2, String postCode, String city) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("companyName")).sendKeys("Mike’s Totally Cool Property Management");
        driver.findElement(By.id("emailAddress")).sendKeys(email);
        try{//Try to select Legal Form
            driver.findElement(By.cssSelector("div.row:nth-child(1) > div:nth-child(3) > div:nth-child(2) > ng-select:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)")).click();
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[1]/div[3]/div/ng-select/div/div[3]/div/input"))).sendKeys("Friendly Society");
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[1]/div[3]/div/ng-select/div/div[3]/ul/li[1]/div"))).click();
        }catch (Exception e) {
            fail("Unable to Select from drop down");
        }
        try{//Try to select county of Tax Residence
            driver.findElement(By.cssSelector("div.row:nth-child(2) > div:nth-child(1) > div:nth-child(2) > ng-select:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)")).click();
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[2]/div[1]/div/ng-select/div/div[3]/div/input"))).sendKeys(country);
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[2]/div[1]/div/ng-select/div/div[3]/ul/li[1]/div"))).click();
        }catch (Exception e){
            fail("Unable to select from drop down, Tax Redidence");
        }
        driver.findElement(By.id("supervisoryAuthority")).sendKeys("Mike's Supervisory Authority");
        driver.findElement(By.id("rcsMatriculation")).sendKeys("MCs Accounting Standards");
        driver.findElement(By.id("numSiretOrSiren")).sendKeys(SIRENT);
        driver.findElement(By.id("shareCapital")).sendKeys("100");
        driver.findElement(By.id("lei")).sendKeys(LEI);
        driver.findElement(By.id("bic")).sendKeys(BIC);
        driver.findElement(By.id("giin")).sendKeys(GIIN);
        driver.findElement(By.id("postalAddressLine1")).sendKeys(Address1);
        driver.findElement(By.id("postalAddressLine2")).sendKeys(Address2);
        driver.findElement(By.id("postalCode")).sendKeys(postCode);
        driver.findElement(By.id("city")).sendKeys(city);
        try{//Try to select country from County
            driver.findElement(By.cssSelector("#country > ng-select:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)")).click();
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[6]/div[5]/div/ng-select/div/div[3]/div/input"))).sendKeys(country);
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[6]/div[5]/div/ng-select/div/div[3]/ul/li[1]/div"))).click();
        }catch (Exception e){
            fail("Unable to select from drop down, Address County");
        }
        driver.findElement(By.id("commercialContact")).sendKeys("David Higgins");
        driver.findElement(By.id("operationalContact")).sendKeys("Daniel Partridge");
        driver.findElement(By.id("directorContact")).sendKeys("Samuel Hutchinson");
        driver.findElement(By.id("mc_websiteUrl")).sendKeys("uk-lon-li-006.dev.setl.io");
        try{//Try to select county from Phone Number Country Selection
            driver.findElement(By.cssSelector("#kyc_additionnal_phoneCode > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)")).click();
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[9]/div[2]/div/div[1]/ng-select/div/div[3]/div/input"))).sendKeys(country);
            wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[9]/div[2]/div/div[1]/ng-select/div/div[3]/ul/li[1]/div"))).click();
        }catch (Exception e){
            fail("Unable to select from drop down, Phone Number");
        }
       driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys("07464575836");
       driver.findElement(By.id("mcBtnSubmitForm")).click();
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
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[1]/clr-tab-content/div/ng-select/div/div[2]/div/input"))).sendKeys("IZNES Admin Group");
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[1]/clr-tab-content/div/ng-select/div/div[2]/ul/li/div/a"))).click();
        //Removing Transactional Chain
        driver.findElement(By.id("clr-tab-link-12")).click();
        wait.until(elementToBeClickable(By.cssSelector("#clr-tab-content-6 > div > ng-select:nth-child(1) > div > div.ui-select-match.dropdown > span > a > i"))).click();
        String chain = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-admin-users/div[2]/clr-tabs/clr-tab[2]/clr-tab-content/div[2]/form/div/div[5]/div/div/clr-tabs/clr-tab[2]/clr-tab-content/div/ng-select[1]/div/div[2]/span/span")).getText();
        assertNotEquals("Chain2700", chain);
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
    public static void checkManagementCompanyList(String companyA, String companyB){
        assertEquals(" List", driver.findElement(By.id("mcTabList")).getText());
        assertEquals(companyA, driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[1]/clr-tab-content/section/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[1]/div/clr-dg-cell[1]")).getText());
        assertEquals(companyB, driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[1]/clr-tab-content/section/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[2]/div/clr-dg-cell[1]")).getText());
    }
    public static void accountCreationStepTwo(String email, String invitedBy, String companyName, String firstName, String lastName, String phoneNumber) {
        /*
        For this step (2) we need to pass the required fields for the sign up process, once the user is on the "CompanyDetails" similiar to the investor creation page.
        */
    }
    public static void assertManagementCompanyDetailsOnEdit(){
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("mcBtnEditMc")).click();
        wait.until(visibilityOfElementLocated(By.id("mcTabEditMc")));
        assertEquals("Edit management company", driver.findElement(By.id("mcTabEditMc")).getText());
        assertEquals("Management Company", driver.findElement(By.id("companyName")).getAttribute("value"));
        assertEquals("am@setl.io", driver.findElement(By.id("emailAddress")).getAttribute("value"));
        assertEquals("French Gov", driver.findElement(By.id("supervisoryAuthority")).getAttribute("value"));
        assertEquals("0001", driver.findElement(By.id("numSiretOrSiren")).getAttribute("value"));
        assertEquals("100000", driver.findElement(By.id("shareCapital")).getAttribute("value"));
        assertEquals("Line 1", driver.findElement(By.id("postalAddressLine1")).getAttribute("value"));
        assertEquals("Line 2", driver.findElement(By.id("postalAddressLine2")).getAttribute("value"));
        assertEquals("POST CODE", driver.findElement(By.id("postalCode")).getAttribute("value"));
        assertEquals("City", driver.findElement(By.id("city")).getAttribute("value"));
        assertEquals("0123456789", driver.findElement(By.id("commercialContact")).getAttribute("value"));
        assertEquals("0123456789", driver.findElement(By.id("operationalContact")).getAttribute("value"));
        assertEquals("0123456789", driver.findElement(By.id("directorContact")).getAttribute("value"));
    }
    public static void assertPage(String pageHeader) {
        String pageTitle = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/div/h1/span")).getText();
        assertEquals(pageHeader, pageTitle);
    }
    public static void assertRequiredFields() {
        driver.findElement(By.id("mcTabAddNewMc")).click();
        //Management Company Name is a Required Field
        driver.findElement(By.id("companyName")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[1]/div[1]/div[2]")).getText());
        //Email Address of the Super Admin is a Required Field
        driver.findElement(By.id("emailAddress")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[1]/div[2]/div[2]")).getText());
        //Supervisory Authority is a Required Field
        driver.findElement(By.id("supervisoryAuthority")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[2]/div[2]/div[2]")).getText());
        //RCS matriculation is a Required Field
        driver.findElement(By.id("rcsMatriculation")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[3]/div[1]/div[2]")).getText());
        //Identification number (SIRET / SIREN) is a Required Field
        driver.findElement(By.id("numSiretOrSiren")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[3]/div[2]/div[2]")).getText());
        //Share Capital is a Required Field
        driver.findElement(By.id("shareCapital")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[4]/div[1]/div[2]")).getText());
        //LEI Code is a Required Field
        driver.findElement(By.id("lei")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[4]/div[2]/div[2]")).getText());
        //BIC Code is a Required Field
        driver.findElement(By.id("bic")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[5]/div[1]/div[2]")).getText());
        //Registered Company’s Headquarters address is a Required Field
        driver.findElement(By.id("postalAddressLine1")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[6]/div[1]/div[2]")).getText());
        //ZIP Code is a Required Field
        scrollElementIntoViewById("postalCode");
        driver.findElement(By.id("postalCode")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[6]/div[3]/div[2]")).getText());
        //City is a Required Field
        driver.findElement(By.id("city")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[6]/div[4]/div[2]")).getText());
        //Commercial Contact is a Required Field
        driver.findElement(By.id("commercialContact")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[7]/div[1]/div[2]")).getText());
        //Operational Contact is a Required Field
        scrollElementIntoViewById("operationalContact");
        driver.findElement(By.id("operationalContact")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[7]/div[2]/div[2]")).getText());
        //Director Contact is a Required Field
        driver.findElement(By.id("directorContact")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[8]/div/div[2]")).getText());
        //Management Company Website Address is a Required Field
        scrollElementIntoViewById("mc_websiteUrl");
        driver.findElement(By.id("mc_websiteUrl")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[9]/div[1]/div[2]")).getText());
        // Management Company Phone Number is a Required Field
        driver.findElement(By.id("kyc_additionnal_phoneNumber")).sendKeys(Keys.TAB);
        assertEquals("This field is required", driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/management-company/clr-tabs/clr-tab[2]/clr-tab-content/form/section/div[9]/div[2]/div/div[2]/div")).getText());
    }
}


