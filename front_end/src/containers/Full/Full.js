import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import ProviderMapping from '../../views/ProviderMapping/';
import PermissionGroups from '../../views/PermissionGroups/';
import AddPermissionGroup from '../../views/PermissionGroups/AddPermissionGroup/';
import EditPermissionGroup from '../../views/PermissionGroups/EditPermissionGroup/';
import CreateUser from '../../views/CreateUser/';
import CreatedUsers from '../../views/CreatedUsers/';
import EditUser from '../../views/EditUser/';
import Authorization from '../../views/Authorization/';
import ClaimDetails from '../../views/ClaimDetails/';
import Settings from '../../views/Settings/';
import Maintenance from '../../views/Maintenance/';
import AdmissionReport from "../../views/Reports/AdmissionReport/";
import DuplicateClaimsReport from '../../views/Reports/DuplicateClaimsReport/'; 
import SpecialistComaparisionReport from '../../views/Reports/SpecialistComaparisionReport/';
import ERPatientVisitReport from '../../views/Reports/ERPatientVisitReport/';
import Reports from '../../views/Reports/';
import SummaryReport from '../../views/Reports/SummaryReport/';
import SettledMonthsReport from '../../views/Reports/SettledMonthsReport/';
import PMPMByPrecticeReport from '../../views/Reports/PMPMByPrecticeReport/';
import ReinsuranceCostReport from '../../views/Reports/ReinsuranceCostReport/';
import ReinsuranceReport from '../../views/Reports/ReinsuranceReport/';
import DuplicateClaimsDetails from '../../views/Reports/DuplicateClaimsDetails/';
import AdmissionReportDetails from '../../views/Reports/AdmissionReportDetails/';
import SpecialistComparisonReportDetails from '../../views/Reports/SpecialistComparisonReportDetails/';
import SpecialistComparisionPrecticeDetails from '../../views/Reports/SpecialistComparisionPrecticeDetails/SpecialistComparisionPrecticeDetails';
import ERPatientVisitReportDetails from '../../views/Reports/ERPatientVisitReportDetails/ERPatientVisitReportDetails';
import SettledMonthsDetails from '../../views/Reports/SetteledMonthsDetails/';
import PMPMByPrecticeDetails from '../../views/Reports/PMPMByPrecticeDetails/PMPMByPrecticeDetails'
import BeneficiariesReportByPatient from '../../views/Reports/BeneficiariesReportByPatient/'; 
import BeneficiariesReportByLocation from '../../views/Reports/BeneficiariesReportByLocation/';
import BeneficiariesReportByDoctor from '../../views/Reports/BeneficiariesReportByDoctor/';
import BeneficiariesReportByClinic from '../../views/Reports/BeneficiariesReportByClinic/';
import BeneficiariesReportByDoctorDetails from '../../views/Reports/BeneficiariesReportByDoctorDetails/';
import BeneficiariesReportByLocationDetails from '../../views/Reports/BeneficiariesReportByLocationDetails/BeneficiariesReportByLocationDetails';
import BeneficiariesReportByPatientDetails from '../../views/Reports/BeneficiariesReportByPatientDetails/BeneficiariesReportByPatientDetails';
import BeneficiariesReportByClinicDetails from '../../views/Reports/BeneficiariesReportByClinicDetails/';
import SpecialistComparisionPatientDetails from '../../views/Reports/SpecialistComparisionPatientDetails/';
import ClaimDetailsDrillDownReport from '../../views/ClaimDetailsDrillDownReport/';
class Full extends Component {
  componentDidMount() {
    if(localStorage.getItem("user") == null || localStorage.getItem("user") == undefined) {
      window.location.href = "#/login";
    }
  }
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          {
            <main className="main" style={{ backgroundColor: "#f7f3f0" }}>
              <Container fluid>
                <Switch>
                  <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                  <Route path="/provider" name="ProviderMapping" component={ProviderMapping}/>
                  <Route path="/permissions" name="PermissionGroups" component={PermissionGroups}/>
                  <Route path="/addPermissions" name="AddPermissionGroup" component={AddPermissionGroup}/>
                  <Route path="/editPermissions/:id" name="EditPermissionGroup" component={EditPermissionGroup}/>
                  <Route path="/editUser/:id" name="EditUser" component={EditUser}/>
                  <Route exact path="/createdUsers" name="CreatedUsers" component={CreatedUsers}/>
                  <Route exact path="/createUser" name="CreateUser" component={CreateUser}/>
                  <Route exact path="/AuthorizationError" name="Authorization" component={Authorization}/>
                  <Route path="/claimDetails" name="ClaimDetails" component={ClaimDetails}/>
                  <Route path = "/claimDetailsDrillDownReport" name="ClaimDetailsDrillDownReport" component = {ClaimDetailsDrillDownReport} />
                  <Route path="/settings" name="Settings" component={Settings}/>
                  <Route path="/maintenance" name="Maintenance" component={Maintenance}/>
                  <Route path="/admissionreport" name="AdmissionReport" component={AdmissionReport}/>
                  <Route path="/duplicateClaimsReport" name="DuplicateClaimsReport" component={DuplicateClaimsReport} />
                  <Route path="/specialistComaparisionReport" name="SpecialistComaparisionReport" component={SpecialistComaparisionReport} />
                  <Route path="/erPatientVisitReport" name="ERPatientVisitReport" component={ERPatientVisitReport} />
                  <Route path="/summaryReport" name="SummaryReport" component={SummaryReport} />
                  <Route path="/settledMonthsReport" name="SettledMonthsReport" component={SettledMonthsReport} />
                  <Route path="/pmpmByPrecticeReport" name="PMPMByPrecticeReport" component={PMPMByPrecticeReport} />
                  <Route path="/reinsuranceReport" name="ReinsuranceReport" component={ReinsuranceReport} />
                  <Route path="/reinsuranceCostReport" name="ReinsuranceCostReport" component={ReinsuranceCostReport} />
                  <Route path="/duplicateClaimsDetails" name="DuplicateClaimsDetails" component={DuplicateClaimsDetails} />
                  <Route path="/admissionReportDetails" name="AdmissionReportDetails" component={AdmissionReportDetails} />
                  <Route path="/specialistComparisonReportDetails" name="SpecialistComparisonReportDetails" component={SpecialistComparisonReportDetails} />
                  <Route path="/specialistComparisionPrecticeDetails" name="SpecialistComparisionPrecticeDetails" component={SpecialistComparisionPrecticeDetails} />
                  <Route path="/erPatientVisitReportDetails" name="ERPatientVisitReportDetails" component={ERPatientVisitReportDetails} />
                  <Route path="/settledMonthsDetails" name="SettledMonthsDetails" component={SettledMonthsDetails} />
                  <Route path="/pmpmByPrecticeDetails" name="PMPMByPrecticeDetails" component={PMPMByPrecticeDetails} />
                  <Route path="/beneficiariesReportByPatient" name="BeneficiariesReportByPatient" component={BeneficiariesReportByPatient} />
                  <Route path="/beneficiariesReportByLocation" name="BeneficiariesReportByLocation" component={BeneficiariesReportByLocation} />
                  <Route path="/beneficiariesReportByDoctor" name="BeneficiariesReportByDoctor" component={BeneficiariesReportByDoctor} />
                  <Route path="/beneficiariesReportByClinic" name="BeneficiariesReportByClinic" component={BeneficiariesReportByClinic} />
                  <Route path="/BeneficiariesReportByClinicDetails" name="BeneficiariesReportByClinicDetails" component={BeneficiariesReportByClinicDetails} />
                  <Route path="/beneficiariesReportByDoctorDetails" name="BeneficiariesReportByDoctorDetails" component={BeneficiariesReportByDoctorDetails} />
                  <Route path="/beneficiariesReportByLocationDetails" name="BeneficiariesReportByLocationDetails" component={BeneficiariesReportByLocationDetails} />
                  <Route path="/beneficiariesReportByPatientDetails" name="BeneficiariesReportByPatientDetails" component={BeneficiariesReportByPatientDetails} />
                  <Route path="/specialistComparisionPatientDetails" name="SpecialistComparisionPatientDetails" component={SpecialistComparisionPatientDetails} />
                  <Route path="/reports" name="Reports" component={Reports} />
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Container>
            </main>
          }
          
          {
            /*
            <Aside />
            */
          }
        </div>
        {
          /*
          <Footer />
          */
        }
      </div>
    );
  }
}

export default Full;
