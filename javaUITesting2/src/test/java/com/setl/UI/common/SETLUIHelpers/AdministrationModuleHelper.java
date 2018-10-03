package com.setl.UI.common.SETLUIHelpers;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.sql.*;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.sun.tools.doclint.Entity.and;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;

public class AdministrationModuleHelper {

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

    public static String[] generateRandomTeamName() {
        String str = randomAlphabetic(7);
        String teamName = "Team_" + str;
        return new String[]{teamName};
    }
    public static String[] generateUpdateTeamName() {
        String str = randomAlphabetic(7);
        String updateName = "Updated" + str;
        return new String[]{updateName};
    }

    public static String[] generateRandomTeamReference() {
        String str = randomNumeric(7);
        String teamReference = "AA_" + str;
        return new String[]{teamReference};
    }

    public static String[] fillInDescription() {
        String str = randomAlphabetic(10) + randomNumeric(10);
        String teamDescription = "Team_Description_" + str;
        return new String[]{teamDescription};

    }
    public static String[] generateEmail() {
        String str1 = randomAlphabetic(7);
        String str2 = randomNumeric(5);
        String userEmail = str1 + "email@" + str2 +".co.uk";
        return new String[]{userEmail};
    }
    public static String[] generateBadEmail() {
        String str1 = randomAlphabetic(7);
        String str2 = randomNumeric(5);
        String userEmail = str1 + "_email@_" + str2 +"_.co.uk";
        return new String[]{userEmail};
    }
    public static String[] generatePhoneNumber() {
        String str = randomNumeric(10);
        String phoneNo = "+44" + str;
        return new String[]{phoneNo};
    }
    public static String[] generateUser() {
        String str = randomAlphabetic(5);
        String userName = "Donald" + str;
        return new String[]{userName};
    }
    public static String[] generateBadUser() {
        String str = randomAlphabetic(5);
        String userName = "_Donald_" + str;
        return new String[]{userName};
    }

    public static void fillInTeamsDetails(String Name, String Reference, String Description) {
        driver.findElement(By.id("name")).sendKeys(Name);
        driver.findElement(By.id("reference")).sendKeys(Reference);
        driver.findElement(By.id("description")).sendKeys(Description);
    }

    public static void selectAddNewTeam() {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a"))));
        wait.until(refreshed(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a"))));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")).click();
        try {
            wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/div"))));
            String header = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/div")).getText();
            assertTrue(header.contains("Create a New Team"));
        } catch (Exception e) {
            fail("Page heading test was not correct : " + e.getMessage());
        }
    }

