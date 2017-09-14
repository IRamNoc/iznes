package com.setl.workflows;

import com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper;
import com.setl.UI.common.SETLUIHelpers.PageHelper;

import java.io.IOException;

public class LoginAndNavigateToPage {

    public static void loginAndNavigateToPage(String user, String password, String pageId) throws IOException, InterruptedException {
        LoginAndNavigationHelper.loginAndVerifySuccess(user, password);
        PageHelper.selectNewPageToNavigateTo(pageId);
    }
}
