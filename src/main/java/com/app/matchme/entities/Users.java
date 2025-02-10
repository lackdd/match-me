package com.app.matchme.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String username;
    private String gender;
    private Integer age;
    private String profilePicture;

    public Users() {}

    public Users(String email, String password, String username, int age, String gender, String profilePicture) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.age = age;
        this.gender = gender;
        this.profilePicture = profilePicture;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {return username;}

    public void setUsername(String username) {this.username = username;}

    public String getGender() {return gender;}

    public void setGender(String gender){this.gender = gender;}

    public Integer getAge() {return age;}

    public void setAge(Integer age) {this.age = age;}

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
