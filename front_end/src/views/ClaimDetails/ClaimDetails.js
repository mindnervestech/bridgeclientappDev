import React, { Component } from 'react';
import ReactDataGrid   from 'react-data-grid';
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
  Collapse,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Table,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import fetch from 'node-fetch';
import  FormData from 'form-data';
import moment from 'moment';
import PropTypes from 'prop-types';
import config from '../Config/ServerUrl';
import DatePicker from 'react-date-picker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import print from 'print-js';
import Select from 'react-select';
import './CustomCss.css';
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

class ClaimDetails extends React.Component {
	constructor(props, context) {
	  super(props, context);
    this.state = {
      dropdownOpen: new Array(8).fill(false),
      fromDate: "",
      toDate: "",
      planList: [],
      planOptions:[],
      yearsList:[],
      locationList:[],
      ageRangeList:[],
      conditionList:[],
      providerList:[],
      specialityList:[],
      reportData: [],
      claimTypeArr: [],
      statusCodeTypeArr: [],
      loading: false,
      pages:0,
      showPlanName: true,
      showProviderName: true,
      showMedicareId: true,
      showPatientName: true,
      showICDCode: true,
      showHCCCodes: true,
      showTermedMonth: true,
      showEligibleMonth: true,
      showCost: true,
      totalCount:0,
      fileQuery:"",
      jsonData:"",
      fetchDataCount:0,
      planSelectValue:"",
      locationSelectValue:"",
      providerSelectValue:"",
      ageRangeSelectValue:"",
      conditionSelectValue:"",
      specialitySelectValue:"",
      costRangeSelectValue:"",

      claimDetailsExpandModal: false,
      claimDetailsExpandLoading: false,
      claimDetailsExpandPages: 0,
      claimDetailsExpandData: [],
      claimDetailsExpandTotalCount: 0,
      claimDetailsExpandFileQuery: "",
      claimDetailsSelectedMedicareId:"",

      showClaimId_beneficiariesManagementExpand: true,
      showClaimDate_beneficiariesManagementExpand: true,
      showClaimType_beneficiariesManagementExpand: true,
      showClinicName_beneficiariesManagementExpand: true,
      showIcdCodes_beneficiariesManagementExpand: true,
      showHccCodes_beneficiariesManagementExpand: true,
      showDrgCode_beneficiariesManagementExpand: true,
      showCost_beneficiariesManagementExpand: true,

      jsonDataForBeneficiariesManagementExpand:"",

    };
    self = this;
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.getClaimDetailsExpandData = this.getClaimDetailsExpandData.bind(this);
    this.generateXLSX = this.generateXLSX.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePlanSelect = this.handlePlanSelect.bind(this);
    this.handleLocationSelect = this.handleLocationSelect.bind(this);
    this.handleProviderSelect = this.handleProviderSelect.bind(this);
    this.handleAgeRangeSelect = this.handleAgeRangeSelect.bind(this);
    this.handleConditionSelect = this.handleConditionSelect.bind(this);
    this.handleSpecialitySelect = this.handleSpecialitySelect.bind(this);
    this.handleCostRangeSelect = this.handleCostRangeSelect.bind(this);
    this.toggleClaimDetailsExpandModal = this.toggleClaimDetailsExpandModal.bind(this);
    this.fetchClaimDetailsExpandData = this.fetchClaimDetailsExpandData.bind(this);
    this.generateReport = debounce(this.generateReport,500);
    this.getClaimDetailsExpandData = debounce(this.getClaimDetailsExpandData,500);
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
        if(self.state.showProviderName) {
          document.getElementById("ddItemProviderName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProviderName").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showMedicareId) {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPatientName) {
          document.getElementById("ddItemPatientName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showICDCode) {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showHCCCodes) {
          document.getElementById("ddItemHccCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCode").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTermedMonth) {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth) {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showCost) {
          document.getElementById("ddItemCost").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost").style.backgroundColor = "#20a8d8";
        }
      }
      if(i == 2) {
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
              if(self.state.showCost_beneficiariesManagementExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
          }
    }, 300);
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

    fetch(config.serverUrl+'/getAllPlanAndPCP', {
          method: 'GET'
      }).then(function(res1) {
        return res1.json();
      }).then(function(response)   {
        self.setState({planList: response.planList,providerList: response.pcpList,yearsList:response.yearsList,locationList:response.locationList});
        self.setState({
          planList: self.state.planList.concat({value:'', label:'All'})
        });
      }).catch((error) => {
        console.log(error);
      });