    public static void selectCreateNewTeam() throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button");
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button"))));
        wait.until(refreshed(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button"))));
        String create = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).getText();
        assertTrue(create.contains("Create Team"));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.className("jaspero__dialog-title"))));
        wait.until(refreshed(elementToBeClickable(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]"))));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]")).getText().equals("You have selected no permissions for this team. Any users, soley assigned to this team, will no longer hold any permissions on the system."));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        Thread.sleep(1000);
        wait.until(refreshed(visibilityOfElementLocated(By.className("jaspero__dialog-title"))));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]")).getText().equals("Are you sure you wish to create this Team?"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(refreshed(invisibilityOfElementLocated(By.className("jaspero__dialog-title"))));
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/div/h1"))));


    }

    public static void searchTeam(String ref, String teamName, String teamDescription, String teamStatus) throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")));
        if (driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/button")).isDisplayed())
        {
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        } else {
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/button")).click();

        }
        if (driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).isDisplayed())
        {
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(teamName);
        } else {
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(teamName);
        }
        String columnRef = driver.findElement(By.id("accountAdminTeamCellRef0")).getText();
        assertTrue(columnRef.equals(ref));
        String columnName = driver.findElement(By.id("accountAdminTeamCellName0")).getText();
        assertTrue(columnName.equals(teamName));
        String columnDescription = driver.findElement(By.id("accountAdminTeamCellDescription0")).getText();
        assertTrue(columnDescription.equals(teamDescription));
        String status = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]/span/span/span")).getText();
        assertTrue(status.equals(teamStatus));
    }
    public static void fillInUserDetails(String Email, String firstName, String lastName, String Reference, String phoneNumber) {
        driver.findElement(By.id("emailAddress")).sendKeys(Email);
        driver.findElement(By.id("firstName")).sendKeys(firstName);
        driver.findElement(By.id("lastName")).sendKeys(lastName);
        driver.findElement(By.id("reference")).sendKeys(Reference);
        driver.findElement(By.id("phoneNumber")).sendKeys(phoneNumber);
    }
    public static void selectAddNewUser() {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]")).click();
    }
    public static void createUserDisabled() throws InterruptedException {
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]");
        Thread.sleep(1000);
        assertFalse(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[2]")).isEnabled());

    }

    public static void selectCreateUser()throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]");
        Thread.sleep(1000);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")).click();
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(visibilityOfElementLocated(By.id("tabAccountAdminUsersButton")));

    }
    public static void selectUserType() {
        driver.findElement(By.cssSelector("#userType > div > div.ui-select-match.dropdown > span > i.pull-right.special.caret")).click();
        driver.findElement(By.cssSelector("#userType > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > div > input")).sendKeys("Asset manager");
        driver.findElement(By.cssSelector("#userType > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > ul > li > div")).click();
    }
    public static void searchUser(String reference, String firstName, String lastName, String emailAddress, String phoneNumber) throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("tabAccountAdminUsersButton"))).isDisplayed();
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button");
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(reference);

        String columnReference = driver.findElement(By.id("accountAdminTeamCellRef0")).getText();
        assertTrue(columnReference.equals(reference));
        String columnFirstName = driver.findElement(By.id("accountAdminTeamCellFirstName0")).getText();
        assertTrue(columnFirstName.equals(firstName));
        String columnLastName = driver.findElement(By.id("accountAdminTeamCellLastName0")).getText();
        assertTrue(columnLastName.equals(lastName));
        String columnEmail = driver.findElement(By.id("accountAdminTeamCellEmail0")).getText();
        assertTrue(columnEmail.equals(emailAddress));
        String columnPhone = driver.findElement(By.id("accountAdminTeamCellPhone0")).getText();
        assertTrue(columnPhone.equals(phoneNumber));
        String columnType = driver.findElement(By.id("accountAdminTeamCellType0")).getText();
        assertTrue(columnType.equals("Asset manager"));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[7]/span")).getText().equals("1"));
        assertTrue(driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[8]/span")).getText().equals("Pending"));

    }

    public static void selectCreateUserWithBadDetails() {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]");
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button[1]")).click();
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
        String error = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")).getText();
        assertTrue(error.equals("Error!"));
        String errorMessage = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]")).getText();
        assertTrue(errorMessage.contains("Invalid User Name / Email Address."));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
    }
    public static void selectStaticTeam() {
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[4]/div/app-core-admin-users-team-mgmt/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[1]/div/clr-dg-cell[5]/label/span");
        assertTrue(driver.findElement(By.id("userMgmtCellDescription0")).getText().equals("This Team was created for the backup taken on 18/09/2018 for Users +1 to +5"));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-users-crud/clr-tabs/clr-tab/clr-tab-content/div[4]/div/app-core-admin-users-team-mgmt/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[1]/div/clr-dg-cell[5]/label/span")).click();
    }
    public static void selectTeamRow0() {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("accountAdminTeamRow0")));
        wait.until(elementToBeClickable(By.id("accountAdminTeamRow0")));
        driver.findElement(By.id("accountAdminTeamRow0")).click();
    }
    public static void editTeamName(String nameUpdate) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("name")));
        driver.findElement(By.id("name")).clear();
        driver.findElement(By.id("name")).sendKeys(nameUpdate);
    }

    public static void selectUpdateTeam() throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button");
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button"))));
        wait.until(refreshed(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button"))));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.className("jaspero__dialog-title"))));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]")).getText().equals("You have selected no permissions for this team. Any users, soley assigned to this team, will no longer hold any permissions on the system."));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        Thread.sleep(1000);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]"))).isDisplayed();
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]"))).isDisplayed();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")).getText().equals("Update Team"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]")).getText().equals("Are you sure you wish to update this Team?"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.id("tabAccountAdminTeamsButton"))));
    }
    public static void assertTeamName (String reName) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("name")));
        wait.until(elementToBeClickable(By.id("name")));
        String nameEntry = driver.findElement(By.id("name")).getAttribute("value");
        assertTrue(nameEntry.equals(reName));
    }
    public static void selectDeleteTeam (String Answer, String teamName) throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[3]/button");
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[3]/button")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]"))));
        if (Answer == "Yes") {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
            //Directs to overview page
            wait.until(refreshed(visibilityOfElementLocated(By.id("tabAccountAdminTeamsButton"))));
            wait.until(elementToBeClickable(By.cssSelector(".col-name > div:nth-child(1) > clr-dg-string-filter:nth-child(1) > clr-dg-filter:nth-child(1) > button:nth-child(1)")));
            driver.findElement(By.cssSelector(".col-name > div:nth-child(1) > clr-dg-string-filter:nth-child(1) > clr-dg-filter:nth-child(1) > button:nth-child(1)")).click();
            driver.findElement(By.cssSelector("input.ng-pristine")).sendKeys(teamName);
            wait.until(refreshed(invisibilityOfElementLocated(By.id("accountAdminTeamRow0"))));

        }
        if (Answer == "No") {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[1]")).click();
            wait.until(refreshed(visibilityOfElementLocated(By.id("name"))));
            scrollElementIntoViewByXpath("//*[@id=\"clr-tab-content-4\"]/div[5]/div[1]/a");
            wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-4\"]/div[5]/div[1]/a")));
            driver.findElement(By.xpath("//*[@id=\"clr-tab-content-4\"]/div[5]/div[1]/a")).click();
            wait.until(refreshed(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a"))));
        }
    }
    public static void validateTeamsCreated(int expectedCount, String teamName, String teamReference, String teamDescription) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM setlnet.tblUserTeams where name = " + "\"" + teamName + "\" AND reference =  " + "\"" + teamReference + "\" AND description = " + "\"" + teamDescription + "\"");
            int rows = 1;

            if (rs.last()) {
                rows = rs.getRow();

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }
    public static void validateTeamsDeleted(int expectedCount, String teamName, String teamReference, String teamDescription) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM setlnet.tblUserTeams where name = " + "\"" + teamName + "\" AND reference =  " + "\"" + teamReference + "\" AND description = " + "\"" + teamDescription + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }
    public static void validateUserCreated(int expectedCount, String emailAddress, String phoneNumber, String firstName, String lastName, String userReference ) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM setlnet.tblUserDetails where displayName = " + "\"" + emailAddress + "\" AND firstName = " + "\"" + firstName + "\" AND lastName = " + "\"" + lastName + "\" AND phoneNumber = " + "\"" + phoneNumber + "\" AND reference =" + "\"" + userReference + "\"");
            int rows = 1;

            if (rs.last()) {
                rows = rs.getRow();

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }
    public static void validateUserNOTCreatedOrDeleted(int expectedCount, String emailAddress, String phoneNumber, String firstName, String lastName, String userReference ) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM setlnet.tblUserDetails where displayName = " + "\"" + emailAddress + "\" AND firstName = " + "\"" + firstName + "\" AND lastName = " + "\"" + lastName + "\" AND phoneNumber = " + "\"" + phoneNumber + "\" AND reference =" + "\"" + userReference + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }
}
