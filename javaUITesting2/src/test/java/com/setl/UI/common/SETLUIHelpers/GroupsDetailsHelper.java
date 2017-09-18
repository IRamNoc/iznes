package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class GroupsDetailsHelper extends LoginAndNavigationHelper
{

    public static void populateNewGroupFields(String groupName, String description, String type) throws InterruptedException {
        enterGroupName(groupName);
        enterGroupDescription(description);
        selectType(type);
        submitGroupDetails();
    }

    public static void navigateToAddGroupTab() throws InterruptedException
    {
        String text = "Add New Group";
        WebElement link = driver.findElement(By.linkText(text));
        waitForLinkText(text, link);
        link.click();
    }

    public static void navigateToGroupSearchTab() throws InterruptedException
    {
        for (int second = 0; ; second++) {
            if (second >= 60) fail("timeout");
            try {
                if ("Search".equals(driver.findElement
                        (By.xpath("//a[contains(@href, '#permission-group-tab-1')]")).getText()))
                    break;
            } catch (Exception e) {
                System.out.println("Timed out " + e);
            }
            Thread.sleep(1000);
        }
        driver.findElement(By.xpath("//a[contains(@href, '#permission-group-tab-1')]")).click();

    }

    private static void enterGroupName(String groupName) throws InterruptedException
    {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement grpName = wait.until(elementToBeClickable(By.cssSelector("input.form-control.groupname")));
        grpName.clear();
        grpName.sendKeys(groupName);
    }

    private static void enterGroupDescription(String description) throws InterruptedException
    {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement grpDes = wait.until(elementToBeClickable(By.cssSelector("input.form-control.groupdescription")));
        grpDes.clear();
        grpDes.sendKeys(description);
    }

    public static void confirmNoGroup()
    {
        assertTrue(isElementPresent(By.cssSelector("td.dataTables_empty")));
    }

    public static void confirmSearchResults(String expected)
    {
        assertEquals(expected, driver.findElement(By.cssSelector("td.groupName")).getText());
    }

    private static void selectType(String type) throws InterruptedException
    {
        try {
            assertTrue(isElementPresent(By.linkText("choose group tag...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                driver.findElement(By.linkText("choose group tag...")).click();
                WebElement groupType = driver.findElement(By.xpath(".//*[@id='permission-group-tab-2']/div/form/div/div[4]/div/div/div/ul/li[" + type + "]"));
                wait.until(visibilityOf(groupType));
                wait.until(elementToBeClickable(groupType));
                groupType.click();
    }

    private static void submitGroupDetails() throws InterruptedException
    {
        scrollElementIntoViewByXpath("(//button[@type='submit'])[11]");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement groupDet = wait.until(elementToBeClickable (By.xpath("(//button[@type='submit'])[11]")));
        groupDet.click();
    }

    public static void navigateToEditGroupViaSearch(String group) throws InterruptedException
    {
        selectNewPageToNavigateTo("menu_permission_groups");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement group1 = wait.until(elementToBeClickable(By.cssSelector("#permission-group-search > a")));
        group1.click();

        wait.until(visibilityOfElementLocated(By.xpath("//table[@id='permission-group-table']/tbody/tr/td/div/button")));

        WebElement groupSearch = wait.until(visibilityOfElementLocated(By.cssSelector("#permission-group-table_filter > label > input.form-control.input-sm")));

        groupSearch.clear();
        groupSearch.sendKeys(group);


        wait.until(visibilityOfElementLocated(By.id("permission-group-table")));
        ((JavascriptExecutor) driver).executeScript("$('#permission-group-table .btn-white.edit').click()");
    }

    public static void searchForGroup(String group) throws InterruptedException
    {
        selectNewPageToNavigateTo("menu_permission_groups");
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement grpSearchLink = wait.until(elementToBeClickable(By.cssSelector("#permission-group-search > a")));
            grpSearchLink.click();

            WebElement grpSearch = wait.until(elementToBeClickable(By.cssSelector("#permission-group-table_filter > label > input.form-control.input-sm")));
            grpSearch.clear();
            grpSearch.sendKeys(group);
        }catch(Exception e){
            System.out.println("Group Search not ready " + e.getMessage());
        }
    }

    public static void actionGroupDeletion(String button) throws InterruptedException
    {
            try {
                WebElement deleteButton = driver.findElement(By.xpath("//table[@id='permission-group-table']/tbody/tr/td/div/button[" + button + "]"));
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                wait.until(visibilityOf(deleteButton));
                wait.until(elementToBeClickable(deleteButton));
                deleteButton.click();

            } catch (Exception e) {
                System.out.println("Delete button is not ready " + e);
            }
    }

    private static boolean isElementPresent(By by)
    {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public static void submitPermissions() throws InterruptedException {
        scrollElementIntoViewByXpath("(//button[@type='submit'])[12]");
        try {
        WebElement submit = driver.findElement(By.xpath("(//button[@type='submit'])[12]"));
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(submit));
            wait.until(elementToBeClickable(submit));
            submit.click();
        } catch (TimeoutException t){
            System.out.println("Submit button was not ready " + t.getMessage());
        } catch (NoSuchElementException n){
            System.out.println("Submit button was not present " + n.getMessage());
        } catch (ElementNotVisibleException v){
            System.out.println("Submit button was not visible " + v.getMessage());
        } catch (ElementNotSelectableException s){
            System.out.println("Submit button was not clickable " + s.getMessage());
        }
        Thread.sleep(1000);
    }

    public static void selectAdminPermissions(String user, String id, String delegateValue, String readValue, String insertValue, String updateValue, String deleteValue)
    {
        scrollElementIntoViewByXpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[2]/div");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(elementToBeClickable(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[2]/div")));

        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id +"] .permission-dropdown-toggle.delegate .permission-dropdown-toggle-option[data-val=" + delegateValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id +"] .permission-dropdown-toggle.read .permission-dropdown-toggle-option[data-val=" + readValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id +"] .permission-dropdown-toggle.insert .permission-dropdown-toggle-option[data-val=" + insertValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id +"] .permission-dropdown-toggle.update .permission-dropdown-toggle-option[data-val=" + updateValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id +"] .permission-dropdown-toggle.delete .permission-dropdown-toggle-option[data-val=" + deleteValue + "] a').trigger('click')");
    }

    public static void verifyAdminPermissionsSet(String user, String id, String delegateVal, String readVal, String insertVal, String updateVal, String deleteVal)
    {
        if(!verifyAdminPermissions(user, id, delegateVal, readVal, insertVal, updateVal, deleteVal)) Assert.fail("Permissions not set correctly");
    }

    public static boolean verifyAdminPermissions(String user, String id, String delegateVal, String readVal, String insertVal, String updateVal, String deleteVal)
    {
        String delegate = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[2]/div")).getAttribute("data-val"));
        String read = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[3]/div")).getAttribute("data-val"));
        String insert = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[4]/div")).getAttribute("data-val"));
        String update = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[5]/div")).getAttribute("data-val"));
        String delete = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[5]/div/table/tbody/tr[" + id + "]/td[6]/div")).getAttribute("data-val"));

        return delegate.equals(delegateVal) &&
                read.equals(readVal) &&
                insert.equals(insertVal) &&
                update.equals(updateVal) &&
                delete.equals(deleteVal);
    }

    public static void selectTXNPermissions(String user, String id, String delegateValue, String readValue, String insertValue)
    {
  //      scrollElementIntoViewByXpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[6]/div/table/tbody/tr[" + id + "]/td[2]/div");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(elementToBeClickable(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[6]/div/table/tbody/tr[" + id + "]/td[2]/div")));

        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id + "] .permission-dropdown-toggle.delegate .permission-dropdown-toggle-option[data-val=" + delegateValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id + "] .permission-dropdown-toggle.read .permission-dropdown-toggle-option[data-val=" + readValue + "] a').trigger('click')");
        ((JavascriptExecutor)driver).executeScript("$('#permission-group-tab-group-" + user + " .table tr[data-id=" + id + "] .permission-dropdown-toggle.insert .permission-dropdown-toggle-option[data-val=" + insertValue + "] a').trigger('click')");
    }

    public static void verifyTXNPermissionsSet(String user, String id, String delegateVal, String readVal, String insertVal)
    {
        if(!verifyTXNPermissions(user, id, delegateVal, readVal, insertVal)) Assert.fail("Permissions not set correctly");
    }

    public static boolean verifyTXNPermissions(String user, String id, String delegateVal, String readVal, String insertVal)
    {
        String delegate = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[6]/div/table/tbody/tr[" + id + "]/td[2]/div")).getAttribute("data-val"));
        String read = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[6]/div/table/tbody/tr[" + id + "]/td[3]/div")).getAttribute("data-val"));
        String insert = (driver.findElement(By.xpath(".//*[@id='permission-group-tab-group-" + user + "']/div/form/div/div[6]/div/table/tbody/tr[" + id + "]/td[4]/div")).getAttribute("data-val"));

        return delegate.equals(delegateVal) &&
                read.equals(readVal) &&
                insert.equals(insertVal);
    }

    public static String generateRandomGroupName(String type)
    {
        String name = RandomStringUtils.randomAlphanumeric(6);
        String groupName = "Test_" + type + "_Group_" + name;
        return groupName;
    }


    public static void verifyAdminGroupsApplied(String group, String user) {
        Assert.assertEquals("Standard User Group", driver.findElement(By.xpath("//div[@id='user-tab-user-" + user + "-1-1']/div/div/div/div/ul/li/span")).getText());
    }

    public static boolean verifyOnlyCorrectMenuOptionsVisible(List expectedMenuItems)
    {
        boolean menulist;
        List visibleMenuItems = makeAListOfVisibleMenuItems(allMenuOptions);
        System.out.println("visible :  " +visibleMenuItems);
        System.out.println("expected : " +expectedMenuItems);
        menulist = visibleMenuItems.equals(expectedMenuItems);
        return menulist;
    }

    public static List makeAListOfVisibleMenuItems(List allMenuOptions) {
        List<String> visibleMenuItems = new ArrayList<>();
        for (int menu = 0; menu < allMenuOptions.size(); menu++){
            String menu_item_id = String.valueOf(allMenuOptions.get(menu));

            if(isElementVisible(By.id(menu_item_id)) ){
                visibleMenuItems.add(String.valueOf(allMenuOptions.get(menu)));
            }
        }
        return visibleMenuItems;
    }

    public static boolean isElementVisible(By by) {
        return driver.findElement(by).isDisplayed();
    }
}
