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

class DuplicateClaimsReport extends Component {

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
      
      duplicateClaimsReportData:[],

      loading: false,
      exportModeltoggleView: false,

      showSubscriberId_duplicate: true,
      showPlanName_duplicate: true,
      showPatientName_duplicate: true,
      showPcp_duplicate: true,
      showEligibleMonth_duplicate: true,
      showTermedMonth_duplicate: true,
      dropdownOpen: new Array(1).fill(false),
      showClaimDate_duplicate: true,
      showDuplicativeCost_duplicate: true,
      
      
      duplicateClaimsPages:0,
      duplicateClaimsTotalCount:0,
      duplicateClaimsGridPage:0,
      duplicateClaimsGridPageSize:0,
      duplicateClaimsGridSoreted:{},
      duplicateClaimsGridFiltered:{},
      duplicateClaimsReportFileQuery:"",
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.generateDuplicateClaimsXLSX = this.generateDuplicateClaimsXLSX.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchData = debounce(this.fetchData,500);
    
  }

  componentDidMount() {
     {
        localStorage.removeItem('duplicateClaimSubscriberId');
        localStorage.removeItem('duplicateClaimsExpandFirstServiceDate');
        localStorage.removeItem('duplicateClaimsExpandServiceMonth');
        localStorage.removeItem('duplicateClaimsExpandPaidAmount');
        localStorage.removeItem('duplicateClaimsExpandClaimType');
    }
    
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList:response.planList,pcpList:response.pcpList, yearsList:response.yearsList});
     
      for(var i=0;i<self.state.yearsList.length;i++) {
        if(self.state.yearsList[i].value >= self.state.currentYear) {
          self.state.currentYear = self.state.yearsList[i].value;
        } 
        if(localStorage.getItem('year')==null)
        self.state.yearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
      }
      self.setState({
        providerList: self.state.providerList.concat({ value: "all", label: "All" }),
        pcpList:self.state.pcpList.concat({value:'all', label:'All'}),
        yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
      });
    });

    if (localStorage.getItem('providerForReports') != null) {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('providerForReports'));
      self.getPCPForProviders(self.state.providerSelectValue.value);
    }
    if (localStorage.getItem('pcpNameForReports') != null) {
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpNameForReports'));
    }
    if (localStorage.getItem('yearForReports') != null){
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('yearForReports'));

  }
}  

  setProviderValue(e) {
    self.state.providerSelectValue = e;
    self.getPCPForProviders(self.state.providerSelectValue.value);
    localStorage.setItem('provider', JSON.stringify(e));
    setTimeout(function(){
      self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
  }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getDuplicateClaimReports(self.state.duplicateClaimsGridPageSize, 1, JSON.stringify(self.state.duplicateClaimsGridSoreted),JSON.stringify(self.state.duplicateClaimsGridFiltered));
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
        pcpReportList: self.state.pcpReportList.concat({ value: 'all', label: 'All' })
      });
      self.state.admissionsReportPcpNameValue = { value: 'all', label: 'All' };
    });
  }

  fetchData(state, instance) {
    var page = state.page + 1;
    self.state.duplicateClaimsGridPage = page;
    self.state.duplicateClaimsGridPageSize = state.pageSize;
    self.state.duplicateClaimsGridSoreted = state.sorted;
    self.state.duplicateClaimsGridFiltered = state.filtered;
    this.getDuplicateClaimReports(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getDuplicateClaimReports(pageSize,page,sortedArr,filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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
          self.duplicateClaimsReportFileQuery = response.fileQuery;
          self.setState({ loading: false });
          self.generateDuplicateClaimsXLSX();
      });        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
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
      propertiesArr.push("PCP Name");
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Claims Search", documentTitle:"Print-Claims Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
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
  getDuplicateClaimsExpandDataRow(rowInfo) {
    localStorage.setItem('duplicateClaimSubscriberId',rowInfo.row.subscriberId);
    localStorage.setItem('duplicateClaimsExpandFirstServiceDate',rowInfo.row.claimDate);
    localStorage.setItem('duplicateClaimsExpandServiceMonth', rowInfo.row.eligibleMonth);
    localStorage.setItem('duplicateClaimsExpandPaidAmount', rowInfo.row.duplicativeCost);
    localStorage.setItem('duplicateClaimsExpandClaimType',rowInfo.row.claimType);
    window.location.href = "#/duplicateClaimsDetails";
 }

  backToReports() {
    window.location.href = "#reports";
  }

  toggle(i) {
    console.log("toggle");
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
    setTimeout(function () {
      if (i == 0) {
        if(self.state.showSubscriberId_duplicate) {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPlanName_duplicate) {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_duplicate) {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcp_duplicate) {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showEligibleMonth_duplicate) {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth_duplicate) {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimDate_duplicate) {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDuplicativeCost_duplicate) {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
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
        document.getElementById("ddItemSubscriberId_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showPlanName_duplicate) {
        document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPlanName_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showPatientName_duplicate) {
        document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPatientName_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showPcp_duplicate) {
        document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPcp_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showEligibleMonth_duplicate) {
        document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemEligibleMonth_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showTermedMonth_duplicate) {
        document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemTermedMonth_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showClaimDate_duplicate) {
        document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClaimDate_duplicate").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showDuplicativeCost_duplicate) {
        document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemDuplicativeCost_duplicate").style.backgroundColor = "#d03b3c";
      }   

      self.generateDuplicateClaimsXLSX();

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
            
            <h2>Duplicate Claims Report</h2>
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
                                  <DropdownItem toggle={false} id="ddItemSubscriberId_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("subscriberId")}>HICN/Subscriber ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPlanName_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcp_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("pcp")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDuplicativeCost_duplicate" className="commonFontFamily" onClick={e => self.showHideColumn_duplicate("duplicativeCost")}>Duplicative Cost</DropdownItem>
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcp",
                                      show: this.state.showPcp_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show: this.state.showEligibleMonth_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Duplicative Cost",
                                      accessor: "duplicativeCost",
                                      show: this.state.showDuplicativeCost_duplicate,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_duplicateClaims()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderDuplicateClaimsXLSX/'+self.state.jsonDataForDuplicateClaims} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderDuplicateClaimsPDF/'+self.state.jsonDataForDuplicateClaims} target="_blank" >
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
export default DuplicateClaimsReport;
