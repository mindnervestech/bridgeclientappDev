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

class SpecialistComparisionPrecticeDetails extends Component {

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
      
      specialistComparisonExpandPracticeReportModal: false,
      specialistComparisonExpandPracticeReportLoading: false,
      specialistComparisonExpandPracticeReportPages: 0,
      specialistComparisonExpandPracticeReportData: [],
      specialistComparisonExpandPracticeReportTotalCount: 0,
      specialistComparisonExpandPracticeReportFileQuery: "",
      specialistComparisonPracticeName: "",
      dropdownOpen: new Array(1).fill(false),
      
      showPracticeName_specialistComparisonExpandPractice: true,
      showSpecialityType_specialistComparisonExpandPractice: true,
      showPatientName_specialistComparisonExpandPractice: true,
      showPcpName_specialistComparisonExpandPractice: true,
      showNoOfClaims_specialistComparisonExpandPractice: true,
      showAverageCostPerClaim_specialistComparisonExpandPractice: true,
      showCost_specialistComparisonExpandPractice: true,

  
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchSpecialistComparisonExpandPracticeReportData = this.fetchSpecialistComparisonExpandPracticeReportData.bind(this);
    this.fetchSpecialistComparisonExpandPracticeReportData = debounce(this.fetchSpecialistComparisonExpandPracticeReportData,500);
    
  }

  componentDidMount() {
    localStorage.removeItem('specialistComparisonPatientName');
    localStorage.removeItem('pcpNameExpand');


      if (localStorage.getItem('provider') != null)
        self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
      if (localStorage.getItem('pcpName') != null)
        self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
      if (localStorage.getItem('year') != null)
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('year'));
      self.getPCPForProviders(self.state.providerSelectValue.value);

    self.getSpecialistComaprisionPracticeReportsRowData();
 
  }
  getSpecialistComaprisionPracticeReportsRowData(rowInfo) {
    self.setState({
        specialistComparisonPracticeName: localStorage.getItem('specialistComparisonPracticeName'),
    });
 }

 setPcpName(e) {
   self.state.pcpNameValue = e;
   localStorage.setItem('pcpNameExpand', JSON.stringify(e));
   self.getSpecialistComparisonExpandPracticeReportData(self.state.specialistComparisonExpandPracticeGridPageSize,1,JSON.stringify(self.state.specialistComparisonExpandPracticeGridSorted),JSON.stringify(self.state.specialistComparisonExpandPracticeGridFiltered));
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
    });
  }

  getValueFromLocalStorage() {
    if (localStorage.getItem('provider') != null) {
      self.state.providerSelectValue = { value: localStorage.getItem('provider'), label: localStorage.getItem('provider') };
    }
      if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue = { value: localStorage.getItem('pcpName'), label: localStorage.getItem('pcpNameLabel') };
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue = { value: localStorage.getItem('year'), label: localStorage.getItem('year') };
  
}  


fetchSpecialistComparisonExpandPracticeReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonExpandPracticeGridPage = page;
    self.state.specialistComparisonExpandPracticeGridPageSize = state.pageSize;
    self.state.specialistComparisonExpandPracticeGridSorted = state.sorted;
    self.state.specialistComparisonExpandPracticeGridFiltered = state.filtered;
    self.getSpecialistComparisonExpandPracticeReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

getSpecialistComparisonExpandPracticeReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonExpandPracticeReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
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
          self.setState({ specialistComparisonExpandPracticeReportLoading: false });
          self.generateSpecialistComparisonExpandPrecticeReportXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }
  getSpecialistComparisonPatientExpandDataRow(rowInfo) {
    localStorage.setItem('specialistComparisonPatientName',rowInfo.row.medicareId);
    window.location.href = "#/specialistComparisionPatientDetails";
 }

  printTableData_specialistComparisonPrecticeReportExpand() {

    var propertiesArr = [];

    if(self.state.showPracticeName_specialistComparisonExpandPractice)
      propertiesArr.push("Practice Name");
    if(self.state.showSpecialityType_specialistComparisonExpandPractice)
      propertiesArr.push("Speciality Type");
    if(self.state.showPatientName_specialistComparisonExpandPractice)
      propertiesArr.push("Patient Name");
    if(self.state.showPcpName_specialistComparisonExpandPractice)
      propertiesArr.push("PCP Name");
    if(self.state.showNoOfClaims_specialistComparisonExpandPractice)
      propertiesArr.push("Number Of Claims");
    if(self.state.showAverageCostPerClaim_specialistComparisonExpandPractice)
     propertiesArr.push("Average Cost Per Claim");
    if(self.state.showCost_specialistComparisonExpandPractice)
     propertiesArr.push("Cost");
      
    

    const formData = new FormData();
    formData.append('fileQuery', self.state.specialistComparisonExpandPracticeReportFileQuery);

    fetch(config.serverUrl+'/getSpecialistComparisonExpandPracticeReportDataForPrint', {
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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Practice Report Search", documentTitle:"Print-Specialist Comparison Practice Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generateSpecialistComparisonExpandPrecticeReportXLSX() {
  const formData = new FormData();

 
  formData.append('fileQuery', self.state.specialistComparisonExpandPracticeReportFileQuery);
  formData.append('showPracticeName_specialistComparisonExpandPractice', self.state.showPracticeName_specialistComparisonExpandPractice);
  formData.append('showSpecialityType_specialistComparisonExpandPractice', self.state.showSpecialityType_specialistComparisonExpandPractice);
  formData.append('showPatientName_specialistComparisonExpandPractice', self.state.showPatientName_specialistComparisonExpandPractice);
  formData.append('showPcpName_specialistComparisonExpandPractice', self.state.showPcpName_specialistComparisonExpandPractice);
  formData.append('showNoOfClaims_specialistComparisonExpandPractice', self.state.showNoOfClaims_specialistComparisonExpandPractice);
  formData.append('showAverageCostPerClaim_specialistComparisonExpandPractice', self.state.showAverageCostPerClaim_specialistComparisonExpandPractice);
  formData.append('showCost_specialistComparisonExpandPractice', self.state.showCost_specialistComparisonExpandPractice);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForSpecialistComparisonExpandPracticeReport: btoa(JSON.stringify(object))});
 }
  backToReports() {
    window.location.href = "#specialistComparisonReportDetails";
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
        if(self.state.showPracticeName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecialityType_specialistComparisonExpandPractice) {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfClaims_specialistComparisonExpandPractice) {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showAverageCostPerClaim_specialistComparisonExpandPractice) {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_specialistComparisonExpandPractice) {
          document.getElementById("ddItemCost_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_specialistComparisonExpandPractice(columnName) {
    
    if(columnName == "practiceName") {
      this.state.showPracticeName_specialistComparisonExpandPractice = !this.state.showPracticeName_specialistComparisonExpandPractice;
    }
    if(columnName == "spacialistType") {
      this.state.showSpecialityType_specialistComparisonExpandPractice = !this.state.showSpecialityType_specialistComparisonExpandPractice;
    }
    if(columnName == "patientName") {
      this.state.showPatientName_specialistComparisonExpandPractice = !this.state.showPatientName_specialistComparisonExpandPractice;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_specialistComparisonExpandPractice = !this.state.showPcpName_specialistComparisonExpandPractice;
    }
    if(columnName == "numberOfClaims") {
      this.state.showNoOfClaims_specialistComparisonExpandPractice = !this.state.showNoOfClaims_specialistComparisonExpandPractice;
    }
    if(columnName == "averageCostPerClaim") {
      this.state.showAverageCostPerClaim_specialistComparisonExpandPractice = !this.state.showAverageCostPerClaim_specialistComparisonExpandPractice;
    }
    if(columnName == "cost") {
      this.state.showCost_specialistComparisonExpandPractice = !this.state.showCost_specialistComparisonExpandPractice;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

        if(self.state.showPracticeName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecialityType_specialistComparisonExpandPractice) {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_specialistComparisonExpandPractice) {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfClaims_specialistComparisonExpandPractice) {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showAverageCostPerClaim_specialistComparisonExpandPractice) {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_specialistComparisonExpandPractice) {
          document.getElementById("ddItemCost_specialistComparisonExpandPractice").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_specialistComparisonExpandPractice").style.backgroundColor = "#d03b3c";
        }
      
        self.generateSpecialistComparisonExpandPrecticeReportXLSX();

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
            <h2>Specialist Comparison Report Practice Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemPracticeName_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("practiceName")}>Practice Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecialityType_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("spacialistType")}>Speciality Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageCostPerClaim_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("averageCostPerClaim")}>Average Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_specialistComparisonExpandPractice" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpandPractice("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
                <Col xs="12" md="3">
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
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Speciality Type",
                                      accessor: "specialityType",
                                      show: this.state.showSpecialityType_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Average Cost Per Claim",
                                      accessor: "averageCostPerClaim",
                                      show: this.state.showAverageCostPerClaim_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_specialistComparisonExpandPractice,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Medicare ID",
                                      accessor: "medicareId",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
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
                                    if(column.Header == "Patient Name") {
                                      self.getSpecialistComparisonPatientExpandDataRow(rowInfo);
                                    }
                                  },
                                  style: {
                                    color: column.Header === "Patient Name" ? "#337ab7" : "",
                                    cursor: column.Header === "Patient Name" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_specialistComparisonPrecticeReportExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonExpandPracticeReportXLSX/'+self.state.jsonDataForSpecialistComparisonExpandPracticeReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonExpandPracticeReportPDF/'+self.state.jsonDataForSpecialistComparisonExpandPracticeReport} target="_blank" >
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
export default SpecialistComparisionPrecticeDetails;
