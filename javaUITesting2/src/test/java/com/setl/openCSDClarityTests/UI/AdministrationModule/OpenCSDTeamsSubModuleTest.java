package com.setl.openCSDClarityTests.UI.AdministrationModule;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;


import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDTeamsSubModuleTest {

    JavascriptExecutor jse = (JavascriptExecutor)driver;

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(55000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldCreateATeam() throws InterruptedException, SQLException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeamNoPermissions();
        searchTeam(teamReference[0],teamName[0],teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamName[0], teamReference[0], teamDescription[0]);
    }
    @Test
    public void shouldNotAllowNullNameRefDesc() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsNullCharacters();
        logout();
    }
    @Test
    public void shouldNotAllowDuplicateName() throws InterruptedException, SQLException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeamNoPermissions();
        searchTeam(teamReference[0],teamName[0],teamDescription[0], "Pending");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        assertTeamName(teamName[0]);
        assertCantCreateTeamNameAlreadyExists(teamName[0]);
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
    }
    @Test
    public void shouldUpdateTeam() throws InterruptedException, SQLException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        String[] updateName = generateUpdateTeamName();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeamNoPermissions();
        validateTeamsCreated(1, teamName[0], teamReference[0], teamDescription[0]);
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        selectTeamRow0();
        assertTeamName(teamName[0]);
        editTeamName(updateName[0]);
        selectUpdateTeam();
        searchTeam(teamReference[0], updateName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, updateName[0], teamReference[0], teamDescription[0]);
    }
    @Test
    public void shouldCancelDeleteTeamIfNoIsSelected() throws InterruptedException, SQLException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeamNoPermissions();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        selectTeamRow0();
        assertTeamName(teamName[0]);
        selectDeleteTeam("No",teamName[0]);
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
    }
    @Test
    public void shouldDeleteTeamIfYesIsSelected() throws InterruptedException, SQLException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeamNoPermissions();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        selectTeamRow0();
        assertTeamName(teamName[0]);
        selectDeleteTeam("Yes",teamName[0]);
        logout();
        validateTeamsDeleted(0, teamReference[0], teamName[0], teamDescription[0]);
    }
    @Test
    public void shouldCreateTeamWithPermissionsAdministration() throws InterruptedException, SQLException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectAccountAdminPermissions();
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        validateAdminTeamPermissions(teamName[0]);
    }
    @Test
    public void createTeamAssignUser() throws InterruptedException, SQLException {
        String [] emailaddress = generateEmail();
        String [] phoneNumber = generatePhoneNumber();
        String [] firstName = generateUser();
        String [] lastName = generateUser();
        String [] userRef = generateRandomTeamReference();
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectAccountAdminPermissions();
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        validateAdminTeamPermissions(teamName[0]);
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-users");
        selectAddNewUser();
        fillInUserDetails(emailaddress[0], firstName[0], lastName[0], userRef[0], phoneNumber[0]);
        selectTeamFromUserCreation(teamName[0]);
        selectCreateUser();
        searchUser(userRef[0],firstName[0], lastName[0], emailaddress[0], phoneNumber[0]);
        validateUserCreated(1, emailaddress[0], firstName[0], lastName[0], phoneNumber[0], userRef[0]);
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Active");
        logout();
    }
    @Test
    public void shouldCreateTeamWithPermissionsOrderBook() throws InterruptedException, SQLException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectOrderBookPermissions();
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        validateOrderBookTeamPermissions(teamName[0]);
    }
    @Test
    public void shouldCreateTeamWithPermissionsMyReports() throws InterruptedException, SQLException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectMyReportsPermissions();
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        validateMyReportsTeamPermissions(teamName[0]);
    }
    @Test
    public void shouldCreateTeamWithPermissionsMyClients() throws InterruptedException, SQLException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectMyClientsPermissions();
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        logout();
        validateTeamsCreated(1, teamReference[0], teamName[0], teamDescription[0]);
        validateMyClientsTeamPermissions(teamName[0]);
    }

}
