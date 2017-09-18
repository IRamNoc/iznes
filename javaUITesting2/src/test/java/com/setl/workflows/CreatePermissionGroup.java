package com.setl.workflows;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;

import static com.setl.UI.common.SETLUIHelpers.GroupsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;

public class CreatePermissionGroup {
    public static final Logger logger = (Logger) LogManager.getLogger(CreatePermissionGroup.class);

    public static void createPermissionGroup(String group, String type) throws InterruptedException {
        selectNewPageToNavigateTo("menu_permission_groups");
        navigateToAddGroupTab();navigateToAddGroupTab();
        populateNewGroupFields(group, group, type);

    }


}
