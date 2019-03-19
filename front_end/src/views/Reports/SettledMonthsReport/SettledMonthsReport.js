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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import Select from 'react-select';

class SettledMonthsReport extends Component {

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

        settledMonthsGridPage: 0,
        settledMonthsGridPageSize: 0,
        settledMonthsGridSorted: {},
        settledMonthsGridFiltered: {},
   
        

      settledMonthsLoading: false,
      settledMonthsPages: 0,
      settledMonthsData: [],
      settledMonthsTotalCount: 0,
      settledMonthsFileQuery: "",
   
        showPcpLocation_settledMonths: false,
        showMonth_settledMonths: true,
        showMembership_settledMonths: true,
        showIpaPremium_settledMonths: true,
        showTotalExpenses_settledMonths: true,
        showStopLoss_settledMonths: true,
        showNetPremium_settledMonths: true,
        showRiskSharing_settledMonths: true,
      showSurplusDeficit_settledMonths: true,
        
         exportModeltoggleView: false,
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchSettledMonthsData = this.fetchSettledMonthsData.bind(this);

    this.backToReports = this.backToReports.bind(this);

    this.fetchSettledMonthsData = debounce(this.fetchSettledMonthsData,500);
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
    localStorage.removeItem('settledMonthsSelectedMonth');
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
        pcpList:self.state.pcpList.concat({value:'all', label:'All'}),
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
      self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted),JSON.stringify(self.state.settledMonthsGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted),JSON.stringify(self.state.settledMonthsGridFiltered));
}
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getSettledMonthsData(self.state.settledMonthsGridPageSize, 1, JSON.stringify(self.state.settledMonthsGridSorted), JSON.stringify(self.state.settledMonthsGridFiltered));
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


  fetchSettledMonthsData(state, instance) {
    var page = state.page + 1;
    self.state.settledMonthsGridPage = page;
    self.state.settledMonthsGridPageSize = state.pageSize;
    self.state.settledMonthsGridSorted = state.sorted;
    self.state.settledMonthsGridFiltered = state.filtered;
    self.getSettledMonthsData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getSettledMonthsData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ settledMonthsLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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

          self.setState({ settledMonthsLoading: false });
          self.generateSettledMonthsXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Settled Months Report Search", documentTitle:"Print-Settled Months Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
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

getSettledMonthsReportExpandDataRow(rowInfo) {
  localStorage.setItem('settledMonthsSelectedMonth', rowInfo.row.month);
  window.location.href = "#/settledMonthsDetails";
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
        if (self.state.showPcpLocation_settledMonths) {
          document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showMonth_settledMonths) {
          document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showMembership_settledMonths) {
          document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showIpaPremium_settledMonths) {
          document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showTotalExpenses_settledMonths) {
          document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showStopLoss_settledMonths) {
          document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showNetPremium_settledMonths) {
          document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showRiskSharing_settledMonths) {
          document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "#d03b3c";
        }
        if (self.state.showSurplusDeficit_settledMonths) {
          document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
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
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showPcpLocation_settledMonths) {
              document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpLocation_settledMonths").style.backgroundColor = "#d03b3c";
            } 
            if(self.state.showMonth_settledMonths) {
              document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemMonth_settledMonths").style.backgroundColor = "#d03b3c";
            } 
            if(self.state.showMembership_settledMonths) {
              document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemMembership_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showIpaPremium_settledMonths) {
              document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIpaPremium_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalExpenses_settledMonths) {
              document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalExpenses_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showStopLoss_settledMonths) {
              document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemStoploss_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showNetPremium_settledMonths) {
              document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemNetPremium_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showRiskSharing_settledMonths) {
              document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemRiskSharing_settledMonths").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showSurplusDeficit_settledMonths) {
              document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemSurplusDeficit_settledMonths").style.backgroundColor = "#d03b3c";
            }

            self.generateSettledMonthsXLSX();
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
            
            <h2>Settled Months</h2>
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
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Month",
                                      accessor: "month",
                                      show: this.state.showMonth_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Membership",
                                      accessor: "membership",
                                      show: this.state.showMembership_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Ipa Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses",
                                      accessor: "totalExpenses",
                                      show: this.state.showTotalExpenses_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "StopLoss",
                                      accessor: "stoploss",
                                      show: this.state.showStopLoss_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Net Premium",
                                      accessor: "netPremium",
                                      show: this.state.showNetPremium_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Risk Sharing",
                                      accessor: "riskSharing",
                                      show: this.state.showRiskSharing_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Surplus/Deficit",
                                      accessor: "surplusDeficit",
                                      show: this.state.showSurplusDeficit_settledMonths,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_settledMonthsReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSettledMonthsReportXLSX/'+self.state.jsonDataForSettledMonths} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSettledMonthsReportPDF/'+self.state.jsonDataForSettledMonths} target="_blank" >
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
export default SettledMonthsReport;
