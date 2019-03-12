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

class PMPMByPrecticeReport extends Component {

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
      
        pmpmByPracticeGridPage: 0,
        pmpmByPracticeGridPageSize: 0,
        pmpmByPracticeGridSorted: {},
        pmpmByPracticeGridFiltered: {},
        pmpmByPracticeLoading: false,
        pmpmByPracticePages: 0,
        pmpmByPracticeData: [],
        pmpmByPracticeTotalCount: 0,
        pmpmByPracticeFileQuery: "",
        jsonDataForPmpmByPractice: "",
        dropdownOpen: new Array(1).fill(false),
        
        showFacilityLocationName_pmpmByPractice: false,
        showProviderName_pmpmByPractice: true,
        showMra_pmpmByPractice: true,
        showTotalCost_pmpmByPractice: true,
        showTotalNumberOfMemberMonth_pmpmByPractice: true,
        showPMPM_pmpmByPractice: true,
        showPMPY_pmpmByPractice: true,
        showTotalPremium_pmpmByPractice: true,
        showIpaPremium_pmpmByPractice: true,
        showDifference_pmpmByPractice: true,
        exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchPmpmByPracticeData = this.fetchPmpmByPracticeData.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchPmpmByPracticeData = debounce(this.fetchPmpmByPracticeData,500);
  }

  componentDidMount() {
    localStorage.removeItem('pmpmByPracticeSelectedPcpId');
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
      self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
   }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getPmpmByPracticeData(self.state.pmpmByPracticeGridPageSize, 1, JSON.stringify(self.state.pmpmByPracticeGridSorted),JSON.stringify(self.state.pmpmByPracticeGridFiltered));
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

  fetchPmpmByPracticeData(state, instance) {
    var page = state.page + 1;
    self.state.pmpmByPracticeGridPage = page;
    self.state.pmpmByPracticeGridPageSize = state.pageSize;
    self.state.pmpmByPracticeGridSorted = state.sorted;
    self.state.pmpmByPracticeGridFiltered = state.filtered;
    self.getPmpmByPracticeData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getPmpmByPracticeData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ pmpmByPracticeLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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
          self.setState({ pmpmByPracticeLoading: false });
          self.generatePmpmByPracticeXLSX();
      });
    }

    getPmpmByPracticeExpandDataRow(rowInfo) {
      localStorage.setItem('pmpmByPracticeSelectedPcpId', rowInfo.row.providerName);
      window.location.href = "#/pmpmByPrecticeDetails";
   }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_pmpmByPracticeReport() {

    var propertiesArr = [];

    if(self.state.showFacilityLocationName_pmpmByPractice)
      propertiesArr.push("Facility Location Name");
    if(self.state.showProviderName_pmpmByPractice)
      propertiesArr.push("PCP Name");
    if(self.state.showMra_pmpmByPractice)
      propertiesArr.push("MRA");
    if(self.state.showTotalCost_pmpmByPractice)
      propertiesArr.push("Total Cost");
    if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice)
      propertiesArr.push("Total Number Of Member Month");
    if(self.state.showPMPM_pmpmByPractice)
      propertiesArr.push("PMPM");
    if(self.state.showPMPY_pmpmByPractice)
      propertiesArr.push("PMPY");
    if(self.state.showTotalPremium_pmpmByPractice)
      propertiesArr.push("Total Expenses");
    if(self.state.showIpaPremium_pmpmByPractice)
      propertiesArr.push("IPA Premium");
    if(self.state.showDifference_pmpmByPractice)
      propertiesArr.push("Total Expenses - IPA Premium");
    

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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-PMPM by Practice Report Search", documentTitle:"Print-PMPM by Practice Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }
  

 generatePmpmByPracticeXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.pmpmByPracticeFileQuery);
  formData.append('showFacilityLocationName_pmpmByPractice', self.state.showFacilityLocationName_pmpmByPractice);
  formData.append('showProviderName_pmpmByPractice', self.state.showProviderName_pmpmByPractice);
  formData.append('showMra_pmpmByPractice', self.state.showMra_pmpmByPractice);
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
        if(self.state.showFacilityLocationName_pmpmByPractice) {
          document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showProviderName_pmpmByPractice) {
          document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMra_pmpmByPractice) {
          document.getElementById("ddItemMra_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMra_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalCost_pmpmByPractice) {
          document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice) {
          document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPMPM_pmpmByPractice) {
          document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPMPY_pmpmByPractice) {
          document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalPremium_pmpmByPractice) {
          document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIpaPremium_pmpmByPractice) {
          document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDifference_pmpmByPractice) {
          document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_pmpmByPractice(columnName) {
    
    if(columnName == "facilityLocationName") {
      this.state.showFacilityLocationName_pmpmByPractice = !this.state.showFacilityLocationName_pmpmByPractice;
    }
    if(columnName == "providerName") {
      this.state.showProviderName_pmpmByPractice = !this.state.showProviderName_pmpmByPractice;
    }
    if(columnName == "mra") {
      this.state.showMra_pmpmByPractice = !this.state.showMra_pmpmByPractice;
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
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showFacilityLocationName_pmpmByPractice) {
              document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemFacilityLocationName_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showProviderName_pmpmByPractice) {
              document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemProviderName_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showMra_pmpmByPractice) {
              document.getElementById("ddItemMra_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemMra_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalCost_pmpmByPractice) {
              document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalCost_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalNumberOfMemberMonth_pmpmByPractice) {
              document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalMemberMonth_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPMPM_pmpmByPractice) {
              document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPMPM_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPMPY_pmpmByPractice) {
              document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPMPY_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalPremium_pmpmByPractice) {
              document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalPremium_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showIpaPremium_pmpmByPractice) {
              document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIpaPremium_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showDifference_pmpmByPractice) {
              document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDifference_pmpmByPractice").style.backgroundColor = "#d03b3c";
            }

            self.generatePmpmByPracticeXLSX();

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
            
            <h2>PMPM By Practice</h2>
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
                                  <DropdownItem toggle={false} id="ddItemFacilityLocationName_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("facilityLocationName")}>Facility Location Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProviderName_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("providerName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalCost")}>Total Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalMemberMonth_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalNumberOfMemberMonth")}>Total Number of Member Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPMPM_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("pmpm")}>PMPM</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPMPY_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("pmpy")}>PMPY</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalPremium_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("totalPremium")}>Total Expenses</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaPremium_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("ipaPremium")}>IPA Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDifference_pmpmByPractice" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPractice("difference")}>Total Expenses - IPA Premium</DropdownItem>
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "providerName",
                                      show: this.state.showProviderName_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Number of Member Month",
                                      accessor: "totalNumberOfMemberMonth",
                                      show: this.state.showTotalNumberOfMemberMonth_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PMPM",
                                      accessor: "pmpm",
                                      show: this.state.showPMPM_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PMPY",
                                      accessor: "pmpy",
                                      show: this.state.showPMPY_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses",
                                      accessor: "totalPremium",
                                      show: this.state.showTotalPremium_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses - IPA Premium",
                                      accessor: "difference",
                                      show: this.state.showDifference_pmpmByPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_pmpmByPracticeReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPmpmByPracticeReportXLSX/'+self.state.jsonDataForPmpmByPractice} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPmpmByPracticeReportPDF/'+self.state.jsonDataForPmpmByPractice} target="_blank" >
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
export default PMPMByPrecticeReport;
