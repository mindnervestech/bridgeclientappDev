import React, { Component } from "react";
import ReactTable from "react-table";
var debounce = require("lodash.debounce");
import config from '../../Config/ServerUrl';
import '../ReportsStyle.css';
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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import Select from 'react-select';

class ReinsuranceReport extends Component {

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
        dropdownOpen: new Array(1).fill(false),
      
        reinsuranceManagementPages:0,
        reinsuranceManagementData:[],
        reinsuranceManagementTotalCount:0,
        reinsuranceManagementFileQuery:"",
        reinsuranceManagementGridPageSize:0,
        reinsuranceManagementGridPage:0,
        reinsuranceManagementGridSorted:{},
        reinsuranceManagementGridFiltered:{},

        showSubscriberID_reinsuranceManagement: true,
        showPlanName_reinsuranceManagement: true,
        showPatientName_reinsuranceManagement: true,
        showPcpName_reinsuranceManagement:true,
        showTermedMonth_reinsuranceManagement: true,
        showTotalCost_reinsuranceManagement: true,
        showInstClaims_reinsuranceManagement: true,
        showProfClaims_reinsuranceManagement: true,
        reinsuranceManagementModal:false,
        reinsuranceManagementLoading: false,
        exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchReinsuranceManagementData = this.fetchReinsuranceManagementData.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchReinsuranceManagementData = debounce(this.fetchReinsuranceManagementData,500);
  }

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

    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList, yearsList:response.yearsList});
     
      for(var i=0;i<self.state.yearsList.length;i++) {
        if(self.state.yearsList[i].value >= self.state.currentYear) {
          self.state.currentYear = self.state.yearsList[i].value;
        } 
        if(localStorage.getItem('year')==null)
        self.state.yearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
      }
      self.setState({
        providerList: self.state.providerList.concat({ value: 'all', label: 'All' }),
        yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
      });
    });

    if(localStorage.getItem('provider') !=null)      {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
      self.state.pcpList = JSON.parse(localStorage.getItem('pcpList'));
    }
  if(localStorage.getItem('pcpName')!=null){
    self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpName'));
  }
  if(localStorage.getItem('year')!=null){
    self.state.yearSelectValue = JSON.parse(localStorage.getItem('year'));
  }

  
}  

  setProviderValue(e) {
    self.state.providerSelectValue = e;
    self.getPCPForProviders(self.state.providerSelectValue.value);
    localStorage.setItem('provider', JSON.stringify(e));
    setTimeout(function(){
      self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
   }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getReinsuranceManagementData(self.state.reinsuranceManagementGridPageSize, 1, JSON.stringify(self.state.reinsuranceManagementGridSorted),JSON.stringify(self.state.reinsuranceManagementGridFiltered));
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
        pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' })
      });
      self.state.pcpNameValue = { value: 'all', label: 'All' };
      localStorage.setItem('pcpList',JSON.stringify(self.state.pcpList));
    });
  }

  fetchReinsuranceManagementData(state,instance){
    var page = state.page + 1;
    self.state.reinsuranceManagementGridPage = page;
    self.state.reinsuranceManagementGridPageSize = state.pageSize;
    self.state.reinsuranceManagementGridSorted = state.sorted;
    self.state.reinsuranceManagementGridFiltered = state.filtered;
    self.getReinsuranceManagementData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getReinsuranceManagementData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ reinsuranceManagementLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
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


  backToReports() {
    window.location.href = "#reports";
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
    setTimeout(function () {
      if (i == 0) {
        if(self.state.showSubscriberID_reinsuranceManagement) {
          document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPlanName_reinsuranceManagement) {
          document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_reinsuranceManagement) {
          document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_reinsuranceManagement) {
          document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth_reinsuranceManagement) {
          document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showInstClaims_reinsuranceManagement) {
          document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showProfClaims_reinsuranceManagement) {
          document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalCost_reinsuranceManagement) {
          document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
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
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showSubscriberID_reinsuranceManagement) {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemSubscriberID_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPlanName_reinsuranceManagement) {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPlanName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPatientName_reinsuranceManagement) {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPatientName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPcpName_reinsuranceManagement) {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTermedMonth_reinsuranceManagement) {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTermedMonth_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showInstClaims_reinsuranceManagement) {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemInstClaims_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showProfClaims_reinsuranceManagement) {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemProfClaims_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalCost_reinsuranceManagement) {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalCost_reinsuranceManagement").style.backgroundColor = "#d03b3c";
            }

            self.generateReinsuranceManagementXLSX();

 }

  render() {
    return (
      <React.Fragment>
        <Row className="header">
        <Col md="10">
          <FormGroup check inline>
            <img id="backButton" onClick={this.backToReports}  src="/img/header-back-button.png" />
          </FormGroup>
          <FormGroup check inline>
            
            <h2>Reinsurance Report</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
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
        <Row>
        <Col xs="12" md="3" >
            
        <Card>
              <CardHeader className="filterCardHeaderStyle2"><img style={{marginBottom:"3px"}}src="/img/year_icon.png"/>&nbsp;&nbsp;Year</CardHeader>
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                             
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },                        
                                    {
                                      Header: "INST Claims",
                                      accessor: "instClaims",
                                      show: this.state.showInstClaims_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PROF Claims",
                                      accessor: "profClaims",
                                      show: this.state.showProfClaims_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_reinsuranceManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                            

  </Col>
</Row>
     
    
{/* -----------------------------------Export Model------------------------ */}
        
  <Modal isOpen={this.state.exportModeltoggleView} toggle={this.exportModelToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'}>
      <ModalBody>
          <Row>
                <FormGroup>
                   <p id="exportText">Export To:</p>
               </FormGroup>
          </Row>
          <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_reinsuranceManagementReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderReinsuranceManagementReportXLSX/'+self.state.jsonDataForReinsuranceManagement} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderReinsuranceManagementReportPDF/'+self.state.jsonDataForReinsuranceManagement} target="_blank" >
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
export default ReinsuranceReport;
