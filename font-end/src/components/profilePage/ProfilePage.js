import React, { Component } from "react";
import "./profile.css";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      editMail: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="main-profile-wrapper">
        <div className="profile-page-wrapper">
          {this.props.profileData.name && this.props.profileData.name !== "" ? (
            <div className="profile-item">
              <label>Name:</label> <span>{this.props.profileData.name}</span>
            </div>
          ) : (
            ""
          )}
          {this.props.profileData.email &&
          this.props.profileData.email !== "" ? (
            <div className="profile-item">
              <label>Email:</label> <span>{this.props.profileData.email}</span>
            </div>
          ) : (
            ""
          )}

          <div className="profile-item">
            <button onClick={this.props.logout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
