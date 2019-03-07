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

class ERPatientVisitReport extends Component {

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
      
        patientVisitReportLoading: false,
        patientVisitReportPages: 0,
        patientVisitReportData: [],
        patientVisitReportTotalCount: 0,
        patientVisitReportFileQuery: "",
        dropdownOpen: new Array(1).fill(false), 
        
        showPatientName_patientVisit: true,
        showHicn_patientVisit: true,
        showPcpName_patientVisit: true,
        showTermedMonth_patientVisit: true,
        showIpaEffectiveDate_patientVisit: true,
        showTotalErVisits_patientVisit: true,
        showTotalCost_patientVisit: true,
  
      
      exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchPatientVisitReportData = this.fetchPatientVisitReportData.bind(this);
    this.getValueFromLocalStorage = this.getValueFromLocalStorage.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchPatientVisitReportData = debounce(this.fetchPatientVisitReportData,500);
  }

  componentDidMount() {
    localStorage.removeItem('ERPatientVisitExpandReportMedicareId');
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList,pcpList:response.pcpList, yearsList:response.yearsList});
     
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
    self.getValueFromLocalStorage();
 
  }

  getValueFromLocalStorage() {

    if (localStorage.getItem('providerForReports') != null) {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('providerForReports'));
    }
    if (localStorage.getItem('pcpNameForReports') != null) {
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpNameForReports'));
    }
    if (localStorage.getItem('yearForReports') != null) {
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('yearForReports'));

    }
  }

  setProviderValue(e) {
    self.state.providerSelectValue = e;
    self.getPCPForProviders(self.state.providerSelectValue.value);
    localStorage.setItem('provider', JSON.stringify(e));
      setTimeout(function () {
     self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
    }, 1000);
  }

  setPcpName(e) {

    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
   }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getPatientVisitReportData(self.state.patientVisitGridPageSize, 1, JSON.stringify(self.state.patientVisitGridSorted),JSON.stringify(self.state.patientVisitGridFiltered));
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

  fetchPatientVisitReportData(state, instance) {
    var page = state.page + 1;
    self.state.patientVisitGridPage = page;
    self.state.patientVisitGridPageSize = state.pageSize;
    self.state.patientVisitGridSorted = state.sorted;
    self.state.patientVisitGridFiltered = state.filtered;
    self.getPatientVisitReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getPatientVisitReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ patientVisitReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
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
  getERPatientVisitExpandDataRow(rowInfo) {
    localStorage.setItem('ERPatientVisitExpandReportMedicareId', rowInfo.row.hicn);
    window.location.href = "#/erPatientVisitReportDetails";
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
        if(self.state.showPatientName_patientVisit) {
          document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHicn_patientVisit) {
          document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_patientVisit) {
          document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth_patientVisit) {
          document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIpaEffectiveDate_patientVisit) {
          document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalErVisits_patientVisit) {
          document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalCost_patientVisit) {
          document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_patientVisit(columnName) {
    
    if (columnName == "patientName") {
      this.state.showPatientName_patientVisit = !this.state.showPatientName_patientVisit;
    }
    if (columnName == "hicn") {
      this.state.showHicn_patientVisit = !this.state.showHicn_patientVisit;
    }
    if (columnName == "pcpName") {
      this.state.showPcpName_patientVisit = !this.state.showPcpName_patientVisit;
    }
    if (columnName == "termedMonth") {
      this.state.showTermedMonth_patientVisit = !this.state.showTermedMonth_patientVisit;
    }
    if (columnName == "ipaEffectiveDate") {
      this.state.showIpaEffectiveDate_patientVisit = !this.state.showIpaEffectiveDate_patientVisit;
    }
    if (columnName == "totalErVisits") {
      this.state.showTotalErVisits_patientVisit = !this.state.showTotalErVisits_patientVisit;
    }
    if (columnName == "totalCost") {
      this.state.showTotalCost_patientVisit = !this.state.showTotalCost_patientVisit;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

    if (self.state.showPatientName_patientVisit) {
      document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemPatientName_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showHicn_patientVisit) {
      document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemHicn_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showPcpName_patientVisit) {
      document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemPcpName_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showTermedMonth_patientVisit) {
      document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemTermedMonth_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showIpaEffectiveDate_patientVisit) {
      document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemIpaEffectiveDate_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showTotalErVisits_patientVisit) {
      document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemTotalErVisits_patientVisit").style.backgroundColor = "#d03b3c";
    }
    if (self.state.showTotalCost_patientVisit) {
      document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "";
    } else {
      document.getElementById("ddItemTotalCost_patientVisit").style.backgroundColor = "#d03b3c";
    }

    self.generatePatientVisitReportXLSX();
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
            
            <h2>Frequent ER Visit</h2>
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN",
                                      accessor: "hicn",
                                      show: this.state.showHicn_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Effective Date",
                                      accessor: "ipaEffectiveDate",
                                      show: this.state.showIpaEffectiveDate_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Number Of ER Visits",
                                      accessor: "totalErVisits",
                                      show: this.state.showTotalErVisits_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_patientVisit,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_patientVisitReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPatientVisitReportXLSX/'+self.state.jsonDataForPatientVisitReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPatientVisitReportPDF/'+self.state.jsonDataForPatientVisitReport} target="_blank" >
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
export default ERPatientVisitReport;
