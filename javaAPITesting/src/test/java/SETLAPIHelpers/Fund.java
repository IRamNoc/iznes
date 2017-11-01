package SETLAPIHelpers;

public class Fund {

  public Fund() {
  }

  @Override
  public String toString() {
    return "User{" +
      "Status='" + Status + '\'' +
      ", userID='" + userID + '\'' +
      ", userName='" + userName + '\'' +
      ", emailAddress='" + emailAddress + '\'' +
      ", account=ID" + accountID +
      ", parent=" + parent +
      ", isManager=" + isManager +
      ", accountLocked=" + accountLocked +
      ", userType=" + userType +
      ", isAdmin=" + isAdmin +
      '}';
  }

  String Status;

  String userID;

  String userName;

  String emailAddress;

  String accountID;

  int parent;

  int isManager;

  int accountLocked;

  int userType;

  int isAdmin;


  public String getUserID() {
    return userID;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public String getStatus() {
    return Status;
  }

  public void setStatus(String Status) {
    this.Status = Status;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public void setEmailAddress(String emailAddress) {
    this.emailAddress = emailAddress;
  }

  public String getAccountID() {
    return accountID;
  }

  public void setAccountID(String accountID) {
    this.accountID = accountID;
  }

  public int getParent() {
    return parent;
  }

  public void setParent(int parent) {
    this.parent = parent;
  }

  public int getIsManager() {
    return isManager;
  }

  public void setIsManager(int isManager) {
    this.isManager = isManager;
  }

  public int getAccountLocked() {
    return accountLocked;
  }

  public void setAccountLocked(int accountLocked) {
    this.accountLocked = accountLocked;
  }

  public int getUserType() {
    return userType;
  }

  public void setUserType(int userType) {
    this.userType = userType;
  }

  public int getIsAdmin() {
    return isAdmin;
  }

  public void setIsAdmin(int isAdmin) {
    this.isAdmin = isAdmin;
  }
}

