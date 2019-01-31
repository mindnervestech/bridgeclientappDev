import React, {Component} from 'react';
import {
  Row,
  Col,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert
} from 'reactstrap';
import config from '../../Config/ServerUrl';
import '../PermissionGroupStyles.css';

class EditPermissionGroup extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      permissionModules: {},
      moduleKeys: [],
      moduleAndName: [],
      savedGroupData: {},
    };
    self = this;
    this.handleChange = this.handleChange.bind(this);
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
        
        if(response == true) {
          window.location.href = "#/maintenance";
        } 
        
      });
    
  	if(localStorage.getItem("user") != null) {
  		document.getElementById("successMsg").style.display = "none";
  		var check = 0;
        JSON.parse(localStorage.getItem("user")).permissions.forEach(function(permission) {
          if(permission.name == "Edit" && permission.module == "Permission Management") {
            check = 1;
          }
        })

        if(check == 0) {
          window.location.href = "#/AuthorizationError";
        }

	      fetch(config.serverUrl+'/getAllPermissions', {
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
	        //console.log(Object.keys(response));
	        let mapKeyz = Object.keys(response);
	      self.setState({permissionModules: response, moduleKeys: mapKeyz});
	    });

	    fetch(config.serverUrl+'/getGroupById/'+this.props.match.params.id, {
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
	      self.setState({savedGroupData: response});
	      document.getElementById("groupName").value = response.name;
	      document.getElementById("description").value = response.description;
	      response.permissionsList.forEach(function(permission) {
	        document.getElementById(permission.module+permission.name).checked = true;
	        self.state.moduleAndName.push(permission.module+"="+permission.name);
	      })
	    });
	}
  }

   handleChange(event,module,name) {
      //console.log(module+" "+name);
      //console.log(event.target.checked);
      if(event.target.checked == true) {
        this.state.moduleAndName.push(module+"="+name);
      } else {
        this.state.moduleAndName.splice(this.state.moduleAndName.indexOf(module+"="+name),1);
      }
      //console.log(this.state.moduleAndName);
   }

   updateGroup(event) {
    //console.log("update...");
    const formData = new FormData();
      formData.append('groupName', document.getElementById("groupName").value);
      formData.append('groupDescription', document.getElementById("description").value);
      formData.append('permissionArray', self.state.moduleAndName);

      fetch(config.serverUrl+'/updateGroupPermissions/'+self.props.match.params.id, {
        method: 'POST',
        body: formData 
      }).then(function(response)   {
      	document.body.scrollTop = document.documentElement.scrollTop = 0;
      	document.getElementById("successMsg").style.display = "block";
      	setTimeout(function(){ 
        document.getElementById("successMsg").style.display = "none";
       }, 4000);
      //window.location.href = "#/permissions";
    });
   }

  render() {
    let moduleNames = this.state.permissionModules;
    return (
      <div className="animated fadeIn commonFont">
       <br/>
       <br/>
      <Alert id="successMsg" color="success" style={{textAlign:"center"}}>
                  Group updated successfully
          </Alert>
        <Row>
          <Col>
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <strong className="cardHeaderTextStyles">General Information</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="name" className="commonFontColor">Group Name</Label>
                      <Input type="text" id="groupName" placeholder="Enter group name" required/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="name" className="commonFontColor">Group Description</Label>
                      <Input type="textarea" name="textarea-input" id="description" rows="1"
                             placeholder="Enter description..."/>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
        
        <Row>
          <Col>
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <strong className="cardHeaderTextStyles">Permissions</strong>
              </CardHeader>
              <CardBody>
                <div className="card-body">
            <div className="row">
            {
                    this.state.moduleKeys.map(function(module, i) {
                      return(
              <div className="col-md-3">
                <FormGroup>
                    <Col md="12"><Label className="commonFontColor"><b>{module}</b></Label></Col>
                    <Col md="12">
                  {
                    moduleNames[module].map(function(name, i) {
                      return (
                            <FormGroup check className="checkbox">
                              <Input className="form-check-input" type="checkbox" id={module+name} name={name} value="option1" onChange={(e) => self.handleChange(e,module,name)}/>
                              <Label check className="form-check-label" htmlFor="checkbox1">{name}</Label>
                            </FormGroup>
                        );
                    })
                  }
                    </Col>
                     
                  </FormGroup>
              </div>
              );
            })
          }
              
            </div>
          </div>
          		<Row>
	          		<Col xs="12" md="5">
	          		</Col>
	                <Col xs="12" md="4">
	                <div className="form-actions">
	                  <Button color="primary" onClick={this.updateGroup}>Update Group</Button>
	                </div>
	              </Col>
              </Row>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </div>
    )
  }
}

export default EditPermissionGroup;
