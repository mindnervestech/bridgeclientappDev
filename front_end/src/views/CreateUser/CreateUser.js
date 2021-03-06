import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, FormGroup, Label, InputGroupAddon, InputGroupText, Form, Badge, TabContent, TabPane, Nav, NavItem, NavLink, Alert } from 'reactstrap';
import classnames from 'classnames';
import config from '../Config/ServerUrl';
import './CreateUserStyle.css';

class CreateUser extends Component {
  constructor(props, context) {
    super(props, context);

    this.toggle = this.toggle.bind(this);
    this.state = {
      userName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      rolesList: [],
      groupsList: [],
      groupIdList: [],
      activeTab: '1',
      userNameMsg: '',
      emailMsg: '',
      passwordMsg: '',
      firstNameMsg: '',
      lastNameMsg: '',
      phoneMsg: '',
      primary: false,
      emailExists: false,
      passwordLength: false,
    };
    self = this;
    this.togglePrimary = this.togglePrimary.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {

    if (localStorage.getItem("user") != null) {
      var check = 0;
      JSON.parse(localStorage.getItem("user")).permissions.forEach(function (permission) {

        if (permission.module == "Reports") {
          check = 1;
        }
      })

      if (check == 0) {
        window.location.href = "#/AuthorizationError";
      }
    }

    fetch(config.serverUrl + '/getMaintenanceMode', {
      method: 'GET'
    }).then(function (res1) {
      if (!res1.ok) {
        if (error.message) {
          self.setState({ errorMessage: error.message });
        }
      }
      return res1.json();
    }).then(function (response) {

      if (response.maintenanceMode == "true") {
        window.location.href = "#/maintenance";
      }

    });

    var check = 0;
    if (localStorage.getItem("user") != null) {
      document.getElementById("successMsg").style.display = "none";
      JSON.parse(localStorage.getItem("user")).permissions.forEach(function (permission) {
        if (permission.name == "Create" && permission.module == "User Management") {
          check = 1;
        }
      })
    }
    if (check == 0) {
      window.location.href = "#/AuthorizationError";
    }
    /*fetch(config.serverUrl+'/getUserRoles', {
      method: 'GET'
  }).then(function(res1) {
    if (!res1.ok) {
      if (error.message) {
        self.setState({errorMessage :error.message});
      } 
    }
    return res1.json();
  }).then(function(response)   {
    console.log(response);
    self.setState({rolesList: response});
  });*/
    if (localStorage.getItem("user") != null) {
      fetch(config.serverUrl + '/getAllGroups', {
        method: 'GET'
      }).then(function (res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({ errorMessage: error.message });
          }
        }
        return res1.json();
      }).then(function (response) {
        self.setState({ groupsList: response });
      });
    }
  }

  handleChange(event, groupId) {
    if (event.target.checked == true) {
      this.state.groupIdList.push(groupId);
    } else {
      this.state.groupIdList.splice(this.state.groupIdList.indexOf(groupId), 1);
    }
  }

  handleSubmit() {

    if (document.getElementById("userName").value != "" &&
      document.getElementById("email").value != "" &&
      document.getElementById("firstName").value != "" &&
      document.getElementById("lastName").value != "" &&
      document.getElementById("phone").value != "" &&
      document.getElementById("password").value != "" &&
      self.validateEmail(document.getElementById("email").value) == true &&
      self.state.emailExists == false &&
      self.checkPasswordLength(document.getElementById("password").value) == true
    ) {
      self.state.userNameMsg = "";
      self.state.emailMsg = "";
      self.state.emailMsg = "";
      self.state.passwordMsg = "";
      self.state.firstNameMsg = "";
      self.state.lastNameMsg = "";
      self.state.phoneMsg = "";

      const formData = new FormData();
      formData.append('userName', document.getElementById("userName").value);
      formData.append('email', document.getElementById("email").value);
      formData.append('firstName', document.getElementById("firstName").value);
      formData.append('lastName', document.getElementById("lastName").value);
      formData.append('phone', document.getElementById("phone").value);
      formData.append('password', document.getElementById("password").value);
      formData.append('groupIdList', self.state.groupIdList);

      fetch(config.serverUrl + '/saveUser', {
        method: 'POST',
        body: formData
      }).then(function (response) {
        document.getElementById("successMsg").style.display = "block";
        setTimeout(function () {
          document.getElementById("successMsg").style.display = "none";
        }, 4000);

      });

    } else {

      self.togglePrimary();
      if (document.getElementById("userName").value == "")
        self.setState({ userNameMsg: "* Required" });
      else
        self.setState({ userNameMsg: "" });

      if (!self.validateEmail(document.getElementById("email").value)) {
        self.setState({ emailMsg: "* Invalid Email Address" });
      } else {
        self.setState({ emailMsg: "" });
      }
      if (document.getElementById("password").value == "" || self.state.passwordLength == false)
        self.setState({ passwordMsg: "* Required (Password must be at least 6 characters)" });
      else
        self.setState({ passwordMsg: "" });
      if (document.getElementById("firstName").value == "")
        self.setState({ firstNameMsg: "* Required" });
      else
        self.setState({ firstNameMsg: "" });
      if (document.getElementById("lastName").value == "")
        self.setState({ lastNameMsg: "* Required" });
      else
        self.setState({ lastNameMsg: "" });
      if (document.getElementById("phone").value == "")
        self.setState({ phoneMsg: "* Required" });
      else
        self.setState({ phoneMsg: "" });
    }
  }

  togglePrimary() {
    this.setState({
      primary: !this.state.primary
    });
  }

  validateEmail(email) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (reg.test(email) == false) {
      self.setState({ emailMsg: "* Invalid Email Address" });
      return false;
    }
    self.chekEmailAlreadyExists();
    self.setState({ emailMsg: "" });
    return true;
  }

  chekEmailAlreadyExists() {
    const formData = new FormData();
    formData.append('email', document.getElementById("email").value);
    fetch(config.serverUrl + '/checkEmailExists', {
      method: 'POST',
      body: formData
    }).then(function (res1) {
      if (!res1.ok) {
        if (error.message) {
          self.setState({ errorMessage: error.message });
        }
      }
      return res1.json();
    }).then(function (response) {
      self.state.emailExists = response;
      if (response == true) {
        self.setState({ emailMsg: "* Email Already Exists" });
      } else {
        self.setState({ emailMsg: "" });
      }
    });

  }

  checkPasswordLength(password) {
    console.log(password.length);
    if (password.length < 6) {
      self.setState({ passwordMsg: "* Password must be at least 6 characters" });
      self.state.passwordLength = false;
      return false;
    } else {
      self.setState({ passwordMsg: "" });
      self.state.passwordLength = true;
      return true;
    }
  }


  render() {
    return (
      <div className="animated fadeIn commonFont">
        <br />
        <br />
        <Row>
          <Col xs="12" md="12" className="mb-4">
            <Alert id="successMsg" color="success">
              User created successfully
          </Alert>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  User Details
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Permissions
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Container>
                  <Row className="justify-content-center">
                    <Col md="6">
                      <Card className="mx-4">
                        <Form>
                          <CardBody className="p-4">
                            <h1>Create User</h1>

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="email" placeholder="Username" id="userName" />
                              &nbsp;&nbsp;
                            </InputGroup><div class="formValidationStyle" ><Label style={{ color: "red" }}>{this.state.userNameMsg}</Label></div>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>@</InputGroupText>
                              </InputGroupAddon>
                              <Input type="email" id="email" onBlur={(e) => self.validateEmail(e.target.value)} placeholder="Email" />
                              &nbsp;&nbsp;
                            </InputGroup><div class="formValidationStyle"><Label style={{ color: "red" }}>{this.state.emailMsg}</Label></div>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="firstName" placeholder="First Name" />
                              &nbsp;&nbsp;
                            </InputGroup><div class="formValidationStyle"><Label style={{ color: "red" }}>{this.state.firstNameMsg}</Label></div>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="lastName" placeholder="Last Name" />
                              &nbsp;&nbsp;
                            </InputGroup><div class="formValidationStyle"><Label style={{ color: "red" }}>{this.state.lastNameMsg}</Label></div>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-phone"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="number" id="phone" min="0" placeholder="Phone" />
                              &nbsp;&nbsp;
                            </InputGroup><div class="formValidationStyle"><Label style={{ color: "red" }}>{this.state.phoneMsg}</Label></div>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-lock"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="password" id="password" placeholder="Password" onBlur={(e) => self.checkPasswordLength(e.target.value)} />
                              &nbsp;&nbsp;
                            </InputGroup>
                            <div class="formValidationStyle"><Label style={{ color: "red" }}>{this.state.passwordMsg}</Label></div>
                          </CardBody>
                        </Form>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </TabPane>
              <TabPane tabId="2">
                <div className="row">
                  {
                    self.state.groupsList.map(function (group, i) {
                      return (
                        <div className="col-md-3">
                          <FormGroup>
                            <Col md="12">
                              <FormGroup check className="checkbox">
                                <Input className="form-check-input" type="checkbox" id={i} name={group.name} value="option1" onChange={(e) => self.handleChange(e, group.id)} />
                                <Label check className="form-check-label" htmlFor="checkbox1">{group.name}</Label>
                              </FormGroup>
                            </Col>
                            <Col md="12">
                            </Col>
                          </FormGroup>
                        </div>
                      );
                    })
                  }
                </div>
                <Row>
                  <div className="col-md-5">
                  </div>
                  <div className="col-md-2">
                    <Button type="submit" className="userSaveButtonStyle" block onClick={this.handleSubmit}>Create User</Button>
                  </div>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
          <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
            className={this.props.className + ' tableRowsStyle'}>
            <ModalHeader style={{ borderBottom: "0px" }} toggle={this.togglePrimary}></ModalHeader>
            <ModalBody style={{ textAlign: "center", paddingBottom: "10%", color: "red", fontSize: "20px", marginTop: "-6%" }}>
              Please fill all the required fields.
                  </ModalBody>
          </Modal>
        </Row>
      </div>
    );
  }
}

export default CreateUser;
