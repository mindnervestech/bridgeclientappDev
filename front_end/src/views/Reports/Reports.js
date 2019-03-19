import React, { Component } from 'react';
import "./ReportsStyle.css";
var debounce = require("lodash.debounce");
import config from '../Config/ServerUrl';
import {
  Row,
  Col,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import Select from 'react-select';
import { loadavg } from 'os';
class Reports extends Component {

      constructor(props, context) {
        super(props, context);

        this.state = {
          pcpNameValue: "",
          yearSelectValue: "",
          providerSelectValue: "",
          yearsList: [],
          providerList: [],
          pcpList: [],
          reportProviderArr: [],
          currentYear: 0,
        };

        self = this;
        self.state.providerSelectValue = { value: 'all', label: 'All' };
        self.state.pcpNameValue = { value: 'all', label: 'All' };
        self.state.yearSelectValue = { value: 'all', label: 'All' };
        this.openAddmisionReportToggle = this.openAddmisionReportToggle.bind(this);
        this.openDuplicateClaimsReportToggle = this.openDuplicateClaimsReportToggle.bind(this);
        this.openSpecialistComparisonReportToggle = this.openSpecialistComparisonReportToggle.bind(this);
        this.openERPatientVisitReportToggle = this.openERPatientVisitReportToggle.bind(this);
        this.openSummaryReportToggle = this.openSummaryReportToggle.bind(this);
        this.openSettledMonthsReportToggle = this.openSettledMonthsReportToggle.bind(this);
        this.openPMPMByPrecticeReportToggle = this.openPMPMByPrecticeReportToggle.bind(this);
        this.openBeneficiariesReportByClinicToggle = this.openBeneficiariesReportByClinicToggle.bind(this);
        this.openBeneficiariesReportByDoctorToggle = this.openBeneficiariesReportByDoctorToggle.bind(this);
        this.openBeneficiariesReportByLocationToggle = this.openBeneficiariesReportByLocationToggle.bind(this);
        this.openBeneficiariesReportByPatientToggle = this.openBeneficiariesReportByPatientToggle.bind(this);
        this.openReinsuranceReportToggle = this.openReinsuranceReportToggle.bind(this);
        this.openReinsuranceCostReportToggle = this.openReinsuranceCostReportToggle.bind(this);        
    };

  componentDidMount() {


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

    localStorage.removeItem('year');
    localStorage.removeItem('pcpName');
    localStorage.removeItem('provider');
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

        {
          fetch(config.serverUrl + '/getAllPlanAndPCP', {
            method: 'GET'
          }).then(function (res1) {
            return res1.json();
          }).then(function (response) {
            self.setState({ providerList: response.planList, yearsList:response.yearsList});
          for (var i = 0; i < self.state.yearsList.length; i++) {
            if (self.state.yearsList[i].value >= self.state.currentYear) {
              self.state.currentYear = self.state.yearsList[i].value;
            }
          }
            
            if(localStorage.getItem('yearForReports')===null){
            localStorage.setItem('yearForReports', JSON.stringify(self.state.yearSelectValue));
            }else if(localStorage.getItem('yearForReports')===null){
              self.state.yearSelectValue = JSON.parse(localStorage.getItem('yearForReports'));
            } else {
              self.state.yearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
              self.setValueToLocalStorage();
            }
            self.setState({
              yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' }),
              providerList:self.state.providerList.concat({value:'all', label:'All'})
            });
          });
      }

      
    if (localStorage.getItem('providerForReports') != null) {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('providerForReports'));
      self.getPCPForProviders(self.state.providerSelectValue.value);
    }
    else
    self.getPCPForProviders(self.state.providerSelectValue.value);
    if (localStorage.getItem('pcpNameForReports') != null) {
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpNameForReports'));
    }
    if (localStorage.getItem('yearForReports') != null) {
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('yearForReports'));
    }

      self.setValueToLocalStorage();
  
    }


    setProviderValue(e) {
      self.state.providerSelectValue = e;
      localStorage.setItem('providerForReports', JSON.stringify(e));
      self.getPCPForProviders(self.state.providerSelectValue.value);
      self.setValueToLocalStorage();
  }

  setValueToLocalStorage() {
    localStorage.setItem('pcpNameForReports', JSON.stringify(self.state.pcpNameValue));
    localStorage.setItem('pcpList',JSON.stringify(self.state.pcpList));
    localStorage.setItem('yearForReports', JSON.stringify(self.state.yearSelectValue));
    localStorage.setItem('providerForReports', JSON.stringify(self.state.providerSelectValue));
    localStorage.setItem('pcpName', JSON.stringify(self.state.pcpNameValue));
    localStorage.setItem('year', JSON.stringify(self.state.yearSelectValue));
    localStorage.setItem('provider', JSON.stringify(self.state.providerSelectValue));
  }
  
    setPcpName(e) {
      self.state.pcpNameValue = e;
      localStorage.setItem('pcpNameForReports', JSON.stringify(e));
      self.setValueToLocalStorage();
      self.getPCPForProviders(self.state.providerSelectValue.value);
    }
   
    setYearValue(e) {
      self.state.yearSelectValue = e;
      localStorage.setItem('yearForReports', JSON.stringify(e));
      self.setValueToLocalStorage();
      self.getPCPForProviders(self.state.providerSelectValue.value);
  }
  
  getPCPForProviders(providerName) {
      this.state.reportProviderArr = [];
      this.state.reportProviderArr[0] = providerName;
      const formData = new FormData();
      formData.append('providerArr', self.state.reportProviderArr);
      fetch(config.serverUrl + '/getPCPForAllProviders', {
        method: 'POST',
        body: formData
      }).then(function (res1) {
        return res1.json();
      }).then(function (response) {
        self.setState({ pcpList: response });
        self.setState({
          pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' }),
        });
        self.state.pcpNameValue = { value: 'all', label: 'All' };
        localStorage.setItem('pcpList',JSON.stringify(self.state.pcpList));
      });
    }

    openAddmisionReportToggle() {
        window.location.href = "#/admissionreport"
    }
    openDuplicateClaimsReportToggle() {
        window.location.href = "#/duplicateclaimsreport"
    }
    openReinsuranceCostReportToggle() {
        window.location.href = "#/reinsuranceCostReport"
    }
    openSpecialistComparisonReportToggle() {
        window.location.href = "#/specialistComaparisionReport"
    }
    openERPatientVisitReportToggle() {
        window.location.href = "#/erPatientVisitReport"
    }
    openSummaryReportToggle() {
        window.location.href = "#/summaryReport"
    }
    openSettledMonthsReportToggle() {        
        window.location.href = "#/settledMonthsReport"
    }
    openPMPMByPrecticeReportToggle() {
        window.location.href = "#/pmpmByPrecticeReport"
    }
    openBeneficiariesReportByPatientToggle() {
        window.location.href = "#/beneficiariesReport"
    }
    openBeneficiariesReportByDoctorToggle() {
      window.location.href = "#/beneficiariesReportByDoctor"
    }
    openBeneficiariesReportByLocationToggle(){     
      window.location.href = "#/beneficiariesReportByLocation"
    }
    openBeneficiariesReportByClinicToggle() {
      window.location.href = "#/beneficiariesReportByClinic"
    }
        openReinsuranceReportToggle() {
        window.location.href = "#/reinsuranceReport"
    }
    
          

 render() {
     return (
         <React.Fragment>
             <Row style={{height:"50px"}}>
             </Row>
             <Row>
          <Col xs="12" md="3" >
            
          <Card>
              <CardHeader className="filterCardHeaderStyle2"><img style={{marginBottom:"3px"}}src="/img/year_icon.png"/>&nbsp;&nbsp;Year</CardHeader>
            <CardBody>
                 <Select
                  
                   id="admissionsReportYearSelect"
                   className="Col md='5'"
                   value={self.state.yearSelectValue}
                    options={this.state.yearsList}
                    onChange={this.setYearValue}
                          />
            </CardBody>
            </Card>
          
            <Card>
            <CardHeader className="filterCardHeaderStyle2"><img style={{marginBottom:"3px"}}src="/img/heart-rate-icon.png"/>&nbsp;&nbsp;Health Plan</CardHeader>
            <CardBody>
            <Select
                        id="duplicateClaimsProviderSelect"
                        className="Col md='5'"
                        value={this.state.providerSelectValue}
                        options={this.state.providerList}
                        onChange={this.setProviderValue}
                      />
            </CardBody>
            </Card>
         
          
            <Card>
            <CardHeader className="filterCardHeaderStyle2"><img style={{marginBottom:"3px"}}src="/img/doctor-icon.png"/>&nbsp;&nbsp;Doctor</CardHeader>
            <CardBody>
            <Select
                          placeholder="Select Doctor"
                          className="Col md='5'"
                          value={this.state.pcpNameValue}
                          options={this.state.pcpList}
                          onChange={this.setPcpName}
                        />  
            </CardBody>
            </Card>
          </Col>
          <Col xs="12" md="9" >  

         
            <Card style={{height:"600px"}}>
              <CardHeader className="filterCardHeaderStyle2">
                <b className="commonFontFamilyColor" style={{fontSize:"20px"}}>Reports</b>
              </CardHeader>
              <CardBody>
           
             <Row>
                
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openDuplicateClaimsReportToggle}>Duplicate Claims Report</Label>
                  </FormGroup>
                </Col>  
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openAddmisionReportToggle}>Admissions Report</Label>
                  </FormGroup>
                </Col>  
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSpecialistComparisonReportToggle}>Specialist Comparison Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openERPatientVisitReportToggle}>ER Patient Visit Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSummaryReportToggle}>Summary Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSettledMonthsReportToggle}>Settled Months</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openPMPMByPrecticeReportToggle}>PMPM by Practice</Label>
                  </FormGroup>
                  </Col>
              
                   <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openBeneficiariesReportByPatientToggle}>Beneficiaries Management Report</Label>
                  </FormGroup>
                  </Col>
                   
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openReinsuranceReportToggle}>Reinsurance Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i className="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openReinsuranceCostReportToggle}>Reinsurance Cost Report</Label>
                  </FormGroup>
                  </Col>
              </Row>
           </CardBody>
           </Card>
           </Col>
           </Row>
    </React.Fragment>
        
    );
}
}
export default Reports;