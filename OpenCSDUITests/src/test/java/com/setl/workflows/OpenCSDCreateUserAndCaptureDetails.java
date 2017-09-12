package com.setl.workflows;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.generateRandomUserDetails;
import static com.setl.UI.common.SETLUIHelpers.UserDetailsHelper.populateUserDetailFields;

public class OpenCSDCreateUserAndCaptureDetails {

    private static final Logger logger = LogManager.getLogger(OpenCSDCreateUserAndCaptureDetails.class);


    public static String[] createRandomUserAndCaptureDetails(String userTypeIndex, String[] adminGroups) throws IOException, InterruptedException {
        String[] userDetails = generateRandomUserDetails();
        String newUserName = userDetails[0];
        String newUserEmail = userDetails[1];
        populateUserDetailFields(userDetails[0], userDetails[1], "10", userTypeIndex, "password", "password", adminGroups);
        logger.info("User created : " + userDetails[0] + " ");
        return new String[]{newUserName, newUserEmail} ;
    }

    public static String[] createRandomUserAndCaptureDetails(String typeIndex, String userTypeIndex) throws IOException, InterruptedException {
        String[] userDetails = generateRandomUserDetails();
        String newUserName = userDetails[0];
        String newUserEmail = userDetails[1];
        logger.info("User created : " + userDetails[0] + " ");
        populateUserDetailFields(userDetails[0], userDetails[1], "10", userTypeIndex, "password", "password");
        return new String[]{newUserName, newUserEmail} ;
    }
}