import React, {Component} from 'react';
import {Container, Row, Col, Card, CardBody, CardFooter, Button, Input, InputGroup, FormGroup, Label, InputGroupAddon, InputGroupText, Form, Badge, TabContent, TabPane, Nav, NavItem, NavLink, Alert} from 'reactstrap';
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
    };
    self = this;
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
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {
        //console.log(response);
        self.setState({groupsList: response});
      });
    }    
   }

   handleChange(event, groupId) {
      //console.log(groupId);
      //console.log(event.target.checked);
      if(event.target.checked == true) {
        this.state.groupIdList.push(groupId);
      } else {
        this.state.groupIdList.splice(this.state.groupIdList.indexOf(groupId),1);
      }
      //console.log(this.state.groupIdList);
   }

  handleSubmit() {
    const formData = new FormData();
      formData.append('userName', document.getElementById("userName").value);
      formData.append('email', document.getElementById("email").value);
      formData.append('firstName', document.getElementById("firstName").value);
      formData.append('lastName', document.getElementById("lastName").value);
      formData.append('phone', document.getElementById("phone").value);
      formData.append('password', document.getElementById("password").value);
      //formData.append('roleId', document.getElementById("role").value);
      formData.append('groupIdList', self.state.groupIdList);

      fetch(config.serverUrl+'/saveUser', {
        method: 'POST',
        body: formData 
      }).then(function(response)   {
      document.getElementById("successMsg").style.display = "block";
      setTimeout(function(){ 
        document.getElementById("successMsg").style.display = "none";
       }, 4000);
      //window.location.href = "#/createdUsers";
    });
  }

  render() {
    return (
      <div className="animated fadeIn commonFont">
       <br/>
       <br/>
        <Row>
          <Col xs="12" md="12" className="mb-4">
          <Alert id="successMsg" color="success">
                  User created successfully
          </Alert>
            <Nav tabs className="commonFontColor">
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
                            <h1 className="commonFontColor">Create User</h1>
                            
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" placeholder="Username" id="userName"/>
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>@</InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="email" placeholder="Email"/>
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="firstName" placeholder="First Name"/>
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                  <i className="icon-user"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="lastName" placeholder="Last Name"/>
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                  <i className="icon-phone"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="phone" placeholder="Phone"/>
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="icon-lock"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input type="password" id="password" placeholder="Password"/>
                            </InputGroup>
                            {/*<InputGroup className="mb-3">
                              
                              <Input type="select" id="role" name="userRole">
                                <option>Please select role</option>
                                  {
                                    this.state.rolesList.map(function(role, i) {
                                      return <option value={role.id} key={i}>{role.name}</option>
                                    })
                                  }
                              </Input>
                            </InputGroup>*/}
                            
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
                self.state.groupsList.map(function(group, i) {
                  return (
              <div className="col-md-3">
                <FormGroup>
                    <Col md="12">
                    <FormGroup check className="checkbox">
                              <Input className="form-check-input" type="checkbox" id={i} name={group.name} value="option1" onChange={(e) => self.handleChange(e,group.id)}/>
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
            
            <div className="col-md-2">
              <Button type="submit" color="primary" block onClick={this.handleSubmit}>Create User</Button>
            </div>
              </TabPane>
            </TabContent>
          </Col>
          
        </Row>
      </div>
    );
  }
}

export default CreateUser;
