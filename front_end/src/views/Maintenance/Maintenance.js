import React, {Component} from 'react';
import {
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  FormGroup,
  Label,
  Input,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from 'reactstrap';
import config from '../Config/ServerUrl';
//import './CreatedUsersStyles.css';


class Maintenance extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      usersList: [],
      isCreate: false,
      isEdit: false,
      isDelete: false,
      isReadOnly: false,
      primary: false,
      userIdToDelete: 0,
    };
    self = this;
    
  }

  

  goToEditUser(event, userId) {
    window.location.href = "#/editUser/"+userId;
  }

  

  componentDidMount() {
    //console.log("on page load....");
    if(localStorage.getItem("user") != null) {
      var check = 0;
        JSON.parse(localStorage.getItem("user")).permissions.forEach(function(permission) {
          if(permission.name == "Edit" && permission.module == "User Management") {
            self.setState({isEdit :true});
          }
          if(permission.name == "Delete" && permission.module == "User Management") {
            self.setState({isDelete :true});
          }
          if(permission.name == "Create" && permission.module == "User Management") {
            self.setState({isCreate :true});
          }
          if(permission.name == "Read Only" && permission.module == "User Management") {
            self.setState({isReadOnly :true});
          }
          if(permission.module == "User Management") {
            check = 1;
          }
        })

        if(check == 0) {
          window.location.href = "#/AuthorizationError";
        }
      fetch(config.serverUrl+'/getAllUsers', {
          method: 'GET'
      }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {
        //console.log("success...");
        //console.log(response);
        self.setState({usersList: response});
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
          <Card>
            <CardBody style={{height:560}}>
              <FormGroup row style={{marginTop:100}}>
                <Col xs="12" md="2">
                </Col>
                <Col xs="12" md="9" >
                  <h4><b><Label>Sorry, website is under maintenance please login after some time!</Label></b></h4>    
                </Col>
              </FormGroup>
            </CardBody>
          </Card>   
      </div>

    )
  }
}

export default Maintenance;
