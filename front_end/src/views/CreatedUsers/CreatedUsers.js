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
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from 'reactstrap';
import config from '../Config/ServerUrl';
import './CreatedUsersStyles.css';


class CreatedUsers extends Component {

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
    this.togglePrimary = this.togglePrimary.bind(this);
  }

  togglePrimary(event, userId) {
    self.setState({userIdToDelete :userId});
    this.setState({
      primary: !this.state.primary
    });
  }

  goToEditUser(event, userId) {
    window.location.href = "#/editUser/"+userId;
  }

  deleteUser() {
    fetch(config.serverUrl+'/deleteUserById/'+self.state.userIdToDelete, {
        method: 'GET'
    }).then(function(response)   {
      window.location.reload();
    });
  }

  componentDidMount() {


    fetch(config.serverUrl+'/getMaintenanceMode', {
          method: 'GET'
      }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {
        
        if(response.maintenanceMode == "true") {
          window.location.href = "#/maintenance";
        } 
        
      });

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

        self.setState({usersList: response});
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
       <br/>
       <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}} className="userCardHeaderTextStyles">
                <i class="icon-user icons"></i> Users
                {
                  self.state.isCreate == true ? 
                  <a href="#/createUser" color="primary" class="btn btn-primary btn-sm smallButtonsStyle" style={{float:"right",marginTop:"1px"}}><b>+ Create User</b></a> : null
                }
              </CardHeader>
              <CardBody>

              <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                       className={this.props.className+' tableRowsStyle'}>
                  <ModalHeader className="userModalHeaderStyle" toggle={this.togglePrimary}>Delete User</ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete user?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" className="smallButtonsStyle" onClick={this.deleteUser}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.togglePrimary}>No</Button>
                  </ModalFooter>
                </Modal>

                <Table hover bordered striped responsive>
                  <thead>
                  <tr className="userTableHeaderStyle">
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Edit</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    self.state.usersList.map(function(user, i) {
                      return (
                                <tr className="tableRowsStyle">
                                  <td>{user.userName}</td>
                                  <td>{user.email}</td>
                                  <td>{user.phone}</td>
                                  {/*<td>
                                    <Badge color="success">Active</Badge>
                                  </td>*/}
                                  <td>
                                    {
                                      self.state.isEdit ? <i class="fa fa-edit fa-lg editButtonStyle" onClick={(e) => self.goToEditUser(e,user.id)}></i> : null
                                    }&nbsp;&nbsp;&nbsp;&nbsp;
                                    {
                                      self.state.isDelete ? <i class="fa fa-trash fa-lg editButtonStyle" onClick={(e) => self.togglePrimary(e,user.id)}></i> : null
                                    }  
                                  </td>
                                </tr>
                              );
                            })
                  }
                  </tbody>
                </Table>
                {/*<nav>
                  <Pagination>
                    <PaginationItem><PaginationLink previous href="#">Prev</PaginationLink></PaginationItem>
                    <PaginationItem active>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next href="#">Next</PaginationLink></PaginationItem>
                  </Pagination>
                </nav>*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

export default CreatedUsers;
