package SETLAPIHelpers.RestAPI;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.sql.*;
import java.util.Set;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;


public class DatabaseHelper {


    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "mikimosu81";

    public static void validateDatabaseAccountTable(String accountName, String accountDescription, int expectedCount) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
            rs = stmt.executeQuery("select * from setlnet.tblAccounts where accountName = " + "\"" + accountName + "\" AND description =  " + "\"" + accountDescription + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): " + accountName, expectedCount, rows);

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

    public static void validateDatabaseMembersTable(String memberName,  int expectedCount) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
            rs = stmt.executeQuery("select * from setlnet.tblMembers where memberName = " + "\"" + memberName + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): " + memberName, expectedCount, rows);

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }


    public static void validateDatabaseUsersTable(String userName,  String email, int expectedCount) throws SQLException {

        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {

            rs = stmt.executeQuery("select * from setlnet.tblUsers where userName = " + "\"" + userName + "\" AND emailAddress =  " + "\"" + email + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): " + userName + " but there were " + rows, expectedCount, rows);


        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

    public static void validateDatabaseUserDetailsTable(String displayName, String firstName, String lastName, String mobilePhone, String addressPrefix, String address1, String address2, String address3, String address4, String postalCode, String memorableQuestion,
                                                        String memorableAnswer, String profileText, int expectedCount) throws SQLException {

        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {

            rs = stmt.executeQuery("select * from setlnet.tblUserDetails where displayName = " + "\"" + displayName + "\" AND firstName =  " + "\"" + firstName + "\"  AND lastName =  " + "\"" + lastName + "\"" +
                " AND mobilePhone =  " + "\"" + mobilePhone + "\" AND addressPrefix = " + "\"" + addressPrefix + "\" AND address1 = " + "\"" + address1 + "\" AND address2 = " + "\"" + address2 + "\" AND address3 = " + "\"" + address3 + "\" AND address4 = " + "\"" + address4 + "\"" +
            " AND postalCode = " + "\"" + postalCode + "\" AND country IS NOT NULL AND memorableQuestion = " + "\"" + memorableQuestion + "\" AND memorableAnswer = " + "\"" + memorableAnswer + "\" AND profileText = " + "\"" + profileText + "\"") ;
            int rows = 0;

            System.out.println();

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): " + displayName + " but there were " + rows, expectedCount, rows);


        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }

    }

    public static void validateDatabaseCountRows(String table, int expectedCount) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            String countRows = "select * from setlnet.tbl" + table;
            rs = stmt.executeQuery(countRows);
            rs.last();
            assertEquals("There should be exactly " + expectedCount + " record(s) ", expectedCount, rs.getRow());

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

    public static String getUserIDFromUsername(String userName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        String userId = "";
        try {
            String getUserId = "select userid from setlnet.tblUsers where userName = " + "\"" + userName + "\"";

            rs = stmt.executeQuery(getUserId);
            rs.last();
            userId = rs.getString("userID");

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
        return userId;
    }

    public static int getWalletLockedStateFromWalletname(String walletName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        int walletLockState = 0;
        try {
            String walletLockedState = "select walletLocked from setlnet.tblWalletDetail where walletName = " + "\"" + walletName + "\"";

            rs = stmt.executeQuery(walletLockedState);
            rs.last();
            walletLockState = rs.getInt("walletLocked");

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
        return walletLockState;
    }



    public static int databaseCountRows(String table) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        int count = 0;
        try {
            String countRows = "select * from setlnet.tbl" + table;
            rs = stmt.executeQuery(countRows);
            rs.last();
            count = rs.getRow();

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
        return count;
    }


    public static void deleteAccountFromDatabase(String accountName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblAccounts WHERE accountName = " + "\"" + accountName + "\"");

        conn.close();
        stmt.close();

    }

    public static void deleteUserFromDatabase(String email) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblUsers WHERE emailAddress = " + "\"" + email + "\"");

        conn.close();
        stmt.close();
    }



    public static void validateDatabaseWalletTable(String walletName, int lockState) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
            rs =  stmt.executeQuery("select walletLocked from setlnet.tblwalletDetail  where walletName = " + "\"" + walletName + "\" AND walletLocked =  " + "\"" + lockState + "\"");
            int rows = 0;
            rs.next();

            String result = rs.getString("data");
            JsonParser parser = new JsonParser();
            // we hve the json object
            JsonObject jsonResult = (JsonObject) parser.parse(result);

            // need to store the  set as an set of strings
            Set<String> names = jsonResult.keySet();

            for (String name : names) {

                assertTrue(jsonResult.get(name).toString().equals("\"\"") || jsonResult.get(name).toString().equals("[]"));

            }

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }


    public static void deleteFormdataFromDatabase(String userId, String formId) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblUsersFormdata WHERE userId = " + "\"" + userId +  "\" AND formId =  " + "\"" + formId + "\"");

        conn.close();
        stmt.close();

    }


    public static void deleteFormdataFromDatabase(String userId) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblUsersFormdata WHERE userId = " + "\"" + userId +  "\"");

        conn.close();
        stmt.close();

    }


    public static void setDBTwoFAOn() throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("UPDATE setlnet.tblSiteSetting SET value = 1 WHERE settingID = '5'");

        conn.close();
        stmt.close();
    }

    public static void setDBTwoFAOff() throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("UPDATE setlnet.tblSiteSetting SET value = 0 WHERE settingID = '5'");

        conn.close();
        stmt.close();
    }


    public static String getDb2FaSharedSecret(String userName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        String result = "NOT FOUND";
        try
        {
            rs =  stmt.executeQuery("select twoFactorSecret from setlnet.tblUsers where userName = " + "\"" + userName + "\"");
            rs.last();

            String secret = rs.getString("twoFactorSecret");
            result =  secret;
        }
        catch (Exception e)
        {
            System.out.println("Error trying to get 2FA secret");
            return "BUG";
        }
        finally
        {
            conn.close();
            stmt.close();
        }

        return result;
    }

}



