package SETLAPIHelpers;

import SETLAPIHelpers.JsonToJava;
import SETLAPIHelpers.Wallet;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.setl.restapi.client.RestApi;
import io.setl.restapi.client.message.MemberNodeMessageFactory;
import io.setl.restapi.client.message.MessageFactory;
import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.Before;

import java.io.IOException;
import java.sql.*;
import java.util.Map;
import java.util.Set;

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
            assertEquals("There should be exactly " + expectedCount + " record(s) matching: " + accountName, expectedCount, rows);

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
            assertEquals("There should be exactly " + expectedCount + " record(s) matching: " + memberName, expectedCount, rows);

        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

    public static void validateDatabaseUsersFormdataTable(int expectedCount, String formId, String userId) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;

        try {
           rs =  stmt.executeQuery("select data from setlnet.tblUsersFormdata where formId = " + "\"" + formId + "\" AND userId =  " + "\"" + userId + "\"");
            int rows = 0;
            rs.next();
            assertEquals("There should be exactly " + expectedCount + " record(s) matching: ", expectedCount, rows);
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

    public static void validatePopulatedDatabaseUsersFormdataTable(int expectedCount, String formId, String userId, String userName, String email) throws SQLException {
            conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);

            //for the query
            Statement stmt = conn.createStatement();
            ResultSet rs = null;

            try {
               rs =  stmt.executeQuery("select data from setlnet.tblUsersFormdata where formId = " + "\"" + formId + "\" AND userId =  " + "\"" + userId + "\"");
                int rows = 0;
                rs.next();
                assertEquals("There should be exactly " + expectedCount + " record(s) matching: ", expectedCount, rows);
                String result = rs.getString("data");
                JsonParser parser = new JsonParser();
                // we have the json object
                JsonObject jsonResult = (JsonObject) parser.parse(result);

                // need to store the set as an set of strings
                Set<String> names = jsonResult.keySet();

                for (String name : names) {
                    if (name.equals("username")) {
                        System.out.println(" input userName = " + userName);
                        System.out.println("JSON data " + jsonResult.get(name));
                        System.out.println((jsonResult.get(name).toString().equals("\"" + userName + "\"")));
                        assertTrue((jsonResult.get(name).toString().equals("\"" + userName + "\"")));
                    }
                    if (name.equals("email")) {
                        System.out.println(" input email = " + email);
                        System.out.println("JSON data " + jsonResult.get(name));
                        System.out.println((jsonResult.get(name).toString().equals("\"" + email + "\"")));
                        assertTrue((jsonResult.get(name).toString().equals("\"" + email + "\"")));
                        }
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
            assertEquals("There should be exactly " + expectedCount + " record(s) matching: " + userName + " but there were " + rows, expectedCount, rows);


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

    public static void deleteFormdataFromDatabase(String userId, String formId) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        Statement stmt = conn.createStatement();

        stmt.executeUpdate("DELETE FROM setlnet.tblUsersFormdata WHERE userId = " + "\"" + userId +  "\" AND formId =  " + "\"" + formId + "\"");

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

