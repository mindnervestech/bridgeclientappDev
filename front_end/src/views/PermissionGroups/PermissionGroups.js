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
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Alert
} from 'reactstrap';
import config from '../Config/ServerUrl';
import '../CreatedUsers/CreatedUsersStyles.css';

class PermissionGroups extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      groupsList: [],
      primary: false,
      groupId:0,
    };
    self = this;
    this.togglePrimary = this.togglePrimary.bind(this);
  }

  togglePrimary(event, groupId) {
    self.setState({groupId :groupId});
    this.setState({
      primary: !this.state.primary
    });
  }

  componentDidMount() {
    //console.log("on page load....");

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
        
        if(response == true) {
          window.location.href = "#/maintenance";
        } 
        
      });
    
    if(localStorage.getItem("user") != null) {
      //document.getElementById("successMsg").style.display = "none";
      var check = 0;
        JSON.parse(localStorage.getItem("user")).permissions.forEach(function(permission) {
          if(permission.name == "Edit" && permission.module == "Permission Management") {
            self.setState({isEdit :true});
          }
          if(permission.name == "Delete" && permission.module == "Permission Management") {
            self.setState({isDelete :true});
          }
          if(permission.name == "Create" && permission.module == "Permission Management") {
            self.setState({isCreate :true});
          }
          if(permission.name == "Read Only" && permission.module == "Permission Management") {
            self.setState({isReadOnly :true});
          }
          if(permission.module == "Permission Management") {
            check = 1;
          }
        })

        if(check == 0) {
          window.location.href = "#/AuthorizationError";
        }

      fetch(config.serverUrl+'/getAllGroups', {
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
        self.setState({groupsList: response});
      });
    }
  }

  goToEditGroup(event,id) {
    window.location.href = "#/editPermissions/"+id;
  }

  deleteGroup() {
    fetch(config.serverUrl+'/deleteGroupById/'+self.state.groupId, {
        method: 'GET'
    }).then(function(response)   {
      /*document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.getElementById("successMsg").style.display = "block";
        setTimeout(function(){ 
        document.getElementById("successMsg").style.display = "none";
       }, 4000);*/
      window.location.reload();
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
       <br/>
       <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}} className="cardHeaderTextStyles">
                <i class="icon-lock-open icons"></i> Groups
                {
                  self.state.isCreate == true ? 
                  <a href="#/addPermissions" color="primary" class="btn btn-primary btn-sm" onClick={this.addGroup} style={{float:"right",marginTop:"1px"}}>+ Create Group</a> : null
                }
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                       className={'modal-primary ' + this.props.className + ' tableRowsStyle'}>
                  <ModalHeader toggle={this.togglePrimary}>Delete Group</ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete group?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.deleteGroup}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.togglePrimary}>No</Button>
                  </ModalFooter>
                </Modal>
                <Table hover bordered striped responsive>
                  <thead>
                  <tr className="tableHeaderStyle">
                    <th>Name</th>
                    <th>Description</th>
                    <th>Edit</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    self.state.groupsList.map(function(group, i) {
                      return (
                                <tr className="tableRowsStyle">
                                  <td>{group.name}</td>
                                  <td>{group.description}</td>
                                  <td>
                                    {
                                      self.state.isEdit ? <i class="fa fa-edit fa-lg editButtonStyle" onClick={(e) => self.goToEditGroup(e,group.id)}></i> : null 
                                    }
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                    {
                                      self.state.isDelete ? <i class="fa fa-trash fa-lg editButtonStyle" onClick={(e) => self.togglePrimary(e,group.id)}></i> : null 
                                    }
                                  </td>
                                </tr>
                              );
                    })
                  }
                  </tbody>
                </Table>
                {/*<Pagination>
                  <PaginationItem>
                    <PaginationLink previous href="#"></PaginationLink>
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next href="#"></PaginationLink>
                  </PaginationItem>
                </Pagination>*/}
                {/*<FormGroup row>
                <Col xs="12" md="5">
                </Col>
                      <Col xs="12" md="4">
                        <div className="form-actions">
                            <a href="#/addPermissions" color="primary" class="btn btn-primary" onClick={this.addGroup}>Create Group</a>
                        </div>
                      </Col>
                </FormGroup>*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default PermissionGroups;
