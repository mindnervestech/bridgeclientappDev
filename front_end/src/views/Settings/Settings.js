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


class Settings extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      usersList: [],
      isCreate: false,
      isEdit: false,
      isDelete: false,
      isReadOnly: false,
      deletePopup: false,
      uploadDataPopup: false,
      userIdToDelete: 0,
      reinsuranceThreshold: 0,
      reinsuranceCostThreshold: 0,
    };
    self = this;
    this.toggleDeletePopup = this.toggleDeletePopup.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.toggleUploadDataPopup = this.toggleUploadDataPopup.bind(this);
    this.uploadData = this.uploadData.bind(this);
  }

  handleChange(event) {
      const formData = new FormData();
      if(event.target.checked == true) {
        formData.append('mode', "true");
      } else {
        formData.append('mode', "false");
      }

        fetch(config.serverUrl+'/setMaintenanceMode', {
          method: 'POST',
          body: formData 
        }).then(function(response)   {
          
      });
   }

   deleteData() {

    fetch(config.serverUrl+'/deleteAllData', {
          method: 'POST',
        }).then(function(response) {
          
      });

    this.toggleDeletePopup();
   }

   toggleDeletePopup(event) {
    this.setState({
      deletePopup: !this.state.deletePopup
    });
  }

  toggleUploadDataPopup(event) {
    this.setState({
      uploadDataPopup: !this.state.uploadDataPopup
    });
  }

  uploadData() {

    fetch(config.serverUrl+'/uploadData', {
          method: 'POST',
        }).then(function(response) {
          
      });

  }

  setReinsuranceThreshold(e) {

      const formData = new FormData();
        formData.append('reinsuranceThreshold', document.getElementById("reinsuranceReportThreshold").value);

        fetch(config.serverUrl+'/setReinsuranceThreshold', {
          method: 'POST',
          body: formData 
        }).then(function(response)   {
          
      });

  }

  setReinsuranceCostThreshold(e) {
    
      const formData = new FormData();
        formData.append('reinsuranceCostThreshold', document.getElementById("reinsuranceCostReportThreshold").value);

        fetch(config.serverUrl+'/setReinsuranceCostThreshold', {
          method: 'POST',
          body: formData 
        }).then(function(response)   {
          
      });

  }

  componentDidMount() {
    if(localStorage.getItem("user") != null) {
      var check = 0;
        JSON.parse(localStorage.getItem("user")).permissions.forEach(function(permission) {
          
          if(permission.module == "Settings") {
            check = 1;
          }
        })

        if(check == 0) {
          window.location.href = "#/AuthorizationError";
        }
      
    }

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
          document.getElementById("maintenanceSwitch").checked = true;
        } 
        if(response.maintenanceMode == "false") {
          document.getElementById("maintenanceSwitch").checked = false;
        }

        document.getElementById("reinsuranceReportThreshold").value = response.reinsuranceThreshold;
        document.getElementById("reinsuranceCostReportThreshold").value = response.reinsuranceCostThreshold;

      });


  }

  render() {
    return (
      <div className="animated fadeIn">
       
        
          <Row>
            
          </Row>

          <Card>
            <CardBody style={{height:600}}>
            <FormGroup row style={{marginTop:100}}>
              <Col xs="12" md="4">
                </Col>
                <Col xs="12" md="3" >
                  <b><Label className="commonFontStyle">Maintenance &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label></b>
                     <Label className="switch switch-lg switch-text switch-pill switch-primary">
                        <Input type="checkbox" className="switch-input" id="maintenanceSwitch" onChange={(e) => self.handleChange(e)} />
                        <span className="switch-label" data-on="On" data-off="Off"></span>
                        <span className="switch-handle"></span>
                     </Label>
                </Col>
            </FormGroup>
            <FormGroup row>
              <Col xs="12" md="4">
                </Col>
                <Col xs="12" md="3" >
                  <button class="btn btn-danger btn-lg btn-block" onClick={(e) => self.toggleDeletePopup(e)}>Delete Data</button>
                </Col>
            </FormGroup>
            <br/>
            <FormGroup row>
              <Col xs="12" md="4">
                </Col>
              <Col xs="12" md="3" >
                <button class="btn btn-success btn-lg btn-block" onClick={(e) => self.toggleUploadDataPopup(e)}>Upload Data</button>
              </Col>
            </FormGroup>

            <br/><br/>
            <FormGroup row>
              <Col md="3">
                <b><Label className="commonFontStyle">Reinsurance Report Threshold</Label></b>
              </Col>
              <Col md="3">
                <Input type="text" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} className="commonFontFamily commonBgColor" name="reinsuranceReportThreshold" id="reinsuranceReportThreshold"/> <br/>         
              </Col>
              <Col md="1">
                <Button color="primary" className="commonFontFamily" onClick={(e) => self.setReinsuranceThreshold(e)} block>Save</Button>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <b><Label className="commonFontStyle">Reinsurance Cost Report Threshold</Label></b>
              </Col>
              <Col md="3">
                <Input type="text" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} className="commonFontFamily commonBgColor" name="reinsuranceCostReportThreshold" id="reinsuranceCostReportThreshold"/> <br/>         
              </Col>
              <Col md="1">
                <Button color="primary" className="commonFontFamily" onClick={(e) => self.setReinsuranceCostThreshold(e)} block>Save</Button>
              </Col>
            </FormGroup>

            </CardBody>
          </Card>  

          <Modal isOpen={this.state.deletePopup} toggle={this.toggleDeletePopup}
                       className={'modal-primary ' + this.props.className+' tableRowsStyle'}>
                  <ModalHeader toggle={this.toggleDeletePopup}>Delete Data</ModalHeader>
                  <ModalBody>
                    Are you sure?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.deleteData}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.toggleDeletePopup}>No</Button>
                  </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.uploadDataPopup} toggle={this.toggleUploadDataPopup}
                       className={'modal-primary ' + this.props.className+' tableRowsStyle'}>
                  <ModalHeader toggle={this.toggleUploadDataPopup}>Upload Data</ModalHeader>
                  <ModalBody>
                    Are you sure?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.uploadData}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.toggleUploadDataPopup}>No</Button>
                  </ModalFooter>
                </Modal>
        
      </div>

    )
  }
}

export default Settings;
