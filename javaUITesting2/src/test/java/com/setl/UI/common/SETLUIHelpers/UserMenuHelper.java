package com.setl.UI.common.SETLUIHelpers;

import java.io.IOException;
import java.util.List;

import static com.setl.UI.common.SETLUIHelpers.GroupsDetailsHelper.verifyOnlyCorrectMenuOptionsVisible;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPermissionDeniedPopUp;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static com.setl.workflows.OpenCSDCreateUserAndCaptureDetails.createRandomUserAndCaptureDetails;
import static org.junit.Assert.assertTrue;

public class UserMenuHelper extends LoginAndNavigationHelper {


    public static void createUserAndAssignToGroup(List menuOptions, String userTypeIndex, String[] adminGroup) throws IOException, InterruptedException {
        String userDetails[] = createRandomUserAndCaptureDetails(userTypeIndex, adminGroup);
        verifyPopupMessageText("Added Successfully", "User Updated Success Message not displayed ");
        logout();
        loginAndNavigateToPage(userDetails[0], "password", "menu_home");
        verifyPermissionDeniedPopUp();
        assertTrue("Incorrect Menu Items Found", verifyOnlyCorrectMenuOptionsVisible(menuOptions));
    }
}
