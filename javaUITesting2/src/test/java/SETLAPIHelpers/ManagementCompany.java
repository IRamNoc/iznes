package SETLAPIHelpers;

public class ManagementCompany {

  public ManagementCompany() {
  }

  String Status;

  String MCName;

  String description;


  public String getStatus() {
    return Status;
  }

  public void setStatus(String Status) {
    this.Status = Status;
  }

  public String getMCName() {
    return MCName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public String toString() {
    return "ManagementCompany{" +
      "Status='" + Status + '\'' +
      ", MCName=" + MCName +
      ", description='" + description +
      '}';
  }
}



