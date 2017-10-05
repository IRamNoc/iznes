package com.setl.workflows;

import com.setl.UI.common.SETLUIHelpers.ChainDetailsHelper;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.junit.Rule;

public class AssignChainToMember {
    public static final Logger logger = (Logger) LogManager.getLogger(AssignChainToMember.class);

    @Rule
    public ScreenshotRule screenShotRule = new ScreenshotRule();

    public static void assignChainToMember(String chainIdIndex, String memberIndex, String memberTypeIndex, String walletNodeIndex) throws InterruptedException {
        ChainDetailsHelper.populateChainAccessFields(chainIdIndex, memberIndex, memberTypeIndex, walletNodeIndex);
    }
}