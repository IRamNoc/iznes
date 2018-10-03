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
import org.openqa.selenium.JavascriptExecutor;

import static com.setl.UI.common.SETLUIHelpers.AdministrationModuleHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDTeamsSubModuleTest {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

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
    public void shouldCreateATeam() throws InterruptedException {
        String [] teamName = generateRandomTeamName();
        String [] teamReference = generateRandomTeamReference();
        String [] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeam();
        //TODO: assert Team has been created
        searchTeam(teamReference[0],teamName[0],teamDescription[0], "Pending");
    }

    @Test
    public void shouldUpdateTeam() throws InterruptedException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        String[] updateName = generateUpdateTeamName();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        selectTeamRow0();
        assertTeamName(teamName[0]);
        editTeamName(updateName[0]);
        selectUpdateTeam();
        searchTeam(teamReference[0], updateName[0], teamDescription[0], "Pending");
        //TODO: assert change has happened
    }

    @Test
    public void shouldCancelDeleteTeamIfNoIsSelected() throws InterruptedException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeam();
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        selectTeamRow0();
        assertTeamName(teamName[0]);
        selectDeleteTeam("No",teamName[0]);
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        //TODO: assert Team still exists
    }

    @Test
    public void shouldDeleteTeamIfYesIsSelected() throws InterruptedException {
        String[] teamName = generateRandomTeamName();
        String[] teamReference = generateRandomTeamReference();
        String[] teamDescription = fillInDescription();
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-administration");
        navigateToDropdown("menu-administration-teams");
        selectAddNewTeam();
        fillInTeamsDetails(teamName[0], teamReference[0], teamDescription[0]);
        selectCreateNewTeam();
        //TODO: assert Team has been created
        searchTeam(teamReference[0], teamName[0], teamDescription[0], "Pending");
        selectTeamRow0();
        assertTeamName(teamName[0]);
        selectDeleteTeam("Yes",teamName[0]);
        //TODO: assert Team has been deleted
    }
}
