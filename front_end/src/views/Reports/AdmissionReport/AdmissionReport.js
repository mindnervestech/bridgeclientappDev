import React, { Component } from "react";
import ReactTable from "react-table";
var debounce = require("lodash.debounce");
import config from '../../Config/ServerUrl';
import '../ReportsSyl.css';
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

class AdmissionReport extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {

      yearsList: [],
      ProviderList: [],
      pcpReportList: [],
      reportProviderArr: [],
      admissionsReportData: [],
      loading: false,
      exportModeltoggleView: false,
      showPcpName_admissions: true,
      showTotalCost_admissions: true,
      showPatientName_admissions: true,
      showSubscriberId_admissions: true,
      showEligibleMonth_admissions: true,
      showTotalNoOfAdmissions_admissions: true,
      dropdownOpen: new Array(1).fill(false),

      currentYear:0,
      admissionsReportPages: 0,
      admissionsReportGridPage: 0,
      admissionsReportGridPageSize: 0,
      
      admissionsReportPcpNameValue: "",
      admissionsReportYearSelectValue: "",
      admissionsReportProviderSelectValue:"",
      admissionsReportGridSorted: {},
      admissionsReportGridFiltered: {},
      
    };
    self = this;
    self.state.admissionsReportProviderSelectValue = { value: 'all', label: 'All' };
    self.state.admissionsReportPcpNameValue = { value: 'all', label: 'All' };
    self.state.admissionsReportYearSelectValue = { value: 'all', label: 'All' };
    this.fetchAdmissionsReportData = this.fetchAdmissionsReportData.bind(this);
    this.getAdmissionsReports = this.getAdmissionsReports.bind(this);

    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchAdmissionsReportData = debounce(this.fetchAdmissionsReportData, 500);
    
  }

  componentDidMount() {
    {
      localStorage.removeItem('admissionsReportExpandPatientName');
      localStorage.removeItem('admissionsReportExpandSubscriberId');
      localStorage.removeItem('admissionsReportExpandPcpName');
      localStorage.removeItem('admissionsReportExpandEligibleMonth');
    }
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ ProviderList: response.planList,pcpReportList:response.pcpList, yearsList:response.yearsList});
     
      for(var i=0;i<self.state.yearsList.length;i++) {
        if(self.state.yearsList[i].value >= self.state.currentYear) {
          self.state.currentYear = self.state.yearsList[i].value;
        }
        self.state.admissionsReportYearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
      }
     
    
      self.setState({
        ProviderList: self.state.ProviderList.concat({ value: 'all', label: 'All' }),
        pcpReportList:self.state.pcpReportList.concat({value:'all', label:'All'}),
        yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
      });
    });

    if (localStorage.getItem('provider') != null)
    self.state.admissionsReportProviderSelectValue = { value: localStorage.getItem('provider'), label: localStorage.getItem('provider')};
    if (localStorage.getItem('pcpName') != null)
      self.state.admissionsReportPcpNameValue = { value: localStorage.getItem('pcpName'), label: localStorage.getItem('pcpNameLabel') };
    if (localStorage.getItem('year') != null)
      self.state.admissionsReportYearSelectValue = { value: localStorage.getItem('year'), label: localStorage.getItem('year') }; 
  }

  setAdmissionsReportProviderValue(e) {
    self.state.admissionsReportProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.admissionsReportProviderSelectValue.value);
    localStorage.setItem('provider' , self.state.admissionsReportProviderSelectValue.value)
    setTimeout(function(){
      self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
    }, 1000);
  }
  setAdmissionsReportPcpName(e) {
    self.state.admissionsReportPcpNameValue = e;
    localStorage.setItem('pcpName', self.state.admissionsReportPcpNameValue.value);
    localStorage.setItem('pcpNameLabel', self.state.admissionsReportPcpNameValue.label);
    self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
  }
 
  setAdmissionsReportYearValue(e) {
    self.state.admissionsReportYearSelectValue = e;
    localStorage.setItem('year', self.state.admissionsReportYearSelectValue.value);
    self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
  }

  getPCPForReportProviders(providerName) {
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

  fetchAdmissionsReportData(state, instance) {
  
    var page = state.page + 1;
    self.state.admissionsReportGridPage = page;
    self.state.admissionsReportGridPageSize = state.pageSize;
    self.state.admissionsReportGridSorted = state.sorted;
    self.state.admissionsReportGridFiltered = state.filtered;
    setTimeout(function () {
      self.getAdmissionsReports(state.pageSize, page, JSON.stringify(state.sorted), JSON.stringify(state.filtered));
    }, 1000);
  }

  getAdmissionsReports(pageSize,page,sortedArr,filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();
        console.log(this.state.admissionsReportYearSelectValue);
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
          self.setState({ loading: false });
          self.generateAdmissionsReportXLSX();
          
      });
        
  }

  getAdmissionsReportExpandDataRow(rowInfo) {
    localStorage.setItem('admissionsReportExpandPatientName',rowInfo.row.patientName);
    localStorage.setItem('admissionsReportExpandSubscriberId',rowInfo.row.subscriberId);
    localStorage.setItem('admissionsReportExpandPcpName',rowInfo.row.pcpName);
    localStorage.setItem('admissionsReportExpandEligibleMonth',rowInfo.row.eligibleMonth);
    window.location.href = "#/admissionReportExpand";
 }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
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
        body: formData,
    }).then(function(res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({errorMessage :error.message});
          } 
        }
        return res1.json();
    }).then(function (response) {
        
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
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
        if(self.state.showPatientName_admissions) {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSubscriberId_admissions) {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_admissions) {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showEligibleMonth_admissions) {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalNoOfAdmissions_admissions) {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalCost_admissions) {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
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
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

    if(self.state.showPatientName_admissions) {
        document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPatientName_admissions").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showSubscriberId_admissions) {
        document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemSubscriberId_admissions").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showPcpName_admissions) {
        document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPcpName_admissions").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showEligibleMonth_admissions) {
        document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemEligibleMonth_admissions").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showTotalNoOfAdmissions_admissions) {
        document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemTotalNoOfAdmissions_admissions").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showTotalCost_admissions) {
        document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemTotalCost_admissions").style.backgroundColor = "#d03b3c";
      }

      self.generateAdmissionsReportXLSX();

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
            
            <h2>Admissions Report - Details</h2>
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
        <Row>
          <Col xs="12" md="3" >
            
              <Card>
              <CardHeader className="filterCardHeaderStyle2">Year</CardHeader>
              <CardBody>
                  <Select
                    
                      id="admissionsReportYearSelect"
                      className="Col md='5'"
                      value={this.state.admissionsReportYearSelectValue}
                      options={this.state.yearsList}
                      onChange={this.setAdmissionsReportYearValue}
                            />
              </CardBody>
              </Card>
            
            
              <Card>
              <CardHeader className="filterCardHeaderStyle2">Health Plan</CardHeader>
              <CardBody>
              <Select
                          id="duplicateClaimsProviderSelect"
                          className="Col md='5'"
                          value={this.state.admissionsReportProviderSelectValue}
                          options={this.state.ProviderList}
                          onChange={this.setAdmissionsReportProviderValue}
                        />
              </CardBody>
              </Card>
            
            
              <Card >
              <CardHeader className="filterCardHeaderStyle2">Doctor</CardHeader>
              <CardBody>
              <Select
                            placeholder="Select Doctor"
                            className="Col md='5'"
                            value={this.state.admissionsReportPcpNameValue}
                            options={this.state.pcpReportList}
                            onChange={this.setAdmissionsReportPcpName}
                          />  
              </CardBody>
              </Card>
            
          </Col>
          <Col xs="12" md="9" >          
        <div>
          <ReactTable
            manual
            data={this.state.admissionsReportData}
            loading={this.state.loading}
            pages={this.state.admissionsReportPages}
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
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  },
                  {
                    Header: "HICN/Subscriber ID",
                    accessor: "subscriberId",
                    show: this.state.showSubscriberId_admissions,
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  },
                  {
                    Header: "PCP Name",
                    accessor: "pcpName",
                    show: this.state.showPcpName_admissions,
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  },
                  {
                    Header: "Eligible Month",
                    accessor: "eligibleMonth",
                    show: this.state.showEligibleMonth_admissions,
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  },
                  {
                    Header: "Total Number Of Addmissions",
                    accessor: "totalNoOfAdmissions",
                    show: this.state.showTotalNoOfAdmissions_admissions,
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  },
                  {
                    Header: "Total Cost",
                    accessor: "totalCost",
                    show: this.state.showTotalCost_admissions,
                    headerStyle: {
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginTop: "5px"
                    },
                    filterMethod: (filter, row) =>
                      row[filter.id].startsWith(filter.value)
                  }
                ]
              }
            ]}
            defaultPageSize={100}
            onFetchData={this.fetchAdmissionsReportData}
            className="-striped -highlight commonFontFamily"
            pageText={
              "Total Entries " + this.state.admissionsReportTotalCount + ", Page"
            }
    
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
                onClick: e => {
                  if (column.Header == "HICN/Subscriber ID") {
                  self.getAdmissionsReportExpandDataRow(rowInfo);
                 }
                },
               style: {
             color: column.Header === "HICN/Subscriber ID" ? "#337ab7" : "",
            cursor: column.Header === "HICN/Subscriber ID" ? "pointer" : ""
          }
    
              };
        }}
       />
    </div>
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_admissionsReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderAdmissionsReportXLSX/'+self.state.jsonDataForAdmissionsReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderAdmissionsReportPDF/'+self.state.jsonDataForAdmissionsReport} target="_blank" >
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
export default AdmissionReport;
