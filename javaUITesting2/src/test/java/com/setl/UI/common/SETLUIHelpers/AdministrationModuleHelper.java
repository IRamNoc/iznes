package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.io.IOException;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphabetic;
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

public class AdministrationModuleHelper {

    public static String[] generateRandomTeamName() {
        String str = randomAlphabetic(7);
        String teamName = "Team_" + str;
        return new String[]{teamName};
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

    public static void fillInTeamsDetails(String Name, String Reference, String Description) throws IOException, InterruptedException {
        driver.findElement(By.id("name")).sendKeys(Name);
        driver.findElement(By.id("reference")).sendKeys(Reference);
        driver.findElement(By.id("description")).sendKeys(Description);
    }

    public static void selectAddNewTeam() throws IOException, InterruptedException {
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

    public static void SelectCreateNewTeam() throws IOException, InterruptedException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
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

    public static void searchTeam(String ref, String Name, String Description) throws InterruptedException, IOException {
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/div/div[3]/a")));

        String columnRef = driver.findElement(By.id("accountAdminTeamCellRef0")).getText();
        assertTrue(columnRef.equals(ref));

        String columnName = driver.findElement(By.id("accountAdminTeamCellName0")).getText();
        assertTrue(columnName.equals(Name));

        String columnDescription = driver.findElement(By.id("accountAdminTeamCellDescription0")).getText();
        assertTrue(columnDescription.equals(Description));

        String status = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-core-admin-teams-list/clr-tabs/clr-tab/clr-tab-content/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[4]/span/span/span")).getAttribute("value");
        assertTrue(status.equals("Active"));
    }
}
