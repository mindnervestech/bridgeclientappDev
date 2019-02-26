import React, { Component } from 'react';
import "./ReportsSyl.css";
import {
    Row,
    Col,
    FormGroup,
    Card,
    CardHeader,
    CardBody,
    Label,
} from "reactstrap";
class Reports extends Component {

    constructor(props, context) {
        super(props, context);
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
             <Row style={{height:"30px"}}>
             </Row>
             
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
    </React.Fragment>
        
    );
}
}
export default Reports;