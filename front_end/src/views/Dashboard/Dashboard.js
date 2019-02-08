import React, { Component } from 'react';
import ReactDataGrid   from 'react-data-grid';
import classnames from 'classnames';
import {
  Badge,
  Row,
  Col,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import fetch from 'node-fetch';
import  FormData from 'form-data';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Doughnut} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';
import {HorizontalBar} from 'react-chartjs-2';
import Widget02 from '../Widgets/Widget02';
import Widget01 from '../Widgets/Widget01';
import jsPDF from 'jspdf';
import config from '../Config/ServerUrl';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import print from 'print-js';
import Select from 'react-select';
import './CustomStyles.css';
import CountUp from 'react-countup';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
var debounce = require('lodash.debounce');

var self;
var style = {
	"textAlign" : 'right'
};

class RowRenderer extends React.Component {
  constructor(props) {
    super(props)
    var propTypes = {
      idx: PropTypes.string.isRequired
    };
    this.state = {
      propTypes : propTypes
    }
  }

  getRowStyle(row) {
    return {
      color: this.props.value === "Invalid" ? 'red' : 'green'
    };
  };

  render() {
    return ( <span style={this.getRowStyle()}>{this.props.value}</span>);
  }
}

class Dashboard extends React.Component {
	constructor(props, context) {
	  super(props, context);

   // this.createRows = this.createRows.bind(this);
	  self = this;
    this._columns = [
      { key: 'infNFeId', name: 'XML' , resizable: true  },
      { key: 'nNF', name: 'NF' ,resizable: true},
      { key: 'dEmi', name: 'EMISSAO' ,resizable: true },
      { key: 'xNome', name: 'EMITENTE',resizable: true },
      { key: 'status', name: 'status' ,resizable: true , formatter : RowRenderer} ];
		this._rows = [];
    this.state ={
      file:null,
      errorMessage : null,
      drugNames: [],
      costList: [],
      planList: [],
      drugsPlansList:[],
      pcpList: [],
      pcpReportList: [],
      locationList:[],
      yearsList: [],
      providerArr: [],
      reportProviderArr: [],
      duplicateClaimFileQuery:"",
      claimTotalsProviderSelect:{value:'all', label:'All'},
      providerSelectValue:{value:'all', label:'All'},
      yearsSelectValue:{value:'all', label:'All'},
      duplicateClaimsYearSelectValue:"",
      duplicateClaimsProviderSelectValue:{value:'all', label:'All'},
      admissionsReportYearSelectValue:"",
      admissionsReportProviderSelectValue:{value:'all', label:'All'},
      specialistComparisonReportYearSelectValue:"",
      specialistComparisonProviderSelectValue:{value:'all', label:'All'},
      patientVisitReportYearSelectValue:"",
      patientVisitProviderSelectValue:{value:'all', label:'All'},
      summaryReportYearSelectValue:"",
      duplicateClaimsReportData:[],
      admissionsReportData:[],
      loading: false,
      duplicateClaimsPages:0,
      duplicateClaimsTotalCount:0,
      admissionsReportPages:0,
      admissionsTotalCount:0,
      instSum: 0.0,
      profSum: 0.0,
      specSum: 0.0,
      prescSum: 0.0,
      currentMonthCount:0,
      ofMemberYTD:0,
      monthlyTotals: [],
      monthlyTotalsLabel: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      monthlyIPAValue: [],
      prescType:"",
      large: false,
      admissionsReportModal: false,
      admissionsReportExpandModal: false,

      specialistComparisonReportModal: false,
      specialistComparisonReportLoading: false,
      specialistComparisonReportPages: 0,
      specialistComparisonReportData: [],
      specialistComparisonReportTotalCount: 0,
      specialistComparisonReportFileQuery: "",

      patientVisitReportModal: false,
      patientVisitReportLoading: false,
      patientVisitReportPages: 0,
      patientVisitReportData: [],
      patientVisitReportTotalCount: 0,
      patientVisitReportFileQuery: "",

      patientVisitExpandReportModal: false,
      patientVisitExpandReportLoading: false,
      patientVisitExpandReportPages: 0,
      patientVisitExpandReportData: [],
      patientVisitExpandReportTotalCount: 0,
      patientVisitExpandReportFileQuery: "",

      specialistComparisonExpandReportModal: false,
      specialistComparisonExpandReportLoading: false,
      specialistComparisonExpandReportPages: 0,
      specialistComparisonExpandReportData: [],
      specialistComparisonExpandReportTotalCount: 0,
      specialistComparisonExpandReportFileQuery: "",

      specialistComparisonExpandPracticeReportModal: false,
      specialistComparisonExpandPracticeReportLoading: false,
      specialistComparisonExpandPracticeReportPages: 0,
      specialistComparisonExpandPracticeReportData: [],
      specialistComparisonExpandPracticeReportTotalCount: 0,
      specialistComparisonExpandPracticeReportFileQuery: "",

      summaryReportModal: false,
      summaryReportLoading: false,
      summaryReportPages: 0,
      summaryReportData: [],
      summaryReportTotalCount: 0,
      summaryReportFileQuery: "",

      settledMonthsModal: false,
      settledMonthsLoading: false,
      settledMonthsPages: 0,
      settledMonthsData: [],
      settledMonthsTotalCount: 0,
      settledMonthsFileQuery: "",

      settledMonthsExpandModal: false,
      settledMonthsExpandLoading: false,
      settledMonthsExpandPages: 0,
      settledMonthsExpandData: [],
      settledMonthsExpandTotalCount: 0,
      settledMonthsExpandFileQuery: "",

      duplicateClaimsExpandModal: false,
      duplicateClaimsExpandLoading: false,
      duplicateClaimsExpandPages: 0,
      duplicateClaimsExpandData: [],
      duplicateClaimsExpandTotalCount: 0,
      duplicateClaimsExpandFileQuery: "",

      reinsuranceManagementModal:false,
      reinsuranceManagementLoading: false,
      reinsuranceManagementPages:0,
      reinsuranceManagementData:[],
      reinsuranceManagementTotalCount:0,
      reinsuranceManagementFileQuery:"",

      reinsuranceCostReportModal:false,
      reinsuranceCostReportLoading: false,
      reinsuranceCostReportPages:0,
      reinsuranceCostReportData:[],
      reinsuranceCostReportTotalCount:0,
      reinsuranceCostReportFileQuery:"",

      

      pmpmByPracticeModal: false,
      pmpmByPracticeLoading: false,
      pmpmByPracticePages: 0,
      pmpmByPracticeData: [],
      pmpmByPracticeTotalCount: 0,
      pmpmByPracticeFileQuery: "",

      pmpmByPracticeExpandModal: false,
      pmpmByPracticeExpandLoading: false,
      pmpmByPracticeExpandPages: 0,
      pmpmByPracticeExpandData: [],
      pmpmByPracticeExpandTotalCount: 0,
      pmpmByPracticeExpandFileQuery: "",

      dropdownOpen: new Array(30).fill(false),

      showSubscriberId_duplicate: true,
      showPlanName_duplicate: true,
      showPatientName_duplicate: true,
      showPcp_duplicate: true,
      showEligibleMonth_duplicate: true,
      showTermedMonth_duplicate: true,
      showClaimDate_duplicate: true,
      showDuplicativeCost_duplicate: true,

      showPatientName_admissions: true,
      showSubscriberId_admissions: true,
      showPcpName_admissions: true,
      showEligibleMonth_admissions: true,
      showTotalNoOfAdmissions_admissions: true,
      showTotalCost_admissions: true,

      showClaimId_admissionsExpand: true,
      showClaimDate_admissionsExpand: true,
      showClaimType_admissionsExpand: true,
      showClinicName_admissionsExpand: true,
      showPcpName_admissionsExpand: true,
      showIcdCodes_admissionsExpand: true,
      showHccCodes_admissionsExpand: true,
      showDrgCode_admissionsExpand: true,
      showBetosCat_admissionsExpand: true,
      showCost_admissionsExpand: true,

      showClaimId_duplicateClaimsExpand: true,
      showClaimDate_duplicateClaimsExpand: true,
      showClaimType_duplicateClaimsExpand: true,
      showClinicName_duplicateClaimsExpand: true,
      showProviderName_duplicateClaimsExpand: true,
      showBetosCat_duplicateClaimsExpand: true,
      showDrgCode_duplicateClaimsExpand: true,
      showIcdCodes_duplicateClaimsExpand: true,
      showHccCodes_duplicateClaimsExpand: true,
      showCost_duplicateClaimsExpand: true,

      showClaimId_beneficiariesManagementExpand: true,
      showClaimDate_beneficiariesManagementExpand: true,
      showClaimType_beneficiariesManagementExpand: true,
      showClinicName_beneficiariesManagementExpand: true,
      showPcpName_beneficiariesManagementExpand: true,
      showIcdCodes_beneficiariesManagementExpand: true,
      showHccCodes_beneficiariesManagementExpand: true,
      showDrgCode_beneficiariesManagementExpand: true,
      showBetosCat_beneficiariesManagementExpand: true,
      showCost_beneficiariesManagementExpand: true,

      showClaimId_beneficiariesManagementByDoctorExpand: true,
      showClaimDate_beneficiariesManagementByDoctorExpand: true,
      showClaimType_beneficiariesManagementByDoctorExpand: true,
      showClinicName_beneficiariesManagementByDoctorExpand: true,
      showPcpName_beneficiariesManagementByDoctorExpand: true,
      showIcdCodes_beneficiariesManagementByDoctorExpand: true,
      showHccCodes_beneficiariesManagementByDoctorExpand: true,
      showDrgCode_beneficiariesManagementByDoctorExpand: true,
      showBetosCat_beneficiariesManagementByDoctorExpand: true,
      showCost_beneficiariesManagementByDoctorExpand: true,

      showClaimId_beneficiariesManagementByClinicExpand: true,
      showClaimDate_beneficiariesManagementByClinicExpand: true,
      showClaimType_beneficiariesManagementByClinicExpand: true,
      showClinicName_beneficiariesManagementByClinicExpand: true,
      showPcpName_beneficiariesManagementByClinicExpand: true,
      showIcdCodes_beneficiariesManagementByClinicExpand: true,
      showHccCodes_beneficiariesManagementByClinicExpand: true,
      showDrgCode_beneficiariesManagementByClinicExpand: true,
      showBetosCat_beneficiariesManagementByClinicExpand: true,
      showCost_beneficiariesManagementByClinicExpand: true,
      
      showClaimId_beneficiariesManagementByLocationExpand: true,
      showClaimDate_beneficiariesManagementByLocationExpand: true,
      showClaimType_beneficiariesManagementByLocationExpand: true,
      showClinicName_beneficiariesManagementByLocationExpand: true,
      showPcpLocation_beneficiariesManagementByLocationExpand: true,
      showIcdCodes_beneficiariesManagementByLocationExpand: true,
      showHccCodes_beneficiariesManagementByLocationExpand: true,
      showDrgCode_beneficiariesManagementByLocationExpand: true,
      showBetosCat_beneficiariesManagementByLocationExpand: true,
      showCost_beneficiariesManagementByLocationExpand: true,

      showSpecialityCode_specialistComparison: true,
      showNoOfClaims_specialistComparison: true,
      showNoOfPcp_specialistComparison: true,
      showNoOfBeneficiaries_specialistComparison: true,
      showCostPerClaim_specialistComparison: true,
      showCostPerBeneficiary_specialistComparison: true,
      showTotalCost_specialistComparison: true,

      showPracticeName_specialistComparisonExpand: true,
      showSpecialityType_specialistComparisonExpand: true,
      showNoOfClaims_specialistComparisonExpand: true,
      showAverageCostPerClaim_specialistComparisonExpand: true,
      showCost_specialistComparisonExpand: true,

      showPracticeName_specialistComparisonExpandPractice: true,
      showSpecialityType_specialistComparisonExpandPractice: true,
      showPatientName_specialistComparisonExpandPractice: true,
      showPcpName_specialistComparisonExpandPractice: true,
      showNoOfClaims_specialistComparisonExpandPractice: true,
      showAverageCostPerClaim_specialistComparisonExpandPractice: true,
      showCost_specialistComparisonExpandPractice: true,

      specialistComparisonSpecialityCode: "",
      specialistComparisonPracticeName: "",

      jsonDataForSpecialistComparisonExpandReport:"",
      jsonDataForSpecialistComparisonExpandPracticeReport:"",

      showPatientName_patientVisit: true,
      showHicn_patientVisit: true,
      showPcpName_patientVisit: true,
      showTermedMonth_patientVisit: true,
      showIpaEffectiveDate_patientVisit: true,
      showTotalErVisits_patientVisit: true,
      showTotalCost_patientVisit: true,

      showClaimId_patientVisitExpand: true,
      showClaimDate_patientVisitExpand: true,
      showClaimType_patientVisitExpand: true,
      showClinicName_patientVisitExpand: true,
      showPcpName_patientVisitExpand: true,
      showIcdCodes_patientVisitExpand: true,
      showHccCodes_patientVisitExpand: true,
      showDrgCode_patientVisitExpand: true,
      showBetosCat_patientVisitExpand: true,
      showCost_patientVisitExpand: true,

      showPcpLocation_summary: false,
      showMonth_summary: true,
      showMembers_summary: true,
      showMaPremium_summary: true,
      showPartDPremium_summary: true,
      showTotalPremium_summary: true,
      showIpaPremium_summary: true,
      showPcpCap_summary: true,
      showSpecCost_summary: true,
      showProfClaims_summary: true,
      showInstClaims_summary: true,
      showRxClaims_summary: true,
      showIbnrDollars_summary: true,
      showReinsurancePremium_summary: true,
      showSpecCap_summary: true,
      showTotalExpenses_summary: true,
      showReinsuranceRecovered_summary: true,
      showRxAdmin_summary: true,
      showSilverSneakerUtilization_summary: true,
      showPba_summary: true,
      showHumanaAtHome_summary: true,
      showDentalFFS_summary: true,

      showPcpLocation_settledMonths: false,
      showMonth_settledMonths: true,
      showMembership_settledMonths: true,
      showIpaPremium_settledMonths: true,
      showTotalExpenses_settledMonths: true,
      showStopLoss_settledMonths: true,
      showNetPremium_settledMonths: true,
      showRiskSharing_settledMonths: true,
      showSurplusDeficit_settledMonths: true,

      showPatientName_settledMonthsExpand: true,
      showPcpName_settledMonthsExpand: true,
      showPcpLocation_settledMonthsExpand: true,
      showCost_settledMonthsExpand: true,
      showClaimType_settledMonthsExpand: true,
      showMra_settledMonthsExpand: true,

      showFacilityLocationName_pmpmByPractice: false,
      showProviderName_pmpmByPractice: true,
      showTotalCost_pmpmByPractice: true,
      showTotalNumberOfMemberMonth_pmpmByPractice: true,
      showPMPM_pmpmByPractice: true,
      showPMPY_pmpmByPractice: true,
      showTotalPremium_pmpmByPractice: true,
      showIpaPremium_pmpmByPractice: true,
      showDifference_pmpmByPractice: true,


      showSubscriberID_reinsuranceManagement: true,
      showPlanName_reinsuranceManagement: true,
      showPatientName_reinsuranceManagement: true,
      showPcpName_reinsuranceManagement:true,
      showTermedMonth_reinsuranceManagement: true,
      showTotalCost_reinsuranceManagement: true,
      showInstClaims_reinsuranceManagement: true,
      showProfClaims_reinsuranceManagement: true,
      


      showPlanName_reinsuranceCostReport:true,
      showPolicyPeriod_reinsuranceCostReport:true,
      showPatientLastName_reinsuranceCostReport:true,
      showPatientFirstName_reinsuranceCostReport:true,
      showSubscriberID_reinsuranceCostReport:true,
      showEffectiveDate_reinsuranceCostReport:true,
      showTermedMonth_reinsuranceCostReport:true,
      showDateOfBirth_reinsuranceCostReport:true,
      showStatus_reinsuranceCostReport:true,
      showGender_reinsuranceCostReport:true,
      showPcpName_reinsuranceCostReport:true,
      showTotalClaimsCost_reinsuranceCostReport:true,

      showPlanName_membershipManagement: true,
      showMedicareId_membershipManagement: true,
      showInsuranceId_membershipManagement: true,
      showPatientName_membershipManagement: true,
      showPatientDob_membershipManagement: true,
      showAssignedPcp_membershipManagement: true,
      showPcpLocation_membershipManagement: true,
      showIpaEffectiveDate_membershipManagement: true,
      showMra_membershipManagement: true,
      showTotalPatientCost_membershipManagement: true,

      admissionsReportExpandPatientName:"",
      admissionsReportExpandSubscriberId:"",
      admissionsReportExpandPcpName:"",
      admissionsReportExpandEligibleMonth:"",
      admissionsReportExpandData: [],
      admissionsReportExpandPages: 0,
      admissionsReportExpandTotalCount: 0,
      admissionsReportExpandFileQuery: "",
      admissionsReportExpandLoading: false,


      optionSelectValue:{value:'all', label:'All'},
      locationSelectValue:[{value:'all', label:'All'}],

      duplicateClaimsGridPage:0,
      duplicateClaimsGridPageSize:0,
      duplicateClaimsGridSoreted:{},
      duplicateClaimsGridFiltered:{},

      admissionsReportGridPage:0,
      admissionsReportGridPageSize:0,
      admissionsReportGridSorted:{},
      admissionsReportGridFiltered:{},

      patientVisitGridPage: 0,
      patientVisitGridPageSize: 0,
      patientVisitGridSorted: {},
      patientVisitGridFiltered: {},

      pmpmByPracticeGridPage: 0,
      pmpmByPracticeGridPageSize: 0,
      pmpmByPracticeGridSorted: {},
      pmpmByPracticeGridFiltered: {},

      reinsuranceManagementGridPageSize:0,
      reinsuranceManagementGridPage:0,
      reinsuranceManagementGridSorted:{},
      reinsuranceManagementGridFiltered:{},

      reinsuranceCostReportGridPageSize:0,
      reinsuranceCostReportGridPage:0,
      reinsuranceCostReportGridSorted:{},
      reinsuranceCostReportGridFiltered:{},
      

      summaryGridPage: 0,
      summaryGridPageSize: 0,
      summaryGridSorted: {},
      summaryGridFiltered: {},

      settledMonthsGridPage: 0,
      settledMonthsGridPageSize: 0,
      settledMonthsGridSorted: {},
      settledMonthsGridFiltered: {},

      membershipManagementGridPage:0,
      membershipManagementGridPageSize:0,
      membershipManagementGridSorted:{},
      membershipManagementGridFiltered:{},

      beneficiariesManagementGridPage:0,
      beneficiariesManagementGridPageSize:0,
      beneficiariesManagementGridSorted:{},
      beneficiariesManagementGridFiltered:{},

      specialistComparisonExpandGridPage:0,
      specialistComparisonExpandGridPageSize:0,
      specialistComparisonExpandGridSorted:{},
      specialistComparisonExpandGridFiltered:{},

      specialistComparisonExpandPracticeGridPage:0,
      specialistComparisonExpandPracticeGridPageSize:0,
      specialistComparisonExpandPracticeGridSorted:{},
      specialistComparisonExpandPracticeGridFiltered:{},

      duplicateClaimsExpandMedicareId:"",
      duplicateClaimsExpandFirstServiceDate:"",
      duplicateClaimsExpandServiceMonth:"",
      duplicateClaimsExpandPaidAmount:"",
      duplicateClaimsExpandClaimType:"",

      jsonDataForDuplicateClaims:"",
      jsonDataForDuplicateClaimsExpand:"",
      jsonDataForAdmissionsReport:"",
      jsonDataForAdmissionsReportHeader:"",
      jsonDataForAdmissionsReportExpand:"",
      jsonDataForSpecialistComparisonReport:"",
      jsonDataForPatientVisitReport:"",
      jsonDataForPatientVisitExpandReport:"",
      jsonDataForSummaryReport:"",
      jsonDataForSettledMonths:"",
      jsonDataForSettledMonthsExpand:"",
      jsonDataForPmpmByPractice:"",
      jsonDataForReinsuranceManagement:"",
      jsonDataForReinsuranceCostReport:"",
      jsonDataForMembershipManagement:"",
      jsonDataForPmpmByPracticeExpand:"",
      jsonDataForBeneficiariesManagement:"",
      jsonDataForBeneficiariesManagementByLocation:"",
      jsonDataForBeneficiariesManagementExpand:"",
      jsonDataForBeneficiariesManagementByDoctorExpand:"",
      jsonDataForBeneficiariesManagementByClinic:"",
       jsonDataForBeneficiariesManagementByLocationExpand:"",
      jsonDataForBeneficiariesManagementByClinicExpand:"",


      monthlyReportYearsSelectValue:"",
      monthlyReportYearsList: [],
      summaryReportYearsList: [],
      monthlyReportsProviderSelectValue:{value:'all', label:'All'},
      monthlyTotalsProviderList: [],
      summaryReportsProviderSelectValue:{value:'all', label:'All'},

      settledMonthsYearSelectValue:"",
      settledMonthsProviderSelectValue:{value:'all', label:'All'},
      settledMonthsSelectedMonth: "",

      pmpmByPracticeYearSelectValue:"",
      pmpmByPracticeProviderSelectValue:{value:'all', label:'All'},

      reinsuranceManagementYearSelectValue:"",
      reinsuranceManagementProviderSelectValue:{value:'all',label:'All'},

      reinsuranceCostReportYearSelectValue:"",
      reinsuranceCostReportProviderSelectValue:{value:'all',label:'All'},
      

      membershipManagementProviderSelectValue:{value:'all', label:'All'},

      beneficiariesManagementYearSelectValue:"",
      beneficiariesManagementProviderSelectValue:{value:'all', label:'All'},

      termedPatients: 0,
      newPatients: 0,
      currentPatients: 0,
      netImpact: 0,
      currentPatientsPercent: 0.0,
      newPatientsPercent: 0.0,
      termedPatientsPercent: 0.0,
      patientTypeClicked: "",

      membershipManagementModal: false,
      membershipManagementLoading: false,
      membershipManagementPages: 0,
      membershipManagementData: [],
      membershipManagementTotalCount: 0,
      membershipManagementFileQuery: "",

      beneficiariesManagementModal: false,
      beneficiariesManagementLoading: false,
      beneficiariesManagementPages: 0,
      beneficiariesManagementData: [],
      beneficiariesManagementTotalCount: 0,
      beneficiariesManagementFileQuery: "",

      beneficiariesManagementByDoctorModal: false,
      beneficiariesManagementByDoctorLoading: false,
      beneficiariesManagementByDoctorPages: 0,
      beneficiariesManagementByDoctorData: [],
      beneficiariesManagementByDoctorTotalCount: 0,
      beneficiariesManagementByDoctorFileQuery: "",

      beneficiariesManagementByLocationModal: false,
      beneficiariesManagementByLocationLoading: false,
      beneficiariesManagementByLocationPages: 0,
      beneficiariesManagementByLocationData: [],
      beneficiariesManagementByLocationTotalCount: 0,
      beneficiariesManagementByLocationFileQuery: "",

      beneficiariesManagementByClinicModal: false,
      beneficiariesManagementByClinicLoading: false,
      beneficiariesManagementByClinicPages: 0,
      beneficiariesManagementByClinicData: [],
      beneficiariesManagementByClinicTotalCount: 0,
      beneficiariesManagementByClinicFileQuery: "",

      showClinicName_beneficiariesManagementByClinic: true,
      showTotalCost_beneficiariesManagementByClinic: true,

      beneficiariesManagementExpandModal: false,
      beneficiariesManagementExpandLoading: false,
      beneficiariesManagementExpandPages: 0,
      beneficiariesManagementExpandData: [],
      beneficiariesManagementExpandTotalCount: 0,
      beneficiariesManagementExpandFileQuery: "",

      
      beneficiariesManagementByClinicExpandModal: false,
      beneficiariesManagementByClinicExpandLoading: false,
      beneficiariesManagementByClinicExpandPages: 0,
      beneficiariesManagementByClinicExpandData: [],
      beneficiariesManagementByClinicExpandTotalCount: 0,
      beneficiariesManagementByClinicExpandFileQuery: "",

      beneficiariesManagementByLocationExpandModal: false,
      beneficiariesManagementByLocationExpandLoading: false,
      beneficiariesManagementByLocationExpandPages: 0,
      beneficiariesManagementByLocationExpandData: [],
      beneficiariesManagementByLocationExpandTotalCount: 0,
      beneficiariesManagementByLocationExpandFileQuery: "",

      beneficiariesManagementByDoctorExpandModal: false,
      beneficiariesManagementByDoctorExpandLoading: false,
      beneficiariesManagementByDoctorExpandPages: 0,
      beneficiariesManagementByDoctorExpandData: [],
      beneficiariesManagementByDoctorExpandTotalCount: 0,
      beneficiariesManagementByDoctorExpandFileQuery: "",

      pmpmByPracticeSelectedPcpId:"",
      beneficiariesManagementSelectedMedicareId:"",
      beneficiariesManagementSelectedPcpLocation:"",
      beneficiariesManagementSelectedClinicName:"",
      beneficiariesManagementSelectedPcpId:"",

      showPatientName_pmpmByPracticeExpand: true,
      showPcpName_pmpmByPracticeExpand: true,
      showPcpLocation_pmpmByPracticeExpand: true,
      showMra_pmpmByPracticeExpand: true,
      showCost_pmpmByPracticeExpand: true,
      showClaimType_pmpmByPracticeExpand: true,

      showPlanName_beneficiariesManagement: true,
      showHicn_beneficiariesManagement: true,
      showPatientName_beneficiariesManagement: true,
      showDob_beneficiariesManagement: true,
      showEligibleMonth_beneficiariesManagement: true,
      showTermedMonth_beneficiariesManagement: true,
      showPcpName_beneficiariesManagement: true,
      showPcpLocation_beneficiariesManagement: true,
      showMra_beneficiariesManagement: true,
      showTotalCost_beneficiariesManagement: true,
      showAddress_beneficiariesManagement: false,
      showRecentAppointmentDate_beneficiariesManagement: false,
      showNextAppointmentDate_beneficiariesManagement: false,
      showFacilityLocation_beneficiariesManagement: false,
      showPhoneNumber_beneficiariesManagement: false,
      showLastClaimsDate_beneficiariesManagement: false,
      showIcdCode_beneficiariesManagement: false,

      showPcpLocation_beneficiariesManagementByLocation: true,
      showMra_beneficiariesManagementByLocation: true,
      showTotalCost_beneficiariesManagementByLocation: true,
      


      duplicateClaimsPcpNameValue: "",
      admissionsReportPcpNameValue: "",
      specialistComparisonPcpNameValue: "",
      specialistComparisonExpandPcpNameValue: "",
      erPatientVisitPcpNameValue: "",
      settledMonthsPcpNameValue: "",
      pmpmByPracticePcpNameValue: "",
      beneficiariesManagementPcpNameValue: "",

      showPcpName_beneficiariesManagementByDoctor: true,
      showPcpLocation_beneficiariesManagementByDoctor: true,
      showAverageMra_beneficiariesManagementByDoctor: true,
      showTotalCost_beneficiariesManagementByDoctor: true,

      beneficiariesManagementByDoctorGridPage: "",
      beneficiariesManagementByDoctorGridPageSize: "",
      beneficiariesManagementByDoctorGridSorted: "",
      beneficiariesManagementByDoctorGridFiltered: "",
      jsonDataForBeneficiariesManagementByDoctor: "",

      beneficiariesManagementByLocationGridPage: "",
      beneficiariesManagementByLocationGridPageSize: "",
      beneficiariesManagementByLocationGridSorted: "",
      beneficiariesManagementByLocationGridFiltered: "",

      beneficiariesManagementByClinicGridPage: "",
      beneficiariesManagementByClinicGridPageSize: "",
      beneficiariesManagementByClinicGridSorted: "",
      beneficiariesManagementByClinicGridFiltered: "",

      activeTab: '1',
    };

      this.toggleLarge = this.toggleLarge.bind(this);
      this.toggleDuplicateClaimsExpandModal = this.toggleDuplicateClaimsExpandModal.bind(this);
      this.toggleAdmissionsReportModal = this.toggleAdmissionsReportModal.bind(this);
      this.toggleAdmissionsReportExpandModal = this.toggleAdmissionsReportExpandModal.bind(this);
      this.toggleSpecialistComparisonReportModal = this.toggleSpecialistComparisonReportModal.bind(this);
      this.togglePatientVisitReportModal = this.togglePatientVisitReportModal.bind(this);
      this.togglePatientVisitExpandReportModal = this.togglePatientVisitExpandReportModal.bind(this);
      this.toggleSpecialistComparisonExpandReportModal = this.toggleSpecialistComparisonExpandReportModal.bind(this);
      this.toggleSpecialistComparisonExpandPracticeReportModal = this.toggleSpecialistComparisonExpandPracticeReportModal.bind(this);
      this.toggleSummaryReportModal = this.toggleSummaryReportModal.bind(this);
      this.toggleSettledMonthsModal = this.toggleSettledMonthsModal.bind(this);
      this.toggleSettledMonthsExpandModal = this.toggleSettledMonthsExpandModal.bind(this);
      this.togglePmpmByPracticeModal = this.togglePmpmByPracticeModal.bind(this);
      this.toggleReinsuranceManagementModal=this.toggleReinsuranceManagementModal.bind(this);
      this.toggleReinsuranceCostReportModal=this.toggleReinsuranceCostReportModal.bind(this);
      this.togglePmpmByPracticeExpandModal = this.togglePmpmByPracticeExpandModal.bind(this);
      this.toggleMembershipManagementModal = this.toggleMembershipManagementModal.bind(this);
      this.toggleBeneficiariesManagementModal = this.toggleBeneficiariesManagementModal.bind(this);
      this.toggleBeneficiariesManagementExpandModal = this.toggleBeneficiariesManagementExpandModal.bind(this);
      this.toggleBeneficiariesManagementByLocationExpandModal = this.toggleBeneficiariesManagementByLocationExpandModal.bind(this);
      this.toggleBeneficiariesManagementByDoctorExpandModal = this.toggleBeneficiariesManagementByDoctorExpandModal.bind(this);
      this.fetchData = this.fetchData.bind(this);
      this.fetchAdmissionsReportData = this.fetchAdmissionsReportData.bind(this);
      this.fetchPatientVisitReportData = this.fetchPatientVisitReportData.bind(this);
      this.fetchPatientVisitExpandReportData = this.fetchPatientVisitExpandReportData.bind(this);
      this.fetchAdmissionsReportExpandData = this.fetchAdmissionsReportExpandData.bind(this);
      this.fetchDuplicateClaimsExpandData = this.fetchDuplicateClaimsExpandData.bind(this);
      this.fetchSummaryReportData = this.fetchSummaryReportData.bind(this);
      this.fetchSettledMonthsData = this.fetchSettledMonthsData.bind(this);
      this.fetchSettledMonthsExpandData = this.fetchSettledMonthsExpandData.bind(this);
      this.fetchPmpmByPracticeData = this.fetchPmpmByPracticeData.bind(this);
      this.fetchPmpmByPracticeExpandData = this.fetchPmpmByPracticeExpandData.bind(this);
      this.fetchMembershipManagementData = this.fetchMembershipManagementData.bind(this);
      this.fetchReinsuranceManagementData = this.fetchReinsuranceManagementData.bind(this);
      this.fetchBeneficiariesManagementData = this.fetchBeneficiariesManagementData.bind(this);
      this.fetchBeneficiariesManagementDataByDoctor = this.fetchBeneficiariesManagementDataByDoctor.bind(this);
      this.fetchBeneficiariesManagementDataByLocation = this.fetchBeneficiariesManagementDataByLocation.bind(this);
      this.fetchBeneficiariesManagementDataByClinic = this.fetchBeneficiariesManagementDataByClinic.bind(this);
      this.fetchBeneficiariesManagementExpandData = this.fetchBeneficiariesManagementExpandData.bind(this);
      this.fetchBeneficiariesManagementByDoctorExpandData = this.fetchBeneficiariesManagementByDoctorExpandData.bind(this);
      this.fetchBeneficiariesManagementByLocationExpandData=this.fetchBeneficiariesManagementByLocationExpandData.bind(this);
      this.fetchBeneficiariesManagementByClinicExpandData=this.fetchBeneficiariesManagementByClinicExpandData.bind(this);
      this.fetchSpecialistComparisonReportData = this.fetchSpecialistComparisonReportData.bind(this);
      this.fetchSpecialistComparisonExpandReportData = this.fetchSpecialistComparisonExpandReportData.bind(this);
      this.fetchSpecialistComparisonExpandPracticeReportData = this.fetchSpecialistComparisonExpandPracticeReportData.bind(this);
      this.toggleBeneficiariesManagementByClinicExpandModal = this.toggleBeneficiariesManagementByClinicExpandModal.bind(this);
      this.toggle = this.toggle.bind(this);
      this.generateDuplicateClaimsXLSX = this.generateDuplicateClaimsXLSX.bind(this);
      this.duplicateClaimsReportFileQuery = "";

      this.getBeneficiariesManagementExpandData = debounce(this.getBeneficiariesManagementExpandData,500);
      this.getBeneficiariesManagementData = debounce(this.getBeneficiariesManagementData,500);
      this.fetchBeneficiariesManagementDataByLocation = debounce(this.fetchBeneficiariesManagementDataByLocation,500);
      this.fetchBeneficiariesManagementDataByClinic = debounce(this.fetchBeneficiariesManagementDataByClinic,500);
      this.fetchPmpmByPracticeData = debounce(this.fetchPmpmByPracticeData,500);
      this.fetchPmpmByPracticeExpandData = debounce(this.fetchPmpmByPracticeExpandData,500);
      this.fetchSettledMonthsData = debounce(this.fetchSettledMonthsData,500);
      this.fetchSettledMonthsExpandData = debounce(this.fetchSettledMonthsExpandData,500);
      this.fetchSummaryReportData = debounce(this.fetchSummaryReportData,500);
      this.fetchPatientVisitReportData = debounce(this.fetchPatientVisitReportData,500);
      this.fetchPatientVisitExpandReportData = debounce(this.fetchPatientVisitExpandReportData,500);
      this.fetchSpecialistComparisonReportData = debounce(this.fetchSpecialistComparisonReportData,500);
      this.fetchSpecialistComparisonExpandReportData = debounce(this.fetchSpecialistComparisonExpandReportData,500);
      this.fetchSpecialistComparisonExpandPracticeReportData = debounce(this.fetchSpecialistComparisonExpandPracticeReportData,500);
      this.fetchAdmissionsReportData = debounce(this.fetchAdmissionsReportData,500);
      this.fetchAdmissionsReportExpandData = debounce(this.fetchAdmissionsReportExpandData,500);
      this.fetchData = debounce(this.fetchData,500);
      this.fetchDuplicateClaimsExpandData = debounce(this.fetchDuplicateClaimsExpandData,500);
      this.fetchMembershipManagementData = debounce(this.fetchMembershipManagementData,500);
      this.fetchBeneficiariesManagementDataByDoctor = debounce(this.fetchBeneficiariesManagementDataByDoctor,500);
      this.fetchBeneficiariesManagementByDoctorExpandData = debounce(this.fetchBeneficiariesManagementByDoctorExpandData,500);
      this.fetchBeneficiariesManagementByLocationExpandData=debounce(this.fetchBeneficiariesManagementByLocationExpandData,500);
      this.fetchBeneficiariesManagementByClinicExpandData=debounce(this.fetchBeneficiariesManagementByClinicExpandData,500);
      this.fetchReinsuranceManagementData = debounce(this.fetchReinsuranceManagementData,500);
      this.fetchReinsuranceCostReportData=debounce(this.fetchReinsuranceCostReportData,500);
  }

