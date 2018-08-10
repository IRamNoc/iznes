package com.setl.UI.common.SETLUIHelpers;

import org.junit.Before;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.safari.SafariOptions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static java.util.Arrays.asList;


public class SetUp {
    public static WebDriver driver;
    public static JavascriptExecutor js;
    public static final String adminuser = "emmanuel";
    public static final String adminuserPassword = "alex01";
    public static final String username = "billtestuser";
    public static final String password = "billtest1";
    public static final String baseUrl = "https://uk-lon-li-006.opencsd.io";
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
    //MenuOptions per Group
    public static final List<String> allMenuOptions = asList("menu_home", "menu_dashboard_cobalt", "menu_actions_cobalt",
                                                                        "menu_query_cobalt", "menu_chains", "menu_wallet_nodes",
                                                                        "menu_members",  "menu_member_chain_access", "menu_accounts",
                                                                        "menu_um", "menu_wallets", "menu_permission_groups",
                                                                        "menu_user_account", "menu_user_messages", "menu_wallet");

    public static final List<String> StandardUserMenuOptions = asList("menu_home", "menu_dashboard_cobalt", "menu_actions_cobalt",
                                                                             "menu_query_cobalt", "menu_user_account", "menu_user_messages",
                                                                             "menu_wallet");
    public static final List<String> MemberMenuOptions = asList("menu_home", "menu_dashboard_cobalt", "menu_actions_cobalt",
                                                                            "menu_query_cobalt", "menu_accounts", "menu_um", "menu_wallets",
                                                                            "menu_user_account", "menu_user_messages", "menu_wallet");

    public static final List<String> ChainAdminMenuOptions = asList("menu_home", "menu_dashboard_cobalt", "menu_actions_cobalt", "menu_query_cobalt",
                                                                           "menu_members", "menu_member_chain_access", "menu_accounts", "menu_um",
                                                                           "menu_wallets", "menu_user_account", "menu_user_messages", "menu_wallet");


    public static final List<String> SystemAdminMenuOptions = asList("menu_home", "menu_dashboard_cobalt", "menu_actions_cobalt", "menu_query_cobalt",
                                                                                "menu_chains", "menu_wallet_nodes", "menu_members", "menu_member_chain_access",
                                                                                "menu_accounts", "menu_um", "menu_wallets", "menu_permission_groups",
                                                                                "menu_user_account", "menu_user_messages", "menu_wallet");

    public static final String SystemAdminUser = "2";
    public static final String ChainAdminUser = "3";
    public static final String Member = "4";
    public static final String StandardUser = "5";


    //Datagrid Headings - Shares
    public static final String[] sharesHeadings = new String[]{"Share name", "Fund name", "ISIN", "Management company", "Type of share", "Status (close or open?)"};

    //Datagrid Headings - Funds
    public static final String[] fundsHeadings = new String[]{"Fund name", "LEI", "Management company", "Country", "Law status", "Umbrella fund (to which the fund belongs)", "Currency of the fund"};

    //Datagrid Headings - Umbrella Funds
    public static final String[] umbrellaFundsHeadings = new String[]{"Umbrella fund name", "LEI", "Management company", "Domicile"};

    //Datagrid Headings - NAV
    public static final String[] NAVHeadings = new String[]{"Share Name", "ISIN", "NAV Date", "NAV\n" +
        "Pub Date", "Next Valuation Date", "NAV CCY", "NAV", "NAV\n" +
        "Estimated", "NAV\n" +
        "Technical", "NAV\n" +
        "Validated", "Status", "Actions"};


    public static final String SweetAlert = ".sweet-alert.showSweetAlert.visible p";
    public static final String SweetAlertHeader = ".sweet-alert.showSweetAlert.visible>h2";
    public static final Dimension Screen =  new Dimension(1920, 1080);



    @Before
    public static void testSetUp() throws Exception {
        System.setProperty("webdriver.gecko.driver", "/usr/local/bin/geckodriver");
        System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver");

        getDriver();

        driver.manage().deleteAllCookies();

        js = new JavascriptExecutor() {
            @Override
            public Object executeScript(String s, Object... objects) {
                return null;
            }

            @Override
            public Object executeAsyncScript(String s, Object... objects) {
                return null;
            }
        };
    }

    private static WebDriver getDriver() {
        String OS = System.getProperty("os.name");
        if (OS.contains("MAC")) {

            SafariOptions options = new SafariOptions();
            options.setUseCleanSession(true);
            options.setUseTechnologyPreview(true);

            driver = new SafariDriver(options);
            driver.manage().window().setSize(Screen);
            driver.manage().timeouts().implicitlyWait(30000, TimeUnit.MILLISECONDS);

        } else {

/*
        //FirefoxDriver
        FirefoxOptions options = new FirefoxOptions();
        driver = new FirefoxDriver(options);
        //Resize the current window to the given dimension
        driver.manage().window().setSize(Screen);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(500, TimeUnit.MILLISECONDS);
        */

            //ChromeDriver
            ChromeOptions options = new ChromeOptions();

            Map<String, Object> prefs = new HashMap<String, Object>();
            options.addArguments("disable-extensions");
            options.addArguments("disable-infobars");
            options.setExperimentalOption("prefs", prefs);
            options.addArguments("chrome.switches","--disable-extensions");
            options.addArguments("--test-type" );
            options.addArguments("window-size=1920,1080");
            options.addArguments("--no-sandbox");
            options.addArguments("enable-automation");
            options.addArguments("test-type=browser");
            options.addArguments("disable-plugins");
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            prefs.put("credentials_enable_service", false);
            prefs.put("profile.default_content_settings.popups", 0);
            prefs.put("password_manager_enabled", false);

            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(200, TimeUnit.MILLISECONDS);

        }
        return driver;
    }
}
