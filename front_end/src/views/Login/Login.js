
import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, InputGroupText, Form} from 'reactstrap';
import nav from '../../components/Sidebar/_nav';
import config from '../Config/ServerUrl';

class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      menuItems: [],
    };
    self = this;
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
        //console.log(response);
        if(response.id == -1) {
          document.getElementById("invalid").style.display = "block";
          document.getElementById("invalid").style.color = "red";

        } else {
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
          /*self.state.menuItems.forEach(function(permission) {
            if(permission == null) {
              self.state.menuItems.splice(this.state.menuItems.indexOf(permission),1);
            }
          })*/
          
          localStorage.setItem('menuItems',JSON.stringify(self.state.menuItems));
          //console.log(self.state.menuItems);
          window.location.href = "#/";
        }
        
    });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
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
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                  </Form>
                </Card>
                {/*<Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      
                      <Button color="primary" className="mt-3" active onClick={this.goToRegister}>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>*/}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
