package SETLAPIHelpers;

import org.junit.Before;

import static java.lang.System.*;


public class SetUp {

    public static final String adminuser = "emmanuel";
    public static final String adminuserPassword = "alex01";
    public static final String username = "billtestuser";
    public static final String password = "billtest1";
    public static final String baseUrl = "https://uk-lon-li-002.opencsd.io";
    public static final String phoenixBaseUrl = "https://phoenix.setl.io";
    public static final StringBuffer verificationErrors = new StringBuffer();
    public static final long timeoutInSeconds = 20;
    //Administrative Groups
    public static final String SystemAdminGroup = "1";
    public static final String ChainAdminGroup = "3";
    public static final String MemberAdminGroup = "5";
    public static final String UserAdminGroup = "12";
    public static final String StandardUserGroup = "13";
    //Transactional Groups
    public static final String systemAdminTXGroup = "2";
    public static final String chainAdminTXGroup = "4";
    public static final String memberAdminTXGroup = "6";
    public static final String memberClearerTXGroup = "7";
    public static final String memberCustodianTXGroup = "8";
    public static final String memberRegistrarTXGroup = "9";
    public static final String memberRegulatorTXGroup = "10";
    public static final String memberPaymentInstitutionTXGroup = "11";
    public static final String SETLPrivateAdmin = "1";
    public static final String Custodian_Bank1_Admin_Account = "3";
    public static final String Payment_Bank1_Admin_Account = "4";
    public static final String Registrar_Admin_Account = "5";
    public static final String Exchange_Admin_Account = "6";
    public static final String Custodian_Bank2_Admin_Account = "7";
    public static final String Issuer1 = "9";
    public static final String Custodian_Bank1_AssetOwner1 = "10";
    public static final String Custodian_Bank1_AssetOwn2 = "11";
    public static final String Custodian_Bank2_AssetOwn1 = "12";
    public static final String FX_Sponsor_Admin_Account = "13";
    public static final String FX_Bank1_Admin_Account = "14";
    public static final String FX_Bank2_Admin_Account = "15";
    public static final String FX_Bank3_Admin_Account = "16";
    public static final String BoE_Admin_Account = "17";
    public static final String ECB_Admin_Account = "18";
    public static final String BoJ_Admin_Account = "19";
    public static final String Payment_Sponsor_Admin_Account = "20";


    @Before
    public static String testSetUp() throws Exception {

        return String.valueOf(getenv());
    }


}
