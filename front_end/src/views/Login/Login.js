
import React, {Component} from 'react';
import {Container, Row, Col, CardGroup,   Modal, ModalHeader, ModalBody,Card, CardBody, Button, Input, InputGroup, FormGroup,InputGroupAddon, InputGroupText, Form} from 'reactstrap';
import nav from '../../components/Sidebar/_nav';
import config from '../Config/ServerUrl';

class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      menuItems: [],
      forgotModalToggleView:false,
      changePasswordToggleView:false,
      otpValidationToggleView:false,
      changePasswordSuccessToggleView:false,
      email:'',
      errorMessageEmail:'',
      otpValidationError:'',

    };
    self = this;

    this.forgotModalToggle = this.forgotModalToggle.bind(this);
    this.changePasswordToggle = this.changePasswordToggle.bind(this);
    this.otpValidationToggle = this.otpValidationToggle.bind(this);
    this.sendOPTCodeToMailID = this.sendOPTCodeToMailID.bind(this);
    this.changePasswordSuccessToggle = this.changePasswordSuccessToggle.bind(this);
  } 

  goToRegister() {
    window.location.href = "#/register";
  }

  componentDidMount() {
    document.getElementById("invalid").style.display = "none";

  }

  loginUser() {
    const formData = new FormData();
      formData.append('email', document.getElementById("email").value);
      formData.append('password', document.getElementById("password").value);

      fetch(config.serverUrl+'/userLogin', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
      if (!res1.ok) {
        if (error.message) {
          self.setState({errorMessage :error.message});
        } 
      }
      return res1.json();
    }).then(function(response)   {

        if(response.id == -1) {
          document.getElementById("invalid").style.display = "block";
          document.getElementById("invalid").style.color = "red";

        } else {
          localStorage.setItem('X-AUTH-TOKEN', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          var isPermissionMgmt = 0;
          var isUserMgmt = 0;
          self.state.menuItems.push(nav.items[0]);
          JSON.parse(localStorage.getItem("user")).permissions.forEach(function(permission) {
            if(permission.module == "ETL Mapping") {
              self.state.menuItems.push(nav.items[1]);
            }
            if(permission.module == "Permission Management" && isPermissionMgmt == 0) {
              isPermissionMgmt = 1;
              self.state.menuItems.push(nav.items[2]);
            }
            if(permission.module == "User Management" && isUserMgmt == 0) {
              isUserMgmt = 1;
              self.state.menuItems.push(nav.items[3]);
            }
            if(permission.module == "Settings") {
              self.state.menuItems.push(nav.items[4]);
            }
            if (permission.module == "Reports") {
              self.state.menuItems.push(nav.items[5]);
            }
          })          
          localStorage.setItem('menuItems',JSON.stringify(self.state.menuItems));
          window.location.href = "#/";
        }
        
    });
  }
  forgotModalToggle()
  {
    self.setState({forgotModalToggleView : !this.state.forgotModalToggleView});
  }
  otpValidationToggle()
  {
    self.setState({
      otpValidationToggleView : !this.state.otpValidationToggleView,
    });
  }
  changePasswordToggle()
  {
    self.setState({
      changePasswordToggleView : !this.state.changePasswordToggleView,
    });
  }
  changePasswordSuccessToggle(){
    self.setState({
      changePasswordSuccessToggleView : !this.state.changePasswordSuccessToggleView
    })
  }
  
  sendOPTCodeToMailID(){
    self.state.email = document.getElementById("forgotPasswordEmailId").value;
    const formData = new FormData();
    formData.append('email', self.state.email);
    fetch(config.serverUrl+'/forgotPassword/sentOTP', {
      method: 'POST',
      body: formData 
    }).then(function(res1) {
    if (!res1.ok) {

    }
    return res1.json();
  }).then(function(response)   {

      if(response) {
       self.state.forgotModalToggleView = false;
        self.otpValidationToggle();
      }
      else{
        self.state.errorMessageEmail = "Email Address is not registered";
       document.getElementById("errorEmailNotFound").style.color = "red";
      document.getElementById("errorEmailNotFound").innerHTML = self.state.errorMessageEmail;
      
      }
  
    });

  }

  otpValidation(){

    const formData = new FormData();
    formData.append('email',self.state.email);
    formData.append('otp', document.getElementById('otp').value);
    fetch(config.serverUrl+'/forgotPassword/validateOTP', {
      method: 'POST',
      body: formData 
    }).then(function(res1) {
    if (!res1.ok) {
    }
    return res1.json();
  }).then(function(response)   {
      if(response) {
        self.state.otpValidationToggleView = false;
        self.changePasswordToggle();
      }
      else{
        console.log('works');
      self.state.otpValidationError = "OTP is invalid ! Please try again";
      document.getElementById("otpInvaidError").style.color = "red";
      document.getElementById("otpInvaidError").innerHTML = self.state.otpValidationError;
      }
    });
  }

  
  changePassword(){
    if(document.getElementById('newPassword').value == document.getElementById('reEnterNewPasword').value){
    const formData = new FormData();
    formData.append('email',self.state.email);
    formData.append('newPassword', document.getElementById('newPassword').value);
    fetch(config.serverUrl+'/forgotPassword/changePassword', {
      method: 'POST',
      body: formData 
    }).then(function(res1) {
    if (!res1.ok) {
    }
    return res1.json();
  }).then(function(response)   {
      if(response) {
        self.setState({
          changePasswordToggleView:false,
        });
        self.changePasswordSuccessToggle();
  
      }
    });
  }
  else{
    document.getElementById("passwordMatchError").style.color = "red";
    document.getElementById("passwordMatchError").innerHTML = "Password not matched";
  }
}

  render() {
    return (
      <div className="row-align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                <Form onSubmit={this.loginUser}>
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" id="email" placeholder="email"/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="password" placeholder="Password"/>
                    </InputGroup>
                    <p id="invalid">Invalid credentials</p>
                    <Row>
                      <Col xs="6">
                        <Button type="submit" color="primary" className="px-4">Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link"onClick={this.forgotModalToggle} className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                  </Form>
                </Card>
   
              </CardGroup>
            </Col>
          </Row>
        </Container>
        {/* ------------------------------------------Forgot Password Modal------------------------------------ */}
       
        <Modal isOpen={this.state.forgotModalToggleView} toggle={this.forgotModalToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'} style={{width: '400px', height:'200px'}}>
        <ModalHeader style={{    background: '#333333' , color: '#ffffff', height: '40px'}} >
          <p style={{marginTop:'-10px'}}>Forgot Your Password?</p>
        </ModalHeader>
      <ModalBody>
                <p style={{marginTop:'-10px'}}>Please Enter Registered Email Address</p>
          <Row style={{marginLeft:'auto', marginRight:'auto'}}>
            <Input type="text" name="emailId" id="forgotPasswordEmailId" placeholder="Write email here"/>
            <div id="errorEmailNotFound"></div>
        </Row>
        
        <Row>
          <Col md="4"></Col>
          <Col md="4">
          <Button style={{width:'-webkit-fill-available', height:'35px', marginTop:'20px',background: '#c01818', color: '#ffffff'}} onClick={this.sendOPTCodeToMailID } value="submit" name="submit">Submit</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>

           {/* -----------------------------OTP Validation modal-------------------------------- */}
    <Modal isOpen={this.state.otpValidationToggleView} toggle={this.otpValidationToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'} style={{width: '400px', height:'200px'}}>
        <ModalHeader style={{    background: '#333333' , color: '#ffffff', height: '40px'}}>
          <p style={{marginTop:'-10px'}}>Email Varification</p>
        </ModalHeader>
      <ModalBody>
                <p style={{marginTop:'-10px', color:'#008a00'}}>We have Successfully sent an OTP to your email. Please check your inbox. </p>
          <Row style={{marginLeft:'auto', marginRight:'auto'}}>
            <Input type="text" name="otp" id="otp" placeholder="Write OTP here"/>
            <div id="otpInvaidError"></div>
        </Row>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
          <Button style={{width:'-webkit-fill-available', height:'35px', marginTop:'20px',background: '#c01818', color: '#ffffff'}} onClick={this.otpValidation} value="submit" name="submit">Submit</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>

      {/* -------------------------------------Password Change Modal---------------------------------- */}

    <Modal isOpen={this.state.changePasswordToggleView} toggle={this.changePasswordToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'} style={{width: '400px', height:'200px'}}>
        <ModalHeader style={{    background: '#333333' , color: '#ffffff', height: '40px'}}>
          <p style={{marginTop:'-10px'}}>Enter New Password?</p>
        </ModalHeader>
      <ModalBody>
        <Row style={{marginLeft:'auto', marginRight:'auto'}}>
            <Input type="text" name="newPassword" id="newPassword" placeholder="Enter New Password"/>
        </Row>
          <Row style={{marginLeft:'auto', marginRight:'auto', marginTop:'20px'}}>
            <Input type="text" name="reEnterNewPasword" id="reEnterNewPasword" placeholder="ReEnter New Password"/>
            <div id="passwordMatchError"></div>
        </Row>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
          <Button style={{width:'-webkit-fill-available', height:'35px', marginTop:'20px',background: '#c01818', color: '#ffffff'}} onClick={this.changePassword } value="submit" name="submit">Submit</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>

    {/* -----------------------------Password Change Sucess Modal---------------------------------- */}
     

      <Modal isOpen={this.state.changePasswordSuccessToggleView} toggle={this.changePasswordSuccessToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'} style={{width: 'fitContent'}}>
        <ModalHeader style={{    background: '#333333' , color: '#ffffff', height: '40px'}}>
          <p style={{marginTop:'-10px'}}>Successfully password changed</p>
        </ModalHeader>
      <ModalBody>
      <Row>
        <img style={{margin: 'auto'}} src="/img/Success.png"></img>
        </Row>
        <Row> 
          <Col xs="12" md="2"></Col>
          <Col>
          <p style={{marginLeft:'5px'}}>Please <a style={{cursor:'pointer',color:'blue',fontSize:'medium'}}onClick={self.changePasswordSuccessToggle} >login</a> with new password</p>
          </Col>  
          </Row>

     
      </ModalBody>
    </Modal>

      </div>
    );
  }
}

export default Login;
