package com.setl.workflows;

import com.setl.UI.common.SETLUIHelpers.CaptureMemberCredentials;
import com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper;
import com.setl.UI.common.SETLUIHelpers.SetUp;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.acceptCookies;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.generateMemberName;

public class OpenCSDCreateMemberAndCaptureDetails {
    public static final Logger logger = (Logger) LogManager.getLogger(OpenCSDCreateMemberAndCaptureDetails.class);


    public static String[] createRandomMemberAndCaptureDetails() throws IOException, InterruptedException {
        LoginAndNavigateToPage.loginAndNavigateToPage(SetUp.adminuser, SetUp.adminuserPassword, "menu_members");
        acceptCookies();
        MemberDetailsHelper.navigateToAddNewMemberTab();
        String memberName = generateMemberName();
        MemberDetailsHelper.populateMemberDetailFields(memberName, "billtestsetl@gmail.com");
        String newMemberLogin = CaptureMemberCredentials.getNewMemberAdminUserName();
        String newMemberPassword = CaptureMemberCredentials.getNewMemberAdminUserPassword();
        MemberDetailsHelper.closeMemberDetailsConfirmation();
        return new String[]{newMemberLogin, newMemberPassword, memberName} ;
    }
}