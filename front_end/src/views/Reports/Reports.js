import React, { Component } from 'react';
import "./ReportsSyl.css";
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
          currentYear:0,
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
        this.openBeneficiariesReportToggle = this.openBeneficiariesReportToggle.bind(this);
        this.openReinsuranceReportToggle = this.openReinsuranceReportToggle.bind(this);
        this.openReinsuranceCostReportToggle = this.openReinsuranceCostReportToggle.bind(this);        
    };

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

        {
          fetch(config.serverUrl + '/getAllPlanAndPCP', {
            method: 'GET'
          }).then(function (res1) {
            return res1.json();
          }).then(function (response) {
            self.setState({ providerList: response.planList,pcpList:response.pcpList, yearsList:response.yearsList});
           
            for(var i=0;i<self.state.yearsList.length;i++) {
              if(self.state.yearsList[i].value >= self.state.currentYear) {
                self.state.currentYear = self.state.yearsList[i].value;
              } console.log(self.state.currentYear);
              self.state.yearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
            }
            self.setState({
              providerList: self.state.providerList.concat({ value: 'all', label: 'All' }),
              pcpList:self.state.pcpList.concat({value:'all', label:'All'}),
              yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
            });
            
          });
      }
    }

    setProviderValue(e) {
      self.state.providerSelectValue = e;
      localStorage.setItem('provider', self.state.providerSelectValue.value);
      self.getPCPForProviders(self.state.providerSelectValue.value);

    }
    setPcpName(e) {
      self.state.pcpNameValue = e;
      localStorage.setItem('pcpName', self.state.pcpNameValue.value);
    }
   
    setYearValue(e) {
      self.state.yearSelectValue = e;
      localStorage.setItem('year', self.state.yearSelectValue.value);
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
        self.setState({ pcpReportList: response });
        self.setState({
          pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' })
        });
        self.state.pcpNameValue = { value: 'all', label: 'All' };
      });
    }

    openAddmisionReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openDuplicateClaimsReportToggle() {
        console.log("open")
        window.location.href = "#/duplicateclaimsreport"
    }
    openReinsuranceCostReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openSpecialistComparisonReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openERPatientVisitReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openSummaryReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openSettledMonthsReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openPMPMByPrecticeReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openBeneficiariesReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    openReinsuranceReportToggle() {
        console.log("open")
        window.location.href = "#/admissionreport"
    }
    
          

 render() {
     return (
         <React.Fragment>
             <Row style={{height:"50px"}}>
             </Row>
             <Row>
          <Col md="3">
            <Row>
              <Card id="selectCardStyle">
              <CardHeader Style={{backgroundColor:'white'}}>Year</CardHeader>
              <CardBody>
                  <Select
                    
                      id="admissionsReportYearSelect"
                      className="Col md='5'"
                      value={this.state.yearSelectValue}
                      options={this.state.yearsList}
                      onChange={this.setYearValue}
                            />
              </CardBody>
              </Card>
            </Row>
            <Row>
              <Card id="selectCardStyle">
              <CardHeader>Health Plan</CardHeader>
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
            </Row>
            <Row>
              <Card id="selectCardStyle">
              <CardHeader>Doctor</CardHeader>
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
            </Row>
          </Col>
          <Col md="9">  

         
            <Card style={{height:"600px"}}>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <b className="commonFontFamilyColor" style={{fontSize:"20px"}}>Reports</b>
              </CardHeader>
              <CardBody>
           
             <Row>
                
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openDuplicateClaimsReportToggle}>Duplicate Claims Report</Label>
                  </FormGroup>
                </Col>  
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openAddmisionReportToggle}>Admissions Report</Label>
                  </FormGroup>
                </Col>  
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSpecialistComparisonReportToggle}>Specialist Comparison Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openERPatientVisitReportToggle}>ER Patient Visit Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSummaryReportToggle}>Summary Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openSettledMonthsReportToggle}>Settled Months</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openPMPMByPrecticeReportToggle}>PMPM by Practice</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openBeneficiariesReportToggle}>Beneficiaries Management Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.openReinsuranceReportToggle}>Reinsurance Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
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