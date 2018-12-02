import React, { Component } from "react";
import ProfilePage from "./components/profilePage/ProfilePage";
import { PostData, GetData, DeleteData } from "./helpers/apicall";
import "bulma/css/bulma.css";
import Notification from "react-bulma-notification";
import "react-bulma-notification/build/css/index.css";
import "./App.css";
import { loadReCaptcha } from "react-recaptcha-google";
import ExampleComponent from "./components/exampleComponent/ExampleComponent";
import Loader from "./components/loader/Loader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      authenticated: false,
      authForm: "login",
      name: "",
      email: "",
      password: "",
      ipcount: 0
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  login = e => {
    e.preventDefault();
    this.setState({ loaded: false });
    PostData("login", this.state)
      .then(result => {
        if (result.status === "failure") {
          this.setState({ loaded: true });
          Notification.error(result.message);
        } else {
          localStorage.setItem("token", result.data.token);
          this.setState({
            authenticated: true,
            data: result.data.info,
            loaded: true
          });
          Notification.success("Welcome");
        }
      })
      .catch(error => {
        this.setState({ loaded: true });
        Notification.error("Error! Please try again.");
      });
  };

  signup = e => {
    e.preventDefault();
    this.setState({ loaded: false });
    PostData("register", this.state)
      .then(result => {
        if (result.status === "failure") {
          this.setState({ loaded: true });
          Notification.error("Please check all the fields.");
        } else {
          localStorage.setItem("token", result.data.token);
          this.setState({
            authenticated: true,
            data: result.data,
            loaded: true
          });
          Notification.success("Welcome");
        }
      })
      .catch(error => {
        this.setState({ loaded: true });
        Notification.error("Error! Please try again.");
      });
  };

  logout = e => {
    e.preventDefault();
    this.setState({ loaded: false });
    DeleteData("logout")
      .then(result => {
        if (result.status === "failure") {
          Notification.error(result.message);
        } else {
          localStorage.clear();
          this.setState({
            loaded: true,
            authenticated: false,
            authForm: "login",
            name: "",
            email: "",
            password: "",
            captcha: "",
            data: {}
          });
          Notification.success("You have successfully logged out.");
          this.ipCount();
        }
      })
      .catch(error => {
        this.setState({ loaded: true });
        Notification.error("Error! Please try again.");
      });
  };

  captchaRes = captcha => {
    this.setState({ captcha });
  };

  signupForm = () => {
    this.setState({ authForm: "signup", name: "", email: "", password: "" });
  };

  loginForm = () => {
    this.setState({ authForm: "login", name: "", email: "", password: "" });
  };

  ipCount = () => {
    GetData("ip-count")
      .then(result => {
        if (result.status === "failure") {
          this.setState({ loaded: true });
        } else {
          this.setState({ ipcount: result.data, loaded: true });
        }
      })
      .catch(err => {
        Notification.error("Error getting Ip count");
        this.setState({ loaded: true });
      });
  };

  componentDidMount = () => {
    loadReCaptcha();
    if (localStorage.token && localStorage.token !== "") {
      this.setState({ loaded: false });
      GetData("confirm-profile")
        .then(result => {
          if (result.status === "failure") {
            this.setState({ loaded: true });
            localStorage.clear();
          } else {
            localStorage.setItem("token", result.data.token);
            this.setState({
              authenticated: true,
              data: result.data,
              loaded: true
            });
            Notification.success("Welcome");
          }
        })
        .catch(error => {
          this.setState({ loaded: true });
          localStorage.clear();
          Notification.error("There is error fetching the data.");
        });
    } else {
      this.setState({ loaded: false });
      this.ipCount();
    }
  };

  render() {
    let { authenticated, data, loaded } = this.state;
    if (!loaded) {
      return <Loader />;
    } else if (!authenticated) {
      return (
        <div className="App">
          <div className="auth-form-wrapper">
            <div className="auth-form">
              {this.state.authForm === "login" ? (
                <form onSubmit={this.login}>
                  <div className="form-input-field">
                    <label>Email:</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="Email"
                      name="email"
                      autoComplete="off"
                      onChange={this.handleChange}
                      value={this.state.email}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Password:</label>
                    <input
                      className="input"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={this.handleChange}
                      value={this.state.password}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <div className="submit-button-wrapper">
                      <button type="submit" className="submit-button">
                        Sign In
                      </button>
                    </div>
                  </div>
                  <div className="signupButton">
                    <span className="span-text" onClick={this.signupForm}>
                      New user ? (Sign up){" "}
                    </span>{" "}
                  </div>
                </form>
              ) : (
                <form onSubmit={this.signup}>
                  <div className="form-input-field">
                    <label>Name:</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Name"
                      name="name"
                      autoComplete="off"
                      onChange={this.handleChange}
                      value={this.state.name}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Email:</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="Email"
                      name="email"
                      autoComplete="off"
                      onChange={this.handleChange}
                      value={this.state.email}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Password:</label>
                    <input
                      className="input"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={this.handleChange}
                      value={this.state.password}
                      required
                    />
                  </div>
                  {this.state.ipcount >= 3 ? (
                    <div>
                      <ExampleComponent
                        captchaRes={captcha => this.captchaRes(captcha)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="form-input-field">
                    <div className="submit-button-wrapper">
                      <button type="submit" className="submit-button">
                        Sign Up
                      </button>
                    </div>
                  </div>
                  <div className="signupButton">
                    <span className="span-text" onClick={this.loginForm}>
                      Log in{" "}
                    </span>{" "}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      );
    } else return <ProfilePage logout={this.logout} profileData={data} />;
  }
}

export default App;
