import React, { Component } from 'react';
import { ReCaptcha } from 'react-recaptcha-google'
class ExampleComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }
  componentDidMount() {
    if (this.captchaDemo) {
        this.captchaDemo.reset();
    }
  }
  onLoadRecaptcha() {
      if (this.captchaDemo) {
          this.captchaDemo.reset();
      }
  }
  verifyCallback(recaptchaToken) {
    this.props.captchaRes(recaptchaToken)
  }
  render() {
    return (
      <div>
        {/* You can replace captchaDemo with any ref word */}
        <ReCaptcha
            ref={(el) => {this.captchaDemo = el;}}
            size="normal"
            data-theme="dark"            
            render="explicit"
            sitekey="6LeWOX4UAAAAAECCXCVVEeSZ5pu2HFoWCZJ6BJEa"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
      </div>
    );
  };
};
export default ExampleComponent;