package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;


import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;

public class AdministrationModuleHelper {

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
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")).click();
        try {
            wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/div")));
            String header = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/div")).getText();
            assertTrue(header.contains("Create a New Team"));
        } catch (Exception e) {
            fail("Page heading test was not correct : " + e.getMessage());
        }
    }

    public static void SelectCreateNewTeam() throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button");
        Thread.sleep(1000);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")));
        String create = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).getText();
        assertTrue(create.contains("Create Team"));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).click();
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")));
        driver.findElement(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/div/h1")));
    }

    public static void searchTeam(String ref, String Name, String Description) throws InterruptedException {
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
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(Name);
        } else {
            driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[2]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(Name);
        }
        String columnRef = driver.findElement(By.id("accountAdminTeamCellRef0")).getText();
        assertTrue(columnRef.equals(ref));
        String columnName = driver.findElement(By.id("accountAdminTeamCellName0")).getText();
        assertTrue(columnName.equals(Name));
        String columnDescription = driver.findElement(By.id("accountAdminTeamCellDescription0")).getText();
        assertTrue(columnDescription.equals(Description));
        String status = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]/span/span/span")).getText();
        assertTrue(status.equals("Active"));
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
        driver.findElement(By.cssSelector("#userType > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > div > input")).sendKeys("Standard user");
        driver.findElement(By.cssSelector("#userType > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > ul > li > div")).click();
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
    public static void selectTeamRow0() {
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
        Thread.sleep(2000);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")));
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[2]/button")).click();
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        driver.findElement((By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]"))).click();
        wait.until(visibilityOfElementLocated(By.id("tabAccountAdminTeamsButton")));
    }
    public static void assertTeamName (String Name) {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("name")));
        wait.until(elementToBeClickable(By.id("name")));
        String teamName = driver.findElement(By.id("name")).getText();
        assertTrue(teamName.equals(teamName));
    }
    public static void selectDeleteTeam (String Answer) throws InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[3]/button");
        Thread.sleep(2000);
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-core-admin-teams-crud/clr-tabs/clr-tab/clr-tab-content/div[5]/div[3]/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")));
        if (Answer == "Yes") {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        }
        if (Answer == "No") {
            driver.findElement(By.xpath("/html/body/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[1]")).click();
        }
    }
}
