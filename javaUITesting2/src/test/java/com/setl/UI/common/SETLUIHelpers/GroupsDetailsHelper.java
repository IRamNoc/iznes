package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
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