  createRows (data) {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push({
      	infNFeId : data[i].infNFeId,
      	nNF : data[i].nNF,
      	dEmi : data[i].dEmi ? moment(data[i].dEmi).format('L'): "",
      	xNome : data[i].xNome,
      	status : data[i].status
      });
    }
   
    this._rows = rows;
    this.setState({rows: rows });
  };

  rowGetter(i) {
    return self._rows[i];
  };



  /*onChange(e) {
  	const formData = new FormData();
		formData.append('file',e.target.files[0]);
		fetch('http://localhost:7070/upload', {
		    method: 'POST',
		    body: formData
		}).then(function(res1) {
      if (!res1.ok) {
        self.createRows([]);
        if (error.message) {
          self.setState({errorMessage :error.message});
        } 
      }
      return res1.json();
    }).then(function(response){
      //console.log(response);
    	self.createRows(response.data);
    });
  }

  onChange1 (e) {
    const formData = new FormData();
    formData.append('file',e.target.files[0]);
    fetch('http://localhost:7070/validatesignature', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        return res1.json();
    }).then(function(response){
      self.createRows(response.data)
    }).catch((error) => {
      //console.log(error);
    });
  }*/

  toggleReportsTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    if(tab==1)
      self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
    if(tab==2)
    self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
    if(tab==3)
    self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    if(tab==4)
    self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered)); 
    }
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
    setTimeout(function(){ 
      if(i == 0) {
        if(self.state.showSubscriberId_duplicate) {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPlanName_duplicate) {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPatientName_duplicate) {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPcp_duplicate) {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth_duplicate) {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTermedMonth_duplicate) {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showClaimDate_duplicate) {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showDuplicativeCost_duplicate) {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "#20a8d8";
        }
      }

      if(i == 1) {
        if(self.state.showPatientName_admissions) {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showSubscriberId_admissions) {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPcpName_admissions) {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth_admissions) {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTotalNoOfAdmissions_admissions) {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTotalCost_admissions) {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "#20a8d8";
        }
      }  
        if(i == 2) {
          if(self.state.showClaimId_admissionsExpand) {
            document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClaimDate_admissionsExpand) {
            document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClaimType_admissionsExpand) {
            document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClinicName_admissionsExpand) {
            document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_admissionsExpand) {
            document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIcdCodes_admissionsExpand) {
            document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHccCodes_admissionsExpand) {
            document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDrgCode_admissionsExpand) {
            document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showBetosCat_admissionsExpand) {
            document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCost_admissionsExpand) {
            document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
        }
        if(i == 3) {
          if(self.state.showSpecialityCode_specialistComparison) {
            document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfClaims_specialistComparison) {
            document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfPcp_specialistComparison) {
            document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfBeneficiaries_specialistComparison) {
            document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCostPerClaim_specialistComparison) {
            document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCostPerBeneficiary_specialistComparison) {
            document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalCost_specialistComparison) {
            document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "#20a8d8";
          }
        }

        if(i == 4) {
          if(self.state.showPatientName_patientVisit) {
            document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHicn_patientVisit) {
            document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_patientVisit) {
            document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTermedMonth_patientVisit) {
            document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIpaEffectiveDate_patientVisit) {
            document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalErVisits_patientVisit) {
            document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalCost_patientVisit) {
            document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "#20a8d8";
          }
        }
        if(i == 5) {
          if(self.state.showPcpLocation_summary) {
            document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMonth_summary) {
            document.getElementById("ddItemMonth_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMonth_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMembers_summary) {
            document.getElementById("ddItemMembers_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMembers_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMaPremium_summary) {
            document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPartDPremium_summary) {
            document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalPremium_summary) {
            document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIpaPremium_summary) {
            document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpCap_summary) {
            document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSpecCost_summary) {
            document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showProfClaims_summary) {
            document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showInstClaims_summary) {
            document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showRxClaims_summary) {
            document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIbnrDollars_summary) {
            document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showReinsurancePremium_summary) {
            document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSpecCap_summary) {
            document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalExpenses_summary) {
            document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showReinsuranceRecovered_summary) {
            document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showRxAdmin_summary) {
            document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSilverSneakerUtilization_summary) {
            document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPba_summary) {
            document.getElementById("ddItemPba_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPba_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHumanaAtHome_summary) {
            document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDentalFFS_summary) {
            document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "#20a8d8";
          }
        }
        if(i == 6) {
             if(self.state.showPcpLocation_settledMonths) {
                document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "#20a8d8";
              } 
              if(self.state.showMonth_settledMonths) {
                document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "#20a8d8";
              } 
              if(self.state.showMembership_settledMonths) {
                document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaPremium_settledMonths) {
                document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalExpenses_settledMonths) {
                document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showStopLoss_settledMonths) {
                document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showNetPremium_settledMonths) {
                document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showRiskSharing_settledMonths) {
                document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showSurplusDeficit_settledMonths) {
                document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "#20a8d8";
              }
          }
          if(i == 7) {
              if(self.state.showPatientName_settledMonthsExpand) {
                document.getElementById("ddItemPatientName_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_settledMonthsExpand) {
                document.getElementById("ddItemPcpName_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_settledMonthsExpand) {
                document.getElementById("ddItemPcpLocation_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_settledMonthsExpand) {
                document.getElementById("ddItemCost_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_settledMonthsExpand) {
                document.getElementById("ddItemClaimType_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_settledMonthsExpand) {
                document.getElementById("ddItemMra_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
          }
          if(i == 8) {
              if(self.state.showFacilityLocationName_pmpmByPractice) {
                document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showProviderName_pmpmByPractice) {
                document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_pmpmByPractice) {
                document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice) {
                document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPMPM_pmpmByPractice) {
                document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPMPY_pmpmByPractice) {
                document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalPremium_pmpmByPractice) {
                document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaPremium_pmpmByPractice) {
                document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDifference_pmpmByPractice) {
                document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }

          }
          if(i == 9) {
              if(self.state.showPlanName_membershipManagement) {
                document.getElementById("ddItemPlanName_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPlanName_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMedicareId_membershipManagement) {
                document.getElementById("ddItemMedicareId_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMedicareId_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showInsuranceId_membershipManagement) {
                document.getElementById("ddItemInsuranceId_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemInsuranceId_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientName_membershipManagement) {
                document.getElementById("ddItemPatientName_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientDob_membershipManagement) {
                document.getElementById("ddItemPatientDob_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientDob_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAssignedPcp_membershipManagement) {
                document.getElementById("ddItemAssignedPcp_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAssignedPcp_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_membershipManagement) {
                document.getElementById("ddItemPcpLocation_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaEffectiveDate_membershipManagement) {
                document.getElementById("ddItemIpaEffectiveDate_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaEffectiveDate_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_membershipManagement) {
                document.getElementById("ddItemMra_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalPatientCost_membershipManagement) {
                document.getElementById("ddItemTotalPatientCost_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalPatientCost_membershipManagement").style.backgroundColor = "#20a8d8";
              }
          }

          if(i == 10) {
              if(self.state.showPatientName_pmpmByPracticeExpand) {
                document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_pmpmByPracticeExpand) {
                document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_pmpmByPracticeExpand) {
                document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_pmpmByPracticeExpand) {
                document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_pmpmByPracticeExpand) {
                document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_pmpmByPracticeExpand) {
                document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }

          }

          if(i == 11) {
              if(self.state.showClaimDate_patientVisitExpand) {
                document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_patientVisitExpand) {
                document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_patientVisitExpand) {
                document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_patientVisitExpand) {
                document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_patientVisitExpand) {
                document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_patientVisitExpand) {
                document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_patientVisitExpand) {
                document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_patientVisitExpand) {
                document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_patientVisitExpand) {
                document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
          }
          
          if(i == 12) {
            if(self.state.showPlanName_beneficiariesManagement) {
                document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHicn_beneficiariesManagement) {
                document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientName_beneficiariesManagement) {
                document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDob_beneficiariesManagement) {
                document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showEligibleMonth_beneficiariesManagement) {
                document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTermedMonth_beneficiariesManagement) {
                document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagement) {
                document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_beneficiariesManagement) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_beneficiariesManagement) {
                document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagement) {
                document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAddress_beneficiariesManagement) {
                document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showRecentAppointmentDate_beneficiariesManagement) {
                document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showNextAppointmentDate_beneficiariesManagement) {
                document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showFacilityLocation_beneficiariesManagement) {
                document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPhoneNumber_beneficiariesManagement) {
                document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showLastClaimsDate_beneficiariesManagement) {
                document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCode_beneficiariesManagement) {
                document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
          }

          if(i == 13) {
            if(self.state.showClaimId_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagementExpand) {
                document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
          }
            if(i == 14) {
              /*if(self.state.showClaimId_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }*/
              if(self.state.showClaimDate_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_duplicateClaimsExpand) {
                document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showProviderName_duplicateClaimsExpand) {
                document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_duplicateClaimsExpand) {
                document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_duplicateClaimsExpand) {
                document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_duplicateClaimsExpand) {
                document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_duplicateClaimsExpand) {
                document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_duplicateClaimsExpand) {
                document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
            }

            if(i == 15) {
              if(self.state.showSpecialityType_specialistComparisonExpand) {
                document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showNoOfClaims_specialistComparisonExpand) {
                document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAverageCostPerClaim_specialistComparisonExpand) {
                document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_specialistComparisonExpand) {
                document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
              }
            }

            if(i==16)
            {
              
            if(self.state.showSubscriberID_reinsuranceManagement) {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPlanName_reinsuranceManagement) {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPatientName_reinsuranceManagement) {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPcpName_reinsuranceManagement) {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showTermedMonth_reinsuranceManagement) {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showInstClaims_reinsuranceManagement) {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showProfClaims_reinsuranceManagement) {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showTotalCost_reinsuranceManagement) {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            }

            if(i == 17) {
              if(self.state.showPcpName_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAverageMra_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
            }

            if(i == 18) {
              if(self.state.showClaimId_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
            }
            if(i==19)
            {
              if(self.state.showPcpLocation_beneficiariesManagementByLocation) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_beneficiariesManagementByLocation) {
                document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagementByLocation) {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
              }
            }
            if(i == 20) {
              if(self.state.showClaimId_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementByLocationExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
              }
              
            }
            
            if(i == 21) {
              if(self.state.showClinicName_beneficiariesManagementByClinic) {
                document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagementByClinic) {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "#20a8d8";
              }
            }


            if(i == 22) {
              if(self.state.showClaimId_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementByClinicExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
              }
            }
          if(i==24)
          {
            
          if(self.state.showSubscriberID_reinsuranceCostReport) {
            document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPlanName_reinsuranceCostReport) {
            document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPatientFirstName_reinsuranceCostReport) {
            document.getElementById("ddItemPatientFirstName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientFirstName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          
          if(self.state.showPatientLastName_reinsuranceCostReport) {
            document.getElementById("ddItemPatientLastName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientLastName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_reinsuranceCostReport) {
            document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTermedMonth_reinsuranceCostReport) {
            document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDateOfBirth_reinsuranceCostReport) {
            document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showGender_reinsuranceCostReport) {
            document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalClaimsCost_reinsuranceCostReport) {
            document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showStatus_reinsuranceCostReport) {
            document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }if(self.state.showEffectiveDate_reinsuranceCostReport) {
            document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }if(self.state.showPolicyPeriod_reinsuranceCostReport) {
            document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          }
    }, 300);
  }

  toggleLarge() {
    self.state.duplicateClaimsProviderSelectValue = self.state.claimTotalsProviderSelect;
    self.state.duplicateClaimsPcpNameValue = self.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      large: !this.state.large
    });
  }

   toggleAdmissionsReportModal() {
    this.state.admissionsReportProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.admissionsReportPcpNameValue = self.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      admissionsReportModal: !this.state.admissionsReportModal
    });
    this.state.loading = false;
  }

  toggleAdmissionsReportExpandModal() {
    this.setState({
      admissionsReportExpandModal: !this.state.admissionsReportExpandModal
    });
    this.state.admissionsReportExpandLoading = false;
  }

  toggleDuplicateClaimsExpandModal() {
    this.setState({
      duplicateClaimsExpandModal: !this.state.duplicateClaimsExpandModal
    });
    this.state.duplicateClaimsExpandLoading = false;
  }

  toggleSpecialistComparisonReportModal() {
    this.state.specialistComparisonProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.specialistComparisonPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      specialistComparisonReportModal: !this.state.specialistComparisonReportModal
    });
    this.state.specialistComparisonReportLoading = false;
  }

  togglePatientVisitReportModal() {
    this.state.patientVisitProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.erPatientVisitPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      patientVisitReportModal: !this.state.patientVisitReportModal
    });
    this.state.patientVisitReportLoading = false;
  }

  togglePatientVisitExpandReportModal() {
    this.setState({
      patientVisitExpandReportModal: !this.state.patientVisitExpandReportModal
    });
    this.state.patientVisitExpandReportLoading = false;
  }

  toggleSpecialistComparisonExpandReportModal() {
    this.setState({
      specialistComparisonExpandReportModal: !this.state.specialistComparisonExpandReportModal
    });
    this.state.specialistComparisonExpandReportLoading = false;
  }

  toggleSpecialistComparisonExpandPracticeReportModal() {
    this.setState({
      specialistComparisonExpandPracticeReportModal: !this.state.specialistComparisonExpandPracticeReportModal
    });
    this.state.specialistComparisonExpandPracticeReportLoading = false;
  }

  toggleSummaryReportModal() {
    this.state.summaryReportsProviderSelectValue =  this.state.claimTotalsProviderSelect;
    this.setState({
      summaryReportModal: !this.state.summaryReportModal
    });
    this.state.summaryReportLoading = false;
  }

  toggleSettledMonthsModal() {
    this.state.settledMonthsProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.settledMonthsPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      settledMonthsModal: !this.state.settledMonthsModal
    });
    this.state.settledMonthsLoading = false;
  }

  toggleSettledMonthsExpandModal() {
    this.setState({
      settledMonthsExpandModal: !this.state.settledMonthsExpandModal
    });
    this.state.settledMonthsExpandLoading = false;
  }

  toggleReinsuranceManagementModal()
  {
    this.state.reinsuranceManagementProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.reinsuranceManagementPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      reinsuranceManagementModal: !this.state.reinsuranceManagementModal
    });
    this.state.reinsuranceManagementLoading = false;
  }

  
  toggleReinsuranceCostReportModal()
  {
    this.state.reinsuranceCostReportProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.reinsuranceCostReportPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      reinsuranceCostReportModal: !this.state.reinsuranceCostReportModal
    });
    this.state.reinsuranceCostReportLoading = false;

  }


  togglePmpmByPracticeModal() {
    this.state.pmpmByPracticeProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.pmpmByPracticePcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      pmpmByPracticeModal: !this.state.pmpmByPracticeModal
    });
    this.state.pmpmByPracticeLoading = false;
  }

  togglePmpmByPracticeExpandModal() {
    this.setState({
      pmpmByPracticeExpandModal: !this.state.pmpmByPracticeExpandModal
    });
    this.state.pmpmByPracticeExpandLoading = false;
  }

  toggleMembershipManagementModal() {
    this.setState({
      membershipManagementModal: !this.state.membershipManagementModal
    });
    this.state.membershipManagementLoading = false;
  }

  toggleBeneficiariesManagementModal() {
    this.state.beneficiariesManagementProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.beneficiariesManagementPcpNameValue = this.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      beneficiariesManagementModal: !this.state.beneficiariesManagementModal
    });
    this.state.beneficiariesManagementLoading = false;

  }
  
 
  toggleBeneficiariesManagementByClinicExpandModal()
  {
    this.setState({
      beneficiariesManagementByClinicExpandModal: !this.state.beneficiariesManagementByClinicExpandModal
    });
    this.state.beneficiariesManagementByClinicExpandLoading=false;
  }



  toggleBeneficiariesManagementByLocationExpandModal()
  {
    this.setState({
      beneficiariesManagementByLocationExpandModal: !this.state.beneficiariesManagementByLocationExpandModal
    });
    this.state.beneficiariesManagementByLocationExpandLoading=false;

  }

  toggleBeneficiariesManagementExpandModal() {
    this.setState({
      beneficiariesManagementExpandModal: !this.state.beneficiariesManagementExpandModal
    });
    this.state.beneficiariesManagementExpandLoading = false;
  }

  toggleBeneficiariesManagementByDoctorExpandModal() {
    this.setState({
      beneficiariesManagementByDoctorExpandModal: !this.state.beneficiariesManagementByDoctorExpandModal
    });
    this.state.beneficiariesManagementByDoctorExpandLoading = false;
  }

  goToClaimDetails() {
    window.location.href = "#/claimDetails";
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


    self.state.prescType = "Cost";
    document.getElementById("byCost").checked = true;
    if(localStorage.getItem("user") != null) {
      //document.getElementById("byPlan").checked = true;
      document.getElementById("monthly").checked = true;
      //document.getElementById("pcpSelect").style.display="none";
      //document.getElementById("AllProviderCheckbox").checked = true;

        fetch(config.serverUrl+'/getTopPrescriptionDrugs/'+"cost"+"/all", {
          method: 'GET'
      }).then(function(res1) {
        return res1.json();
      }).then(function(response)   {
        //console.log("success...");
        //console.log(response);
        self.setState({drugNames: response.drugNames,costList: response.expenditures});
      }).catch((error) => {
        console.log(error);
      });

      fetch(config.serverUrl+'/getMonthlyTotalsReportYears', {
          method: 'GET'
      }).then(function(res1) {
        return res1.json();
      }).then(function(response)   {
          self.setState({monthlyReportYearsList: response.yearsList,summaryReportYearsList: response.yearsList});
          self.setState({
          summaryReportYearsList: self.state.summaryReportYearsList.concat({value:'all', label:'All'})
        });
      }).catch((error) => {
        console.log(error);
      });

      fetch(config.serverUrl+'/getAllPlanAndPCP', {
          method: 'GET'
      }).then(function(res1) {
        return res1.json();
      }).then(function(response)   {
        //console.log("success...");
        //console.log(response);
        self.setState({planList: response.planList,pcpList: response.pcpList,yearsList:response.yearsList,drugsPlansList:response.planList,locationList:response.locationList,monthlyTotalsProviderList:response.planList});
        
          var currentYear = 0;
              for(var i=0;i<self.state.yearsList.length;i++) {
                if(self.state.yearsList[i].value >= currentYear) {
                  currentYear = self.state.yearsList[i].value;
                }
              }

              self.state.duplicateClaimsYearSelectValue = {value:currentYear, label:currentYear};
              self.state.admissionsReportYearSelectValue = {value:currentYear, label:currentYear};
              self.state.specialistComparisonReportYearSelectValue = {value:currentYear, label:currentYear};
              self.state.patientVisitReportYearSelectValue = {value:currentYear, label:currentYear};
              self.state.summaryReportYearSelectValue = {value:currentYear, label:currentYear};
              self.state.monthlyReportsYearsSelectValue = {value:currentYear, label:currentYear};
              self.state.settledMonthsYearSelectValue = {value:currentYear, label:currentYear};
              self.state.pmpmByPracticeYearSelectValue = {value:currentYear, label:currentYear};
              self.state.reinsuranceManagementYearSelectValue={value:currentYear,label:currentYear};
              self.state.reinsuranceCostReportYearSelectValue={value:currentYear,label:currentYear};
              self.state.beneficiariesManagementYearSelectValue = {value:currentYear, label:currentYear};
              self.state.yearsSelectValue = {value:currentYear, label:currentYear};


        self.setState({
          yearsList: self.state.yearsList.concat({value:'all', label:'All'})
         }); 
        self.setState({
          drugsPlansList: self.state.drugsPlansList.concat({value:'all', label:'All'})
        });
        
        self.setState({
          planList: self.state.planList.concat({value:'all', label:'All'})
         });

        self.setState({
          monthlyTotalsProviderList: self.state.monthlyTotalsProviderList.concat({value:'all', label:'All'})
        });

      }).catch((error) => {
        console.log(error);
      });

      this.state.providerArr.push("all");
      this.getAllClaimDetails();
      this.getMonthlyTotalsReport("monthly");
      self.getMembershipManagementData();
    }
  }    

  setYearValue(e) {
    self.state.yearsSelectValue = e;
      var year = e.value;
      self.getLocationsByYear();
      

  }

  getLocationsByYear() {

    const formData = new FormData();
    formData.append('year', self.state.yearsSelectValue.value);
    fetch(config.serverUrl+'/getLocationsByYear', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
      return res1.json();
    }).then(function(response)   {
        self.setState({locationList:response});
        self.setState({
          locationList: self.state.locationList.concat({value:'all', label:'All'})
         });

        /*for(var i=0;i<response.length;i++) {
          if(response[i].label == self.state.locationSelectValue[i].label) {
            break;
          }
        }*/
        //if(i == response.length) {
          self.state.locationSelectValue = [{value:'all', label:'All'}];
        //}

        self.getAllClaimDetails();

        var param = "";
        if(document.getElementById('monthly').checked) {
          param = "monthly";
        }
        if(document.getElementById('quarterly').checked) {
          param = "quarterly";
        }
        if(document.getElementById('annual').checked) {
          param = "annual";
        }

        self.getMonthlyTotalsReport(param);

    });

  }

  getAllClaimDetails() {
    
    const formData = new FormData();
      formData.append('year', self.state.yearsSelectValue.value);
      formData.append('providerArr', self.state.providerArr);
      if(self.state.optionSelectValue.value != undefined){
        formData.append('optionName', self.state.optionSelectValue.value);
      } else {
        formData.append('optionName', "all");
      }
      
      if(self.state.locationSelectValue != undefined) {
        formData.append('locationName', JSON.stringify(self.state.locationSelectValue));
      } else {
        formData.append('locationName', JSON.stringify([{value:"all",label:"All"}]));
      }

      fetch(config.serverUrl+'/getAllClaimDetails', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
      return res1.json();
    }).then(function(response)   {
      //console.log("success...");
      //console.log(response);
      self.setState({instSum: response.institutional,profSum: response.professional,specSum:response.speciality,prescSum:response.prescription,currentMonthCount:response.currentMonth});
        
    });

  }

  getPCPForAllProviders() {

    const formData = new FormData();
    formData.append('providerArr', self.state.providerArr);
    fetch(config.serverUrl+'/getPCPForAllProviders', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
      return res1.json();
    }).then(function(response)   {
        self.setState({pcpList:response});
        self.setState({
          pcpList: self.state.pcpList.concat({value:'all', label:'All'})
        });
        var i = 0;
        for( i=0;i<response.length;i++) {
          if(response[i].label == self.state.optionSelectValue.label) {
            
            self.setState({optionSelectValue:response[i]});
            break;
          } 
          
        }

        if(i == response.length) {
          self.state.optionSelectValue = {value:'all', label:'All'};
        }

        self.getAllClaimDetails();

        var param = "";
        if(document.getElementById('monthly').checked) {
          param = "monthly";
        }
        if(document.getElementById('quarterly').checked) {
          param = "quarterly";
        }
        if(document.getElementById('annual').checked) {
          param = "annual";
        }
      self.getMonthlyTotalsReport(param);
      self.getMembershipManagementData();
    });
  }

  getPCPForReportProviders(providerName) {
    this.state.reportProviderArr = [];
    this.state.reportProviderArr[0] = providerName;
    const formData = new FormData();
    formData.append('providerArr', self.state.reportProviderArr);
    fetch(config.serverUrl+'/getPCPForAllProviders', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
      return res1.json();
    }).then(function(response)   {
        self.setState({pcpReportList:response});
        self.setState({
          pcpReportList: self.state.pcpReportList.concat({value:'all', label:'All'})
        });
        /*var i = 0;
        for( i=0;i<response.length;i++) {
          if(response[i].label == self.state.optionSelectValue.label) {
            
            self.setState({optionSelectValue:response[i]});
            break;
          } 
          
        }

        if(i == response.length) {*/
          self.state.duplicateClaimsPcpNameValue = {value:'all', label:'All'};
          self.state.admissionsReportPcpNameValue = {value:'all', label:'All'};
          self.state.specialistComparisonPcpNameValue = {value:'all', label:'All'};
          self.state.erPatientVisitPcpNameValue = {value:'all', label:'All'};
          self.state.settledMonthsPcpNameValue = {value:'all', label:'All'};
          self.state.pmpmByPracticePcpNameValue = {value:'all', label:'All'};
          self.state.reinsuranceManagementPcpNameValue={value:'all',label:'All'};
          self.state.reinsuranceCostReportPcpNameValue={value:'all',label:'All'};
          self.state.beneficiariesManagementPcpNameValue = {value:'all', label:'All'};

        //}

    });
  }

  getPrescriptionDrugs(type) {
    //console.log(type);
    self.state.prescType = type;
    var provider = this.state.providerSelectValue.value;
    
    fetch(config.serverUrl+'/getTopPrescriptionDrugs/'+type+'/'+provider, {
        method: 'GET'
    }).then(function(res1) {
      return res1.json();
    }).then(function(response)   {
      //console.log("success...");
      //console.log(response);
      self.setState({drugNames: response.drugNames,costList: response.expenditures});
    }).catch((error) => {
      //console.log(error);
    });
  }

  changePlan(type) {
    //console.log(type);
    if(type == 'plan') {
      document.getElementById("providerSelect").style.display="block";
      document.getElementById("pcpSelect").style.display="none";
    }
    if(type == 'pcp') {
      document.getElementById("pcpSelect").style.display="block";
      document.getElementById("providerSelect").style.display="none";
    }
  }

  getClaimDetails(e) {
      self.state.providerArr = [];
      self.state.claimTotalsProviderSelect = e;
      self.state.providerArr.push(self.state.claimTotalsProviderSelect.value);
      //console.log(this.state.providerArr);
      if(self.state.providerArr.length != 0) {
      var year = self.state.yearsSelectValue.value;

      self.getPCPForAllProviders();

    }
  }

  setOptionValue(e) {
    self.state.optionSelectValue = e;
    if(self.state.providerArr.length != 0) {
      var year = self.state.yearsSelectValue.value;
      self.getAllClaimDetails();
      var param = "";
      if(document.getElementById('monthly').checked) {
        param = "monthly";
      }
      if(document.getElementById('quarterly').checked) {
        param = "quarterly";
      }
      if(document.getElementById('annual').checked) {
        param = "annual";
      }
      self.getMonthlyTotalsReport(param);
      self.getMembershipManagementData();
    }
  }

  setLocationValue(e) {
    console.log("location selected value",e);
    self.state.locationSelectValue = e;
    if(self.state.providerArr.length != 0) {
      var year = self.state.yearsSelectValue.value;
      self.getAllClaimDetails();

      var param = "";
      if(document.getElementById('monthly').checked) {
        param = "monthly";
      }
      if(document.getElementById('quarterly').checked) {
        param = "quarterly";
      }
      if(document.getElementById('annual').checked) {
        param = "annual";
      }

      self.getMonthlyTotalsReport(param);
      self.getMembershipManagementData();
    }
  }

  handleProviderSelect(e) {
    self.state.providerSelectValue = e;
    self.getPrescriptionDrugs(self.state.prescType);
  }

  saveHorizontalBarAsPdf(event) {
    var src = document.getElementsByTagName("canvas")[0].toDataURL("image/png");
    //document.getElementById("demo").src = src;
    var pdf = new jsPDF();
    var marginLeft=20;
    var marginRight=20;
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();
    //console.log(height+" height width "+ width);
    pdf.addImage(src,"jpeg",0,0,width,height);
    pdf.save('sample-file.pdf');
    //window.location=pdf.output("datauristring");
    //window.open(pdf);
  }

  getMonthlyTotalsReport(param) {
    //console.log(param);
    const formData = new FormData();
    formData.append('totalsType',param);
    //if(self.state.yearsSelectValue.value != 'all') {
      formData.append('year',self.state.yearsSelectValue.value);
    /*} else {
      var date = new Date();
      var currentYear = date.getFullYear();
      formData.append('year',currentYear);
    }*/
    formData.append('provider',self.state.claimTotalsProviderSelect.value);
    formData.append('pcpName',self.state.optionSelectValue.value);
    formData.append('pcpLocation',JSON.stringify(self.state.locationSelectValue));
    fetch(config.serverUrl+'/getMonthlyTotalsReport', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        return res1.json();
    }).then(function(response){
      //console.log('success');
      //console.log(response.monthlyTotals);
      if(param == 'monthly') {
       self.setState({monthlyTotalsLabel: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}); 
      }
      if(param == 'quarterly') {
        self.setState({monthlyTotalsLabel: ['Q1','Q2','Q3','Q4']});
      }
      if(param == 'annual') {
        self.setState({monthlyTotalsLabel: [self.state.monthlyReportsYearsSelectValue.value]});
      }
      self.setState({monthlyTotals: response.totalExpenses,monthlyIPAValue:response.ipaPremiumValue}); 
    }).catch((error) => {
      //console.log(error);
    });
  }

  setDuplicateClaimsPcpName(e) {
    self.state.duplicateClaimsPcpNameValue = e;
    self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
  }

  setAdmissionsReportPcpName(e) {
    self.state.admissionsReportPcpNameValue = e;
    self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
  }

  setSpecialistComparisonPcpName(e) {
    self.state.specialistComparisonPcpNameValue = e;
    self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));
  }

  setSpecialistComparisonExpandPcpName(e) {
    self.state.specialistComparisonExpandPcpNameValue = e;
    self.getSpecialistComparisonExpandPracticeReportData(self.state.specialistComparisonExpandPracticeGridPageSize,1,JSON.stringify(self.state.specialistComparisonExpandPracticeGridSorted),JSON.stringify(self.state.specialistComparisonExpandPracticeGridFiltered));
  }

  setERPatientVisitPcpName(e) {
    self.state.erPatientVisitPcpNameValue = e;
    self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
  }

  setSettledMonthsPcpName(e) {
    self.state.settledMonthsPcpNameValue = e;
    self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted),JSON.stringify(self.state.settledMonthsGridFiltered));
  }

  setReinsuranceManagementPcpName(e) {
    self.state.reinsuranceManagementPcpNameValue = e;
    self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
  }
  setReinsuranceCostReportPcpName(e) {
    self.state.reinsuranceCostReportPcpNameValue = e;
    self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
  }
  

  setPmpmByPracticePcpName(e) {
    self.state.pmpmByPracticePcpNameValue = e;
    self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
  }

  setBeneficiariesManagementPcpName(e) {
    self.state.beneficiariesManagementPcpNameValue = e;
    if(self.state.activeTab == '1') {
      self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
    }
    if(self.state.activeTab == '2') {
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
    }
    if(self.state.activeTab == '3') {
      self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    }
    if(self.state.activeTab == '4') {
      self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
    }

  }

  fetchData(state, instance) {
    var page = state.page + 1;
    self.state.duplicateClaimsGridPage = page;
    self.state.duplicateClaimsGridPageSize = state.pageSize;
    self.state.duplicateClaimsGridSoreted = state.sorted;
    self.state.duplicateClaimsGridFiltered = state.filtered;
    this.getDuplicateClaimReports(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchAdmissionsReportData(state, instance) {
    var page = state.page + 1;
    self.state.admissionsReportGridPage = page;
    self.state.admissionsReportGridPageSize = state.pageSize;
    self.state.admissionsReportGridSorted = state.sorted;
    self.state.admissionsReportGridFiltered = state.filtered;
    self.getAdmissionsReports(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchAdmissionsReportExpandData(state, instance) {
    var page = state.page + 1;
    self.state.admissionsReportExpandGridPage = page;
    self.state.admissionsReportExpandGridPageSize = state.pageSize;
    self.state.admissionsReportExpandGridSorted = state.sorted;
    self.state.admissionsReportExpandGridFiltered = state.filtered;
    self.getAdmissionsReportExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchDuplicateClaimsExpandData(state, instance) {
    var page = state.page + 1;
    self.getDuplicateClaimsExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSpecialistComparisonReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonGridPage = page;
    self.state.specialistComparisonGridPageSize = state.pageSize;
    self.state.specialistComparisonGridSorted = state.sorted;
    self.state.specialistComparisonGridFiltered = state.filtered;
    self.getSpecialistComparisonReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSpecialistComparisonExpandReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonExpandGridPage = page;
    self.state.specialistComparisonExpandGridPageSize = state.pageSize;
    self.state.specialistComparisonExpandGridSorted = state.sorted;
    self.state.specialistComparisonExpandGridFiltered = state.filtered;
    self.getSpecialistComparisonExpandReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSpecialistComparisonExpandPracticeReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonExpandPracticeGridPage = page;
    self.state.specialistComparisonExpandPracticeGridPageSize = state.pageSize;
    self.state.specialistComparisonExpandPracticeGridSorted = state.sorted;
    self.state.specialistComparisonExpandPracticeGridFiltered = state.filtered;
    self.getSpecialistComparisonExpandPracticeReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchPatientVisitReportData(state, instance) {
    var page = state.page + 1;
    self.state.patientVisitGridPage = page;
    self.state.patientVisitGridPageSize = state.pageSize;
    self.state.patientVisitGridSorted = state.sorted;
    self.state.patientVisitGridFiltered = state.filtered;
    self.getPatientVisitReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchPatientVisitExpandReportData(state, instance) {
    var page = state.page + 1;
    self.getPatientVisitExpandReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSummaryReportData(state, instance) {
    var page = state.page + 1;
    self.state.summaryGridPage = page;
    self.state.summaryGridPageSize = state.pageSize;
    self.state.summaryGridSorted = state.sorted;
    self.state.summaryGridFiltered = state.filtered;
    self.getSummaryReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSettledMonthsData(state, instance) {
    var page = state.page + 1;
    self.state.settledMonthsGridPage = page;
    self.state.settledMonthsGridPageSize = state.pageSize;
    self.state.settledMonthsGridSorted = state.sorted;
    self.state.settledMonthsGridFiltered = state.filtered;
    self.getSettledMonthsData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchSettledMonthsExpandData(state, instance) {
    var page = state.page + 1;
    self.getSettledMonthsExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchPmpmByPracticeData(state, instance) {
    var page = state.page + 1;
    self.state.pmpmByPracticeGridPage = page;
    self.state.pmpmByPracticeGridPageSize = state.pageSize;
    self.state.pmpmByPracticeGridSorted = state.sorted;
    self.state.pmpmByPracticeGridFiltered = state.filtered;
    self.getPmpmByPracticeData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchReinsuranceManagementData(state,instance){
    var page = state.page + 1;
    self.state.reinsuranceManagementGridPage = page;
    self.state.reinsuranceManagementGridPageSize = state.pageSize;
    self.state.reinsuranceManagementGridSorted = state.sorted;
    self.state.reinsuranceManagementGridFiltered = state.filtered;
    self.getReinsuranceManagementData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchReinsuranceCostReportData(state,instance){
    var page = state.page + 1;
    self.state.reinsuranceCostReportGridPage = page;
    self.state.reinsuranceCostReportGridPageSize = state.pageSize;
    self.state.reinsuranceCostReportGridSorted = state.sorted;
    self.state.reinsuranceCostReportGridFiltered = state.filtered;
    self.getReinsuranceCostReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchPmpmByPracticeExpandData(state, instance) {
    var page = state.page + 1;
    self.getPmpmByPracticeExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchMembershipManagementData(state, instance) {
    var page = state.page + 1;
    self.state.membershipManagementGridPage = page;
    self.state.membershipManagementGridPageSize = state.pageSize;
    self.state.membershipManagementGridSorted = state.sorted;
    self.state.membershipManagementGridFiltered = state.filtered;
    self.getMembershipManagementPatientsData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchBeneficiariesManagementData(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementGridPage = page;
    self.state.beneficiariesManagementGridPageSize = state.pageSize;
    self.state.beneficiariesManagementGridSorted = state.sorted;
    self.state.beneficiariesManagementGridFiltered = state.filtered;
    if(self.state.activeTab==1) 
    self.getBeneficiariesManagementData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchBeneficiariesManagementDataByDoctor(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByDoctorGridPage = page;
    self.state.beneficiariesManagementByDoctorGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByDoctorGridSorted = state.sorted;
    self.state.beneficiariesManagementByDoctorGridFiltered = state.filtered;
    if(self.state.activeTab==2)
    self.getBeneficiariesManagementByDoctorData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchBeneficiariesManagementExpandData(state, instance) {
    var page = state.page + 1;
    self.getBeneficiariesManagementExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }
  
  fetchBeneficiariesManagementDataByLocation(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByLocationGridPage = page;
    self.state.beneficiariesManagementByLocationGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByLocationGridSorted = state.sorted;
    self.state.beneficiariesManagementByLocationGridFiltered = state.filtered;
    if(self.state.activeTab==3)
    self.getBeneficiariesManagementByLocationData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  fetchBeneficiariesManagementByDoctorExpandData(state, instance) {
    var page = state.page + 1;
    self.getBeneficiariesManagementByDoctorExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }
    fetchBeneficiariesManagementDataByClinic(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByClinicGridPage = page;
    self.state.beneficiariesManagementByClinicGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByClinicGridSorted = state.sorted;
    self.state.beneficiariesManagementByClinicGridFiltered = state.filtered;
    if(self.state.activeTab==4)
    self.getBeneficiariesManagementByClinicData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  
  fetchBeneficiariesManagementByClinicExpandData(state,instance)
  {
    var page =state.page+1;
    self.getBeneficiariesManagementByClinicExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  fetchBeneficiariesManagementByLocationExpandData(state,instance)
  {
    var page =state.page+1;
    self.getBeneficiariesManagementByLocationExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getMembershipManagementPatientsData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ membershipManagementLoading: true });
    const formData = new FormData();

      formData.append('patientType', self.state.patientTypeClicked);
      formData.append('provider', self.state.claimTotalsProviderSelect.value);
      formData.append('pcpName', self.state.optionSelectValue.value);
      formData.append('location', JSON.stringify(self.state.locationSelectValue));
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getMembershipManagementPatientsData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({membershipManagementData: response.membershipManagementData,membershipManagementPages:response.pages,membershipManagementTotalCount:response.totalCount,membershipManagementFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ membershipManagementLoading: false });
          self.generateMembershipManagementXLSX();
      });
        
  }

  getDuplicateClaimReports(pageSize,page,sortedArr,filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();

      formData.append('year', self.state.duplicateClaimsYearSelectValue.value);
      formData.append('provider', self.state.duplicateClaimsProviderSelectValue.value);
      formData.append('pcpName', self.state.duplicateClaimsPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getDuplicateClaimsData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {
          self.setState({duplicateClaimsReportData: response.duplicateClaimsReportData,duplicateClaimsPages:response.pages,duplicateClaimsTotalCount:response.totalCount,duplicateClaimFileQuery:response.fileQuery});
          //console.log(response);
          self.duplicateClaimsReportFileQuery = response.fileQuery;
          self.setState({ loading: false });
          self.generateDuplicateClaimsXLSX();
      });
        
  }

getAdmissionsReports(pageSize,page,sortedArr,filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();

      formData.append('year', self.state.admissionsReportYearSelectValue.value);
      formData.append('provider', self.state.admissionsReportProviderSelectValue.value);
      formData.append('pcpName', self.state.admissionsReportPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getAdmissionsReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({admissionsReportData: response.admissionsReportData,admissionsReportPages:response.pages,admissionsReportTotalCount:response.totalCount,admissionsReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ loading: false });
          self.generateAdmissionsReportXLSX();
          self.generateAdmissionsReportHeaderXLSX();
      });
        
  }

  getAdmissionsReportExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ admissionsReportExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.admissionsReportYearSelectValue.value);
      formData.append('provider', self.state.admissionsReportProviderSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      formData.append('subscriberIdAdmissionsExpand', self.state.admissionsReportExpandSubscriberId);

      fetch(config.serverUrl+'/getAdmissionsReportExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({admissionsReportExpandData: response.admissionsReportExpandData,admissionsReportExpandPages:response.pages,admissionsReportExpandTotalCount:response.totalCount,admissionsReportExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ admissionsReportExpandLoading: false });
          self.generateAdmissionsReportExpandXLSX();
      });
        
  }

  getDuplicateClaimsExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ duplicateClaimsExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.duplicateClaimsYearSelectValue.value);
      formData.append('provider', self.state.duplicateClaimsProviderSelectValue.value);
      formData.append('pcpName', self.state.optionSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      formData.append('medicareId', self.state.duplicateClaimsExpandMedicareId);
      formData.append('serviceMonth', self.state.duplicateClaimsExpandServiceMonth);
      formData.append('firstServiceDate', self.state.duplicateClaimsExpandFirstServiceDate);
      formData.append('paidAmount', self.state.duplicateClaimsExpandPaidAmount.substr(1));
      formData.append('claimTypeValue', self.state.duplicateClaimsExpandClaimType);


      fetch(config.serverUrl+'/getDuplicateClaimsExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({duplicateClaimsExpandData: response.duplicateClaimsExpandData,duplicateClaimsExpandPages:response.pages,duplicateClaimsExpandTotalCount:response.totalCount,duplicateClaimsExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ duplicateClaimsExpandLoading: false });
          self.generateDuplicateClaimsExpandXLSX();
      });
        
  }

  getSpecialistComparisonReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.specialistComparisonReportYearSelectValue.value);
      formData.append('provider', self.state.specialistComparisonProviderSelectValue.value);
      formData.append('pcpName', self.state.specialistComparisonPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({specialistComparisonReportData: response.specialistComparisonReportData,specialistComparisonReportPages:response.pages,specialistComparisonReportTotalCount:response.totalCount,specialistComparisonReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ specialistComparisonReportLoading: false });
          self.generateSpecialistComparisonReportXLSX();
      });
        
  }

  getSpecialistComparisonExpandReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonExpandReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.specialistComparisonReportYearSelectValue.value);
      formData.append('provider', self.state.specialistComparisonProviderSelectValue.value);
      formData.append('pcpName', self.state.specialistComparisonExpandPcpNameValue.value);
      formData.append('speciality', self.state.specialistComparisonSpecialityCode);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonExpandReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({specialistComparisonExpandReportData: response.specialistComparisonExpandReportData,specialistComparisonExpandReportPages:response.pages,specialistComparisonExpandReportTotalCount:response.totalCount,specialistComparisonExpandReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ specialistComparisonExpandReportLoading: false });
          self.generateSpecialistComparisonExpandReportXLSX();
      });
        
  }

  getSpecialistComparisonExpandPracticeReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonExpandPracticeReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.specialistComparisonReportYearSelectValue.value);
      formData.append('provider', self.state.specialistComparisonProviderSelectValue.value);
      formData.append('pcpName', self.state.specialistComparisonExpandPcpNameValue.value);
      formData.append('practiceName', self.state.specialistComparisonPracticeName);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonExpandPracticeReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({specialistComparisonExpandPracticeReportData: response.specialistComparisonExpandPracticeReportData,specialistComparisonExpandPracticeReportPages:response.pages,specialistComparisonExpandPracticeReportTotalCount:response.totalCount,specialistComparisonExpandPracticeReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ specialistComparisonExpandPracticeReportLoading: false });
          self.generateSpecialistComparisonExpandReportXLSX();
      });
        
  }

  getPatientVisitReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ patientVisitReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.patientVisitReportYearSelectValue.value);
      formData.append('provider', self.state.patientVisitProviderSelectValue.value);
      formData.append('pcpName', self.state.erPatientVisitPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPatientVisitReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({patientVisitReportData: response.patientVisitReportData,patientVisitReportPages:response.pages,patientVisitReportTotalCount:response.totalCount,patientVisitReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ patientVisitReportLoading: false });
          self.generatePatientVisitReportXLSX();
      });
        
  }

  getPatientVisitExpandReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ patientVisitExpandReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.patientVisitReportYearSelectValue.value);
      formData.append('provider', self.state.patientVisitProviderSelectValue.value);
      formData.append('medicareId', self.state.ERPatientVisitExpandReportMedicareId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPatientVisitExpandReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({patientVisitExpandReportData: response.patientVisitExpandReportData,patientVisitExpandReportPages:response.pages,patientVisitExpandReportTotalCount:response.totalCount,patientVisitExpandReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ patientVisitExpandReportLoading: false });
          self.generatePatientVisitExpandReportXLSX();
      });
        
  }

  getSummaryReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ summaryReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.summaryReportYearSelectValue.value);
      formData.append('provider', self.state.summaryReportsProviderSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSummaryReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({summaryReportData: response.summaryReportData,summaryReportPages:response.pages,summaryReportTotalCount:response.totalCount,summaryReportFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ summaryReportLoading: false });
          self.generateSummaryReportXLSX();
      });
        
  }

  getSettledMonthsData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ settledMonthsLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.settledMonthsYearSelectValue.value);
      formData.append('provider', self.state.settledMonthsProviderSelectValue.value);
      formData.append('pcpName', self.state.settledMonthsPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSettledMonthsData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({settledMonthsData: response.settledMonthsData,settledMonthsPages:response.pages,settledMonthsTotalCount:response.totalCount,settledMonthsFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ settledMonthsLoading: false });
          self.generateSettledMonthsXLSX();
      });
        
  }

  getReinsuranceManagementData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ reinsuranceManagementLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.reinsuranceManagementYearSelectValue.value);
      formData.append('provider', self.state.reinsuranceManagementProviderSelectValue.value);
      formData.append('pcpName', self.state.reinsuranceManagementPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      fetch(config.serverUrl+'/getReinsuranceManagementData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({reinsuranceManagementData: response.reinsuranceManagementData,reinsuranceManagementPages:response.pages,reinsuranceManagementTotalCount:response.totalCount,reinsuranceManagementFileQuery:response.fileQuery});
          
          self.setState({ reinsuranceManagementLoading: false });
          self.generateReinsuranceManagementXLSX();
      });
    }

    
  getReinsuranceCostReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ reinsuranceCostReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.reinsuranceCostReportYearSelectValue.value);
      formData.append('provider', self.state.reinsuranceCostReportProviderSelectValue.value);
      formData.append('pcpName', self.state.reinsuranceCostReportPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      fetch(config.serverUrl+'/getReinsuranceCostReportData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({reinsuranceCostReportData: response.reinsuranceCostReportData,reinsuranceCostReportPages:response.pages,reinsuranceCostReportTotalCount:response.totalCount,reinsuranceCostReportFileQuery:response.fileQuery});
          self.setState({ reinsuranceCostReportLoading: false });
          self.generateReinsuranceCostReportXLSX();
      });
    }

  getPmpmByPracticeData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ pmpmByPracticeLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.pmpmByPracticeYearSelectValue.value);
      formData.append('provider', self.state.pmpmByPracticeProviderSelectValue.value);
      formData.append('pcpName', self.state.pmpmByPracticePcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPmpmByPracticeData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({pmpmByPracticeData: response.pmpmByPracticeData,pmpmByPracticePages:response.pages,pmpmByPracticeTotalCount:response.totalCount,pmpmByPracticeFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ pmpmByPracticeLoading: false });
          self.generatePmpmByPracticeXLSX();
      });
        
  }

  getPmpmByPracticeExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ pmpmByPracticeExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.pmpmByPracticeYearSelectValue.value);
      formData.append('provider', self.state.pmpmByPracticeProviderSelectValue.value);
      formData.append('pcpName', self.state.pmpmByPracticeSelectedPcpId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPmpmByPracticeExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({pmpmByPracticeExpandData: response.pmpmByPracticeExpandData,pmpmByPracticeExpandPages:response.pages,pmpmByPracticeExpandTotalCount:response.totalCount,pmpmByPracticeExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ pmpmByPracticeExpandLoading: false });
          self.generatePmpmByPracticeExpandXLSX();
      });
        
  }

  getSettledMonthsExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ settledMonthsExpandLoading: true });
    const formData = new FormData();

      formData.append('selectedMonth', self.state.settledMonthsSelectedMonth);
      formData.append('provider', self.state.settledMonthsProviderSelectValue.value);
      formData.append('pcpName', self.state.optionSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSettledMonthsExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({settledMonthsExpandData: response.settledMonthsExpandData,settledMonthsExpandPages:response.pages,settledMonthsExpandTotalCount:response.totalCount,settledMonthsExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ settledMonthsExpandLoading: false });
          self.generateSettledMonthsExpandXLSX();
      });
        
  }

  getBeneficiariesManagementData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementData: response.beneficiariesManagementData,beneficiariesManagementPages:response.pages,beneficiariesManagementTotalCount:response.totalCount,beneficiariesManagementFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementLoading: false });
          self.generateBeneficiariesManagementXLSX();
      });
        
  }

  getBeneficiariesManagementByDoctorData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByDoctorLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementByDoctorData: response.beneficiariesManagementByDoctorData,beneficiariesManagementByDoctorPages:response.pages,beneficiariesManagementByDoctorTotalCount:response.totalCount,beneficiariesManagementByDoctorFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementByDoctorLoading: false });
          self.generateBeneficiariesManagementByDoctorXLSX();
      });
        
  }

  getBeneficiariesManagementByLocationData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByLocationLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByLocationData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementByLocationData: response.beneficiariesManagementByLocationData,beneficiariesManagementByLocationPages:response.pages,beneficiariesManagementByLocationTotalCount:response.totalCount,beneficiariesManagementByLocationFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementByLocationLoading: false });
          self.generateBeneficiariesManagementByLocationXLSX();
      });
        
  }

  getBeneficiariesManagementByClinicData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByClinicLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByClinicData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementByClinicData: response.beneficiariesManagementByClinicData,beneficiariesManagementByClinicPages:response.pages,beneficiariesManagementByClinicTotalCount:response.totalCount,beneficiariesManagementByClinicFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementByClinicLoading: false });
          self.generateBeneficiariesManagementByClinicXLSX();
      });
        
  }

  getBeneficiariesManagementExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('medicareId', self.state.beneficiariesManagementSelectedMedicareId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementExpandData: response.beneficiariesManagementExpandData,beneficiariesManagementExpandPages:response.pages,beneficiariesManagementExpandTotalCount:response.totalCount,beneficiariesManagementExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementExpandLoading: false });
          self.generateBeneficiariesManagementExpandXLSX();
      });
        
  }

   getBeneficiariesManagementByDoctorExpandData(pageSize,page,sortedArr,filteredArr) {
      self.setState({ beneficiariesManagementByDoctorExpandLoading: true });
      const formData = new FormData();

      formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
      formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
      formData.append('pcpId', self.state.beneficiariesManagementSelectedPcpId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorExpandData', {
          method: 'POST',
          body: formData 
        }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {
          self.setState({beneficiariesManagementByDoctorExpandData: response.beneficiariesManagementByDoctorExpandData,beneficiariesManagementByDoctorExpandPages:response.pages,beneficiariesManagementByDoctorExpandTotalCount:response.totalCount,beneficiariesManagementByDoctorExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementByDoctorExpandLoading: false });
          self.generateBeneficiariesManagementByDoctorExpandXLSX();
      });
        
  }
  
  getBeneficiariesManagementByClinicExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByClinicExpandLoading: true });
    const formData = new FormData();

    formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
    formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
    formData.append('clinicName', self.state.beneficiariesManagementSelectedClinicName);
    formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
    formData.append('pageSize', pageSize);
    formData.append('page', page);
    formData.append('sortedColumns', sortedArr);
    formData.append('filteredColumns', filteredArr);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicExpandData', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response) {
        self.setState({beneficiariesManagementByClinicExpandData: response.beneficiariesManagementByClinicExpandData,beneficiariesManagementByClinicExpandPages:response.pages,beneficiariesManagementByClinicExpandTotalCount:response.totalCount,beneficiariesManagementByClinicExpandFileQuery:response.fileQuery});
        //console.log(response);
        self.setState({ beneficiariesManagementByClinicExpandLoading: false });
        self.generateBeneficiariesManagementByClinicExpandXLSX();
    });
      
}


  getBeneficiariesManagementByLocationExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByLocationExpandLoading: true });
    const formData = new FormData();

    formData.append('year', self.state.beneficiariesManagementYearSelectValue.value);
    formData.append('provider', self.state.beneficiariesManagementProviderSelectValue.value);
    formData.append('pcpLocation', self.state.beneficiariesManagementSelectedPcpLocation);
    formData.append('pcpName', self.state.beneficiariesManagementPcpNameValue.value);
    formData.append('pageSize', pageSize);
    formData.append('page', page);
    formData.append('sortedColumns', sortedArr);
    formData.append('filteredColumns', filteredArr);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationExpandData', {
        method: 'POST',
        body: formData 
      }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response) {
        self.setState({beneficiariesManagementByLocationExpandData: response.beneficiariesManagementByLocationExpandData,beneficiariesManagementByLocationExpandPages:response.pages,beneficiariesManagementByLocationExpandTotalCount:response.totalCount,beneficiariesManagementByLocationExpandFileQuery:response.fileQuery});
        //console.log(response);
        self.setState({ beneficiariesManagementByLocationExpandLoading: false });
        self.generateBeneficiariesManagementByLocationExpandXLSX();
    });
      
}

  setDuplicateClaimsYearValue(e) {
    self.state.duplicateClaimsYearSelectValue = e;
    self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
  }

  setAdmissionsReportYearValue(e) {
    self.state.admissionsReportYearSelectValue = e;
    self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
  }

  setSpecialistComparisonReportYearValue(e) {
    self.state.specialistComparisonReportYearSelectValue = e;
    self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));
  }

  setPatientVisitReportYearValue(e) {
    self.state.patientVisitReportYearSelectValue = e;
    self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
  }

  setSummaryReportYearValue(e) {
    self.state.summaryReportYearSelectValue = e;
    self.getSummaryReportData(self.state.summaryGridPageSize, 1, JSON.stringify(self.state.summaryGridSorted),JSON.stringify(self.state.summaryGridFiltered));
  }

  setSummaryReportsProviderValue(e) {
    self.state.summaryReportsProviderSelectValue = e;
    self.getSummaryReportData(self.state.summaryGridPageSize, 1, JSON.stringify(self.state.summaryGridSorted),JSON.stringify(self.state.summaryGridFiltered));
  }

  setSettledMonthsYearValue(e) {
    self.state.settledMonthsYearSelectValue = e;
    self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted),JSON.stringify(self.state.settledMonthsGridFiltered));
  }

  setSettledMonthsProviderValue(e) {
    self.state.settledMonthsProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.settledMonthsProviderSelectValue.value);
    setTimeout(function(){
      self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted),JSON.stringify(self.state.settledMonthsGridFiltered));
    }, 1000);
  }

  setDuplicateClaimsProviderValue(e) {
    self.state.duplicateClaimsProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.duplicateClaimsProviderSelectValue.value);
    setTimeout(function(){
      self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
    }, 1000);
  }

  setAdmissionsReportProviderValue(e) {
    self.state.admissionsReportProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.admissionsReportProviderSelectValue.value);
    setTimeout(function(){
      self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
    }, 1000);
  }

  setSpecialistComparisonProviderValue(e) {
    self.state.specialistComparisonProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.specialistComparisonProviderSelectValue.value);
    setTimeout(function(){
      self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));
    }, 1000);
  }

  setPatientVisitProviderValue(e) {
    self.state.patientVisitProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.patientVisitProviderSelectValue.value);
    setTimeout(function(){
     self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
    }, 1000);
  }

  setReinsuranceManagementYearValue(e) {
    self.state.reinsuranceManagementYearSelectValue = e;
    console.log(e);
    self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
  }

  setReinsuranceCostReportYearValue(e) {
    self.state.reinsuranceCostReportYearSelectValue = e;
    self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
  }
  setPmpmByPracticeYearValue(e) {
    self.state.pmpmByPracticeYearSelectValue = e;
    self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
  }

  
  setReinsuranceManagementProviderValue(e) {
    self.state.reinsuranceManagementProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.reinsuranceManagementProviderSelectValue.value);
    setTimeout(function(){
      self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
    }, 1000);
  }

  setReinsuranceCostReportProviderValue(e) {
    self.state.reinsuranceCostReportProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.reinsuranceCostReportProviderSelectValue.value);
    setTimeout(function(){
      self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
    }, 1000);
  }

  setPmpmByPracticeProviderValue(e) {
    self.state.pmpmByPracticeProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.pmpmByPracticeProviderSelectValue.value);
    setTimeout(function(){
      self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
    }, 1000);
  }

  setBeneficiariesManagementProviderValue(e) {
    self.state.beneficiariesManagementProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.beneficiariesManagementProviderSelectValue.value);
    if(self.state.activeTab == '1') {
      setTimeout(function(){
        self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
      }, 1000);
    }
    if(self.state.activeTab == '2') {
      setTimeout(function(){
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
      }, 1000);
    }
    if(self.state.activeTab == '3') {
        setTimeout(function(){
          self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
        }, 1000);
    }
    
    if(self.state.activeTab == '4') {
      setTimeout(function(){
          self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
        }, 1000);
    }
  }

  setBeneficiariesManagementYearValue(e) {
    self.state.beneficiariesManagementYearSelectValue = e;
    if(self.state.activeTab == '1') {
      self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
    }
    if(self.state.activeTab == '2') {
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
    }
    if(self.state.activeTab == '3') {
      self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    }
    if(self.state.activeTab == '4') {
      self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
    }
  }

  setMembershipManagementProviderValue(e) {
    self.state.membershipManagementProviderSelectValue = e;
    self.getMembershipManagementData();
  }

  getMembershipManagementData() {
    const formData = new FormData();
      formData.append('provider', self.state.claimTotalsProviderSelect.value);
      formData.append('pcpName', self.state.optionSelectValue.value);
      formData.append('location', JSON.stringify(self.state.locationSelectValue));

      fetch(config.serverUrl+'/getMembershipManagementData', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {
            self.setState({currentPatients: response.currentPatients,
                            newPatients:response.newPatients,
                            termedPatients:response.termedPatients,
                            netImpact:response.netImpact,
                            currentPatientsPercent:response.currentPatientsPercent,
                            newPatientsPercent:response.newPatientsPercent,
                            termedPatientsPercent:response.termedPatientsPercent});
      }).catch((error) => {
        console.log(error);
      });
  }

  setMonthlyReportsYearValue(e) {
    self.state.monthlyReportsYearsSelectValue = e;
    var param = "";
    if(document.getElementById('monthly').checked) {
      param = "monthly";
    }
    if(document.getElementById('quarterly').checked) {
      param = "quarterly";
    }
    if(document.getElementById('annual').checked) {
      param = "annual";
    }
    self.getMonthlyTotalsReport(param);
  }

  setMonthlyReportsProviderValue(e) {
    self.state.monthlyReportsProviderSelectValue = e;
    var param = "";
    if(document.getElementById('monthly').checked) {
      param = "monthly";
    }
    if(document.getElementById('quarterly').checked) {
      param = "quarterly";
    }
    if(document.getElementById('annual').checked) {
      param = "annual";
    }
    self.getMonthlyTotalsReport(param);
  }

  showHideColumn_duplicate(columnName) {
    
      if(columnName == "subscriberId") {
        this.state.showSubscriberId_duplicate = !this.state.showSubscriberId_duplicate;
      }
      if(columnName == "planName") {
        this.state.showPlanName_duplicate = !this.state.showPlanName_duplicate;
      }
      if(columnName == "patientName") {
        this.state.showPatientName_duplicate = !this.state.showPatientName_duplicate;
      }
      if(columnName == "pcp") {
        this.state.showPcp_duplicate = !this.state.showPcp_duplicate;
      }
      if(columnName == "eligibleMonth") {
        this.state.showEligibleMonth_duplicate = !this.state.showEligibleMonth_duplicate;
      }
      if(columnName == "termedMonth") {
        this.state.showTermedMonth_duplicate = !this.state.showTermedMonth_duplicate;
      }
      if(columnName == "claimDate") {
        this.state.showClaimDate_duplicate = !this.state.showClaimDate_duplicate;
      }
      if(columnName == "duplicativeCost") {
        this.state.showDuplicativeCost_duplicate = !this.state.showDuplicativeCost_duplicate;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 0 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

       if(self.state.showSubscriberId_duplicate) {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPlanName_duplicate) {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPatientName_duplicate) {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPcp_duplicate) {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth_duplicate) {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTermedMonth_duplicate) {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showClaimDate_duplicate) {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showDuplicativeCost_duplicate) {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "#20a8d8";
        }   

        self.generateDuplicateClaimsXLSX();

   }

   showHideColumn_admissions(columnName) {
    
      if(columnName == "patientName") {
        this.state.showPatientName_admissions = !this.state.showPatientName_admissions;
      }
      if(columnName == "subscriberId") {
        this.state.showSubscriberId_admissions = !this.state.showSubscriberId_admissions;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_admissions = !this.state.showPcpName_admissions;
      }
      if(columnName == "eligibleMonth") {
        this.state.showEligibleMonth_admissions = !this.state.showEligibleMonth_admissions;
      }
      if(columnName == "totalNoOfAdmissions") {
        this.state.showTotalNoOfAdmissions_admissions = !this.state.showTotalNoOfAdmissions_admissions;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_admissions = !this.state.showTotalCost_admissions;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 1 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

      if(self.state.showPatientName_admissions) {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showSubscriberId_admissions) {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPcpName_admissions) {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth_admissions) {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTotalNoOfAdmissions_admissions) {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTotalCost_admissions) {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "#20a8d8";
        }

        self.generateAdmissionsReportXLSX();

   }

   showHideColumn_admissionsExpand(columnName) {
    
      if(columnName == "claimId") {
        this.state.showClaimId_admissionsExpand = !this.state.showClaimId_admissionsExpand;
      }
      if(columnName == "claimDate") {
        this.state.showClaimDate_admissionsExpand = !this.state.showClaimDate_admissionsExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_admissionsExpand = !this.state.showClaimType_admissionsExpand;
      }
      if(columnName == "clinicName") {
        this.state.showClinicName_admissionsExpand = !this.state.showClinicName_admissionsExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_admissionsExpand = !this.state.showPcpName_admissionsExpand;
      }
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_admissionsExpand = !this.state.showIcdCodes_admissionsExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_admissionsExpand = !this.state.showHccCodes_admissionsExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_admissionsExpand = !this.state.showDrgCode_admissionsExpand;
      }
      if(columnName == "betosCat") {
        this.state.showBetosCat_admissionsExpand = !this.state.showBetosCat_admissionsExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_admissionsExpand = !this.state.showCost_admissionsExpand;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 2 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

      if(self.state.showClaimId_admissionsExpand) {
            document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClaimDate_admissionsExpand) {
            document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClaimType_admissionsExpand) {
            document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showClinicName_admissionsExpand) {
            document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_admissionsExpand) {
            document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIcdCodes_admissionsExpand) {
            document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHccCodes_admissionsExpand) {
            document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDrgCode_admissionsExpand) {
            document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showBetosCat_admissionsExpand) {
            document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCost_admissionsExpand) {
            document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "#20a8d8";
          }

          self.generateAdmissionsReportExpandXLSX();

   }

   showHideColumn_duplicateClaimsExpand(columnName) {
    
      if(columnName == "claimId") {
        this.state.showClaimId_duplicateClaimsExpand = !this.state.showClaimId_duplicateClaimsExpand;
      }
      if(columnName == "claimDate") {
        this.state.showClaimDate_duplicateClaimsExpand = !this.state.showClaimDate_duplicateClaimsExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_duplicateClaimsExpand = !this.state.showClaimType_duplicateClaimsExpand;
      }
      if(columnName == "clinicName") {
        this.state.showClinicName_duplicateClaimsExpand = !this.state.showClinicName_duplicateClaimsExpand;
      }
      if(columnName == "providerName") {
        this.state.showProviderName_duplicateClaimsExpand = !this.state.showProviderName_duplicateClaimsExpand;
      }
      if(columnName == "betosCat") {
        this.state.showBetosCat_duplicateClaimsExpand = !this.state.showBetosCat_duplicateClaimsExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_duplicateClaimsExpand = !this.state.showDrgCode_duplicateClaimsExpand;
      }
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_duplicateClaimsExpand = !this.state.showIcdCodes_duplicateClaimsExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_duplicateClaimsExpand = !this.state.showHccCodes_duplicateClaimsExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_duplicateClaimsExpand = !this.state.showCost_duplicateClaimsExpand;
      }

        const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 14 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              /*if(self.state.showClaimId_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }*/
              if(self.state.showClaimDate_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_duplicateClaimsExpand) {
                document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_duplicateClaimsExpand) {
                document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showProviderName_duplicateClaimsExpand) {
                document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_duplicateClaimsExpand) {
                document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_duplicateClaimsExpand) {
                document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_duplicateClaimsExpand) {
                document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_duplicateClaimsExpand) {
                document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_duplicateClaimsExpand) {
                document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "#20a8d8";
              }

              self.generateDuplicateClaimsExpandXLSX();
   }

   showHideColumn_specialistComparison(columnName) {
    
      if(columnName == "specialityCode") {
        this.state.showSpecialityCode_specialistComparison = !this.state.showSpecialityCode_specialistComparison;
      }
      if(columnName == "numberOfClaims") {
        this.state.showNoOfClaims_specialistComparison = !this.state.showNoOfClaims_specialistComparison;
      }
      if(columnName == "numberOfPcp") {
        this.state.showNoOfPcp_specialistComparison = !this.state.showNoOfPcp_specialistComparison;
      }
      if(columnName == "numberOfBeneficiaries") {
        this.state.showNoOfBeneficiaries_specialistComparison = !this.state.showNoOfBeneficiaries_specialistComparison;
      }
      if(columnName == "costPerClaim") {
        this.state.showCostPerClaim_specialistComparison = !this.state.showCostPerClaim_specialistComparison;
      }
      if(columnName == "costPerBeneficiary") {
        this.state.showCostPerBeneficiary_specialistComparison = !this.state.showCostPerBeneficiary_specialistComparison;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_specialistComparison = !this.state.showTotalCost_specialistComparison;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 3 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

          if(self.state.showSpecialityCode_specialistComparison) {
            document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfClaims_specialistComparison) {
            document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfPcp_specialistComparison) {
            document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfBeneficiaries_specialistComparison) {
            document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCostPerClaim_specialistComparison) {
            document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCostPerBeneficiary_specialistComparison) {
            document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalCost_specialistComparison) {
            document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "#20a8d8";
          }

          self.generateSpecialistComparisonReportXLSX();

   }

   showHideColumn_specialistComparisonExpand(columnName) {
    
      if(columnName == "specialityType") {
        this.state.showSpecialityType_specialistComparisonExpand = !this.state.showSpecialityType_specialistComparisonExpand;
      }
      if(columnName == "numberOfClaims") {
        this.state.showNoOfClaims_specialistComparisonExpand = !this.state.showNoOfClaims_specialistComparisonExpand;
      }
      if(columnName == "averageCostPerClaim") {
        this.state.showAverageCostPerClaim_specialistComparisonExpand = !this.state.showAverageCostPerClaim_specialistComparisonExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_specialistComparisonExpand = !this.state.showCost_specialistComparisonExpand;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 15 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

          if(self.state.showSpecialityType_specialistComparisonExpand) {
            document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showNoOfClaims_specialistComparisonExpand) {
            document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showAverageCostPerClaim_specialistComparisonExpand) {
            document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showCost_specialistComparisonExpand) {
            document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "#20a8d8";
          }

          self.generateSpecialistComparisonExpandReportXLSX();

   }

   showHideColumn_patientVisit(columnName) {
    
      if(columnName == "patientName") {
        this.state.showPatientName_patientVisit = !this.state.showPatientName_patientVisit;
      }
      if(columnName == "hicn") {
        this.state.showHicn_patientVisit = !this.state.showHicn_patientVisit;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_patientVisit = !this.state.showPcpName_patientVisit;
      }
      if(columnName == "termedMonth") {
        this.state.showTermedMonth_patientVisit = !this.state.showTermedMonth_patientVisit;
      }
      if(columnName == "ipaEffectiveDate") {
        this.state.showIpaEffectiveDate_patientVisit = !this.state.showIpaEffectiveDate_patientVisit;
      }
      if(columnName == "totalErVisits") {
        this.state.showTotalErVisits_patientVisit = !this.state.showTotalErVisits_patientVisit;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_patientVisit = !this.state.showTotalCost_patientVisit;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 4 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

          if(self.state.showPatientName_patientVisit) {
            document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHicn_patientVisit) {
            document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_patientVisit) {
            document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTermedMonth_patientVisit) {
            document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIpaEffectiveDate_patientVisit) {
            document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalErVisits_patientVisit) {
            document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalCost_patientVisit) {
            document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "#20a8d8";
          }

          self.generatePatientVisitReportXLSX();

   }

   showHideColumn_patientVisitExpand(columnName) {
    
      if(columnName == "claimDate") {
        this.state.showClaimDate_patientVisitExpand = !this.state.showClaimDate_patientVisitExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_patientVisitExpand = !this.state.showClaimType_patientVisitExpand;
      }
      if(columnName == "clinicName") {
        this.state.showClinicName_patientVisitExpand = !this.state.showClinicName_patientVisitExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_patientVisitExpand = !this.state.showPcpName_patientVisitExpand;
      }
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_patientVisitExpand = !this.state.showIcdCodes_patientVisitExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_patientVisitExpand = !this.state.showHccCodes_patientVisitExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_patientVisitExpand = !this.state.showDrgCode_patientVisitExpand;
      }
      if(columnName == "betosCat") {
        this.state.showBetosCat_patientVisitExpand = !this.state.showBetosCat_patientVisitExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_patientVisitExpand = !this.state.showCost_patientVisitExpand;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 11 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showClaimDate_patientVisitExpand) {
                document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_patientVisitExpand) {
                document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_patientVisitExpand) {
                document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_patientVisitExpand) {
                document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_patientVisitExpand) {
                document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_patientVisitExpand) {
                document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_patientVisitExpand) {
                document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_patientVisitExpand) {
                document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_patientVisitExpand) {
                document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "#20a8d8";
              }

              self.generatePatientVisitExpandReportXLSX();

   }

   showHideColumn_settledMonths(columnName) {
    
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_settledMonths = !this.state.showPcpLocation_settledMonths;
      }
      if(columnName == "month") {
        this.state.showMonth_settledMonths = !this.state.showMonth_settledMonths;
      }
      if(columnName == "membership") {
        this.state.showMembership_settledMonths = !this.state.showMembership_settledMonths;
      }
      if(columnName == "ipaPremium") {
        this.state.showIpaPremium_settledMonths = !this.state.showIpaPremium_settledMonths;
      }
      if(columnName == "totalExpenses") {
        this.state.showTotalExpenses_settledMonths = !this.state.showTotalExpenses_settledMonths;
      }
      if(columnName == "stoploss") {
        this.state.showStopLoss_settledMonths = !this.state.showStopLoss_settledMonths;
      }
      if(columnName == "netPremium") {
        this.state.showNetPremium_settledMonths = !this.state.showNetPremium_settledMonths;
      }
      if(columnName == "riskSharing") {
        this.state.showRiskSharing_settledMonths = !this.state.showRiskSharing_settledMonths;
      }
      if(columnName == "surplusDeficit") {
        this.state.showSurplusDeficit_settledMonths = !this.state.showSurplusDeficit_settledMonths;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 6 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPcpLocation_settledMonths) {
                document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "#20a8d8";
              } 
              if(self.state.showMonth_settledMonths) {
                document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "#20a8d8";
              } 
              if(self.state.showMembership_settledMonths) {
                document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaPremium_settledMonths) {
                document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalExpenses_settledMonths) {
                document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showStopLoss_settledMonths) {
                document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showNetPremium_settledMonths) {
                document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showRiskSharing_settledMonths) {
                document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showSurplusDeficit_settledMonths) {
                document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "#20a8d8";
              }

              self.generateSettledMonthsXLSX();

   }

   showHideColumn_settledMonthsExpand(columnName) {
    
      if(columnName == "patientName") {
        this.state.showPatientName_settledMonthsExpand = !this.state.showPatientName_settledMonthsExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_settledMonthsExpand = !this.state.showPcpName_settledMonthsExpand;
      }
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_settledMonthsExpand = !this.state.showPcpLocation_settledMonthsExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_settledMonthsExpand = !this.state.showCost_settledMonthsExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_settledMonthsExpand = !this.state.showClaimType_settledMonthsExpand;
      }
      if(columnName == "mra") {
        this.state.showMra_settledMonthsExpand = !this.state.showMra_settledMonthsExpand;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 7 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPatientName_settledMonthsExpand) {
                document.getElementById("ddItemPatientName_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_settledMonthsExpand) {
                document.getElementById("ddItemPcpName_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_settledMonthsExpand) {
                document.getElementById("ddItemPcpLocation_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_settledMonthsExpand) {
                document.getElementById("ddItemCost_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_settledMonthsExpand) {
                document.getElementById("ddItemClaimType_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_settledMonthsExpand) {
                document.getElementById("ddItemMra_settledMonthsExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_settledMonthsExpand").style.backgroundColor = "#20a8d8";
              }

              self.generateSettledMonthsExpandXLSX();

   }

   
   showHideColumn_reinsuranceManagement(columnName) {
    
    if(columnName == "subscriberID") {
      this.state.showSubscriberID_reinsuranceManagement = !this.state.showSubscriberID_reinsuranceManagement;
    }
    if(columnName == "planName") {
      this.state.showPlanName_reinsuranceManagement = !this.state.showPlanName_reinsuranceManagement;
    }
    if(columnName == "PatientName") {
      this.state.showPatientName_reinsuranceManagement = !this.state.showPatientName_reinsuranceManagement;
    }
    if(columnName == "PcpName") {
      this.state.showPcpName_reinsuranceManagement = !this.state.showPcpName_reinsuranceManagement;
    }
    if(columnName == "termedMonth") {
      this.state.showTermedMonth_reinsuranceManagement = !this.state.showTermedMonth_reinsuranceManagement;
    }
    if(columnName == "instClaims") {
      this.state.showInstClaims_reinsuranceManagement = !this.state.showInstClaims_reinsuranceManagement;
    }
    if(columnName == "profClaims") {
      this.state.showProfClaims_reinsuranceManagement = !this.state.showProfClaims_reinsuranceManagement;
    }
    if(columnName == "totalCost") {
      this.state.showTotalCost_reinsuranceManagement = !this.state.showTotalCost_reinsuranceManagement;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 16 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showSubscriberID_reinsuranceManagement) {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPlanName_reinsuranceManagement) {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPatientName_reinsuranceManagement) {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPcpName_reinsuranceManagement) {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showTermedMonth_reinsuranceManagement) {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showInstClaims_reinsuranceManagement) {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showProfClaims_reinsuranceManagement) {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showTotalCost_reinsuranceManagement) {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "#20a8d8";
            }

            self.generateReinsuranceManagementXLSX();

 }



   showHideColumn_pmpmByPractice(columnName) {
    
      if(columnName == "facilityLocationName") {
        this.state.showFacilityLocationName_pmpmByPractice = !this.state.showFacilityLocationName_pmpmByPractice;
      }
      if(columnName == "providerName") {
        this.state.showProviderName_pmpmByPractice = !this.state.showProviderName_pmpmByPractice;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_pmpmByPractice = !this.state.showTotalCost_pmpmByPractice;
      }
      if(columnName == "totalNumberOfMemberMonth") {
        this.state.showTotalNumberOfMemberMonth_pmpmByPractice = !this.state.showTotalNumberOfMemberMonth_pmpmByPractice;
      }
      if(columnName == "pmpm") {
        this.state.showPMPM_pmpmByPractice = !this.state.showPMPM_pmpmByPractice;
      }
      if(columnName == "pmpy") {
        this.state.showPMPY_pmpmByPractice = !this.state.showPMPY_pmpmByPractice;
      }
      if(columnName == "totalPremium") {
        this.state.showTotalPremium_pmpmByPractice = !this.state.showTotalPremium_pmpmByPractice;
      }
      if(columnName == "ipaPremium") {
        this.state.showIpaPremium_pmpmByPractice = !this.state.showIpaPremium_pmpmByPractice;
      }
      if(columnName == "difference") {
        this.state.showDifference_pmpmByPractice = !this.state.showDifference_pmpmByPractice;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 8 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showFacilityLocationName_pmpmByPractice) {
                document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showProviderName_pmpmByPractice) {
                document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_pmpmByPractice) {
                document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice) {
                document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPMPM_pmpmByPractice) {
                document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPMPY_pmpmByPractice) {
                document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalPremium_pmpmByPractice) {
                document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaPremium_pmpmByPractice) {
                document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDifference_pmpmByPractice) {
                document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "#20a8d8";
              }

              self.generatePmpmByPracticeXLSX();

   }

   showHideColumn_pmpmByPracticeExpand(columnName) {
    
      if(columnName == "patientName") {
        this.state.showPatientName_pmpmByPracticeExpand = !this.state.showPatientName_pmpmByPracticeExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_pmpmByPracticeExpand = !this.state.showPcpName_pmpmByPracticeExpand;
      }
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_pmpmByPracticeExpand = !this.state.showPcpLocation_pmpmByPracticeExpand;
      }
      if(columnName == "mra") {
        this.state.showMra_pmpmByPracticeExpand = !this.state.showMra_pmpmByPracticeExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_pmpmByPracticeExpand = !this.state.showCost_pmpmByPracticeExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_pmpmByPracticeExpand = !this.state.showClaimType_pmpmByPracticeExpand;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 10 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPatientName_pmpmByPracticeExpand) {
                document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_pmpmByPracticeExpand) {
                document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_pmpmByPracticeExpand) {
                document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_pmpmByPracticeExpand) {
                document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_pmpmByPracticeExpand) {
                document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_pmpmByPracticeExpand) {
                document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "#20a8d8";
              }

              self.generatePmpmByPracticeExpandXLSX();

   }

   showHideColumn_membershipManagement(columnName) {
    
      if(columnName == "planName") {
        this.state.showPlanName_membershipManagement = !this.state.showPlanName_membershipManagement;
      }
      if(columnName == "medicareId") {
        this.state.showMedicareId_membershipManagement = !this.state.showMedicareId_membershipManagement;
      }
      if(columnName == "insuranceId") {
        this.state.showInsuranceId_membershipManagement = !this.state.showInsuranceId_membershipManagement;
      }
      if(columnName == "patientName") {
        this.state.showPatientName_membershipManagement = !this.state.showPatientName_membershipManagement;
      }
      if(columnName == "patientDob") {
        this.state.showPatientDob_membershipManagement = !this.state.showPatientDob_membershipManagement;
      }
      if(columnName == "assignedPcp") {
        this.state.showAssignedPcp_membershipManagement = !this.state.showAssignedPcp_membershipManagement;
      }
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_membershipManagement = !this.state.showPcpLocation_membershipManagement;
      }
      if(columnName == "ipaEffectiveDate") {
        this.state.showIpaEffectiveDate_membershipManagement = !this.state.showIpaEffectiveDate_membershipManagement;
      }
      if(columnName == "mra") {
        this.state.showMra_membershipManagement = !this.state.showMra_membershipManagement;
      }
      if(columnName == "totalPatientCost") {
        this.state.showTotalPatientCost_membershipManagement = !this.state.showTotalPatientCost_membershipManagement;
      }
      

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 9 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPlanName_membershipManagement) {
                document.getElementById("ddItemPlanName_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPlanName_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMedicareId_membershipManagement) {
                document.getElementById("ddItemMedicareId_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMedicareId_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showInsuranceId_membershipManagement) {
                document.getElementById("ddItemInsuranceId_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemInsuranceId_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientName_membershipManagement) {
                document.getElementById("ddItemPatientName_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientDob_membershipManagement) {
                document.getElementById("ddItemPatientDob_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientDob_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAssignedPcp_membershipManagement) {
                document.getElementById("ddItemAssignedPcp_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAssignedPcp_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_membershipManagement) {
                document.getElementById("ddItemPcpLocation_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIpaEffectiveDate_membershipManagement) {
                document.getElementById("ddItemIpaEffectiveDate_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIpaEffectiveDate_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_membershipManagement) {
                document.getElementById("ddItemMra_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalPatientCost_membershipManagement) {
                document.getElementById("ddItemTotalPatientCost_membershipManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalPatientCost_membershipManagement").style.backgroundColor = "#20a8d8";
              }
              
              self.generateMembershipManagementXLSX();
   }

showHideColumn_beneficiariesManagementByLocation(columnName){
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_beneficiariesManagementByLocation = !this.state.showPcpLocation_beneficiariesManagementByLocation;
    }
    if(columnName == "mra") {
      this.state.showMra_beneficiariesManagementByLocation = !this.state.showMra_beneficiariesManagementByLocation;
    }
    if(columnName == "totalCost") {
      this.state.showTotalCost_beneficiariesManagementByLocation = !this.state.showTotalCost_beneficiariesManagementByLocation;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 19 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

    if(self.state.showPcpLocation_beneficiariesManagementByLocation) {
      document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
    }
    if(self.state.showMra_beneficiariesManagementByLocation) {
      document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
    }
    if(self.state.showTotalCost_beneficiariesManagementByLocation) {
      document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "#20a8d8";
    }
    self.generateBeneficiariesManagementByLocationXLSX();
   }

   showHideColumn_beneficiariesManagementByClinic(columnName) {

      if(columnName == "clinicName") {
        this.state.showClinicName_beneficiariesManagementByClinic = !this.state.showClinicName_beneficiariesManagementByClinic;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_beneficiariesManagementByClinic = !this.state.showTotalCost_beneficiariesManagementByClinic;
      }
      
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 21 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

      if(self.state.showClinicName_beneficiariesManagementByClinic) {
        document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "#20a8d8";
      }
      if(self.state.showTotalCost_beneficiariesManagementByClinic) {
        document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "#20a8d8";
      }
      self.generateBeneficiariesManagementByClinicXLSX();

   }

   showHideColumn_beneficiariesManagement(columnName) {
    
      if(columnName == "planName") {
        this.state.showPlanName_beneficiariesManagement = !this.state.showPlanName_beneficiariesManagement;
      }
      if(columnName == "hicn") {
        this.state.showHicn_beneficiariesManagement = !this.state.showHicn_beneficiariesManagement;
      }
      if(columnName == "patientName") {
        this.state.showPatientName_beneficiariesManagement = !this.state.showPatientName_beneficiariesManagement;
      }
      if(columnName == "dob") {
        this.state.showDob_beneficiariesManagement = !this.state.showDob_beneficiariesManagement;
      }
      if(columnName == "eligibleMonth") {
        this.state.showEligibleMonth_beneficiariesManagement = !this.state.showEligibleMonth_beneficiariesManagement;
      }
      if(columnName == "termedMonth") {
        this.state.showTermedMonth_beneficiariesManagement = !this.state.showTermedMonth_beneficiariesManagement;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_beneficiariesManagement = !this.state.showPcpName_beneficiariesManagement;
      }
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_beneficiariesManagement = !this.state.showPcpLocation_beneficiariesManagement;
      }
      if(columnName == "mra") {
        this.state.showMra_beneficiariesManagement = !this.state.showMra_beneficiariesManagement;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_beneficiariesManagement = !this.state.showTotalCost_beneficiariesManagement;
      }
      if(columnName == "address") {
        this.state.showAddress_beneficiariesManagement = !this.state.showAddress_beneficiariesManagement;
      }
      if(columnName == "recentAppointmentDate") {
        this.state.showRecentAppointmentDate_beneficiariesManagement = !this.state.showRecentAppointmentDate_beneficiariesManagement;
      }
      if(columnName == "nextAppointmentDate") {
        this.state.showNextAppointmentDate_beneficiariesManagement = !this.state.showNextAppointmentDate_beneficiariesManagement;
      }
      if(columnName == "facilityLocation") {
        this.state.showFacilityLocation_beneficiariesManagement = !this.state.showFacilityLocation_beneficiariesManagement;
      }
      if(columnName == "phoneNumber") {
        this.state.showPhoneNumber_beneficiariesManagement = !this.state.showPhoneNumber_beneficiariesManagement;
      }
      if(columnName == "lastClaimsDate") {
        this.state.showLastClaimsDate_beneficiariesManagement = !this.state.showLastClaimsDate_beneficiariesManagement;
      }
      if(columnName == "icdCode") {
        this.state.showIcdCode_beneficiariesManagement = !this.state.showIcdCode_beneficiariesManagement;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 12 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPlanName_beneficiariesManagement) {
                document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHicn_beneficiariesManagement) {
                document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPatientName_beneficiariesManagement) {
                document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDob_beneficiariesManagement) {
                document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showEligibleMonth_beneficiariesManagement) {
                document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTermedMonth_beneficiariesManagement) {
                document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagement) {
                document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_beneficiariesManagement) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showMra_beneficiariesManagement) {
                document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagement) {
                document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAddress_beneficiariesManagement) {
                document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showRecentAppointmentDate_beneficiariesManagement) {
                document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showNextAppointmentDate_beneficiariesManagement) {
                document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showFacilityLocation_beneficiariesManagement) {
                document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPhoneNumber_beneficiariesManagement) {
                document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showLastClaimsDate_beneficiariesManagement) {
                document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCode_beneficiariesManagement) {
                document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "#20a8d8";
              }

              self.generateBeneficiariesManagementXLSX();

   }

   showHideColumn_beneficiariesManagementExpand(columnName) {
    
      if(columnName == "claimId") {
        this.state.showClaimId_beneficiariesManagementExpand = !this.state.showClaimId_beneficiariesManagementExpand;
      }
      if(columnName == "claimDate") {
        this.state.showClaimDate_beneficiariesManagementExpand = !this.state.showClaimDate_beneficiariesManagementExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_beneficiariesManagementExpand = !this.state.showClaimType_beneficiariesManagementExpand;
      }
      if(columnName == "clinicName") {
        this.state.showClinicName_beneficiariesManagementExpand = !this.state.showClinicName_beneficiariesManagementExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_beneficiariesManagementExpand = !this.state.showPcpName_beneficiariesManagementExpand;
      }
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_beneficiariesManagementExpand = !this.state.showIcdCodes_beneficiariesManagementExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_beneficiariesManagementExpand = !this.state.showHccCodes_beneficiariesManagementExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_beneficiariesManagementExpand = !this.state.showDrgCode_beneficiariesManagementExpand;
      }
      if(columnName == "betosCat") {
        this.state.showBetosCat_beneficiariesManagementExpand = !this.state.showBetosCat_beneficiariesManagementExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_beneficiariesManagementExpand = !this.state.showCost_beneficiariesManagementExpand;
      }
      
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 13 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showClaimId_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagementExpand) {
                document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              
              self.generateBeneficiariesManagementExpandXLSX();

   }

   showHideColumn_beneficiariesManagementByDoctorExpand(columnName) {
    
      if(columnName == "claimId") {
        this.state.showClaimId_beneficiariesManagementByDoctorExpand = !this.state.showClaimId_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "claimDate") {
        this.state.showClaimDate_beneficiariesManagementByDoctorExpand = !this.state.showClaimDate_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "claimType") {
        this.state.showClaimType_beneficiariesManagementByDoctorExpand = !this.state.showClaimType_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "clinicName") {
        this.state.showClinicName_beneficiariesManagementByDoctorExpand = !this.state.showClinicName_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "pcpName") {
        this.state.showPcpName_beneficiariesManagementByDoctorExpand = !this.state.showPcpName_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_beneficiariesManagementByDoctorExpand = !this.state.showIcdCodes_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_beneficiariesManagementByDoctorExpand = !this.state.showHccCodes_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_beneficiariesManagementByDoctorExpand = !this.state.showDrgCode_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "betosCat") {
        this.state.showBetosCat_beneficiariesManagementByDoctorExpand = !this.state.showBetosCat_beneficiariesManagementByDoctorExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_beneficiariesManagementByDoctorExpand = !this.state.showCost_beneficiariesManagementByDoctorExpand;
      }
      
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 18 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showClaimId_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClaimType_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showClinicName_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpName_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showCost_beneficiariesManagementByDoctorExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#20a8d8";
              }
              
              self.generateBeneficiariesManagementByDoctorExpandXLSX();

   }


   showHideColumn_beneficiariesManagementByClinicExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementByClinicExpand = !this.state.showClaimId_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementByClinicExpand = !this.state.showClaimDate_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementByClinicExpand = !this.state.showClaimType_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementByClinicExpand = !this.state.showClinicName_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_beneficiariesManagementByClinicExpand = !this.state.showPcpName_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementByClinicExpand = !this.state.showIcdCodes_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementByClinicExpand = !this.state.showHccCodes_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementByClinicExpand = !this.state.showDrgCode_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementByClinicExpand = !this.state.showBetosCat_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementByClinicExpand = !this.state.showCost_beneficiariesManagementByClinicExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 22 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClaimDate_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClaimType_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClinicName_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPcpName_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showHccCodes_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showDrgCode_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showBetosCat_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showCost_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "#20a8d8";
            }
            
            self.generateBeneficiariesManagementByClinicExpandXLSX();

 }


   
   showHideColumn_beneficiariesManagementByLocationExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementByLocationExpand = !this.state.showClaimId_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementByLocationExpand = !this.state.showClaimDate_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementByLocationExpand = !this.state.showClaimType_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementByLocationExpand = !this.state.showClinicName_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_beneficiariesManagementByLocationExpand = !this.state.showPcpLocation_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementByLocationExpand = !this.state.showIcdCodes_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementByLocationExpand = !this.state.showHccCodes_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementByLocationExpand = !this.state.showDrgCode_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementByLocationExpand = !this.state.showBetosCat_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementByLocationExpand = !this.state.showCost_beneficiariesManagementByLocationExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 20 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClaimDate_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClaimType_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showClinicName_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showHccCodes_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showDrgCode_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showBetosCat_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            if(self.state.showCost_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "#20a8d8";
            }
            
            self.generateBeneficiariesManagementByLocationExpandXLSX();

 }


   showHideColumn_beneficiariesManagementByDoctor(columnName) {
    
      if(columnName == "pcpName") {
        this.state.showPcpName_beneficiariesManagementByDoctor = !this.state.showPcpName_beneficiariesManagementByDoctor;
      }
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_beneficiariesManagementByDoctor = !this.state.showPcpLocation_beneficiariesManagementByDoctor;
      }
      if(columnName == "averageMra") {
        this.state.showAverageMra_beneficiariesManagementByDoctor = !this.state.showAverageMra_beneficiariesManagementByDoctor;
      }
      if(columnName == "totalCost") {
        this.state.showTotalCost_beneficiariesManagementByDoctor = !this.state.showTotalCost_beneficiariesManagementByDoctor;
      }
      
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 17 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

              if(self.state.showPcpName_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showPcpLocation_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showAverageMra_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              if(self.state.showTotalCost_beneficiariesManagementByDoctor) {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "#20a8d8";
              }
              
              self.generateBeneficiariesManagementByDoctorXLSX();

   }

   showHideColumn_summary(columnName) {
    
      if(columnName == "pcpLocation") {
        this.state.showPcpLocation_summary = !this.state.showPcpLocation_summary;
      }
      if(columnName == "month") {
        this.state.showMonth_summary = !this.state.showMonth_summary;
      }
      if(columnName == "members") {
        this.state.showMembers_summary = !this.state.showMembers_summary;
      }
      if(columnName == "maPremium") {
        this.state.showMaPremium_summary = !this.state.showMaPremium_summary;
      }
      if(columnName == "partDPremium") {
        this.state.showPartDPremium_summary = !this.state.showPartDPremium_summary;
      }
      if(columnName == "totalPremium") {
        this.state.showTotalPremium_summary = !this.state.showTotalPremium_summary;
      }
      if(columnName == "ipaPremium") {
        this.state.showIpaPremium_summary = !this.state.showIpaPremium_summary;
      }
      if(columnName == "pcpCap") {
        this.state.showPcpCap_summary = !this.state.showPcpCap_summary;
      }
      if(columnName == "specCost") {
        this.state.showSpecCost_summary = !this.state.showSpecCost_summary;
      }
      if(columnName == "profClaims") {
        this.state.showProfClaims_summary = !this.state.showProfClaims_summary;
      }
      if(columnName == "instClaims") {
        this.state.showInstClaims_summary = !this.state.showInstClaims_summary;
      }
      if(columnName == "rxClaims") {
        this.state.showRxClaims_summary = !this.state.showRxClaims_summary;
      }
      if(columnName == "ibnrDollars") {
        this.state.showIbnrDollars_summary = !this.state.showIbnrDollars_summary;
      }
      if(columnName == "reinsurancePremium") {
        this.state.showReinsurancePremium_summary = !this.state.showReinsurancePremium_summary;
      }
      if(columnName == "specCap") {
        this.state.showSpecCap_summary = !this.state.showSpecCap_summary;
      }
      if(columnName == "totalExpenses") {
        this.state.showTotalExpenses_summary = !this.state.showTotalExpenses_summary;
      }
      if(columnName == "reinsuranceRecovered") {
        this.state.showReinsuranceRecovered_summary = !this.state.showReinsuranceRecovered_summary;
      }
      if(columnName == "rxAdmin") {
        this.state.showRxAdmin_summary = !this.state.showRxAdmin_summary;
      }
      if(columnName == "silverSneakerUtilization") {
        this.state.showSilverSneakerUtilization_summary = !this.state.showSilverSneakerUtilization_summary;
      }
      if(columnName == "pba") {
        this.state.showPba_summary = !this.state.showPba_summary;
      }
      if(columnName == "humanaAtHome") {
        this.state.showHumanaAtHome_summary = !this.state.showHumanaAtHome_summary;
      }
      if(columnName == "dentalFFS") {
        this.state.showDentalFFS_summary = !this.state.showDentalFFS_summary;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 5 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

      if(self.state.showPcpLocation_summary) {
            document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMonth_summary) {
            document.getElementById("ddItemMonth_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMonth_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMembers_summary) {
            document.getElementById("ddItemMembers_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMembers_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showMaPremium_summary) {
            document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPartDPremium_summary) {
            document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalPremium_summary) {
            document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIpaPremium_summary) {
            document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpCap_summary) {
            document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSpecCost_summary) {
            document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showProfClaims_summary) {
            document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showInstClaims_summary) {
            document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showRxClaims_summary) {
            document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showIbnrDollars_summary) {
            document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showReinsurancePremium_summary) {
            document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSpecCap_summary) {
            document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalExpenses_summary) {
            document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showReinsuranceRecovered_summary) {
            document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showRxAdmin_summary) {
            document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showSilverSneakerUtilization_summary) {
            document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPba_summary) {
            document.getElementById("ddItemPba_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPba_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showHumanaAtHome_summary) {
            document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDentalFFS_summary) {
            document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "#20a8d8";
          }

          self.generateSummaryReportXLSX();

   }
 showHideColumn_ReinsuranceCostReportData(columnName) {
  if(columnName == "subscriberID") {
    this.state.showSubscriberID_reinsuranceCostReport = !this.state.showSubscriberID_reinsuranceCostReport;
  }
  if(columnName == "planName") {
    this.state.showPlanName_reinsuranceCostReport = !this.state.showPlanName_reinsuranceCostReport;
  }
  if(columnName == "patientFirstName") {
    this.state.showPatientFirstName_reinsuranceCostReport = !this.state.showPatientFirstName_reinsuranceCostReport;
  }
  
  if(columnName == "patientLastName") {
    this.state.showPatientLastName_reinsuranceCostReport = !this.state.showPatientLastName_reinsuranceCostReport;
  }
  
  if(columnName == "policyPeriod") {
    this.state.showPolicyPeriod_reinsuranceCostReport = !this.state.showPolicyPeriod_reinsuranceCostReport;
  }
  if(columnName == "pcpName") {
    this.state.showPcpName_reinsuranceCostReport = !this.state.showPcpName_reinsuranceCostReport;
  }
  if(columnName == "termedMonth") {
    this.state.showTermedMonth_reinsuranceCostReport = !this.state.showTermedMonth_reinsuranceCostReport;
  }
  if(columnName == "effectiveDate") {
    this.state.showEffectiveDate_reinsuranceCostReport = !this.state.showEffectiveDate_reinsuranceCostReport;
  }
  if(columnName == "dob") {
    this.state.showDateOfBirth_reinsuranceCostReport = !this.state.showDateOfBirth_reinsuranceCostReport;
  }
  
  if(columnName == "status") {
    this.state.showStatus_reinsuranceCostReport = !this.state.showStatus_reinsuranceCostReport;
  }
  if(columnName == "gender") {
    this.state.showGender_reinsuranceCostReport = !this.state.showGender_reinsuranceCostReport;
  }
  if(columnName == "totalClaimsCost") {
    this.state.showTotalClaimsCost_reinsuranceCostReport = !this.state.showTotalClaimsCost_reinsuranceCostReport;
  }

  const newArray = this.state.dropdownOpen.map((element, index) => {
    return (index === 24 ? true : false);
  });
  this.setState({
    dropdownOpen: newArray
  });

          if(self.state.showSubscriberID_reinsuranceCostReport) {
            document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPlanName_reinsuranceCostReport) {
            document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPatientFirstName_reinsuranceCostReport) {
            document.getElementById("ddItemPatientFirstName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientFirstName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          
          if(self.state.showPatientLastName_reinsuranceCostReport) {
            document.getElementById("ddItemPatientLastName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientLastName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showPcpName_reinsuranceCostReport) {
            document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTermedMonth_reinsuranceCostReport) {
            document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showDateOfBirth_reinsuranceCostReport) {
            document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showGender_reinsuranceCostReport) {
            document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showTotalClaimsCost_reinsuranceCostReport) {
            document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }
          if(self.state.showStatus_reinsuranceCostReport) {
            document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }if(self.state.showEffectiveDate_reinsuranceCostReport) {
            document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }if(self.state.showPolicyPeriod_reinsuranceCostReport) {
            document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "#20a8d8";
          }

          self.generateReinsuranceCostReportXLSX();
 
}

   printTableData_duplicateClaims() {

      var propertiesArr = [];

      if(self.state.showSubscriberId_duplicate)
        propertiesArr.push("HICN/Subscriber ID");
      if(self.state.showPlanName_duplicate)
        propertiesArr.push("Plan Name");
      if(self.state.showPatientName_duplicate)
        propertiesArr.push("Patient Name");
      if(self.state.showPcp_duplicate)
        propertiesArr.push("PCP");
      if(self.state.showEligibleMonth_duplicate)
        propertiesArr.push("Eligible Month");
      if(self.state.showTermedMonth_duplicate)
        propertiesArr.push("Termed Month");
      if(self.state.showClaimDate_duplicate)
        propertiesArr.push("Claim Date");
      if(self.state.showDuplicativeCost_duplicate)
        propertiesArr.push("Duplicative Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.duplicateClaimFileQuery);

      fetch(config.serverUrl+'/getDuplicateClaimDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Claims Search", documentTitle:"Print-Claims Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_admissionsReport() {

      var propertiesArr = [];

      if(self.state.showPatientName_admissions)
        propertiesArr.push("Patient Name");
      if(self.state.showSubscriberId_admissions)
        propertiesArr.push("HICN/Subscriber ID");
      if(self.state.showPcpName_admissions)
        propertiesArr.push("PCP Name");
      if(self.state.showEligibleMonth_admissions)
        propertiesArr.push("Eligible Month");
      if(self.state.showTotalNoOfAdmissions_admissions)
        propertiesArr.push("Total Number Of Admissions");
      if(self.state.showTotalCost_admissions)
        propertiesArr.push("Total Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.admissionsReportFileQuery);

      fetch(config.serverUrl+'/getAdmissionsReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_patientVisitReport() {

      var propertiesArr = [];

      if(self.state.showPatientName_patientVisit)
        propertiesArr.push("Patient Name");
      if(self.state.showHicn_patientVisit)
        propertiesArr.push("HICN");
      if(self.state.showPcpName_patientVisit)
        propertiesArr.push("PCP Name");
      if(self.state.showTermedMonth_patientVisit)
        propertiesArr.push("Termed Month");
      if(self.state.showIpaEffectiveDate_patientVisit)
        propertiesArr.push("IPA Effective Date");
      if(self.state.showTotalErVisits_patientVisit)
        propertiesArr.push("Total Number Of ER Visits");
      if(self.state.showTotalCost_patientVisit)
        propertiesArr.push("Total Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.patientVisitReportFileQuery);

      fetch(config.serverUrl+'/getPatientVisitReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-ER Patient Visit Report Search", documentTitle:"Print-ER Patient Visit Report Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

printTableData_patientVisitExpandReport() {

      var propertiesArr = [];

      if(self.state.showClaimId_patientVisitExpand)
        propertiesArr.push("Claim ID");
      if(self.state.showClaimDate_patientVisitExpand)
        propertiesArr.push("Claim Date");
      if(self.state.showClaimType_patientVisitExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showClinicName_patientVisitExpand)
        propertiesArr.push("Clinic Name");
      if(self.state.showPcpName_patientVisitExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showIcdCodes_patientVisitExpand)
        propertiesArr.push("ICD Codes");
      if(self.state.showHccCodes_patientVisitExpand)
        propertiesArr.push("HCC Codes");
      if(self.state.showDrgCode_patientVisitExpand)
        propertiesArr.push("DRG Code");
      if(self.state.showBetosCat_patientVisitExpand)
        propertiesArr.push("Betos Cat");
      if(self.state.showCost_patientVisitExpand)
        propertiesArr.push("Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.patientVisitExpandReportFileQuery);

      fetch(config.serverUrl+'/getPatientVisitExpandReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-ER Patient Visit Report Search", documentTitle:"Print-ER Patient Visit Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

printTableData_settledMonthsReport() {

      var propertiesArr = [];

      if(self.state.showPcpLocation_settledMonths)
        propertiesArr.push("PCP Location");
      if(self.state.showMonth_settledMonths)
        propertiesArr.push("Month");
      if(self.state.showMembership_settledMonths)
        propertiesArr.push("Membership");
      if(self.state.showIpaPremium_settledMonths)
        propertiesArr.push("Ipa Premium");
      if(self.state.showTotalExpenses_settledMonths)
        propertiesArr.push("Total Expenses");
      if(self.state.showStopLoss_settledMonths)
        propertiesArr.push("StopLoss");
      if(self.state.showNetPremium_settledMonths)
        propertiesArr.push("Net Premium");
      if(self.state.showRiskSharing_settledMonths)
        propertiesArr.push("Risk Sharing");
      if(self.state.showSurplusDeficit_settledMonths)
        propertiesArr.push("Surplus/Deficit");

      const formData = new FormData();
      formData.append('fileQuery', self.state.settledMonthsFileQuery);

      fetch(config.serverUrl+'/getSettledMonthsReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Settled Months Report Search", documentTitle:"Print-Settled Months Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_settledMonthsExpandReport() {

      var propertiesArr = [];

      if(self.state.showPatientName_settledMonthsExpand)
        propertiesArr.push("Patient Name");
      if(self.state.showPcpName_settledMonthsExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showPcpLocation_settledMonthsExpand)
        propertiesArr.push("PCP Location");
      if(self.state.showCost_settledMonthsExpand)
        propertiesArr.push("Cost");
      if(self.state.showClaimType_settledMonthsExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showMra_settledMonthsExpand)
        propertiesArr.push("MRA");
      

      const formData = new FormData();
      formData.append('fileQuery', self.state.settledMonthsExpandFileQuery);

      fetch(config.serverUrl+'/getSettledMonthsExpandReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Settled Months Details Report Search", documentTitle:"Print-Settled Months Details Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_pmpmByPracticeReport() {

      var propertiesArr = [];

      if(self.state.showFacilityLocationName_pmpmByPractice)
        propertiesArr.push("Facility Location Name");
      if(self.state.showProviderName_pmpmByPractice)
        propertiesArr.push("Provider Name");
      if(self.state.showTotalCost_pmpmByPractice)
        propertiesArr.push("Total Cost");
      if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice)
        propertiesArr.push("Total Number Of Member Month");
      if(self.state.showPMPM_pmpmByPractice)
        propertiesArr.push("PMPM");
      if(self.state.showPMPY_pmpmByPractice)
        propertiesArr.push("PMPY");
      if(self.state.showTotalPremium_pmpmByPractice)
        propertiesArr.push("Total Premium");
      if(self.state.showIpaPremium_pmpmByPractice)
        propertiesArr.push("IPA Premium");
      if(self.state.showDifference_pmpmByPractice)
        propertiesArr.push("Total Premium - IPA Premium");
      

      const formData = new FormData();
      formData.append('fileQuery', self.state.pmpmByPracticeFileQuery);

      fetch(config.serverUrl+'/getPmpmByPracticeReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-PMPM by Practice Report Search", documentTitle:"Print-PMPM by Practice Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_reinsuranceManagementReport () {

    var propertiesArr = [];

    if(self.state.showSubscriberID_reinsuranceManagement)
      propertiesArr.push("SubscriberID");
    if(self.state.showPlanName_reinsuranceManagement)
      propertiesArr.push("Plan Name");
    if(self.state.showPatientName_reinsuranceManagement)
      propertiesArr.push("Patient Name");
    if(self.state.showPcpName_reinsuranceManagement)
      propertiesArr.push("PCP Name");
    if(self.state.showTermedMonth_reinsuranceManagement)
      propertiesArr.push("Termed Month");
    if(self.state.showInstClaims_reinsuranceManagement)
      propertiesArr.push("INST Claims");
    if(self.state.showProfClaims_reinsuranceManagement)
      propertiesArr.push("PROF Claims");
    if(self.state.showTotalCost_reinsuranceManagement)
      propertiesArr.push("Total Cost");
    

    const formData = new FormData();
    formData.append('fileQuery', self.state.reinsuranceManagementFileQuery);

    fetch(config.serverUrl+'/getReinsuranceManagementReportDataForPrint', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Reinsurance Management Report Search", documentTitle:"Print-Reinsurance Management Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    }).catch((error) => {
      console.log(error);
    });
 }

 printTableData_reinsuranceCostReport () {

  var propertiesArr = [];

  if(self.state.showPlanName_reinsuranceCostReport)
    propertiesArr.push("Plan Name");
  if(self.state.showPolicyPeriod_reinsuranceCostReport)
    propertiesArr.push("Policy Period");
  if(self.state.showPatientLastName_reinsuranceCostReport)
    propertiesArr.push("Patient Last Name");
  if(self.state.showPatientFirstName_reinsuranceCostReport)
    propertiesArr.push("Patient First Name");
  if(self.state.showSubscriberID_reinsuranceCostReport)
    propertiesArr.push("HICN/SubscriberID");
  if(self.state.showEffectiveDate_reinsuranceCostReport)
    propertiesArr.push("Effective Date");
  if(self.state.showTermedMonth_reinsuranceCostReport)
    propertiesArr.push("Termed Month");
  if(self.state.showDateOfBirth_reinsuranceCostReport)
    propertiesArr.push("DOB");
    if(self.state.showStatus_reinsuranceCostReport)
    propertiesArr.push("Status");
  if(self.state.showGender_reinsuranceCostReport)
    propertiesArr.push("Gender");
  if(self.state.showPcpName_reinsuranceCostReport)
    propertiesArr.push("PCP Name");
  if(self.state.showTotalClaimsCost_reinsuranceCostReport)
    propertiesArr.push("Total Claims Cost");

  const formData = new FormData();
  formData.append('fileQuery', self.state.reinsuranceCostReportFileQuery);

  fetch(config.serverUrl+'/getReinsuranceCostReportDataForPrint', {
      method: 'POST',
      body: formData
  }).then(function(res1) {
      if (!res1.ok) {
        if (error.message) {
          self.setState({errorMessage :error.message});
        } 
      }
      return res1.json();
    }).then(function(response)   {
    printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Reinsurance Cost Report Search", documentTitle:"Print-Reinsurance Cost Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
  }).catch((error) => {
    console.log(error);
  });
}

   printTableData_pmpmByPracticeExpandReport() {

      var propertiesArr = [];

      if(self.state.showPatientName_pmpmByPracticeExpand)
        propertiesArr.push("Patient Name");
      if(self.state.showPcpName_pmpmByPracticeExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showPcpLocation_pmpmByPracticeExpand)
        propertiesArr.push("PCP Location");
      if(self.state.showMra_pmpmByPracticeExpand)
        propertiesArr.push("MRA");
      if(self.state.showCost_pmpmByPracticeExpand)
        propertiesArr.push("Cost");
      if(self.state.showClaimType_pmpmByPracticeExpand)
        propertiesArr.push("Claim Type");
      

      const formData = new FormData();
      formData.append('fileQuery', self.state.pmpmByPracticeExpandFileQuery);

      fetch(config.serverUrl+'/getPmpmByPracticeExpandReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response) {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-PMPM Details", documentTitle:"Print-PMPM Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_membershipManagement() {

      var propertiesArr = [];

      if(self.state.showPlanName_membershipManagement)
        propertiesArr.push("Plan Name");
      if(self.state.showMedicareId_membershipManagement)
        propertiesArr.push("Medicare ID");
      if(self.state.showInsuranceId_membershipManagement)
        propertiesArr.push("Insurance ID");
      if(self.state.showPatientName_membershipManagement)
        propertiesArr.push("Patient Name");
      if(self.state.showPatientDob_membershipManagement)
        propertiesArr.push("Patient DOB");
      if(self.state.showAssignedPcp_membershipManagement)
        propertiesArr.push("Assigned PCP");
      if(self.state.showPcpLocation_membershipManagement)
        propertiesArr.push("PCP Location");
      if(self.state.showIpaEffectiveDate_membershipManagement)
        propertiesArr.push("IPA Effective Date");
      if(self.state.showMra_membershipManagement)
        propertiesArr.push("MRA");
      if(self.state.showTotalPatientCost_membershipManagement)
        propertiesArr.push("Total Patient Cost");
      

      const formData = new FormData();
      formData.append('fileQuery', self.state.membershipManagementFileQuery);
      formData.append('patientType', self.state.patientTypeClicked);

      fetch(config.serverUrl+'/getMembershipManagementDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-"+self.state.patientTypeClicked+" Patient List", documentTitle:"Print-"+self.state.patientTypeClicked+" Patient List", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }


  printTableData_beneficiariesManagementByLocation() {

    var propertiesArr = [];

    
    if(self.state.showPcpLocation_beneficiariesManagementByLocation)
      propertiesArr.push("PCP Location");
    if(self.state.showMra_beneficiariesManagementByLocation)
      propertiesArr.push("Average MRA");
    if(self.state.showTotalCost_beneficiariesManagementByLocation)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationDataForPrint', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {

      //console.log(response);
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Location", documentTitle:"Print- Beneficiaries Management Report By Location ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

 printTableData_beneficiariesManagementByClinic() {

    var propertiesArr = [];
    
    if(self.state.showClinicName_beneficiariesManagementByClinic)
      propertiesArr.push("Clinic Name");
    if(self.state.showTotalCost_beneficiariesManagementByClinic)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicDataForPrint', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {

      //console.log(response);
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Clinic", documentTitle:"Print- Beneficiaries Management Report By Clinic ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

    printTableData_beneficiariesManagement() {

      var propertiesArr = [];

      if(self.state.showPlanName_beneficiariesManagement)
        propertiesArr.push("Plan Name");
      if(self.state.showHicn_beneficiariesManagement)
        propertiesArr.push("HICN/ Subscriber ID");
      if(self.state.showPatientName_beneficiariesManagement)
        propertiesArr.push("Patient Name");
      if(self.state.showDob_beneficiariesManagement)
        propertiesArr.push("DOB");
      if(self.state.showEligibleMonth_beneficiariesManagement)
        propertiesArr.push("Eligible Month");
      if(self.state.showTermedMonth_beneficiariesManagement)
        propertiesArr.push("Termed Month");
      if(self.state.showPcpName_beneficiariesManagement)
        propertiesArr.push("PCP Name");
      if(self.state.showPcpLocation_beneficiariesManagement)
        propertiesArr.push("PCP Location");
      if(self.state.showMra_beneficiariesManagement)
        propertiesArr.push("MRA");
      if(self.state.showTotalCost_beneficiariesManagement)
        propertiesArr.push("Total Cost");
      if(self.state.showAddress_beneficiariesManagement)
        propertiesArr.push("Address");
      if(self.state.showRecentAppointmentDate_beneficiariesManagement)
        propertiesArr.push("Recent Appointment Date");
      if(self.state.showNextAppointmentDate_beneficiariesManagement)
        propertiesArr.push("Next Appointment Date");
      if(self.state.showFacilityLocation_beneficiariesManagement)
        propertiesArr.push("Facility Location");
      if(self.state.showPhoneNumber_beneficiariesManagement)
        propertiesArr.push("Phone Number");
      if(self.state.showLastClaimsDate_beneficiariesManagement)
        propertiesArr.push("Last Claims Date");
      if(self.state.showIcdCode_beneficiariesManagement)
        propertiesArr.push("ICD 9/10 Code");
      
      const formData = new FormData();
      formData.append('fileQuery', self.state.beneficiariesManagementFileQuery);

      fetch(config.serverUrl+'/getBeneficiariesManagementDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report", documentTitle:"Print- Beneficiaries Management Report", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_beneficiariesManagementExpand() {

      var propertiesArr = [];

      if(self.state.showClaimId_beneficiariesManagementExpand)
        propertiesArr.push("Claim Id");
      if(self.state.showClaimDate_beneficiariesManagementExpand)
        propertiesArr.push("Claim Date");
      if(self.state.showClaimType_beneficiariesManagementExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showClinicName_beneficiariesManagementExpand)
        propertiesArr.push("Clinic Name");
      if(self.state.showPcpName_beneficiariesManagementExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showIcdCodes_beneficiariesManagementExpand)
        propertiesArr.push("ICD Codes");
      if(self.state.showHccCodes_beneficiariesManagementExpand)
        propertiesArr.push("HCC Codes");
      if(self.state.showDrgCode_beneficiariesManagementExpand)
        propertiesArr.push("DRG Code");
      if(self.state.showBetosCat_beneficiariesManagementExpand)
        propertiesArr.push("BetosCat");
      if(self.state.showCost_beneficiariesManagementExpand)
        propertiesArr.push("Cost");
      
      const formData = new FormData();
      formData.append('fileQuery', self.state.beneficiariesManagementExpandFileQuery);

      fetch(config.serverUrl+'/getBeneficiariesManagementExpandDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Details", documentTitle:"Print- Beneficiaries Management Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_beneficiariesManagementByDoctorExpand() {

      var propertiesArr = [];

      if(self.state.showClaimId_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("Claim Id");
      if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("Claim Date");
      if(self.state.showClaimType_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showClinicName_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("Clinic Name");
      if(self.state.showPcpName_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("ICD Codes");
      if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("HCC Codes");
      if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("DRG Code");
      if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("BetosCat");
      if(self.state.showCost_beneficiariesManagementByDoctorExpand)
        propertiesArr.push("Cost");
      
      const formData = new FormData();
      formData.append('fileQuery', self.state.beneficiariesManagementByDoctorExpandFileQuery);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorExpandDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Doctor Details", documentTitle:"Print- Beneficiaries Management By Doctor Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   
   printTableData_beneficiariesManagementByClinicExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementByClinicExpand)
     propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpLocation_beneficiariesManagementByClinicExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementByClinicExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementByClinicExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicExpandDataForPrint', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {

      //console.log(response);
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Clinic Details", documentTitle:"Print- Beneficiaries Management By Clinic Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }  
   
   printTableData_beneficiariesManagementByLocationExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementByLocationExpand)
     propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand)
      propertiesArr.push("PCP Location");
    if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementByLocationExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementByLocationExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationExpandDataForPrint', {
        method: 'POST',
        body: formData
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
      }).then(function(response)   {

      //console.log(response);
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Location Details", documentTitle:"Print- Beneficiaries Management By Location Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }


   printTableData_beneficiariesManagementByDoctor() {

      var propertiesArr = [];

      if(self.state.showPcpName_beneficiariesManagementByDoctor)
        propertiesArr.push("PCP Name");
      if(self.state.showPcpLocation_beneficiariesManagementByDoctor)
        propertiesArr.push("PCP Location");
      if(self.state.showAverageMra_beneficiariesManagementByDoctor)
        propertiesArr.push("Average MRA");
      if(self.state.showTotalCost_beneficiariesManagementByDoctor)
        propertiesArr.push("Total Cost");
      
      const formData = new FormData();
      formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Doctor", documentTitle:"Print- Beneficiaries Management By Doctor", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_admissionsReportExpand() {

      var propertiesArr = [];

      if(self.state.showClaimId_admissionsExpand)
        propertiesArr.push("Claim Id");
      if(self.state.showClaimDate_admissionsExpand)
        propertiesArr.push("Claim Date");
      if(self.state.showClaimType_admissionsExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showClinicName_admissionsExpand)
        propertiesArr.push("Clinic Name");
      if(self.state.showPcpName_admissionsExpand)
        propertiesArr.push("PCP Name");
      if(self.state.showIcdCodes_admissionsExpand)
        propertiesArr.push("ICD Codes");
      if(self.state.showHccCodes_admissionsExpand)
        propertiesArr.push("HCC Codes");
      if(self.state.showDrgCode_admissionsExpand)
        propertiesArr.push("DRG Code");
      if(self.state.showBetosCat_admissionsExpand)
        propertiesArr.push("Betos Cat");
      if(self.state.showCost_admissionsExpand)
        propertiesArr.push("Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.admissionsReportExpandFileQuery);

      fetch(config.serverUrl+'/getAdmissionsReportExpandDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_duplicateClaimsExpand() {

      var propertiesArr = [];

      if(self.state.showClaimId_duplicateClaimsExpand)
        propertiesArr.push("Claim Id");
      if(self.state.showClaimDate_duplicateClaimsExpand)
        propertiesArr.push("Claim Date");
      if(self.state.showClaimType_duplicateClaimsExpand)
        propertiesArr.push("Claim Type");
      if(self.state.showClinicName_duplicateClaimsExpand)
        propertiesArr.push("Clinic Name");
      if(self.state.showProviderName_duplicateClaimsExpand)
        propertiesArr.push("Provider Name");
      if(self.state.showBetosCat_duplicateClaimsExpand)
        propertiesArr.push("Betos Cat");
      if(self.state.showDrgCode_duplicateClaimsExpand)
        propertiesArr.push("DRG Code");
      if(self.state.showIcdCodes_duplicateClaimsExpand)
        propertiesArr.push("ICD 9/10 Code(s)");
      if(self.state.showHccCodes_duplicateClaimsExpand)
        propertiesArr.push("HCC Code(s)");
      if(self.state.showCost_duplicateClaimsExpand)
        propertiesArr.push("Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.duplicateClaimsExpandFileQuery);

      fetch(config.serverUrl+'/getDuplicateClaimsExpandDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_specialistComparisonReport() {

      var propertiesArr = [];

      if(self.state.showSpecialityCode_specialistComparison)
        propertiesArr.push("Speciality Code");
      if(self.state.showNoOfPcp_specialistComparison)
        propertiesArr.push("Number Of PCP");
      if(self.state.showNoOfClaims_specialistComparison)
        propertiesArr.push("Number Of Claims");
      if(self.state.showNoOfBeneficiaries_specialistComparison)
        propertiesArr.push("Number Of Beneficiaries");
      if(self.state.showCostPerClaim_specialistComparison)
        propertiesArr.push("Cost Per Claim");
      if(self.state.showCostPerBeneficiary_specialistComparison)
        propertiesArr.push("Cost Per Beneficiary");
      if(self.state.showTotalCost_specialistComparison)
        propertiesArr.push("Total Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.specialistComparisonReportFileQuery);

      fetch(config.serverUrl+'/getSpecialistComparisonReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Report Search", documentTitle:"Print-Specialist Comparison Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

printTableData_specialistComparisonReportExpand() {

      var propertiesArr = [];

      if(self.state.showPracticeName_specialistComparisonExpand)
        propertiesArr.push("Practice Name");
      if(self.state.showSpecialityType_specialistComparisonExpand)
        propertiesArr.push("Speciality Type");
      if(self.state.showNoOfClaims_specialistComparisonExpand)
        propertiesArr.push("Number Of Claims");
      if(self.state.showAverageCostPerClaim_specialistComparisonExpand)
        propertiesArr.push("Average Cost Per Claim");
      if(self.state.showCost_specialistComparisonExpand)
        propertiesArr.push("Cost");
      

      const formData = new FormData();
      formData.append('fileQuery', self.state.specialistComparisonExpandReportFileQuery);

      fetch(config.serverUrl+'/getSpecialistComparisonExpandReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Report Search", documentTitle:"Print-Specialist Comparison Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   printTableData_summaryReport() {

      var propertiesArr = [];

      if(self.state.showPcpLocation_summary)
        propertiesArr.push("PCP Location");
      if(self.state.showMonth_summary)
        propertiesArr.push("Month");
      if(self.state.showMembers_summary)
        propertiesArr.push("Members");
      if(self.state.showMaPremium_summary)
        propertiesArr.push("Ma Premium");
      if(self.state.showPartDPremium_summary)
        propertiesArr.push("Part D Premium");
      if(self.state.showTotalPremium_summary)
        propertiesArr.push("Total Premium");
      if(self.state.showIpaPremium_summary)
        propertiesArr.push("IPA Premium");
      if(self.state.showPcpCap_summary)
        propertiesArr.push("PCP Cap");
      if(self.state.showSpecCost_summary)
        propertiesArr.push("Spec Cost");
      if(self.state.showProfClaims_summary)
        propertiesArr.push("Prof Claims");
      if(self.state.showInstClaims_summary)
        propertiesArr.push("Inst Claims");
      if(self.state.showRxClaims_summary)
        propertiesArr.push("Rx Claims");
      if(self.state.showIbnrDollars_summary)
        propertiesArr.push("IBNR Dollars");
      if(self.state.showReinsurancePremium_summary)
        propertiesArr.push("Reinsurance Premium");
      if(self.state.showSpecCap_summary)
        propertiesArr.push("Spec Cap");
      if(self.state.showTotalExpenses_summary)
        propertiesArr.push("Total Expenses");
      if(self.state.showReinsuranceRecovered_summary)
        propertiesArr.push("Reinsurance Recovered");
      if(self.state.showRxAdmin_summary)
        propertiesArr.push("Rx Admin");
      if(self.state.showSilverSneakerUtilization_summary)
        propertiesArr.push("Silver Sneaker Utilization");
      if(self.state.showPba_summary)
        propertiesArr.push("PBA");
      if(self.state.showHumanaAtHome_summary)
        propertiesArr.push("Humana At Home");
      if(self.state.showDentalFFS_summary)
        propertiesArr.push("Dental FFS");

      const formData = new FormData();
      formData.append('fileQuery', self.state.summaryReportFileQuery);

      fetch(config.serverUrl+'/getSummaryReportDataForPrint', {
          method: 'POST',
          body: formData
      }).then(function(res1) {
          if (!res1.ok) {
            if (error.message) {
              self.setState({errorMessage :error.message});
            } 
          }
          return res1.json();
        }).then(function(response)   {

        //console.log(response);
        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Summary Report Search", documentTitle:"Print-Summary Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
      }).catch((error) => {
        console.log(error);
      });
   }

   generateDuplicateClaimsXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.duplicateClaimsReportFileQuery);
    formData.append('showSubscriberId_duplicate', self.state.showSubscriberId_duplicate);
    formData.append('showPlanName_duplicate', self.state.showPlanName_duplicate);
    formData.append('showPatientName_duplicate', self.state.showPatientName_duplicate);
    formData.append('showPcp_duplicate', self.state.showPcp_duplicate);
    formData.append('showEligibleMonth_duplicate', self.state.showEligibleMonth_duplicate);
    formData.append('showTermedMonth_duplicate', self.state.showTermedMonth_duplicate);
    formData.append('showClaimDate_duplicate', self.state.showClaimDate_duplicate);
    formData.append('showDuplicativeCost_duplicate', self.state.showDuplicativeCost_duplicate);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForDuplicateClaims: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementByLocationXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);
    formData.append('showPcpLocation_beneficiariesManagementByLocation', self.state.showPcpLocation_beneficiariesManagementByLocation);
    formData.append('showMra_beneficiariesManagementByLocation', self.state.showMra_beneficiariesManagementByLocation);
    formData.append('showTotalCost_beneficiariesManagementByLocation', self.state.showTotalCost_beneficiariesManagementByLocation);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByLocation: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementByClinicXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);
    formData.append('showClinicName_beneficiariesManagementByClinic', self.state.showClinicName_beneficiariesManagementByClinic);
    formData.append('showTotalCost_beneficiariesManagementByClinic', self.state.showTotalCost_beneficiariesManagementByClinic);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByClinic: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementFileQuery);
    formData.append('showPlanName_beneficiariesManagement', self.state.showPlanName_beneficiariesManagement);
    formData.append('showHicn_beneficiariesManagement', self.state.showHicn_beneficiariesManagement);
    formData.append('showPatientName_beneficiariesManagement', self.state.showPatientName_beneficiariesManagement);
    formData.append('showDob_beneficiariesManagement', self.state.showDob_beneficiariesManagement);
    formData.append('showEligibleMonth_beneficiariesManagement', self.state.showEligibleMonth_beneficiariesManagement);
    formData.append('showTermedMonth_beneficiariesManagement', self.state.showTermedMonth_beneficiariesManagement);
    formData.append('showPcpName_beneficiariesManagement', self.state.showPcpName_beneficiariesManagement);
    formData.append('showPcpLocation_beneficiariesManagement', self.state.showPcpLocation_beneficiariesManagement);
    formData.append('showMra_beneficiariesManagement', self.state.showMra_beneficiariesManagement);
    formData.append('showTotalCost_beneficiariesManagement', self.state.showTotalCost_beneficiariesManagement);
    formData.append('showAddress_beneficiariesManagement', self.state.showAddress_beneficiariesManagement);
    formData.append('showRecentAppointmentDate_beneficiariesManagement', self.state.showRecentAppointmentDate_beneficiariesManagement);
    formData.append('showNextAppointmentDate_beneficiariesManagement', self.state.showNextAppointmentDate_beneficiariesManagement);
    formData.append('showFacilityLocation_beneficiariesManagement', self.state.showFacilityLocation_beneficiariesManagement);
    formData.append('showPhoneNumber_beneficiariesManagement', self.state.showPhoneNumber_beneficiariesManagement);
    formData.append('showLastClaimsDate_beneficiariesManagement', self.state.showLastClaimsDate_beneficiariesManagement);
    formData.append('showIcdCode_beneficiariesManagement', self.state.showIcdCode_beneficiariesManagement);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagement: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementExpand', self.state.showClaimId_beneficiariesManagementExpand);
    formData.append('showClaimDate_beneficiariesManagementExpand', self.state.showClaimDate_beneficiariesManagementExpand);
    formData.append('showClaimType_beneficiariesManagementExpand', self.state.showClaimType_beneficiariesManagementExpand);
    formData.append('showClinicName_beneficiariesManagementExpand', self.state.showClinicName_beneficiariesManagementExpand);
    formData.append('showPcpName_beneficiariesManagementExpand', self.state.showPcpName_beneficiariesManagementExpand);
    formData.append('showIcdCodes_beneficiariesManagementExpand', self.state.showIcdCodes_beneficiariesManagementExpand);
    formData.append('showHccCodes_beneficiariesManagementExpand', self.state.showHccCodes_beneficiariesManagementExpand);
    formData.append('showDrgCode_beneficiariesManagementExpand', self.state.showDrgCode_beneficiariesManagementExpand);
    formData.append('showBetosCat_beneficiariesManagementExpand', self.state.showBetosCat_beneficiariesManagementExpand);
    formData.append('showCost_beneficiariesManagementExpand', self.state.showCost_beneficiariesManagementExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementExpand: btoa(JSON.stringify(object))});
   }


   generateBeneficiariesManagementByClinicExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementByClinicExpand', self.state.showClaimId_beneficiariesManagementByClinicExpand);
    formData.append('showClaimDate_beneficiariesManagementByClinicExpand', self.state.showClaimDate_beneficiariesManagementByClinicExpand);
    formData.append('showClaimType_beneficiariesManagementByClinicExpand', self.state.showClaimType_beneficiariesManagementByClinicExpand);
    formData.append('showPcpName_beneficiariesManagementByClinicExpand', self.state.showPcpName_beneficiariesManagementByClinicExpand);
    formData.append('showClinicName_beneficiariesManagementByClinicExpand', self.state.showClinicName_beneficiariesManagementByClinicExpand);
    formData.append('showIcdCodes_beneficiariesManagementByClinicExpand', self.state.showIcdCodes_beneficiariesManagementByClinicExpand);
    formData.append('showHccCodes_beneficiariesManagementByClinicExpand', self.state.showHccCodes_beneficiariesManagementByClinicExpand);
    formData.append('showDrgCode_beneficiariesManagementByClinicExpand', self.state.showDrgCode_beneficiariesManagementByClinicExpand);
    formData.append('showBetosCat_beneficiariesManagementByClinicExpand', self.state.showBetosCat_beneficiariesManagementByClinicExpand);
    formData.append('showCost_beneficiariesManagementByClinicExpand', self.state.showCost_beneficiariesManagementByClinicExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByClinicExpand: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementByLocationExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementByLocationExpand', self.state.showClaimId_beneficiariesManagementByLocationExpand);
    formData.append('showClaimDate_beneficiariesManagementByLocationExpand', self.state.showClaimDate_beneficiariesManagementByLocationExpand);
    formData.append('showClaimType_beneficiariesManagementByLocationExpand', self.state.showClaimType_beneficiariesManagementByLocationExpand);
    formData.append('showClinicName_beneficiariesManagementByLocationExpand', self.state.showClinicName_beneficiariesManagementByLocationExpand);
    formData.append('showPcpLocation_beneficiariesManagementByLocationExpand', self.state.showPcpLocation_beneficiariesManagementByLocationExpand);
    formData.append('showIcdCodes_beneficiariesManagementByLocationExpand', self.state.showIcdCodes_beneficiariesManagementByLocationExpand);
    formData.append('showHccCodes_beneficiariesManagementByLocationExpand', self.state.showHccCodes_beneficiariesManagementByLocationExpand);
    formData.append('showDrgCode_beneficiariesManagementByLocationExpand', self.state.showDrgCode_beneficiariesManagementByLocationExpand);
    formData.append('showBetosCat_beneficiariesManagementByLocationExpand', self.state.showBetosCat_beneficiariesManagementByLocationExpand);
    formData.append('showCost_beneficiariesManagementByLocationExpand', self.state.showCost_beneficiariesManagementByLocationExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByLocationExpand: btoa(JSON.stringify(object))});
   }

   

   generateBeneficiariesManagementByDoctorExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByDoctorExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementByDoctorExpand', self.state.showClaimId_beneficiariesManagementByDoctorExpand);
    formData.append('showClaimDate_beneficiariesManagementByDoctorExpand', self.state.showClaimDate_beneficiariesManagementByDoctorExpand);
    formData.append('showClaimType_beneficiariesManagementByDoctorExpand', self.state.showClaimType_beneficiariesManagementByDoctorExpand);
    formData.append('showClinicName_beneficiariesManagementByDoctorExpand', self.state.showClinicName_beneficiariesManagementByDoctorExpand);
    formData.append('showPcpName_beneficiariesManagementByDoctorExpand', self.state.showPcpName_beneficiariesManagementByDoctorExpand);
    formData.append('showIcdCodes_beneficiariesManagementByDoctorExpand', self.state.showIcdCodes_beneficiariesManagementByDoctorExpand);
    formData.append('showHccCodes_beneficiariesManagementByDoctorExpand', self.state.showHccCodes_beneficiariesManagementByDoctorExpand);
    formData.append('showDrgCode_beneficiariesManagementByDoctorExpand', self.state.showDrgCode_beneficiariesManagementByDoctorExpand);
    formData.append('showBetosCat_beneficiariesManagementByDoctorExpand', self.state.showBetosCat_beneficiariesManagementByDoctorExpand);
    formData.append('showCost_beneficiariesManagementByDoctorExpand', self.state.showCost_beneficiariesManagementByDoctorExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByDoctorExpand: btoa(JSON.stringify(object))});
   }

   generateBeneficiariesManagementByDoctorXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);
    formData.append('showPcpName_beneficiariesManagementByDoctor', self.state.showPcpName_beneficiariesManagementByDoctor);
    formData.append('showPcpLocation_beneficiariesManagementByDoctor', self.state.showPcpLocation_beneficiariesManagementByDoctor);
    formData.append('showAverageMra_beneficiariesManagementByDoctor', self.state.showAverageMra_beneficiariesManagementByDoctor);
    formData.append('showTotalCost_beneficiariesManagementByDoctor', self.state.showTotalCost_beneficiariesManagementByDoctor);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByDoctor: btoa(JSON.stringify(object))});
   }

  generateAdmissionsReportHeaderXLSX()
  {
    const formData = new FormData();
    formData.append('year',self.state.admissionsReportYearSelectValue.value);
    formData.append('pcpName',self.state.admissionsReportPcpNameValue.value);
    formData.append('provider',self.state.admissionsReportProviderSelectValue.value);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });

    self.setState({jsonDataForAdmissionsReportHeader:btoa(JSON.stringify(object))});
  }

   generateAdmissionsReportXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.admissionsReportFileQuery);
    formData.append('showPatientName_admissions', self.state.showPatientName_admissions);
    formData.append('showSubscriberId_admissions', self.state.showSubscriberId_admissions);
    formData.append('showPcpName_admissions', self.state.showPcpName_admissions);
    formData.append('showEligibleMonth_admissions', self.state.showEligibleMonth_admissions);
    formData.append('showTotalNoOfAdmissions_admissions', self.state.showTotalNoOfAdmissions_admissions);
    formData.append('showTotalCost_admissions', self.state.showTotalCost_admissions);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForAdmissionsReport: btoa(JSON.stringify(object))});
   }

   generateAdmissionsReportExpandXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.admissionsReportExpandFileQuery);
    formData.append('showClaimId_admissionsExpand', self.state.showClaimId_admissionsExpand);
    formData.append('showClaimDate_admissionsExpand', self.state.showClaimDate_admissionsExpand);
    formData.append('showClaimType_admissionsExpand', self.state.showClaimType_admissionsExpand);
    formData.append('showClinicName_admissionsExpand', self.state.showClinicName_admissionsExpand);
    formData.append('showPcpName_admissionsExpand', self.state.showPcpName_admissionsExpand);
    formData.append('showIcdCodes_admissionsExpand', self.state.showIcdCodes_admissionsExpand);
    formData.append('showHccCodes_admissionsExpand', self.state.showHccCodes_admissionsExpand);
    formData.append('showDrgCode_admissionsExpand', self.state.showDrgCode_admissionsExpand);
    formData.append('showBetosCat_admissionsExpand', self.state.showBetosCat_admissionsExpand);
    formData.append('showCost_admissionsExpand', self.state.showCost_admissionsExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForAdmissionsReportExpand: btoa(JSON.stringify(object))});
   }

   generateDuplicateClaimsExpandXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.duplicateClaimsExpandFileQuery);
    formData.append('showClaimId_duplicateClaimsExpand', self.state.showClaimId_duplicateClaimsExpand);
    formData.append('showClaimDate_duplicateClaimsExpand', self.state.showClaimDate_duplicateClaimsExpand);
    formData.append('showClaimType_duplicateClaimsExpand', self.state.showClaimType_duplicateClaimsExpand);
    formData.append('showClinicName_duplicateClaimsExpand', self.state.showClinicName_duplicateClaimsExpand);
    formData.append('showProviderName_duplicateClaimsExpand', self.state.showProviderName_duplicateClaimsExpand);
    formData.append('showBetosCat_duplicateClaimsExpand', self.state.showBetosCat_duplicateClaimsExpand);
    formData.append('showDrgCode_duplicateClaimsExpand', self.state.showDrgCode_duplicateClaimsExpand);
    formData.append('showIcdCodes_duplicateClaimsExpand', self.state.showIcdCodes_duplicateClaimsExpand);
    formData.append('showHccCodes_duplicateClaimsExpand', self.state.showHccCodes_duplicateClaimsExpand);
    formData.append('showCost_duplicateClaimsExpand', self.state.showCost_duplicateClaimsExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForDuplicateClaimsExpand: btoa(JSON.stringify(object))});
   }

   generateSpecialistComparisonReportXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.specialistComparisonReportFileQuery);
    formData.append('showSpecialityCode_specialistComparison', self.state.showSpecialityCode_specialistComparison);
    formData.append('showNoOfPcp_specialistComparison', self.state.showNoOfPcp_specialistComparison);
    formData.append('showNoOfPcp_specialistComparison', self.state.showNoOfPcp_specialistComparison);
    formData.append('showNoOfClaims_specialistComparison', self.state.showNoOfClaims_specialistComparison);
    formData.append('showNoOfBeneficiaries_specialistComparison', self.state.showNoOfBeneficiaries_specialistComparison);
    formData.append('showCostPerClaim_specialistComparison', self.state.showCostPerClaim_specialistComparison);
    formData.append('showCostPerBeneficiary_specialistComparison', self.state.showCostPerBeneficiary_specialistComparison);
    formData.append('showTotalCost_specialistComparison', self.state.showTotalCost_specialistComparison);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSpecialistComparisonReport: btoa(JSON.stringify(object))});
   }

   generateSpecialistComparisonExpandReportXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.specialistComparisonExpandReportFileQuery);
    formData.append('showPracticeName_specialistComparisonExpand', self.state.showPracticeName_specialistComparisonExpand);
    formData.append('showSpecialityType_specialistComparisonExpand', self.state.showSpecialityType_specialistComparisonExpand);
    formData.append('showNoOfClaims_specialistComparisonExpand', self.state.showNoOfClaims_specialistComparisonExpand);
    formData.append('showAverageCostPerClaim_specialistComparisonExpand', self.state.showAverageCostPerClaim_specialistComparisonExpand);
    formData.append('showCost_specialistComparisonExpand', self.state.showCost_specialistComparisonExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSpecialistComparisonExpandReport: btoa(JSON.stringify(object))});
   }

   generatePatientVisitReportXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.patientVisitReportFileQuery);
    formData.append('showPatientName_patientVisit', self.state.showPatientName_patientVisit);
    formData.append('showHicn_patientVisit', self.state.showHicn_patientVisit);
    formData.append('showPcpName_patientVisit', self.state.showPcpName_patientVisit);
    formData.append('showTermedMonth_patientVisit', self.state.showTermedMonth_patientVisit);
    formData.append('showIpaEffectiveDate_patientVisit', self.state.showIpaEffectiveDate_patientVisit);
    formData.append('showTotalErVisits_patientVisit', self.state.showTotalErVisits_patientVisit);
    formData.append('showTotalCost_patientVisit', self.state.showTotalCost_patientVisit);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForPatientVisitReport: btoa(JSON.stringify(object))});
   }

   generatePatientVisitExpandReportXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.patientVisitExpandReportFileQuery);
    formData.append('showClaimId_patientVisitExpand', self.state.showClaimId_patientVisitExpand);
    formData.append('showClaimDate_patientVisitExpand', self.state.showClaimDate_patientVisitExpand);
    formData.append('showClaimType_patientVisitExpand', self.state.showClaimType_patientVisitExpand);
    formData.append('showClinicName_patientVisitExpand', self.state.showClinicName_patientVisitExpand);
    formData.append('showPcpName_patientVisitExpand', self.state.showPcpName_patientVisitExpand);
    formData.append('showIcdCodes_patientVisitExpand', self.state.showIcdCodes_patientVisitExpand);
    formData.append('showHccCodes_patientVisitExpand', self.state.showHccCodes_patientVisitExpand);
    formData.append('showDrgCode_patientVisitExpand', self.state.showDrgCode_patientVisitExpand);
    formData.append('showBetosCat_patientVisitExpand', self.state.showBetosCat_patientVisitExpand);
    formData.append('showCost_patientVisitExpand', self.state.showCost_patientVisitExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForPatientVisitExpandReport: btoa(JSON.stringify(object))});
   }

   generateSummaryReportXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.summaryReportFileQuery);

    formData.append('showPcpLocation_summary', self.state.showPcpLocation_summary);
    formData.append('showMonth_summary', self.state.showMonth_summary);
    formData.append('showMembers_summary', self.state.showMembers_summary);
    formData.append('showMaPremium_summary', self.state.showMaPremium_summary);
    formData.append('showPartDPremium_summary', self.state.showPartDPremium_summary);
    formData.append('showTotalPremium_summary', self.state.showTotalPremium_summary);
    formData.append('showIpaPremium_summary', self.state.showIpaPremium_summary);
    formData.append('showPcpCap_summary', self.state.showPcpCap_summary);
    formData.append('showSpecCost_summary', self.state.showSpecCost_summary);
    formData.append('showProfClaims_summary', self.state.showProfClaims_summary);
    formData.append('showInstClaims_summary', self.state.showInstClaims_summary);
    formData.append('showRxClaims_summary', self.state.showRxClaims_summary);
    formData.append('showIbnrDollars_summary', self.state.showIbnrDollars_summary);
    formData.append('showReinsurancePremium_summary', self.state.showReinsurancePremium_summary);
    formData.append('showSpecCap_summary', self.state.showSpecCap_summary);
    formData.append('showTotalExpenses_summary', self.state.showTotalExpenses_summary);
    formData.append('showReinsuranceRecovered_summary', self.state.showReinsuranceRecovered_summary);
    formData.append('showRxAdmin_summary', self.state.showRxAdmin_summary);
    formData.append('showSilverSneakerUtilization_summary', self.state.showSilverSneakerUtilization_summary);
    formData.append('showPba_summary', self.state.showPba_summary);
    formData.append('showHumanaAtHome_summary', self.state.showHumanaAtHome_summary);
    formData.append('showDentalFFS_summary', self.state.showDentalFFS_summary);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSummaryReport: btoa(JSON.stringify(object))});
   }

   generateSettledMonthsXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.settledMonthsFileQuery);
    formData.append('showPcpLocation_settledMonths', self.state.showPcpLocation_settledMonths);
    formData.append('showMonth_settledMonths', self.state.showMonth_settledMonths);
    formData.append('showMembership_settledMonths', self.state.showMembership_settledMonths);
    formData.append('showIpaPremium_settledMonths', self.state.showIpaPremium_settledMonths);
    formData.append('showTotalExpenses_settledMonths', self.state.showTotalExpenses_settledMonths);
    formData.append('showStopLoss_settledMonths', self.state.showStopLoss_settledMonths);
    formData.append('showNetPremium_settledMonths', self.state.showNetPremium_settledMonths);
    formData.append('showRiskSharing_settledMonths', self.state.showRiskSharing_settledMonths);
    formData.append('showSurplusDeficit_settledMonths', self.state.showSurplusDeficit_settledMonths);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSettledMonths: btoa(JSON.stringify(object))});
   }

   generatePmpmByPracticeXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.pmpmByPracticeFileQuery);
    formData.append('showFacilityLocationName_pmpmByPractice', self.state.showFacilityLocationName_pmpmByPractice);
    formData.append('showProviderName_pmpmByPractice', self.state.showProviderName_pmpmByPractice);
    formData.append('showTotalCost_pmpmByPractice', self.state.showTotalCost_pmpmByPractice);
    formData.append('showTotalNumberOfMemberMonth_pmpmByPractice', self.state.showTotalNumberOfMemberMonth_pmpmByPractice);
    formData.append('showPMPM_pmpmByPractice', self.state.showPMPM_pmpmByPractice);
    formData.append('showPMPY_pmpmByPractice', self.state.showPMPY_pmpmByPractice);
    formData.append('showTotalPremium_pmpmByPractice', self.state.showTotalPremium_pmpmByPractice);
    formData.append('showIpaPremium_pmpmByPractice', self.state.showIpaPremium_pmpmByPractice);
    formData.append('showDifference_pmpmByPractice', self.state.showDifference_pmpmByPractice);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForPmpmByPractice: btoa(JSON.stringify(object))});
   }

   generatePmpmByPracticeExpandXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.pmpmByPracticeExpandFileQuery);
    formData.append('showPatientName_pmpmByPracticeExpand', self.state.showPatientName_pmpmByPracticeExpand);
    formData.append('showPcpName_pmpmByPracticeExpand', self.state.showPcpName_pmpmByPracticeExpand);
    formData.append('showPcpLocation_pmpmByPracticeExpand', self.state.showPcpLocation_pmpmByPracticeExpand);
    formData.append('showMra_pmpmByPracticeExpand', self.state.showMra_pmpmByPracticeExpand);
    formData.append('showCost_pmpmByPracticeExpand', self.state.showCost_pmpmByPracticeExpand);
    formData.append('showClaimType_pmpmByPracticeExpand', self.state.showClaimType_pmpmByPracticeExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForPmpmByPracticeExpand: btoa(JSON.stringify(object))});
   }

   generateMembershipManagementXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.membershipManagementFileQuery);
    formData.append('patientType', self.state.patientTypeClicked);
    formData.append('showPlanName_membershipManagement', self.state.showPlanName_membershipManagement);
    formData.append('showMedicareId_membershipManagement', self.state.showMedicareId_membershipManagement);
    formData.append('showInsuranceId_membershipManagement', self.state.showInsuranceId_membershipManagement);
    formData.append('showPatientName_membershipManagement', self.state.showPatientName_membershipManagement);
    formData.append('showPatientDob_membershipManagement', self.state.showPatientDob_membershipManagement);
    formData.append('showAssignedPcp_membershipManagement', self.state.showAssignedPcp_membershipManagement);
    formData.append('showPcpLocation_membershipManagement', self.state.showPcpLocation_membershipManagement);
    formData.append('showIpaEffectiveDate_membershipManagement', self.state.showIpaEffectiveDate_membershipManagement);
    formData.append('showMra_membershipManagement', self.state.showMra_membershipManagement);
    formData.append('showTotalPatientCost_membershipManagement', self.state.showTotalPatientCost_membershipManagement);
    

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForMembershipManagement: btoa(JSON.stringify(object))});
   }


   generateReinsuranceManagementXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.reinsuranceManagementFileQuery);
  formData.append('showSubscriberID_reinsuranceManagement', self.state.showSubscriberID_reinsuranceManagement);
  formData.append('showPlanName_reinsuranceManagement', self.state.showPlanName_reinsuranceManagement);
  formData.append('showPatientName_reinsuranceManagement', self.state.showPatientName_reinsuranceManagement);
  formData.append('showPcpName_reinsuranceManagement', self.state.showPcpName_reinsuranceManagement);
  formData.append('showTermedMonth_reinsuranceManagement', self.state.showTermedMonth_reinsuranceManagement);
  formData.append('showInstClaims_reinsuranceManagement', self.state.showInstClaims_reinsuranceManagement);
  formData.append('showProfClaims_reinsuranceManagement', self.state.showProfClaims_reinsuranceManagement);
  formData.append('showTotalCost_reinsuranceManagement', self.state.showTotalCost_reinsuranceManagement);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForReinsuranceManagement: btoa(JSON.stringify(object))});
 }

 generateReinsuranceCostReportXLSX() {
  const formData = new FormData();

formData.append('fileQuery', self.state.reinsuranceCostReportFileQuery);
formData.append('showPlanName_reinsuranceCostReport', self.state.showPlanName_reinsuranceCostReport);
formData.append('showPolicyPeriod_reinsuranceCostReport', self.state.showPolicyPeriod_reinsuranceCostReport);
formData.append('showPatientLastName_reinsuranceCostReport', self.state.showPatientLastName_reinsuranceCostReport);
formData.append('showPatientFirstName_reinsuranceCostReport', self.state.showPatientFirstName_reinsuranceCostReport);
formData.append('showSubscriberID_reinsuranceCostReport', self.state.showSubscriberID_reinsuranceCostReport);
formData.append('showEffectiveDate_reinsuranceCostReport', self.state.showEffectiveDate_reinsuranceCostReport);
formData.append('showTermedMonth_reinsuranceCostReport', self.state.showTermedMonth_reinsuranceCostReport);
formData.append('showDateOfBirth_reinsuranceCostReport', self.state.showDateOfBirth_reinsuranceCostReport);
formData.append('showStatus_reinsuranceCostReport', self.state.showStatus_reinsuranceCostReport);
formData.append('showGender_reinsuranceCostReport', self.state.showGender_reinsuranceCostReport);
formData.append('showPcpName_reinsuranceCostReport', self.state.showPcpName_reinsuranceCostReport);
formData.append('showTotalClaimsCost_reinsuranceCostReport', self.state.showTotalClaimsCost_reinsuranceCostReport);

  var object = {};
  formData.forEach(function(value, key){
      object[key] = value;
  });
  
  self.setState({jsonDataForReinsuranceCostReport: btoa(JSON.stringify(object))});
}


   generateSettledMonthsExpandXLSX() {
      const formData = new FormData();
   
    formData.append('fileQuery', self.state.settledMonthsExpandFileQuery);
    formData.append('showPatientName_settledMonthsExpand', self.state.showPatientName_settledMonthsExpand);
    formData.append('showPcpName_settledMonthsExpand', self.state.showPcpName_settledMonthsExpand);
    formData.append('showPcpLocation_settledMonthsExpand', self.state.showPcpLocation_settledMonthsExpand);
    formData.append('showCost_settledMonthsExpand', self.state.showCost_settledMonthsExpand);
    formData.append('showClaimType_settledMonthsExpand', self.state.showClaimType_settledMonthsExpand);
    formData.append('showMra_settledMonthsExpand', self.state.showMra_settledMonthsExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSettledMonthsExpand: btoa(JSON.stringify(object))});
   }

   getAdmissionsReportExpandDataRow(rowInfo) {
      self.state.admissionsReportExpandPatientName = rowInfo.row.patientName;
      self.state.admissionsReportExpandSubscriberId = rowInfo.row.subscriberId;
      self.state.admissionsReportExpandPcpName = rowInfo.row.pcpName;
      self.state.admissionsReportExpandEligibleMonth = rowInfo.row.eligibleMonth;
      this.toggleAdmissionsReportExpandModal();
   }

   getDuplicateClaimsExpandDataRow(rowInfo) {
      self.state.duplicateClaimsExpandMedicareId = rowInfo.row.subscriberId;
      self.state.duplicateClaimsExpandFirstServiceDate = rowInfo.row.claimDate;
      self.state.duplicateClaimsExpandServiceMonth = rowInfo.row.eligibleMonth;
      self.state.duplicateClaimsExpandPaidAmount = rowInfo.row.duplicativeCost;
      self.state.duplicateClaimsExpandClaimType = rowInfo.row.claimType;
      this.toggleDuplicateClaimsExpandModal();
   }

   getERPatientVisitExpandDataRow(rowInfo) {
      self.state.ERPatientVisitExpandReportMedicareId = rowInfo.row.hicn;
      this.togglePatientVisitExpandReportModal();
   }

   getSpecialistComparisonDataRow(rowInfo) {
      self.state.specialistComparisonSpecialityCode = rowInfo.row.specialityCode;
      self.state.specialistComparisonExpandPcpNameValue = self.state.specialistComparisonPcpNameValue;
      this.toggleSpecialistComparisonExpandReportModal();
   }

   getSpecialistComparisonExpandDataRow(rowInfo) {
      self.state.specialistComparisonPracticeName = rowInfo.row.practiceName;
      this.toggleSpecialistComparisonExpandPracticeReportModal();
   }

   getSettledMonthsReportExpandDataRow(rowInfo) {
    self.state.settledMonthsSelectedMonth = rowInfo.row.month;
      this.toggleSettledMonthsExpandModal();
   }

   getPmpmByPracticeExpandDataRow(rowInfo) {
      self.state.pmpmByPracticeSelectedPcpId = rowInfo.row.providerName;
      this.togglePmpmByPracticeExpandModal();
   }

   getBeneficiariesManagementByLocationDataRow(rowInfo)
   {
     self.state.beneficiariesManagementSelectedPcpLocation = rowInfo.row.pcpLocation;
     this.toggleBeneficiariesManagementByLocationExpandModal();
   }

   getBeneficiariesManagementDataRow(rowInfo) {
      self.state.beneficiariesManagementSelectedMedicareId = rowInfo.row.medicareId;
      this.toggleBeneficiariesManagementExpandModal();

   }

   getBeneficiariesManagementByClinicDataRow(rowInfo)
   {
      self.state.beneficiariesManagementSelectedClinicName=rowInfo.row.clinicName;
      this.toggleBeneficiariesManagementByClinicExpandModal();
   }

   getBeneficiariesManagementByDoctorDataRow(rowInfo) {
      self.state.beneficiariesManagementSelectedPcpId = rowInfo.row.pcpId;
      this.toggleBeneficiariesManagementByDoctorExpandModal();
   }

   showMembershipManagementData(patientType) {
      self.state.patientTypeClicked = patientType;
      this.toggleMembershipManagementModal();
   }

  render() {
    const data = {
  labels: [
    'Current',
    'New',
    'Termed'
  ],
  datasets: [{
    data: [this.state.currentPatients, this.state.newPatients, this.state.termedPatients],
    backgroundColor: [
    '#f37428',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#f37428',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
};

const barData = {
  labels: this.state.monthlyTotalsLabel,
  datasets: [
    {
      label: 'Total Expenses',
      backgroundColor: 'rgba(99,194,222,0.8)',
      borderColor: 'rgba(99,194,222,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(99,194,222,1)',
      hoverBorderColor: 'rgba(99,194,222,1)',
      data: this.state.monthlyTotals
    },
    {
      label: 'IPA Premium Value',
      type: 'line',
      backgroundColor: 'rgba(243,116,40,1)',
      borderColor: 'rgba(243,116,40,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(243,116,40,1)',
      hoverBorderColor: 'rgba(243,116,40,1)',
      data: this.state.monthlyIPAValue,
    }
  ]
};


const horizontalBarData = {
  labels: self.state.drugNames,//['CHENODAL 250 MG TABLET', 'ELIQUIS TAB 5MG', 'KEYTRUDA 100MG/4 ML VIAL', 'LANTUS INJ 100/ML', 'IBRANCE 125 MG CAPSULE', 'ADVAIR DISKU AER 250/50', 'XTANDI CAP 40MG'],
  datasets: [
    {
      label: 'Volume Expenditure'+' By '+self.state.prescType,
      backgroundColor: 'rgba(0,191,162,0.8)',
      borderColor: 'rgba(0,191,162,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(0,191,162,1)',
      hoverBorderColor: 'rgba(0,191,162,1)',
      data: self.state.costList//[44700, 49135, 61145, 76790, 165469, 30005, 38369]
    }
  ]
};

const horizontalBarOptions = {
  legend: {
            display: true,
            labels: {
                fontFamily:'Times New Roman',
            }
        },
  scales: {
            yAxes: [{
                ticks: {
                  fontFamily:'Times New Roman'
              }
            }],
            xAxes: [{
                ticks: {
                  fontFamily:'Times New Roman'
              }
            }]
        }
};

    return (
      <div className="animated fadeIn">
       {/*<h1>Dashboard</h1>
       <br/><br/>*/}
       <br/>
       <Row className="topMarginStyle">  
                <Col md="4">
                        <FormGroup check inline>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}><b>Health Plan</b>&nbsp;</Label>
                          <Select
                        id="claimsTotalsProviderSelect"
                        className="yearSelectStyle"
                        value={this.state.claimTotalsProviderSelect}
                        options={this.state.planList}
                        onChange={this.getClaimDetails}
                      />
                    </FormGroup>
                </Col>
                <Col md="3">
                <FormGroup check inline>
                  <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}><b>Doctor</b>&nbsp;</Label>
                    <Select
                      id="optionSelect"
                      placeholder="Select Option"
                      className="optionSelectStyle"
                      value={this.state.optionSelectValue}
                      options={this.state.pcpList}
                      onChange={this.setOptionValue}
                    />
                </FormGroup>
                </Col>
                <Col md="3">
                <FormGroup check inline>
                  <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}><b>Location</b>&nbsp;</Label>
                    {/*<Select
                      id="locationSelect"
                      placeholder="Select Location"
                      className="optionSelectStyle"

                      value={this.state.locationSelectValue}
                      options={this.state.locationList}
                      onChange={this.setLocationValue}
                    />*/}
                    
                    <ReactMultiSelectCheckboxes 
                    id="locationSelect"
                    placeholder="Select Location"
                    className="optionSelectStyle"
                    value={this.state.locationSelectValue}
                    options={this.state.locationList} 
                    onChange={this.setLocationValue}
                    />
                    
                </FormGroup>
                </Col>
                <Col md="2" id="planDropdown">
                  <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}><b>Year</b>&nbsp;</Label>
                    <Select
                      id="yearsSelect"
                      className="yearSelectStyle"
                      value={this.state.yearsSelectValue}
                      options={this.state.yearsList}
                      onChange={this.setYearValue}
                    />
                </FormGroup>
                </Col>
        </Row>
        <hr style={{marginTop:"0.3rem",marginBottom:"0rem"}}/>

        <Row>
                      <Col sm="3">
                        <div className="callout callout-info" onClick={(e) => self.goToClaimDetails()} style={{marginBottom:"0rem",cursor:"pointer"}}>
                          <small className="text-muted" >Institutional</small>
                          <br/>
                          {/*<strong className="h3" onClick={(e) => self.goToClaimDetails()} style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>{'$'+this.state.instSum.toLocaleString('en', {useGrouping:true})}</strong>*/}
                          
                            <CountUp 
                              start={0} 
                              end={this.state.instSum} 
                              duration={1}  
                              separator="," 
                              prefix="$"
                              decimals={2}
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="callout callout-danger" onClick={(e) => self.goToClaimDetails()} style={{marginBottom:"0rem",cursor:"pointer"}}>
                          <small className="text-muted">Professional</small>
                          <br/>
                          {/*<strong className="h3" onClick={(e) => self.goToClaimDetails()} style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>{'$'+this.state.profSum.toLocaleString('en', {useGrouping:true})}</strong>*/}
                          <CountUp 
                              start={0} 
                              end={this.state.profSum} 
                              duration={1} 
                              separator="," 
                              prefix="$"
                              decimals={2}
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="callout callout-warning" onClick={(e) => self.goToClaimDetails()} style={{marginBottom:"0rem",cursor:"pointer"}}>
                          <small className="text-muted">Prescription</small>
                          <br/>
                          {/*<strong className="h3" onClick={(e) => self.goToClaimDetails()} style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>{'$'+this.state.prescSum.toLocaleString('en', {useGrouping:true})}</strong>*/}
                          <CountUp 
                              start={0} 
                              end={this.state.prescSum} 
                              duration={1} 
                              separator="," 
                              prefix="$"
                              decimals={2}
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="callout callout-success" onClick={(e) => self.goToClaimDetails()} style={{marginBottom:"0rem",cursor:"pointer"}}>
                          <small className="text-muted">Specialist</small>
                          <br/>
                          {/*<strong className="h3" onClick={(e) => self.goToClaimDetails()} style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>{'$'+this.state.specSum.toLocaleString('en', {useGrouping:true})}</strong>*/}
                          <CountUp 
                              start={0} 
                              end={this.state.specSum} 
                              duration={1} 
                              separator="," 
                              prefix="$"
                              decimals={2}
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
                     
              </Row>

              <Row>
                    <Col sm="3">
                        <div className="callout callout-warning" onClick={(e) => self.goToClaimDetails()} style={{cursor:"pointer"}}>
                          <small className="text-muted">Current Month</small>
                          <br/>
                          {/*<strong className="h3" style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} onClick={(e) => self.goToClaimDetails()}>{this.state.currentMonthCount}</strong>*/}
                          <CountUp 
                              start={0} 
                              end={this.state.currentMonthCount} 
                              duration={1} 
                              separator=","
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
                      {/*<Col sm="3">
                        <div className="callout callout-primary" onClick={(e) => self.goToClaimDetails()} style={{cursor:"pointer"}}>
                          <small className="text-muted" >Of Member YTD</small>
                          <br/>
                          <strong className="h3" style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>0</strong>
                        </div>
                      </Col>*/}
                      <Col sm="3">
                        <div className="callout callout-success" onClick={(e) => self.goToClaimDetails()} style={{cursor:"pointer"}}>
                          <small className="text-muted">Total Claims Cost</small>
                          <br/>
                          {/*<strong className="h3" onClick={(e) => self.goToClaimDetails()} style={{fontWeight:600,color:'#62879A',fontFamily:'times'}}>{'$'+(this.state.specSum+this.state.instSum+this.state.profSum+this.state.prescSum).toLocaleString('en', {useGrouping:true})}</strong>*/}
                          <CountUp 
                              start={0} 
                              end={(this.state.specSum+this.state.instSum+this.state.profSum+this.state.prescSum)} 
                              duration={1} 
                              separator="," 
                              prefix="$"
                              decimals={2}
                              className="h3"  
                              style={{fontWeight:600,color:'#62879A',fontFamily:'times'}} 
                            />
                        </div>
                      </Col>
              </Row>

       <Row>
          <br />
          <br />
       

          <Col xs="12" md="6">
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <b style={{color:"#62879A",fontFamily:"serif"}}>Monthly Totals Report&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>

                 {/*<FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                      <Select
                      id="monthlyReportsProviderSelect"
                      className="yearSelectStyle"
                      value={this.state.monthlyReportsProviderSelectValue}
                      options={this.state.monthlyTotalsProviderList}
                      onChange={this.setMonthlyReportsProviderValue}
                    />
                </FormGroup>

                 <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                     
                      <Select
                      id="monthlyReportsYearSelect"
                      className="yearSelectStyle"
                      value={this.state.monthlyReportsYearsSelectValue}
                      options={this.state.monthlyReportYearsList}
                      onChange={this.setMonthlyReportsYearValue}
                    />
                </FormGroup>*/}

              </CardHeader>
              <CardBody>
               <Col md="9">
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="monthly" name="monthly" value="monthly" onChange={(e) => self.getMonthlyTotalsReport('monthly')}/>
                          <Label className="form-check-label" check htmlFor="monthly">Monthly</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="quarterly" name="monthly" value="quarterly" onChange={(e) => self.getMonthlyTotalsReport('quarterly')}/>
                          <Label className="form-check-label" check htmlFor="quarterly">Quarterly</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="annual" name="monthly" value="annual" onChange={(e) => self.getMonthlyTotalsReport('annual')}/>
                          <Label className="form-check-label" check htmlFor="quarterly">Annual</Label>
                        </FormGroup>
                </Col>
                <div style={{height:360,width:474}}>
                 <Bar
                    data={barData}
                    width={100}
                    height={50}
                    options={{
                      maintainAspectRatio: false
                    }}
                  />
                  </div>
              </CardBody>
              {/*<CardFooter style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <Row>
                  <Col md="1">
                    <i class="fa fa-file-pdf-o fa-lg" title="Save as PDF" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-print fa-lg" title="Print" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-file fa-lg" title="Export" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-envelope-o fa-lg" title="Message" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-eye fa-lg" title="View All" style={{cursor:"pointer"}}></i>
                  </Col>
                </Row>
              </CardFooter>*/}
            </Card>
          </Col>

          <Col xs="12" md="6" >
            <Card style={{height:461}}>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <b style={{color:"#62879A",fontFamily:"serif"}}>Membership Management</b>
              </CardHeader>
              <CardBody>
              {/*<Row>
              <Col md="9" id="memberPlanDropdown">
              </Col>
              <Col md="3" id="memberPlanDropdown">
                  <Select
                      id="membershipProviderSelect"
                      className="yearSelectStyle"
                      value={this.state.membershipManagementProviderSelectValue}
                      options={this.state.monthlyTotalsProviderList}
                      onChange={this.setMembershipManagementProviderValue}
                    />
                </Col>
                </Row>*/}
                <div>
                
                <div style={{height:260,width:474}}>
                    <Doughnut data={data} onElementsClick={element => self.showMembershipManagementData(element[0]._model.label)}
                    />
                </div>
                 <Row>
                  <Col md="4">
                  </Col>
                  <Col md="5">
                    <div style={{color:"#717171",fontWeight:600}}>&nbsp;&nbsp;&nbsp;&nbsp;Current: {this.state.currentPatients}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                  </Col>
                  <Col md="5">
                    <div style={{color:"#717171",fontWeight:600}}>&nbsp;&nbsp;&nbsp;&nbsp;New: {this.state.newPatients}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                  </Col>
                  <Col md="5">
                    <div style={{color:"#717171",fontWeight:600}}>&nbsp;&nbsp;&nbsp;&nbsp;Termed: {this.state.termedPatients}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                  </Col>
                  <Col md="5">
                    <div style={{color:"#717171",fontWeight:600}}>&nbsp;&nbsp;&nbsp;&nbsp;Net Impact: {this.state.netImpact}</div>
                  </Col>
                </Row>
                </div>
              </CardBody>
              {/*<CardFooter style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <Row>
                  <Col md="1">
                    <i class="fa fa-file-pdf-o fa-lg" title="Save as PDF" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-print fa-lg" title="Print" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-file fa-lg" title="Export" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-envelope-o fa-lg" title="Message" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-eye fa-lg" title="View All" style={{cursor:"pointer"}}></i>
                  </Col>
                </Row>
              </CardFooter>*/}
            </Card>
          </Col>

          {/*<Col xs="12" md="6">
            <Card>
              <CardHeader>
                <b>Switch default</b>
              </CardHeader>
              <CardBody>
                <div style={{height:360,width:474}}>
                  <Pie data={pieData} />
                </div>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col md="1">
                    <i class="fa fa-file-pdf-o fa-lg" title="Save as PDF" style={{cursor:"pointer"}}></i>
                  </Col>
                  {/*<Col md="1">
                    <i class="fa fa-print fa-lg" title="Print" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-file fa-lg" title="Export" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-envelope-o fa-lg" title="Message" style={{cursor:"pointer"}}></i>
                  </Col>
                  <Col md="1">
                    <i class="fa fa-eye fa-lg" title="View All" style={{cursor:"pointer"}}></i>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>*/}
          
       </Row>
       <Row>
       <Col xs="12" md="12">
            <Card>
              <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <b className="commonFontFamilyColor">Reports</b>
              </CardHeader>
              <CardBody>
              <Row>
                
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleLarge}>Duplicate Claims Report</Label>
                  </FormGroup>
                </Col>  
                <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleAdmissionsReportModal}>Admissions Report</Label>
                  </FormGroup>
                </Col>  
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleSpecialistComparisonReportModal}>Specialist Comparison Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.togglePatientVisitReportModal}>ER Patient Visit Report</Label>
                  </FormGroup>
                 </Col>
                 <Col md="3"> 
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleSummaryReportModal}>Summary Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleSettledMonthsModal}>Settled Months</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.togglePmpmByPracticeModal}>PMPM by Practice</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleBeneficiariesManagementModal}>Beneficiaries Management Report</Label>
                  </FormGroup>
                  </Col>
                  <Col md="3">
                  <FormGroup check inline style={{alignItems:"end"}}>
                    <i class="icon-notebook icons font-2xl d-block reportIconColor"></i>
                    <Label style={{cursor:"pointer"}} className="commonFontFamilyColor" onClick={this.toggleReinsuranceManagementModal}>Reinsurance Report</Label>
                  </FormGroup>
                  </Col>
              </Row>
                
              </CardBody>
              {/*<CardFooter style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                <Row>
                </Row>
              </CardFooter>*/}
            </Card>
          </Col>
          </Row>
       
          <Row>
           <Col xs="12" md="12">
                <Card>
                  <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                  <Row>
                    <Col md="5">
                      <b style={{color:"#62879A",fontFamily:"serif",fontSize:"medium",textTransform:"capitalize",fontWeight:100}}>Top 20 Prescription Drugs</b>
                    </Col>
                    <Col md="3" id="planDropdown">
                        <Col md="8">
                        {/*<Input type="select" style={{height:24,fontSize:10,fontFamily:'times'}} name="provider" id="providerSelect" onChange={this.handleProviderSelect}>
                        <option value="all">All</option>
                        {
                          this.state.planList.map(function(plan, i) {
                          return <option key={i}>{plan.value}</option>
                          })
                        }
                      </Input>*/}
                      <Select
                        id="providerSelect"
                        className="commonFontFamily"
                        value={this.state.providerSelectValue}
                        options={this.state.drugsPlansList}
                        onChange={this.handleProviderSelect}
                      />
                      </Col>
                    </Col>
                    <Col md="4">  
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="byCost" name="volumeRadio" style={{outline:"none"}} onClick={(e) => self.getPrescriptionDrugs('Cost')} /><a style={{color:"#62879A",fontFamily:"serif"}}>By Cost{' '}</a>
                      </FormGroup>
                      <FormGroup check inline>  
                        <Input className="form-check-input" type="radio" id="byVolumeCost" name="volumeRadio" style={{outline:"none"}} onClick={(e) => self.getPrescriptionDrugs('Volume Cost')} /><a style={{color:"#62879A",fontFamily:"serif"}}>By Volume Cost{' '}</a>
                      </FormGroup>
                      <FormGroup check inline>  
                        <Input className="form-check-input" type="radio" id="byVolume" name="volumeRadio" style={{outline:"none"}} onClick={(e) => self.getPrescriptionDrugs('Volume')} /><a style={{color:"#62879A",fontFamily:"serif"}}>By Volume</a>
                      </FormGroup>
                    </Col>
                   </Row> 
                  </CardHeader>
                  <CardBody>
                    
                  <Row>  
                    <Col md="8">
                            {/*<FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="byPlan" name="inline-radios" value="option1" onChange={(e) => self.changePlan('plan')} />
                              <Label className="form-check-label" check htmlFor="inline-radio1">By Plan</Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="byPCP" name="inline-radios" value="option2" onChange={(e) => self.changePlan('pcp')}/>
                              <Label className="form-check-label" check htmlFor="inline-radio2">By PCP</Label>
                            </FormGroup>*/}
                    </Col>
                    
                    {/*<Col md="4" id="pcpDropdown">
                      <Input type="select" name="pcp" id="pcpSelect" onChange={this.handlePcpSelect}>
                      <option>All</option>
                      {
                        this.state.pcpList.map(function(pcp, i) {
                        return <option key={i}>{pcp}</option>
                        })
                      }
                    </Input>
                    </Col>*/}
                    {/*<Col md="3">
                      <Button color="primary" size="sm">View All</Button>
                    </Col>*/}
                  </Row>
                    <div>
                      <Bar data={horizontalBarData} options={horizontalBarOptions}/>
                    </div>
                  </CardBody>
                  {/*<CardFooter style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
                    <Row>
                      <Col md="1">
                        {/*<i class="fa fa-file-pdf-o fa-lg" title="Save as PDF" style={{cursor:"pointer"}} onClick={(e) => self.saveHorizontalBarAsPdf(e)}></i>*/}
                       {/*} <img src="/img/pdf.png" title="Save as PDF" style={{cursor:"pointer"}} onClick={(e) => self.saveHorizontalBarAsPdf(e)}/>
                      </Col>
                      <Col md="1">
                        <i class="fa fa-print fa-lg" title="Print" style={{cursor:"pointer"}}></i>
                      </Col>
                      <Col md="1">
                        <i class="fa fa-file fa-lg" title="Export" style={{cursor:"pointer"}}></i>
                      </Col>
                      <Col md="1">
                        <i class="fa fa-envelope-o fa-lg" title="Message" style={{cursor:"pointer"}}></i>
                      </Col>
                      <Col md="1">
                        <i class="fa fa-eye fa-lg" title="View All" style={{cursor:"pointer"}}></i>
                      </Col>
                    </Row>
                  </CardFooter>*/}
                </Card>
              </Col>
              </Row>



       <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleLarge}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Duplicate Claims Report</b>
                      </Col>
                     
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="duplicateClaimsProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.duplicateClaimsProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setDuplicateClaimsProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Option"
                          className="pcpNameSelectStyle"
                          value={this.state.duplicateClaimsPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setDuplicateClaimsPcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="duplicateClaimsYearSelect"
                              className="yearSelectStyle"
                              value={this.state.duplicateClaimsYearSelectValue}
                              options={this.state.yearsList}
                              onChange={this.setDuplicateClaimsYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_duplicateClaims()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderDuplicateClaimsXLSX/'+self.state.jsonDataForDuplicateClaims} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderDuplicateClaimsPDF/'+self.state.jsonDataForDuplicateClaims} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemSubscriberId_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("subscriberId")}>HICN/Subscriber ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPlanName_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcp_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("pcp")}>PCP</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDuplicativeCost_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("duplicativeCost")}>Duplicative Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.duplicateClaimsReportData}
                              loading={this.state.loading}
                              pages={this.state.duplicateClaimsPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "HICN/Subscriber ID",
                                      accessor: "subscriberId",
                                      show: this.state.showSubscriberId_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP",
                                      accessor: "pcp",
                                      show: this.state.showPcp_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show: this.state.showEligibleMonth_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Duplicative Cost",
                                      accessor: "duplicativeCost",
                                      show: this.state.showDuplicativeCost_duplicate,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.duplicateClaimsTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "HICN/Subscriber ID") {
                                        self.getDuplicateClaimsExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "HICN/Subscriber ID" ? "#337ab7" : "",
                                      cursor: column.Header === "HICN/Subscriber ID" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Duplicate Claims expand modal*****************/}
                <Modal isOpen={this.state.duplicateClaimsExpandModal} toggle={this.toggleDuplicateClaimsExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200,zIndex:"9999"}}>
                  <ModalHeader toggle={this.toggleDuplicateClaimsExpandModal}>
                   
                      <div className="duplicateClaimsHeader">
                        <b>Duplicate Claims - Details</b>
                      </div>

                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_duplicateClaimsExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderDuplicateClaimsExpandXLSX/'+self.state.jsonDataForDuplicateClaimsExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderDuplicateClaimsExpandPDF/'+self.state.jsonDataForDuplicateClaimsExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[14]} toggle={() => {
                                this.toggle(14);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  {/*<DropdownItem id="ddItemClaimId_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimId")}>Claim Id</DropdownItem>*/}
                                  <DropdownItem toggle={false} id="ddItemClaimDate_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProviderName_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("providerName")}>Provider Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("icdCodes")}>ICD 9/10 Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("hccCodes")}>HCC Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.duplicateClaimsExpandData}
                              loading={this.state.duplicateClaimsExpandLoading}
                              pages={this.state.duplicateClaimsExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Provider Name",
                                      accessor: "providerName",
                                      show: this.state.showProviderName_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Betos Cat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD 9/10 Code(s)",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Code(s)",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_duplicateClaimsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchDuplicateClaimsExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.duplicateClaimsExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

                
              {/**************Admissions Report modal*****************/}
                <Modal isOpen={this.state.admissionsReportModal} toggle={this.toggleAdmissionsReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleAdmissionsReportModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Admissions Report - Details</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="duplicateClaimsProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.admissionsReportProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setAdmissionsReportProviderValue}
                        />

                      <FormGroup check inline>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                          <Select
                            placeholder="Select Doctor"
                            className="pcpNameSelectStyle"
                            value={this.state.admissionsReportPcpNameValue}
                            options={this.state.pcpReportList}
                            onChange={this.setAdmissionsReportPcpName}
                          />
                      </FormGroup>

                    </FormGroup>
                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="admissionsReportYearSelect"
                              className="yearSelectStyle"
                              value={this.state.admissionsReportYearSelectValue}
                              options={this.state.yearsList}
                              onChange={this.setAdmissionsReportYearValue}
                            />
                            </FormGroup>
                            &nbsp;
                            &nbsp;
                             <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportHeaderXLSX/'+self.state.jsonDataForAdmissionsReportHeader} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportHeaderPDF/'+self.state.jsonDataForAdmissionsReportHeader} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>

                        


                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_admissionsReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportXLSX/'+self.state.jsonDataForAdmissionsReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportPDF/'+self.state.jsonDataForAdmissionsReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPatientName_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSubscriberId_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("subscriberId")}>HICN/Subscriber ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalNoOfAdmissions_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("totalNoOfAdmissions")}>Total Number Of Admissions</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_admissions" className="commonFontFamily" onClick={e => self.showHideColumn_admissions("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.admissionsReportData}
                              loading={this.state.loading}
                              pages={this.state.admissionsReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN/Subscriber ID",
                                      accessor: "subscriberId",
                                      show: this.state.showSubscriberId_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show: this.state.showEligibleMonth_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Number Of Addmissions",
                                      accessor: "totalNoOfAdmissions",
                                      show: this.state.showTotalNoOfAdmissions_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_admissions,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchAdmissionsReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.admissionsReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "HICN/Subscriber ID") {
                                        self.getAdmissionsReportExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "HICN/Subscriber ID" ? "#337ab7" : "",
                                      cursor: column.Header === "HICN/Subscriber ID" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>


              {/**************Admissions Report expand modal*****************/}
                <Modal isOpen={this.state.admissionsReportExpandModal} toggle={this.toggleAdmissionsReportExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200,zIndex:"9999"}}>
                  <ModalHeader toggle={this.toggleAdmissionsReportExpandModal}>
                   
                      <div className="duplicateClaimsHeader">
                        <b>Admissions Report - Details</b>
                      </div>

                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_admissionsReportExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportExpandXLSX/'+self.state.jsonDataForAdmissionsReportExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderAdmissionsReportExpandPDF/'+self.state.jsonDataForAdmissionsReportExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[2]} toggle={() => {
                                this.toggle(2);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemClaimId_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("betosCat")}>Betos Cat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.admissionsReportExpandData}
                              loading={this.state.admissionsReportExpandLoading}
                              pages={this.state.admissionsReportExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_admissionsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchAdmissionsReportExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.admissionsReportExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {

                                    },
                                    style: {
                                      
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Specialist Comparison Report modal*****************/}
                <Modal isOpen={this.state.specialistComparisonReportModal} toggle={this.toggleSpecialistComparisonReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSpecialistComparisonReportModal}>
                   <Row>
                   <Col>
                      <div className="duplicateClaimsHeader">
                        <b>Specialist Comparison Report</b>
                      </div>
                  </Col>    
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="duplicateClaimsProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.specialistComparisonProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setSpecialistComparisonProviderValue}
                        />

                      <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.specialistComparisonPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setSpecialistComparisonPcpName}
                        />
                    </FormGroup>

                    </FormGroup>
                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="specialistComparisonReportYearSelect"
                              className="yearSelectStyle"
                              value={this.state.specialistComparisonReportYearSelectValue}
                              options={this.state.yearsList}
                              onChange={this.setSpecialistComparisonReportYearValue}
                            />
                        </FormGroup>
                      
                    </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_specialistComparisonReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonReportXLSX/'+self.state.jsonDataForSpecialistComparisonReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonReportPDF/'+self.state.jsonDataForSpecialistComparisonReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                                this.toggle(3);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemSpecialityCode_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("specialityCode")}>Speciality Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfPcp_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfPcp")}>Number Of PCP</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfBeneficiaries_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfBeneficiaries")}>Number Of Beneficiaries</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCostPerClaim_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("costPerClaim")}>Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCostPerBeneficiary_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("costPerBeneficiary")}>Cost Per Beneficiary</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.specialistComparisonReportData}
                              loading={this.state.specialistComparisonReportLoading}
                              pages={this.state.specialistComparisonReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Speciality Code",
                                      accessor: "specialityCode",
                                      show: this.state.showSpecialityCode_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Number Of PCP",
                                      accessor: "numberOfPcp",
                                      show: this.state.showNoOfPcp_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Number Of Beneficiaries",
                                      accessor: "numberOfBeneficiaries",
                                      show: this.state.showNoOfBeneficiaries_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Cost Per Claim",
                                      accessor: "costPerClaim",
                                      show: this.state.showCostPerClaim_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Cost Per Beneficiary",
                                      accessor: "costPerBeneficiary",
                                      show: this.state.showCostPerBeneficiary_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_specialistComparison,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterable: false,
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Speciality Code") {
                                        self.getSpecialistComparisonDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "Speciality Code" ? "#337ab7" : "",
                                      cursor: column.Header === "Speciality Code" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>


              {/**************Specialist Comparison Expand Report modal*****************/}
                <Modal isOpen={this.state.specialistComparisonExpandReportModal} toggle={this.toggleSpecialistComparisonExpandReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSpecialistComparisonExpandReportModal}>
                   <Row>
                   <Col>
                      <div className="duplicateClaimsHeader">
                        <b>Specialist Comparison Report - {self.state.specialistComparisonSpecialityCode} Details</b>
                      </div>
                  </Col>    
                     
                    </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_specialistComparisonReportExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportXLSX/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportPDF/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[15]} toggle={() => {
                                this.toggle(15);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemSpecialityType_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("specialityType")}>Speciality Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageCostPerClaim_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("averageCostPerClaim")}>Average Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.specialistComparisonExpandReportData}
                              loading={this.state.specialistComparisonExpandReportLoading}
                              pages={this.state.specialistComparisonExpandReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Practice Name",
                                      accessor: "practiceName",
                                      show: this.state.showPracticeName_specialistComparisonExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Speciality Type",
                                      accessor: "specialityType",
                                      show: this.state.showSpecialityType_specialistComparisonExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparisonExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Average Cost Per Claim",
                                      accessor: "averageCostPerClaim",
                                      show: this.state.showAverageCostPerClaim_specialistComparisonExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_specialistComparisonExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonExpandReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonExpandReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Practice Name") {
                                        self.getSpecialistComparisonExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "Practice Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Practice Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Specialist Comparison Expand Practice modal*****************/}
                <Modal isOpen={this.state.specialistComparisonExpandPracticeReportModal} toggle={this.toggleSpecialistComparisonExpandPracticeReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSpecialistComparisonExpandPracticeReportModal}>
                   <Row>
                   <Col>
                      <div className="duplicateClaimsHeader">
                        <b>Specialist Comparison Report Practice Details</b>
                      </div>
                  </Col>    
                      <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.specialistComparisonExpandPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setSpecialistComparisonExpandPcpName}
                        />
                    </FormGroup>
                    </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_specialistComparisonReportExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportXLSX/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportPDF/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[23]} toggle={() => {
                                this.toggle(23);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemSpecialityType_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("specialityType")}>Speciality Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageCostPerClaim_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("averageCostPerClaim")}>Average Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.specialistComparisonExpandPracticeReportData}
                              loading={this.state.specialistComparisonExpandPracticeReportLoading}
                              pages={this.state.specialistComparisonExpandPracticeReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Practice Name",
                                      accessor: "practiceName",
                                      show: this.state.showPracticeName_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Speciality Type",
                                      accessor: "specialityType",
                                      show: this.state.showSpecialityType_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Average Cost Per Claim",
                                      accessor: "averageCostPerClaim",
                                      show: this.state.showAverageCostPerClaim_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_specialistComparisonExpandPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonExpandPracticeReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonExpandPracticeReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Patient Visit Report modal*****************/}
                <Modal isOpen={this.state.patientVisitReportModal} toggle={this.togglePatientVisitReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.togglePatientVisitReportModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Frequent ER Visit</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="erPatientVisitProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.patientVisitProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setPatientVisitProviderValue}
                        />
                        </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                          <Select
                            placeholder="Select Doctor"
                            className="pcpNameSelectStyle"
                            value={this.state.erPatientVisitPcpNameValue}
                            options={this.state.pcpReportList}
                            onChange={this.setERPatientVisitPcpName}
                          />
                        </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="patientVisitReportYearSelect"
                              className="yearSelectStyle"
                              value={this.state.patientVisitReportYearSelectValue}
                              options={this.state.yearsList}
                              onChange={this.setPatientVisitReportYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_patientVisitReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPatientVisitReportXLSX/'+self.state.jsonDataForPatientVisitReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPatientVisitReportPDF/'+self.state.jsonDataForPatientVisitReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[4]} toggle={() => {
                                this.toggle(4);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPatientName_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHicn_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("hicn")}>HICN</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaEffectiveDate_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("ipaEffectiveDate")}>IPA Effective Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalErVisits_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("totalErVisits")}>Total Number Of ER Visits</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_patientVisit" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisit("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.patientVisitReportData}
                              loading={this.state.patientVisitReportLoading}
                              pages={this.state.patientVisitReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN",
                                      accessor: "hicn",
                                      show: this.state.showHicn_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Effective Date",
                                      accessor: "ipaEffectiveDate",
                                      show: this.state.showIpaEffectiveDate_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Number Of ER Visits",
                                      accessor: "totalErVisits",
                                      show: this.state.showTotalErVisits_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_patientVisit,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPatientVisitReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.patientVisitReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "HICN") {
                                        self.getERPatientVisitExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "HICN" ? "#337ab7" : "",
                                      cursor: column.Header === "HICN" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>


              {/**************Patient Visit Expand Report modal*****************/}
                <Modal isOpen={this.state.patientVisitExpandReportModal} toggle={this.togglePatientVisitExpandReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.togglePatientVisitExpandReportModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>ER Patient Visit Report - Details</b>
                      </Col>
                      
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_patientVisitExpandReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPatientVisitExpandReportXLSX/'+self.state.jsonDataForPatientVisitExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPatientVisitExpandReportPDF/'+self.state.jsonDataForPatientVisitExpandReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[11]} toggle={() => {
                                this.toggle(11);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.patientVisitExpandReportData}
                              loading={this.state.patientVisitExpandReportLoading}
                              pages={this.state.patientVisitExpandReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_patientVisitExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPatientVisitExpandReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.patientVisitExpandReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Summary Report modal*****************/}
                <Modal isOpen={this.state.summaryReportModal} toggle={this.toggleSummaryReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSummaryReportModal}>
                   <Row>
                      <Col className="duplicateClaimsHeader">
                        <b>Summary Report</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="summaryReportsProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.summaryReportsProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setSummaryReportsProviderValue}
                        />
                    </FormGroup>
                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="summaryReportYearSelect"
                              className="yearSelectStyle"
                              value={this.state.summaryReportYearSelectValue}
                              options={this.state.summaryReportYearsList}
                              onChange={this.setSummaryReportYearValue}
                            />
                        </FormGroup>
                     </Row> 
                  
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_summaryReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSummaryReportXLSX/'+self.state.jsonDataForSummaryReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSummaryReportPDF/'+self.state.jsonDataForSummaryReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                                this.toggle(5);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMonth_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("month")}>Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMembers_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("members")}>Members</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMaPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("maPremium")}>Ma Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPartDPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("partDPremium")}>Part D Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("totalPremium")}>Total Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("ipaPremium")}>IPA Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpCap_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pcpCap")}>PCP Cap</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecCost_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("specCost")}>Spec Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProfClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("profClaims")}>Prof Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemInstClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("instClaims")}>Inst Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRxClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("rxClaims")}>Rx Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIbnrDollars_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("ibnrDollars")}>IBNR Dollars</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemReinsurancePremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("reinsurancePremium")}>Reinsurance Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecCap_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("specCap")}>Spec Cap</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalExpenses_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("totalExpenses")}>Total Expenses</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemReinsuranceRecovered_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("reinsuranceRecovered")}>Reinsurance Recovered</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRxAdmin_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("rxAdmin")}>Rx Admin</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSilverSneakerUtilization_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("silverSneakerUtilization")}>Silver Sneaker Utilization</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPba_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pba")}>PBA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHumanaAtHome_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("humanaAtHome")}>Humana at Home</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDentalFFS_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("dentalFFS")}>Dental FFS</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.summaryReportData}
                              loading={this.state.summaryReportLoading}
                              pages={this.state.summaryReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Month",
                                      accessor: "month",
                                      show: this.state.showMonth_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Members",
                                      accessor: "members",
                                      show: this.state.showMembers_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Ma Premium",
                                      accessor: "maPremium",
                                      show: this.state.showMaPremium_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Part D Premium",
                                      accessor: "partDPremium",
                                      show: this.state.showPartDPremium_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Premium",
                                      accessor: "totalPremium",
                                      show: this.state.showTotalPremium_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: this.state.showPcpCap_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: this.state.showSpecCost_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: this.state.showProfClaims_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: this.state.showInstClaims_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Rx Claims",
                                      accessor: "rxClaims",
                                      show: this.state.showRxClaims_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IBNR Dollars",
                                      accessor: "ibnrDollars",
                                      show: this.state.showIbnrDollars_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Premium",
                                      accessor: "reinsurancePremium",
                                      show: this.state.showReinsurancePremium_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cap",
                                      accessor: "specCap",
                                      show: this.state.showSpecCap_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses",
                                      accessor: "totalExpenses",
                                      show: this.state.showTotalExpenses_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance recovered",
                                      accessor: "reinsuranceRecovered",
                                      show: this.state.showReinsuranceRecovered_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Rx Admin",
                                      accessor: "rxAdmin",
                                      show: this.state.showRxAdmin_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Silver Sneaker Utilization",
                                      accessor: "silverSneakerUtilization",
                                      show: this.state.showSilverSneakerUtilization_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PBA",
                                      accessor: "pba",
                                      show: this.state.showPba_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Humana at Home",
                                      accessor: "humanaAtHome",
                                      show: this.state.showHumanaAtHome_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Dental FFS",
                                      accessor: "dentalFFS",
                                      show: this.state.showDentalFFS_summary,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSummaryReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.summaryReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Settled Months Report modal*****************/}
                <Modal isOpen={this.state.settledMonthsModal} toggle={this.toggleSettledMonthsModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSettledMonthsModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Settled Months</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="settledMonthsProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.settledMonthsProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setSettledMonthsProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.settledMonthsPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setSettledMonthsPcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="settledMonthsYearSelect"
                              className="yearSelectStyle"
                              value={this.state.settledMonthsYearSelectValue}
                              options={this.state.monthlyReportYearsList}
                              onChange={this.setSettledMonthsYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_settledMonthsReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSettledMonthsReportXLSX/'+self.state.jsonDataForSettledMonths} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSettledMonthsReportPDF/'+self.state.jsonDataForSettledMonths} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[6]} toggle={() => {
                                this.toggle(6);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMonth_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("month")}>Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMembership_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("membership")}>Membership</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaPremium_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("ipaPremium")}>Ipa Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalExpenses_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("totalExpenses")}>Total Expenses</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemStoploss_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("stoploss")}>StopLoss</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNetPremium_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("netPremium")}>Net Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRiskSharing_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("riskSharing")}>Risk Sharing</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSurplusDeficit_settledMonths" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonths("surplusDeficit")}>Surplus/Deficit</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.settledMonthsData}
                              loading={this.state.settledMonthsLoading}
                              pages={this.state.settledMonthsPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Month",
                                      accessor: "month",
                                      show: this.state.showMonth_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Membership",
                                      accessor: "membership",
                                      show: this.state.showMembership_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Ipa Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses",
                                      accessor: "totalExpenses",
                                      show: this.state.showTotalExpenses_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "StopLoss",
                                      accessor: "stoploss",
                                      show: this.state.showStopLoss_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Net Premium",
                                      accessor: "netPremium",
                                      show: this.state.showNetPremium_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Risk Sharing",
                                      accessor: "riskSharing",
                                      show: this.state.showRiskSharing_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Surplus/Deficit",
                                      accessor: "surplusDeficit",
                                      show: this.state.showSurplusDeficit_settledMonths,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSettledMonthsData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.settledMonthsTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Month") {
                                        self.getSettledMonthsReportExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "Month" ? "#337ab7" : "",
                                      cursor: column.Header === "Month" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>

                {/**************Settled Months Expand Report modal*****************/}
                <Modal isOpen={this.state.settledMonthsExpandModal} toggle={this.toggleSettledMonthsExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleSettledMonthsExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Settled Months - Details</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_settledMonthsExpandReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSettledMonthsExpandReportXLSX/'+self.state.jsonDataForSettledMonthsExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderSettledMonthsExpandReportPDF/'+self.state.jsonDataForSettledMonthsExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[7]} toggle={() => {
                                this.toggle(7);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPatientName_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("cost")}>Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_settledMonthsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_settledMonthsExpand("mra")}>MRA</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.settledMonthsExpandData}
                              loading={this.state.settledMonthsExpandLoading}
                              pages={this.state.settledMonthsExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_settledMonthsExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSettledMonthsExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.settledMonthsExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************PMPM by Practice Report modal*****************/}
                <Modal isOpen={this.state.pmpmByPracticeModal} toggle={this.togglePmpmByPracticeModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.togglePmpmByPracticeModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>PMPM By Practice</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="pmpmByPracticeProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.pmpmByPracticeProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setPmpmByPracticeProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.pmpmByPracticePcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setPmpmByPracticePcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              id="pmpmByPracticeYearSelect"
                              className="yearSelectStyle"
                              value={this.state.pmpmByPracticeYearSelectValue}
                              options={this.state.summaryReportYearsList}
                              onChange={this.setPmpmByPracticeYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_pmpmByPracticeReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPmpmByPracticeReportXLSX/'+self.state.jsonDataForPmpmByPractice} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPmpmByPracticeReportPDF/'+self.state.jsonDataForPmpmByPractice} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[8]} toggle={() => {
                                this.toggle(8);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemFacilityLocationName_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("facilityLocationName")}>Facility Location Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProviderName_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("providerName")}>Provider Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalCost")}>Total Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalMemberMonth_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalNumberOfMemberMonth")}>Total Number of Member Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPMPM_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("pmpm")}>PMPM</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPMPY_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("pmpy")}>PMPY</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalPremium_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalPremium")}>Total Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaPremium_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("ipaPremium")}>IPA Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDifference_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("difference")}>Total Premium - IPA Premium</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.pmpmByPracticeData}
                              loading={this.state.pmpmByPracticeLoading}
                              pages={this.state.pmpmByPracticePages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Facility Location Name",
                                      accessor: "facilityLocationName",
                                      show: this.state.showFacilityLocationName_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Provider Name",
                                      accessor: "providerName",
                                      show: this.state.showProviderName_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Number of Member Month",
                                      accessor: "totalNumberOfMemberMonth",
                                      show: this.state.showTotalNumberOfMemberMonth_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PMPM",
                                      accessor: "pmpm",
                                      show: this.state.showPMPM_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PMPY",
                                      accessor: "pmpy",
                                      show: this.state.showPMPY_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Premium",
                                      accessor: "totalPremium",
                                      show: this.state.showTotalPremium_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Premium - IPA Premium",
                                      accessor: "difference",
                                      show: this.state.showDifference_pmpmByPractice,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPmpmByPracticeData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.pmpmByPracticeTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Total Number of Member Month") {
                                        self.getPmpmByPracticeExpandDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Total Number of Member Month" ? "#337ab7" : "",
                                      cursor: column.Header === "Total Number of Member Month" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>


                {/**************PMPM by Practice Expand Report modal*****************/}
                <Modal isOpen={this.state.pmpmByPracticeExpandModal} toggle={this.togglePmpmByPracticeExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.togglePmpmByPracticeExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>PMPM By Practice - Details</b>
                      </Col>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_pmpmByPracticeExpandReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPmpmByPracticeExpandReportXLSX/'+self.state.jsonDataForPmpmByPracticeExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPmpmByPracticeExpandReportPDF/'+self.state.jsonDataForPmpmByPracticeExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[10]} toggle={() => {
                                this.toggle(10);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPatientName_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("cost")}>Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("claimType")}>Claim Type</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.pmpmByPracticeExpandData}
                              loading={this.state.pmpmByPracticeExpandLoading}
                              pages={this.state.pmpmByPracticeExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_pmpmByPracticeExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPmpmByPracticeExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.pmpmByPracticeExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Total Number of Member Month") {
                                        //self.getPmpmByPracticeExpandDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Total Number of Member Month" ? "#337ab7" : "",
                                      cursor: column.Header === "Total Number of Member Month" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>


              {/**************Patients List Modal*****************/}
                <Modal isOpen={this.state.membershipManagementModal} toggle={this.toggleMembershipManagementModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleMembershipManagementModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>{this.state.patientTypeClicked} Patient List</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_membershipManagement()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderMembershipManagementXLSX/'+self.state.jsonDataForMembershipManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderMembershipManagementPDF/'+self.state.jsonDataForMembershipManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[9]} toggle={() => {
                                this.toggle(9);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPlanName_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMedicareId_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("medicareId")}>Medicare ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemInsuranceId_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("insuranceId")}>Insurance ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientDob_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("patientDob")}>Patient DOB</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAssignedPcp_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("assignedPcp")}>Assigned PCP</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaEffectiveDate_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("ipaEffectiveDate")}>IPA Effective Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalPatientCost_membershipManagement" className="commonFontFamily" onClick={e => self.showHideColumn_membershipManagement("totalPatientCost")}>Total Patient Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.membershipManagementData}
                              loading={this.state.membershipManagementLoading}
                              pages={this.state.membershipManagementPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Medicare ID",
                                      accessor: "medicareId",
                                      show: this.state.showMedicareId_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Insurance ID",
                                      accessor: "insuranceId",
                                      show: this.state.showInsuranceId_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient DOB",
                                      accessor: "patientDob",
                                      show: this.state.showPatientDob_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Assigned PCP",
                                      accessor: "assignedPcp",
                                      show: this.state.showAssignedPcp_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Effective Date",
                                      accessor: "ipaEffectiveDate",
                                      show: this.state.showIpaEffectiveDate_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Patient Cost",
                                      accessor: "totalPatientCost",
                                      show: this.state.showTotalPatientCost_membershipManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchMembershipManagementData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.membershipManagementTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Beneficiaries Management Report Modal*****************/}
                <Modal isOpen={this.state.beneficiariesManagementModal} toggle={this.toggleBeneficiariesManagementModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleBeneficiariesManagementModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Beneficiaries Management Report - Details</b>
                      </Col>

                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          
                          className="yearSelectStyle"
                          value={this.state.beneficiariesManagementProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setBeneficiariesManagementProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.beneficiariesManagementPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setBeneficiariesManagementPcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              
                              className="yearSelectStyle"
                              value={this.state.beneficiariesManagementYearSelectValue}
                              options={this.state.summaryReportYearsList}
                              onChange={this.setBeneficiariesManagementYearValue}
                            />
                        </FormGroup>

                  </Row>
                  </ModalHeader>
                  <ModalBody>

                  <Nav tabs className="commonFontColor">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggleReportsTab('1'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Patients</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggleReportsTab('2'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Doctors</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '3' })}
                        onClick={() => { this.toggleReportsTab('3'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Location</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '4' })}
                        onClick={() => { this.toggleReportsTab('4'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Clinic</b></Label>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagement()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementXLSX/'+self.state.jsonDataForBeneficiariesManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementPDF/'+self.state.jsonDataForBeneficiariesManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[12]} toggle={() => {
                                this.toggle(12);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemPlanName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHicn_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("hicn")}>HICN/ Subscriber ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDob_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("dob")}>DOB</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("totalCost")}>Total Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAddress_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("address")}>Address</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRecentAppointmentDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("recentAppointmentDate")}>Recent Appointment Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNextAppointmentDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("nextAppointmentDate")}>Next Appointment Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemFacilityLocation_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("facilityLocation")}>Facility Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPhoneNumber_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("phoneNumber")}>Phone Number</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemLastClaimsDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("lastClaimsDate")}>Last Claims Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCode_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("icdCode")}>ICD 9/10 Code</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementData}
                              loading={this.state.beneficiariesManagementLoading}
                              pages={this.state.beneficiariesManagementPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN/SubscriberID",
                                      accessor: "hicn",
                                      show: this.state.showHicn_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DOB",
                                      accessor: "dob",
                                      show: this.state.showDob_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show: this.state.showEligibleMonth_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Address",
                                      accessor: "address",
                                      show: this.state.showAddress_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Recent Appointment Date",
                                      accessor: "recentAppointmentDate",
                                      show: this.state.showRecentAppointmentDate_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Next Appointment Date",
                                      accessor: "nextAppointmentDate",
                                      show: this.state.showNextAppointmentDate_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Facility Location",
                                      accessor: "facilityLocation",
                                      show: this.state.showFacilityLocation_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Phone Number",
                                      accessor: "phoneNumber",
                                      show: this.state.showPhoneNumber_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Last Claims Date",
                                      accessor: "lastClaimsDate",
                                      show: this.state.showLastClaimsDate_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD 9/10 Code",
                                      accessor: "icdCode",
                                      show: this.state.showIcdCode_beneficiariesManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Medicare ID",
                                      accessor: "medicareId",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Prem",
                                      accessor: "reinsurancePrem",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "RX Claims",
                                      accessor: "rxClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Patient Name") {
                                        self.getBeneficiariesManagementDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Patient Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Patient Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </TabPane>
                <TabPane tabId="2">
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByDoctor()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorPDF/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[17]} toggle={() => {
                                this.toggle(17);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageMra_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("averageMra")}>Average MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("totalCost")}>Total Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByDoctorData}
                              loading={this.state.beneficiariesManagementByDoctorLoading}
                              pages={this.state.beneficiariesManagementByDoctorPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Name", 
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByDoctor,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByDoctor,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "averageMra",
                                      show: this.state.showAverageMra_beneficiariesManagementByDoctor,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_beneficiariesManagementByDoctor,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP ID",
                                      accessor: "pcpId",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Prem",
                                      accessor: "reinsurancePrem",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "RX Claims",
                                      accessor: "rxClaims",
                                      show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByDoctor}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByDoctorTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "PCP Name") {
                                        self.getBeneficiariesManagementByDoctorDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Name" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                </TabPane>

                <TabPane tabId="3"> 
                
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByLocation()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>

                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationXLSX/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>

                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationPDF/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>

                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[19]} toggle={() => {
                                this.toggle(19);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("mra")}>Average MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByLocationData}
                              loading={this.state.beneficiariesManagementByLocationLoading}
                              pages={this.state.beneficiariesManagementByLocationPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByLocation,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                      
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_beneficiariesManagementByLocation,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                       show: this.state.showTotalCost_beneficiariesManagementByLocation,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByLocation}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByLocationTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "PCP Location") {
                                         self.getBeneficiariesManagementByLocationDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Location" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Location" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByClinic()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>

                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicXLSX/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>

                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicPDF/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>

                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[21]} toggle={() => {
                                this.toggle(21);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByClinic" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinic("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByClinic" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinic("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByClinicData}
                              loading={this.state.beneficiariesManagementByClinicLoading}
                              pages={this.state.beneficiariesManagementByClinicPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByClinic,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                       show: this.state.showTotalCost_beneficiariesManagementByClinic,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Id",
                                      accessor: "clinicId",
                                       show: false,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByClinic}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByClinicTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Clinic Name") {
                                     self.getBeneficiariesManagementByClinicDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Clinic Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Clinic Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                </TabPane>
              </TabContent>
                  </ModalBody>
                  
                </Modal>

                {/**************Beneficiaries Management Report Expand Modal*****************/}
                <Modal isOpen={this.state.beneficiariesManagementExpandModal} toggle={this.toggleBeneficiariesManagementExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleBeneficiariesManagementExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Beneficiaries Management Report - Details</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementExpandPDF/'+self.state.jsonDataForBeneficiariesManagementExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[13]} toggle={() => {
                                this.toggle(13);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementExpandData}
                              loading={this.state.beneficiariesManagementExpandLoading}
                              pages={this.state.beneficiariesManagementExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>

              {/**************Beneficiaries Management By Doctor Expand Modal*****************/}
                <Modal isOpen={this.state.beneficiariesManagementByDoctorExpandModal} toggle={this.toggleBeneficiariesManagementByDoctorExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleBeneficiariesManagementByDoctorExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Beneficiaries Management By Doctor - Details</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByDoctorExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctorExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorExpandPDF/'+self.state.jsonDataForBeneficiariesManagementByDoctorExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[18]} toggle={() => {
                                this.toggle(18);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByDoctorExpandData}
                              loading={this.state.beneficiariesManagementByDoctorExpandLoading}
                              pages={this.state.beneficiariesManagementByDoctorExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementByDoctorExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementByDoctorExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByDoctorExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>
     {/*************Beneficiaries Management By Location Expand Modal****************/}
     <Modal isOpen={this.state.beneficiariesManagementByLocationExpandModal} toggle={this.toggleBeneficiariesManagementByLocationExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleBeneficiariesManagementByLocationExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Beneficiaries Management By Location - Details</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByLocationExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByLocationExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationExpandPDF/'+self.state.jsonDataForBeneficiariesManagementByLocationExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[20]} toggle={() => {
                                this.toggle(20);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByLocationExpandData}
                              loading={this.state.beneficiariesManagementByLocationExpandLoading}
                              pages={this.state.beneficiariesManagementByLocationExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementByLocationExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementByLocationExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByLocationExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>
                {/*************Beneficiaries Management By Clinic Expand Modal****************/}
     <Modal isOpen={this.state.beneficiariesManagementByClinicExpandModal} toggle={this.toggleBeneficiariesManagementByClinicExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleBeneficiariesManagementByClinicExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Beneficiaries Management By Clinic - Details</b>
                      </Col>
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_beneficiariesManagementByClinicExpand()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByClinicExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicExpandPDF/'+self.state.jsonDataForBeneficiariesManagementByClinicExpand} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[22]} toggle={() => {
                                this.toggle(22);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByClinicExpandData}
                              loading={this.state.beneficiariesManagementByClinicExpandLoading}
                              pages={this.state.beneficiariesManagementByClinicExpandPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementByClinicExpand,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementByClinicExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByClinicExpandTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                
                            />
                  </ModalBody>
                  
                </Modal>
                  {/**************Reinsurance Management Report modal*****************/}
                   <Modal isOpen={this.state.reinsuranceManagementModal} toggle={this.toggleReinsuranceManagementModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleReinsuranceManagementModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Reinsurance Report</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="reinsuranceManagementProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.reinsuranceManagementProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setReinsuranceManagementProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.reinsuranceManagementPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setReinsuranceManagementPcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              
                              className="yearSelectStyle"
                              value={this.state.reinsuranceManagementYearSelectValue}
                              options={this.state.summaryReportYearsList}
                              onChange={this.setReinsuranceManagementYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_reinsuranceManagementReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderReinsuranceManagementReportXLSX/'+self.state.jsonDataForReinsuranceManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderReinsuranceManagementReportPDF/'+self.state.jsonDataForReinsuranceManagement} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[16]} toggle={() => {
                                this.toggle(16);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemSubscriberID_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("subscriberID")}>HICN/SubscriberID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPlanName_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("PatientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("PcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemInstClaims_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("instClaims")}>INST Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProfClaims_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("profClaims")}>PROF Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_reinsuranceManagement" className="commonFontFamily" onClick={e => self.showHideColumn_reinsuranceManagement("totalCost")}>Total Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.reinsuranceManagementData}
                              loading={this.state.reinsuranceManagementLoading}
                              pages={this.state.reinsuranceManagementPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "HICN/SuscriberID",
                                      accessor: "hicn",
                                      show: this.state.showSubscriberID_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                             
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },                        
                                    {
                                      Header: "INST Claims",
                                      accessor: "instClaims",
                                      show: this.state.showInstClaims_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PROF Claims",
                                      accessor: "profClaims",
                                      show: this.state.showProfClaims_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_reinsuranceManagement,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchReinsuranceManagementData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.reinsuranceManagementTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                                getTdProps={(state, rowInfo, column) => {
                                  return {
                                    onClick: (e) => {
                                      if(column.Header == "Total Number of Member Month") {
                                        self.getPmpmByPracticeExpandDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Total Number of Member Month" ? "#337ab7" : "",
                                      cursor: column.Header === "Total Number of Member Month" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                  </ModalBody>
                  
                </Modal>
                
                                {/**************Reinsurance Cost Report modal*****************/}
                  <Modal isOpen={this.state.reinsuranceCostReportModal} toggle={this.toggleReinsuranceCostReportModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleReinsuranceCostReportModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Reinsurance Cost Report</b>
                      </Col>
                      
                      <FormGroup check inline style={{marginLeft:80}}>
                        <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Provider&nbsp;</Label>
                     
                          <Select
                          id="reinsuranceCostReportProviderSelect"
                          className="yearSelectStyle"
                          value={this.state.reinsuranceCostReportProviderSelectValue}
                          options={this.state.monthlyTotalsProviderList}
                          onChange={this.setReinsuranceCostReportProviderValue}
                        />
                    </FormGroup>

                    <FormGroup check inline>
                      <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Doctor&nbsp;</Label>
                        <Select
                          placeholder="Select Doctor"
                          className="pcpNameSelectStyle"
                          value={this.state.reinsuranceCostReportPcpNameValue}
                          options={this.state.pcpReportList}
                          onChange={this.setReinsuranceCostReportPcpName}
                        />
                    </FormGroup>

                        <FormGroup check inline>
                          <Label className="form-check-label" style={{color:'#62879A',fontFamily:'times'}}>Year&nbsp;</Label>
                            <Select
                              
                              className="yearSelectStyle"
                              value={this.state.reinsuranceCostReportYearSelectValue}
                              options={this.state.summaryReportYearsList}
                              onChange={this.setReinsuranceCostReportYearValue}
                            />
                        </FormGroup>
                      
                  </Row>
                  </ModalHeader>
                  <ModalBody>
                  <Row>
                  <Col md="10">
                  </Col>
                  <Col md="2">
                  
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData_reinsuranceCostReport()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderReinsuranceCostReportXLSX/'+self.state.jsonDataForReinsuranceCostReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                          <a href={config.serverUrl+'/renderReinsuranceCostPDF/'+self.state.jsonDataForReinsuranceCostReport} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>   
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[24]} toggle={() => {
                                this.toggle(24);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem toggle={false} id="ddItemPlanName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPolicyPeriod_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("policyPeriod")}>Policy Period</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientLastName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("patientLastName")}>Patient Last Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientFirstName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("patientFirstName")}>Patient First Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSubscriberID_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("subscriberID")}>SubscriberID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEffectiveDate_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("effectiveDate")}>Effective Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDateOfBirth_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("dob")}>DOB</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemStatus_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("status")}>Status</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemGender_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("gender")}>Gender</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalClaimsCost_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("totalClaimsCost")}>Total Claims Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.reinsuranceCostReportData}
                              loading={this.state.reinsuranceCostReportLoading}
                              pages={this.state.reinsuranceCostReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Policy Period",
                                      accessor: "policyPeriod",
                                      show: this.state.showPolicyPeriod_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Last Name",
                                      accessor: "patientLastName",
                                      show: this.state.showPatientLastName_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    { 
                                      Header: "Patient First Name",
                                      accessor: "patientFirstName",
                                      show: this.state.showPatientFirstName_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN/SuscriberID",
                                      accessor: "subscriberID",
                                      show: this.state.showSubscriberID_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Effective Date",
                                      accessor: "effectiveDate",
                                      show: this.state.showEffectiveDate_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },     
                                    {
                                      Header: "DOB",
                                      accessor: "dob",
                                      show: this.state.showDateOfBirth_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    }, 
                                    {
                                      Header: "Status",
                                      accessor: "status",
                                      show: this.state.showStatus_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Gender",
                                      accessor: "gender",
                                      show: this.state.showGender_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },            
                                    {
                                      Header: "Total Claims Cost",
                                      accessor: "totalClaimsCost",
                                      show: this.state.showTotalClaimsCost_reinsuranceCostReport,
                                      headerStyle: {"fontWeight":"bold",color:"#62879A"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchReinsuranceCostReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.reinsuranceCostReportTotalCount+', Page'}
                              getTrProps={(state, rowInfo, column) => {
                                  return {
                                    style: {
                                      textAlign:"center"
                                    }
                                  }
                                }}
                               
                            />
                  </ModalBody>
                  
                </Modal>

      </div>
    );
  }
}

export default Dashboard;
