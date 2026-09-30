package com.zosh.request;

public class OtpSignupRequest {
    private String email;
    private String mobile;
    private String otp;
    private String firstName;
    private String lastName;
    private String password;

    public OtpSignupRequest() {}

    public OtpSignupRequest(String email, String mobile, String otp, String firstName, String lastName, String password) {
        this.email = email;
        this.mobile = mobile;
        this.otp = otp;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