      fetch(config.serverUrl+'/getSpeciality', {
          method: 'GET'
      }).then(function(res1) {
        return res1.json();
      }).then(function(response)   {
        self.setState({specialityList: response.specialityList});
        self.setState({
          specialityList: self.state.specialityList.concat({value:"", label:'Select Speciality'})
        });
      }).catch((error) => {
        console.log(error);
      });

   }

  handleFromDate(date) {
    this.setState({
      fromDate: date
    });
  }

  handleToDate(date) {
    this.setState({
      toDate: date
    });
  }

  handleChange(event,claimType) {
      if(event.target.checked == true) {
        this.state.claimTypeArr.push(claimType);
      } else {
        this.state.claimTypeArr.splice(this.state.claimTypeArr.indexOf(claimType),1);
      }
   }

   fetchData(state, instance) {
        var page = state.page + 1;
        if(self.state.fetchDataCount != 0) {
          this.generateReport(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
        }
        self.state.fetchDataCount++;
   }

   fetchClaimDetailsExpandData(state, instance) {
    var page = state.page + 1;
    self.getClaimDetailsExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getClaimDetailsExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ claimDetailsExpandLoading: true });
    const formData = new FormData();
    
      if(self.state.fromDate == "") {
        formData.append('year', "all");
      } else {
        formData.append('year', self.state.fromDate.getFullYear());
      }
      
      formData.append('provider', self.state.planSelectValue);
      formData.append('medicareId', self.state.claimDetailsSelectedMedicareId);
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
          self.setState({claimDetailsExpandData: response.beneficiariesManagementExpandData,claimDetailsExpandPages:response.pages,claimDetailsExpandTotalCount:response.totalCount,claimDetailsExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ claimDetailsExpandLoading: false });
          self.generateClaimDetailsExpandXLSX();
      });
        
  }

  generateClaimDetailsExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.claimDetailsExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementExpand', self.state.showClaimId_beneficiariesManagementExpand);
    formData.append('showClaimDate_beneficiariesManagementExpand', self.state.showClaimDate_beneficiariesManagementExpand);
    formData.append('showClaimType_beneficiariesManagementExpand', self.state.showClaimType_beneficiariesManagementExpand);
    formData.append('showClinicName_beneficiariesManagementExpand', self.state.showClinicName_beneficiariesManagementExpand);
    formData.append('showIcdCodes_beneficiariesManagementExpand', self.state.showIcdCodes_beneficiariesManagementExpand);
    formData.append('showHccCodes_beneficiariesManagementExpand', self.state.showHccCodes_beneficiariesManagementExpand);
    formData.append('showDrgCode_beneficiariesManagementExpand', self.state.showDrgCode_beneficiariesManagementExpand);
    formData.append('showCost_beneficiariesManagementExpand', self.state.showCost_beneficiariesManagementExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementExpand: btoa(JSON.stringify(object))});
      
   }


   getClaimDetailsDataRow(rowInfo) {
      self.state.claimDetailsSelectedMedicareId = rowInfo.row.medicareValue;
      this.toggleClaimDetailsExpandModal();
   }

   toggleClaimDetailsExpandModal() {
    this.setState({
      claimDetailsExpandModal: !this.state.claimDetailsExpandModal
    });
    this.state.claimDetailsExpandLoading = false;
  }

   showHideColumn(columnName) {
    
      if(columnName == "planName") {
        this.state.showPlanName = !this.state.showPlanName;
      }
      if(columnName == "providerName") {
        this.state.showProviderName = !this.state.showProviderName;
      }
      if(columnName == "medicareId") {
        this.state.showMedicareId = !this.state.showMedicareId;
      }
      if(columnName == "patientName") {
        this.state.showPatientName = !this.state.showPatientName;
      }
      if(columnName == "icdCode") {
        this.state.showICDCode = !this.state.showICDCode;
      }
      if(columnName == "hccCode") {
        this.state.showHCCCodes = !this.state.showHCCCodes;
      }
      if(columnName == "termedMonth") {
        this.state.showTermedMonth = !this.state.showTermedMonth;
      }
      if(columnName == "eligibleMonth") {
        this.state.showEligibleMonth = !this.state.showEligibleMonth;
      }
      if(columnName == "cost") {
        this.state.showCost = !this.state.showCost;
      }

      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 0 ? true : false);
      });
      this.setState({
        dropdownOpen: newArray
      });

      if(self.state.showProviderName) {
          document.getElementById("ddItemProviderName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProviderName").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showMedicareId) {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showPatientName) {
          document.getElementById("ddItemPatientName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showICDCode) {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showHCCCodes) {
          document.getElementById("ddItemHccCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCode").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showTermedMonth) {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showEligibleMonth) {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "#20a8d8";
        }
        if(self.state.showCost) {
          document.getElementById("ddItemCost").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost").style.backgroundColor = "#20a8d8";
        }

      self.generateXLSX();
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
      if(columnName == "icdCodes") {
        this.state.showIcdCodes_beneficiariesManagementExpand = !this.state.showIcdCodes_beneficiariesManagementExpand;
      }
      if(columnName == "hccCodes") {
        this.state.showHccCodes_beneficiariesManagementExpand = !this.state.showHccCodes_beneficiariesManagementExpand;
      }
      if(columnName == "drgCode") {
        this.state.showDrgCode_beneficiariesManagementExpand = !this.state.showDrgCode_beneficiariesManagementExpand;
      }
      if(columnName == "cost") {
        this.state.showCost_beneficiariesManagementExpand = !this.state.showCost_beneficiariesManagementExpand;
      }
      
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === 2 ? true : false);
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
              if(self.state.showCost_beneficiariesManagementExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#20a8d8";
              }
              
              self.generateClaimDetailsExpandXLSX();

   }


   printTableData() {

      var propertiesArr = [];
      propertiesArr.push("Plan Name");

      if(self.state.showProviderName)
        propertiesArr.push("Provider Name");
      if(self.state.showMedicareId)
        propertiesArr.push("Medicare ID");
      if(self.state.showPatientName)
        propertiesArr.push("Patient Name");
      if(self.state.showICDCode)
        propertiesArr.push("ICD9/10 Code");
      if(self.state.showHCCCodes)
        propertiesArr.push("HCC Codes");
      if(self.state.showTermedMonth)
        propertiesArr.push("Termed Month");
      if(self.state.showEligibleMonth)
        propertiesArr.push("Eligible Month");
      if(self.state.showCost)
        propertiesArr.push("Cost");

      const formData = new FormData();
      formData.append('fileQuery', self.state.fileQuery);
      formData.append('claimType', self.state.claimTypeArr);
      if(self.state.specialitySelectValue != undefined) {
        formData.append('speciality', self.state.specialitySelectValue);
      } else {
        formData.append('speciality', "");
      }

      fetch(config.serverUrl+'/getDataForPrint', {
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
      
      if(self.state.showIcdCodes_beneficiariesManagementExpand)
        propertiesArr.push("ICD Codes");
      if(self.state.showHccCodes_beneficiariesManagementExpand)
        propertiesArr.push("HCC Codes");
      if(self.state.showDrgCode_beneficiariesManagementExpand)
        propertiesArr.push("DRG Code");
      
      if(self.state.showCost_beneficiariesManagementExpand)
        propertiesArr.push("Cost");
      
      const formData = new FormData();
      formData.append('fileQuery', self.state.claimDetailsExpandFileQuery);

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

  generateXLSX() {
    const formData = new FormData();
    formData.append('fileQuery', self.state.fileQuery);
    formData.append('showProviderName', self.state.showProviderName);
    formData.append('showMedicareId', self.state.showMedicareId);
    formData.append('showPatientName', self.state.showPatientName);
    formData.append('showICDCode', self.state.showICDCode);
    formData.append('showHCCCodes', self.state.showHCCCodes);
    formData.append('showTermedMonth', self.state.showTermedMonth);
    formData.append('showEligibleMonth', self.state.showEligibleMonth);
    formData.append('showCost', self.state.showCost);
    
    formData.append('claimType', self.state.claimTypeArr);
      if(self.state.specialitySelectValue != undefined) {
        formData.append('speciality', self.state.specialitySelectValue);
      } else {
        formData.append('speciality', "");
      }

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      self.setState({jsonData: btoa(JSON.stringify(object))});
   }

  generateReport(pageSize,page,sortedArr,filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();

      formData.append('fromDate', moment(self.state.fromDate).format('YYYY-MM-DD'));
      formData.append('toDate', moment(self.state.toDate).format('YYYY-MM-DD'));

      if(self.state.planSelectValue != undefined) {
        formData.append('plan', self.state.planSelectValue);
      } else {
        formData.append('plan', "");
      }

      if(self.state.locationSelectValue != undefined) {
        formData.append('location', self.state.locationSelectValue);
      } else {
        formData.append('location', "");
      }
      
      if(document.getElementById("male").checked) {
        formData.append('gender', document.getElementById("male").value);
      }
      if(document.getElementById("female").checked) {
        formData.append('gender', document.getElementById("female").value);
      }

      if(self.state.providerSelectValue != undefined) {
        formData.append('provider', self.state.providerSelectValue);
      } else {
        formData.append('provider', "");
      }

      if(self.state.ageRangeSelectValue != undefined) {
        formData.append('ageRange', self.state.ageRangeSelectValue);
      } else {
        formData.append('ageRange', "");
      }
      formData.append('claimType', self.state.claimTypeArr);
      formData.append('zipCode', document.getElementById("zipCode").value);
      /*formData.append('hcpcsCode', document.getElementById("hcpcsCode").value);*/

      /*if(self.state.conditionSelectValue != undefined) {
        formData.append('condition', self.state.conditionSelectValue);
      } else {
        formData.append('condition', "");
      }*/

      if(self.state.specialitySelectValue != undefined) {
        formData.append('speciality', self.state.specialitySelectValue);
      } else {
        formData.append('speciality', "");
      }

      /*if(document.getElementById("icd9Code").checked) {
        formData.append('diagnosisCodeType', document.getElementById("icd9Code").value);
      }
      if(document.getElementById("icd10Code").checked) {
        formData.append('diagnosisCodeType', document.getElementById("icd10Code").value);
      }*/

      if(self.state.costRangeSelectValue != undefined) {
        formData.append('costRange', self.state.costRangeSelectValue);
      } else {
        formData.append('costRange', "");
      }
      formData.append('hccCode', document.getElementById("hccCode").value);
      formData.append('hicn', document.getElementById("hicn").value);
      //formData.append('statusCodeType', self.state.statusCodeTypeArr);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/generateClaimReport', {
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
          self.setState({reportData: response.reportDataList,pages:response.pages,totalCount:response.totalCount,fileQuery:response.fileQuery});
          
          self.setState({ loading: false });
          self.generateXLSX();
      });
        
  }

    handlePlanSelect(e) {
      this.setState({planSelectValue: e.value});
    }
    handleLocationSelect(e) {
      this.setState({locationSelectValue: e.value});
    }
    handleProviderSelect(e) {
      this.setState({providerSelectValue: e.value});
    }
    handleAgeRangeSelect(e) {
      this.setState({ageRangeSelectValue: e.value});
    }
    handleConditionSelect(e) {
      this.setState({conditionSelectValue: e.value});
    }
    handleSpecialitySelect(e) {
      this.setState({specialitySelectValue: e.value});
    }
    handleCostRangeSelect(e) {
      this.setState({costRangeSelectValue: e.value});
    }

  render() {

    const ageRangeOptions = [
                      { value: '0-64', label: '0-64' },
                      { value: '65-74', label: '65-74' },
                      { value: '75-84', label: '75-84' },
                      { value: '>=85', label: '>85' },
                      { value: "", label: 'Select Age Range' }
                    ];

    const costRangeOptions = [
                      { value: '0-99', label: '$0-$99' },
                      { value: '100-999', label: '$100-$999' },
                      { value: '1000-4999', label: '$1,000-$4,999' },
                      { value: '5000-9999', label: '$5,000-$9,999' },
                      { value: '>=10000', label: '>$10,000' },
                      { value: "", label: 'Select Cost Range' }
                    ];
                                    
    return (
      <div className="animated fadeIn">
      <h2 className="commonFontStyle">Claim Details</h2>
        <FormGroup row style={{marginBottom:"0.1rem"}}>
          <Col md="5">
          </Col>
          <Col xs="12" md="3" >
            <FormGroup>
              <Col md="12">
                {/*<Input type="select" style={{cursor:"pointer",backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="plans" id="planSelect" onChange={this.handlePlanSelect}>
                  <option>Select Plans</option>
                  {
                    this.state.planList.map(function(plan, i) {
                    return <option key={i} className="selectItemCustom">{plan}</option>
                    })
                  }
                </Input>*/}

              {/* <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                  this.toggle(1);
                }}>
                  <DropdownToggle caret style={{backgroundColor:"#f4f4f4"}}>
                    Select Plans
                  </DropdownToggle>
                  <DropdownMenu>
                  {
                    this.state.planList.map(function(plan, i) {
                    return <DropdownItem>{plan}</DropdownItem>
                   })
                  } 
                  </DropdownMenu>
                </Dropdown>*/}

                <Select
                  id="planSelect"
                  placeholder="Select Plans"
                  className="commonFontFamily"
                  options={self.state.planList}
                  onChange={this.handlePlanSelect}
                />

              </Col> 
            </FormGroup>  
          </Col>
          <Col xs="12" md="4">
            <FormGroup >
              <Col md="12">
                {/*<Input type="select" style={{cursor:"pointer",backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="location" id="locationSelect" onChange={this.handleLocationSelect}>
                  <option>Select Location</option>
                  {
                    this.state.locationList.map(function(file, i) {
                      return <option key={i}>{file}</option>
                    })
                  }
                </Input>*/}
                 <Select
                  id="locationSelect"
                  placeholder="Select Location"
                  className="commonFontFamily"
                  options={self.state.locationList}
                  onChange={this.handleLocationSelect}
                />
              </Col>
            </FormGroup>
          </Col>
        </FormGroup>
        <Card>
          <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
            <strong className="cardHeaderTextStyles">Search</strong>
          </CardHeader>
          
            <CardBody>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="11" md="6" >
                <Row style={{marginLeft:1}}>
                  
                  <Col xs="6">
                    <FormGroup >
                      {/*<InputGroup>
                                <DatePicker placeholderText="From Date" 
                                  className="commonFontFamily textBoxBgColor"
                                  selected={this.state.fromDate} 
                                  onChange={this.handleFromDate} 
                                />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>
                                    <img src="/img/calendar.png" style={{height:19,width:19}}/>
                                  </InputGroupText>
                                </InputGroupAddon>                              
                      </InputGroup>*/}
                      <b><Label className="commonFontStyle">From Date &nbsp;</Label></b>
                      <DatePicker
                          className="datePickerCss"
                          clearIcon=""
                          onChange={this.handleFromDate}
                          value={this.state.fromDate}
                        />
                    </FormGroup>
                    </Col>
                    <Col xs="6">
                    <FormGroup>
                    {/*<InputGroup>
                        <DatePicker placeholderText="To Date" 
                                className="commonFontFamily textBoxBgColor" 
                                selected={this.state.toDate} 
                                onChange={this.handleToDate} 
                                />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>
                                    <img src="/img/calendar.png" style={{height:19,width:19}}/>
                                  </InputGroupText>
                                </InputGroupAddon>
                      </InputGroup>*/}
                        <b><Label className="commonFontStyle">To Date &nbsp;</Label></b>
                        <DatePicker
                          className="datePickerCss"
                          clearIcon=""
                          onChange={this.handleToDate}
                          value={this.state.toDate}
                        />
                      </FormGroup> 
                      </Col>
                    </Row>
                  </Col>  
                  
                  <Col xs="12" md="1" >
                    <b><Label className="commonFontStyle">&nbsp;&nbsp;&nbsp;&nbsp;Gender</Label></b>
                  </Col>
                  <Col xs="12" md="3" >
                    <Col md="9">
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="male" name="gender" value="M"/>
                            <b><Label className="form-check-label" className="commonFontStyle" check htmlFor="inline-radio1">M</Label></b>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="female" name="gender" value="F"/>
                            <b><Label className="form-check-label" className="commonFontStyle" check htmlFor="inline-radio2">F</Label></b>
                          </FormGroup>
                        </Col>
                    </Col>      
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6" >
                  <FormGroup >
                    <Col md="12">
                      {/*<Input type="select" style={{backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="provider" id="providerSelect" onChange={this.handleProviderSelect}>
                        <option>Select Provider</option>
                        {
                          this.state.providerList.map(function(provider, i) {
                          return <option key={i}>{provider}</option>
                          })
                        }
                      </Input>*/}
                      <Select
                        id="providerSelect"
                        placeholder="Select Provider"
                        className="commonFontFamily"
                        options={self.state.providerList}
                        onChange={this.handleProviderSelect}
                      />
                    </Col> 
                  </FormGroup>  
                </Col>
                <Col xs="12" md="6">
                  <FormGroup >
                    <Col md="12">
                      {/*<Input type="select" style={{backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="ageRange" id="ageRangeSelect" onChange={this.handleAgeRangeSelect}>
                        <option>Select Age Range</option>
                        <option>0-64</option>
                        <option>65-74</option>
                        <option>75-84</option>
                        <option>>85</option>
                      </Input>*/}
                      <Select
                        id="ageRangeSelect"
                        placeholder="Select Age Range"
                        className="commonFontFamily"
                        options={ageRangeOptions}
                        onChange={this.handleAgeRangeSelect}
                      />
                    </Col>
                  </FormGroup>
                </Col>
          </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="3" >
                    <b><Label className="commonFontStyle">&nbsp;&nbsp;&nbsp;&nbsp;Claim Type</Label></b>
                </Col>
                <Col xs="12" md="3" >
                  <FormGroup check className="checkbox">
                      <Input className="form-check-input" type="checkbox" id="instClaims" name="instClaims" value="option1" onChange={(e) => self.handleChange(e,"inst claim")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">INST CLAIMS</Label><br/>
                      <Input className="form-check-input commonFontStyle" type="checkbox" id="profClaims" name="profClaims" value="option1" onChange={(e) => self.handleChange(e,"prof claim")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">PROF CLAIMS</Label><br/>
                      <Input className="form-check-input commonFontStyle" type="checkbox" id="rxClaims" name="rxClaims" value="option1" onChange={(e) => self.handleChange(e, "rx claim")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">RX CLAIMS</Label><br/>                      
                      <Input className="form-check-input commonFontStyle" type="checkbox" id="pcpCap" name="pcpCap" value="option1" onChange={(e) => self.handleChange(e, "pcp cap")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">PCP CAP</Label><br/>
                      <Input className="form-check-input commonFontStyle" type="checkbox" id="specClaims" name="specClaims" value="option1" onChange={(e) => self.handleChange(e,"spec claim")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">SPEC CLAIMS</Label><br/>
                      <Input className="form-check-input commonFontStyle" type="checkbox" id="reinsurancePrem" name="reinsurancePrem" value="option1" onChange={(e) => self.handleChange(e, "reinsurance prem")}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">REINSURANCE PREM</Label><br/>
                  </FormGroup>
                </Col>
                 <Col xs="12" md="6">
                    <FormGroup >
                      <Col md="12">
                        <Input type="text" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} className="commonFontFamily commonBgColor" placeholder="ZipCode" name="zipCode" id="zipCode"/> <br/>
                        {/*<Input type="text" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} className="commonFontFamily" placeholder="HCPCS Code" name="hcpcsCode" id="hcpcsCode"/> <br/>*/}
                        {/*<Input type="select" style={{backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="conditionSelect" id="conditionSelect" onChange={this.handleConditionSelect}>
                        <option>Select Condition</option>
                        {
                          this.state.conditionList.map(function(age, i) {
                            return <option key={i}>{age}</option>
                          })
                        }
                      </Input>*/}
                      {/*<Select
                        id="conditionSelect"
                        placeholder="Select Condition"
                        className="commonFontFamily"
                        options={this.state.conditionList}
                        onChange={this.handleConditionSelect}
                      />*/}
                      </Col>
                    </FormGroup>
                  </Col>
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6">
                    <FormGroup >
                      <Col md="12">
                        {/*<Input type="select" style={{backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="specialitySelect" id="specialitySelect" onChange={this.handleSpecialitySelect}>
                        <option>Select Speciality</option>
                        {
                          this.state.specialityList.map(function(spec, i) {
                            return <option key={i}>{spec}</option>
                          })
                        }
                      </Input>*/}
                      <Select
                        id="specialitySelect"
                        placeholder="Select Speciality"
                        className="commonFontFamily"
                        options={this.state.specialityList}
                        onChange={this.handleSpecialitySelect}
                      />
                      </Col>
                    </FormGroup>
                  </Col>
                   {/* <Col xs="12" md="2" style={{marginLeft:17}}>
                    <b><Label className="commonFontStyle">Diagnosis Code Type</Label></b>
                  </Col>
                  <Col xs="12" md="3" >
                    <Col md="12">
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="icd9Code" name="icdCode" value="icd9"/>
                            <b><Label className="form-check-label commonFontStyle" check htmlFor="inline-radio1">ICD9 Code</Label></b>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="icd10Code" name="icdCode" value="icd10"/>
                            <b><Label className="form-check-label commonFontStyle" check htmlFor="inline-radio2">ICD10 Code</Label></b>
                          </FormGroup>
                        </Col>
                    </Col>*/}
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6">
                    <FormGroup style={{marginBottom:"0.1rem"}}>
                      <Col md="12">
                        {/*<Input type="select" style={{backgroundColor:"#f4f4f4"}} className="commonFontFamily" name="costRangeSelect" id="costRangeSelect" onChange={this.handleCostRangeSelect}>
                        <option>Select Cost Range</option>
                        <option value="0-99">$0-$99</option>
                        <option value="100-999">$100-$999</option>
                        <option value="1000-4999">$1,000-$4,999</option>
                        <option value="5000-9999">$5,000-$9,999</option>
                        <option value=">10000">>$10,000</option>
                      </Input>*/}
                        <Select
                          id="costRangeSelect"
                          placeholder="Select Cost Range"
                          className="commonFontFamily"
                          options={costRangeOptions}
                          onChange={this.handleCostRangeSelect}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup style={{marginBottom:"0.1rem"}}>
                      <Col md="12">
                        <Input type="text" className="commonFontFamily" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} placeholder="HCC Code" name="hccCode" id="hccCode"/> <br/>
                      </Col>
                    </FormGroup>
                  </Col>
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6">
                    <FormGroup >
                      <Col md="12">
                        <Input type="text" className="commonFontFamily" style={{backgroundColor:"#FAFAFA",borderColor:"#CCCCCC"}} placeholder="HICN" name="hicn" id="hicn"/> <br/>
                      </Col>
                    </FormGroup>
                  </Col>
                  {/*<Col xs="12" md="2" style={{marginLeft:17}}>
                    <b><Label className="commonFontStyle">Status Code Type</Label></b>
                </Col>
                <Col xs="12" md="3" >
                  <FormGroup check className="checkbox">
                      <Input className="form-check-input" type="checkbox" id="instClaims" name="instClaims" value="option1" onChange={(e) => self.handleChange(e)}/>
                      <Label check className="form-check-label commonFontStyle" htmlFor="checkbox1">INST CLAIMS</Label><br/>
                  </FormGroup>
                </Col>*/}
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
              <Col xs="12" md="4">
              </Col>
              <Col xs="12" md="4">
                <Button color="primary" className="commonFontFamily btnFontSize" style={{fontSize:16}} onClick={e => self.generateReport(10,1,"[]","[]")} block>Generate Reports</Button>
              </Col>  
              </FormGroup>
            </CardBody>
          
        </Card>

        <Card>
          <CardHeader style={{backgroundColor:"white",padding:"0.40rem 1.25rem"}}>
          
            <strong className="cardHeaderTextStyles">Data Grid</strong>
            <div style={{float:"right"}}>
                        <FormGroup check inline>
                            <i class="icon-printer icons font-2xl d-block" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer",color:"#20a8d8"}}></i>
                            {/*<a>
                            <img src="/img/printer.png" title="Print" onClick={e => self.printTableData()} style={{cursor:"pointer"}} />
                            &nbsp;
                            </a>*/}
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderXLSX/'+self.state.jsonData} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="icon-doc icons font-2xl d-block" title="Export" style={{color:"#20a8d8"}}></i>
                                {/*<img src="/img/excel.png" title="Export"/>*/}
                            </a>
                            &nbsp;
                          </FormGroup>
                          <FormGroup check inline>
                            <a href={config.serverUrl+'/renderPDF/'+self.state.jsonData} target="_blank" style={{color:"inherit",textDecoration:"none"}}><i class="fa fa-file-pdf-o font-2xl" title="PDF" style={{color:"#20a8d8"}}></i>
                              {/*<img src="/img/pdf.png" title="PDF"/>*/}
                            </a>
                          </FormGroup>
                          <FormGroup check inline>
                            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem"}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  {/*<img src="/img/grid.png" title="More" style={{cursor:"pointer"}}/>*/}
                                </DropdownToggle>
                                <DropdownMenu>
                                  {/*<DropdownItem onClick={e => self.showHideColumn("planName")}>Plan Name</DropdownItem>*/}
                                  <DropdownItem toggle={false} id="ddItemProviderName" className="commonFontFamily" onClick={e => self.showHideColumn("providerName")}>Provider Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMedicareId" className="commonFontFamily" onClick={e => self.showHideColumn("medicareId")}>Medicare ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName" className="commonFontFamily" onClick={e => self.showHideColumn("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCode" className="commonFontFamily" onClick={e => self.showHideColumn("icdCode")}>ICD9/10 Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCode" className="commonFontFamily" onClick={e => self.showHideColumn("hccCode")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth" className="commonFontFamily" onClick={e => self.showHideColumn("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth" className="commonFontFamily" onClick={e => self.showHideColumn("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost" className="commonFontFamily" onClick={e => self.showHideColumn("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    </div>
          </CardHeader>
          
            <CardBody>
            <Row>
            
            
                          
                    </Row>            
        <ReactTable
          manual
          data={this.state.reportData}
          loading={this.state.loading}
          pages={this.state.pages} // Display the total number of pages
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
                  show:this.state.showPlanName,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Provider Name",
                  accessor: "providerName",
                  show:this.state.showProviderName,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Medicare ID",
                  accessor: "medicareId",
                  show:this.state.showMedicareId,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Medicare Value",
                  accessor: "medicareValue",
                  show:false,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Patient Name",
                  accessor: "patientName",
                  show:this.state.showPatientName,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "ICD9/10 Code",
                  accessor: "icdCode",
                  show:this.state.showICDCode,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "HCC Codes",
                  accessor: "hccCode",
                  show:this.state.showHCCCodes,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Termed Month",
                  accessor: "termedMonth",
                  show:this.state.showTermedMonth,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Eligible Month",
                  accessor: "eligibleMonth",
                  show:this.state.showEligibleMonth,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
                {
                  Header: "Cost",
                  accessor: "cost",
                  show:this.state.showCost,
                  headerStyle: {"fontWeight":"bold",color:"#62879A"},
                  filterMethod: (filter, row) =>
                    row[filter.id].startsWith(filter.value)
                },
              ]
            }
          ]}
          defaultPageSize={10}
          onFetchData={this.fetchData}
          className="-striped -highlight"
          style={{fontFamily: "serif"}}
          pageText={'Total Entries '+this.state.totalCount+', Page'}
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
                                      if(column.Header == "Medicare ID") {
                                        self.getClaimDetailsDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Medicare ID" ? "#337ab7" : "",
                                      cursor: column.Header === "Medicare ID" ? "pointer" : ""
                                    }
                                  }
                                }}
        />

        {/**************Beneficiaries Management Report Expand Modal*****************/}
                <Modal isOpen={this.state.claimDetailsExpandModal} toggle={this.toggleClaimDetailsExpandModal}
                       className={'modal-lg ' + this.props.className} style={{maxWidth:1200}}>
                  <ModalHeader toggle={this.toggleClaimDetailsExpandModal}>
                  <Row>  
                      <Col className="duplicateClaimsHeader">
                        <b>Claim Details</b>
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
                            <Dropdown isOpen={this.state.dropdownOpen[2]} toggle={() => {
                                this.toggle(2);
                              }}>
                                <DropdownToggle style={{backgroundColor:"white",borderColor:"white",padding:"0rem 0rem",marginTop:-9}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"#20a8d8"}}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("icdCodes")}>ICD 9/10 Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("hccCodes")}>HCC Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("drgCode")}>DRUG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
                          </FormGroup>
                    
                    </Col>
                    </Row>
                    <ReactTable
                              manual
                              data={this.state.claimDetailsExpandData}
                              loading={this.state.claimDetailsExpandLoading}
                              pages={this.state.claimDetailsExpandPages} // Display the total number of pages
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
                                      Header: "DRUG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementExpand,
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
                              defaultPageSize={10}
                              onFetchData={this.fetchClaimDetailsExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.claimDetailsExpandTotalCount+', Page'}
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

            </CardBody>
          
        </Card>
      </div>
    );
  }
}

export default ClaimDetails;
