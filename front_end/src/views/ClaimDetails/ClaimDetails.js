import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
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
      costRangeSelectValue: "",
      exportModeltoggleViewClaimDetails: false,
      jsonDataForBeneficiariesManagementExpand:"",

    };
    self = this;
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.generateReport = this.generateReport.bind(this);
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
    this.exportModelToggleClaimDetails = this.exportModelToggleClaimDetails.bind(this);
    this.generateReport = debounce(this.generateReport,500);
  }

  exportModelToggleClaimDetails() {
    console.log("ashishs");
    this.setState({
      exportModeltoggleViewClaimDetails: !this.state.exportModeltoggleViewClaimDetails
    });
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
          document.getElementById("ddItemProviderName").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMedicareId) {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName) {
          document.getElementById("ddItemPatientName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showICDCode) {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHCCCodes) {
          document.getElementById("ddItemHccCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCode").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth) {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showEligibleMonth) {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost) {
          document.getElementById("ddItemCost").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost").style.backgroundColor = "#d03b3c";
        } 
          }
    }, 300);
  }

  componentDidMount() {
    localStorage.removeItem('claimDetailsSelectedMedicareId');
    localStorage.removeItem('planSelectValue');
    localStorage.removeItem('fromDate');
    
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



  getClaimDetailsDataRow(rowInfo) {
    console.log("clicked");
    localStorage.setItem('claimDetailsSelectedMedicareId', rowInfo.row.medicareValue);
    localStorage.setItem('fromDate', self.state.fromDate.getFullYear());
    window.location.href = "#/claimDetailsDrillDownReport";
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
          document.getElementById("ddItemProviderName").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMedicareId) {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMedicareId").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName) {
          document.getElementById("ddItemPatientName").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showICDCode) {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCode").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHCCCodes) {
          document.getElementById("ddItemHccCode").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCode").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth) {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showEligibleMonth) {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost) {
          document.getElementById("ddItemCost").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost").style.backgroundColor = "#d03b3c";
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
                document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showClaimDate_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showClaimType_beneficiariesManagementExpand) {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showClinicName_beneficiariesManagementExpand) {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showIcdCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showHccCodes_beneficiariesManagementExpand) {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showDrgCode_beneficiariesManagementExpand) {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
              }
              if(self.state.showCost_beneficiariesManagementExpand) {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
              } else {
                document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#d03b3c";
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

        printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Claims Search", documentTitle:"Print-Claims Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
      
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


      if(self.state.specialitySelectValue != undefined) {
        formData.append('speciality', self.state.specialitySelectValue);
      } else {
        formData.append('speciality', "");
      }



      if(self.state.costRangeSelectValue != undefined) {
        formData.append('costRange', self.state.costRangeSelectValue);
      } else {
        formData.append('costRange', "");
      }
      formData.append('hccCode', document.getElementById("hccCode").value);
      formData.append('hicn', document.getElementById("hicn").value);

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
      this.setState({ planSelectValue: e.value });
      localStorage.setItem('planSelectValue',e.value);
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
      <React.Fragment className="animated fadeIn">
      <h2 className="commonFontStyle">Claim Details</h2>
        <FormGroup row style={{marginBottom:"0.1rem"}}>
          <Col md="5">
          </Col>
          <Col xs="12" md="3" >
            <FormGroup>
              <Col md="12">



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

                      </Col>
                    </FormGroup>
                  </Col>
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6">
                    <FormGroup >
                      <Col md="12">

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
              </FormGroup>
              <FormGroup row style={{marginBottom:"0.1rem"}}>
                <Col xs="12" md="6">
                    <FormGroup style={{marginBottom:"0.1rem"}}>
                      <Col md="12">
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

    
        <Row className="header">
        <Col md="10">
          <FormGroup check inline>
            
            <h3>Data Grid</h3>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggleClaimDetails} src="/img/upload-header-button.png" />
          </FormGroup>
          </Col>
            <Col md="2">
            <FormGroup check inline style={{ float: "right" }}>
            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                              <DropdownToggle style={{backgroundColor:"#f7f3f0",borderColor:"#f7f3f0",padding:"0rem 0rem"}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"rgba(208, 82, 89, 0.95)",marginTop:"11px" }}></i>
                                  
                                </DropdownToggle>
                                <DropdownMenu>
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
           </Col>
        </Row> 
        <Col xs="12" md="12" > 
                            <ReactTable
                              manual
                              data={this.state.reportData}
                              loading={this.state.loading}
                              pages={this.state.pages} 
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Provider Name",
                                      accessor: "providerName",
                                      show:this.state.showProviderName,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Medicare ID",
                                      accessor: "medicareId",
                                      show:this.state.showMedicareId,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Medicare Value",
                                      accessor: "medicareValue",
                                      show:false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show:this.state.showPatientName,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD9/10 Code",
                                      accessor: "icdCode",
                                      show:this.state.showICDCode,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCode",
                                      show:this.state.showHCCCodes,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show:this.state.showTermedMonth,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show:this.state.showEligibleMonth,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show:this.state.showCost,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                                    textAlign: "center",
                                    backgroundColor: "white"
                                  }
                                };
                              }}
                      
                                  getTheadProps={(state, rowInfo, column) => {
                                return {
                                  style: {
                                    backgroundColor: "#333333",
                                    height: "40px"
                                  }
                                };
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
        </Col>

                           {/* ======================Expand Modal=============== */}

        <Modal isOpen={this.state.exportModeltoggleViewClaimDetails} toggle={this.exportModelToggleClaimDetails}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'}>
      <ModalBody>
          <Row>
                <FormGroup>
                   <p id="exportText">Export To:</p>
               </FormGroup>
          </Row>
          <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderXLSX/'+self.state.jsonData} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPDF/'+self.state.jsonData} target="_blank" >
                    <img id="pdfButton" src="/img/pdfButton.png" />
                    </a>
                    <p id="text-align-pdf">Pdf</p>
              </FormGroup>
            </Row>
          <Row>
        </Row>
      </ModalBody>
    </Modal>

    </React.Fragment>
    );
  }
}

export default ClaimDetails;
