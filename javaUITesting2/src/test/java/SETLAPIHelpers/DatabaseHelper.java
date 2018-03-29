package SETLAPIHelpers;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.Wallet;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.junit.Before;

import java.io.IOException;
import java.sql.*;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;


public class DatabaseHelper {


    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

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
            assertEquals("There should be exactly "  + expectedCount + " record(s) matching (ignoring case): " + accountName, expectedCount, rows );

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
            assertEquals("There should be exactly "  + expectedCount + " record(s) " , expectedCount, rs.getRow());

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }


    public static void deleteAccountFromDatabase(String accountName) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblAccounts WHERE accountName = " + "\"" + accountName + "\"");

        conn.close();
        stmt.close();

    }

    public static void deleteUserFromDB(String DBUsername, String DBPassword, String email) throws SQLException {
        conn = DriverManager .getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
            rs = stmt.executeQuery("select * from setlnet.tblUsers where emailAddress = " + "\"" + email + "\"");
            int rows = 0;

            // check there is only one result( there should be!! )
            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning
                stmt.executeUpdate("DELETE FROM setlnet.tblUsers WHERE emailAddress = " + "\"" + email + "\"");
                rs.beforeFirst();
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
}


