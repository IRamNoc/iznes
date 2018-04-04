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

    public static void validateDatabaseUsersFormdataTable(int expectedCount) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
            rs = stmt.executeQuery("select * from setlnet.tblUsersFormdata");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);

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
}

