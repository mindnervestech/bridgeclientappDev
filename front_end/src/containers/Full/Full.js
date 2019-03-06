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
import AdmissionReportExpand from '../../views/Reports/AdmissionReportExpand/';
import SpecialistComparisonReportExpand from '../../views/Reports/SpecialistComparisonReportExpand/';
import SpecialistComparisionPrecticeExpand from '../../views/Reports/SpecialistComparisionPrecticeExpand/';
import ERPatientVisitReportExpand from '../../views/Reports/ERPatientVisitReportExpand/';
import SettledMonthsDetails from '../../views/Reports/SetteledMonthsDetails/';
import PMPMByPrecticeExpand from '../../views/Reports/PMPMByPrecticeExpand/'
import BeneficiariesReportByPatient from '../../views/Reports/BeneficiariesReportByPatient/'; 
import BeneficiariesReportByDoctorExpand from '../../views/Reports/BeneficiariesReportByDoctorExpand/';
import BeneficiariesReportByLocationExpand from '../../views/Reports/BeneficiariesReportByLocationExpand/';
import BeneficiariesReportByPatientExpand from '../../views/Reports/BeneficiariesReportByPatientExpand/';
import BeneficiariesReportByClinicExpand from '../../views/Reports/BeneficiariesReportByClinicExpand/';
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
            <Sidebar {...this.props}/>
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
                  <Route path="/admissionReportExpand" name="AdmissionReportExpand" component={AdmissionReportExpand} />
                  <Route path="/specialistComparisonReportExpand" name="SpecialistComparisonReportExpand" component={SpecialistComparisonReportExpand} />
                  <Route path="/specialistComparisionPrecticeExpand" name="SpecialistComparisionPrecticeExpand" component={SpecialistComparisionPrecticeExpand} />
                  <Route path="/erPatientVisitReportExpand" name="ERPatientVisitReportExpand" component={ERPatientVisitReportExpand} />
                  <Route path="/settledMonthsDetails" name="SettledMonthsDetails" component={SettledMonthsDetails} />
                  <Route path="/pmpmByPrecticeExpand" name="PMPMByPrecticeExpand" component={PMPMByPrecticeExpand} />
                  <Route path="/beneficiariesReportByPatient" name="BeneficiariesReportByPatient" component={BeneficiariesReportByPatient} />
                  <Route path="/beneficiariesReportByClinicExpand" name="BeneficiariesReportByClinicExpand" component={BeneficiariesReportByClinicExpand} />
                  <Route path="/beneficiariesReportByDoctorExpand" name="BeneficiariesReportByDoctorExpand" component={BeneficiariesReportByDoctorExpand} />
                  <Route path="/beneficiariesReportByLocationExpand" name="BeneficiariesReportByLocationExpand" component={BeneficiariesReportByLocationExpand} />
                  <Route path="/beneficiariesReportByPatientExpand" name="BeneficiariesReportByPatientExpand" component={BeneficiariesReportByPatientExpand} />
                  <Route path="/reports" name="Reports" component={Reports} />
                  <Redirect from="/" to="/dashboard"/>
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
