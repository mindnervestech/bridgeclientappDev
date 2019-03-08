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

class SpecialistComparisonReportDetails extends Component {

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
        specialistComparisonPatientName: '',
        specialistComparisonPracticeName: '',

        
        specialistComparisonPatientExpandReportModal: false,
        specialistComparisonPatientExpandReportLoading: false,
        specialistComparisonPatientExpandReportPages: 0,
        specialistComparisonPatientExpandReportData: [],
        specialistComparisonPatientExpandReportTotalCount: 0,
        specialistComparisonPatientExpandReportFileQuery: "",

        showPracticeName_specialistComparisonPatientExpand: true,
        showSpecialityType_specialistComparisonPatientExpand: true,
        showPatientName_specialistComparisonPatientExpand: true,
        showPcpName_specialistComparisonPatientExpand: true,
        showCost_specialistComparisonPatientExpand: true,

  
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchSpecialistComparisonPatientExpandReportData = this.fetchSpecialistComparisonPatientExpandReportData.bind(this);
    this.fetchSpecialistComparisonPatientExpandReportData = debounce(this.fetchSpecialistComparisonPatientExpandReportData,500);
    
  }

  componentDidMount() {

      if (localStorage.getItem('provider') != null)
        self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
    if (localStorage.getItem('pcpNameExpand') != null)
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpNameExpand'));
    else 
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpName'));
      if (localStorage.getItem('year') != null)
        self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
        
    
    self.getSpecialistComparisionRowData();
 
  }
  getSpecialistComparisionRowData(rowInfo) {
    self.setState({
        specialistComparisonPatientName: localStorage.getItem('specialistComparisonPatientName'),
        specialistComparisonPracticeName: localStorage.getItem('specialistComparisonPracticeName'),
    });

 }

fetchSpecialistComparisonPatientExpandReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonExpandPatientGridPage = page;
    self.state.specialistComparisonExpandPatientGridPageSize = state.pageSize;
    self.state.specialistComparisonExpandPatientGridSorted = state.sorted;
    self.state.specialistComparisonExpandPatientGridFiltered = state.filtered;
    self.getSpecialistComparisonPatientExpandReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getSpecialistComparisonPatientExpandReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonPatientExpandReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('medicareId',self.state.specialistComparisonPatientName)
      formData.append('practiceName', self.state.specialistComparisonPracticeName);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonPatientExpandReportData', {
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
          self.setState({ specialistComparisonPatientExpandReportData: response.specialistComparisonExpandPatientReportData,specialistComparisonPatientExpandReportPages:response.pages,specialistComparisonPatientExpandReportTotalCount:response.totalCount,specialistComparisonPatientExpandReportFileQuery:response.fileQuery});
          self.setState({ specialistComparisonPatientExpandReportLoading: false });
          self.generateSpecialistComparisonPatientExpandReportXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_specialistComparisonPatientReportExpand() {

    var propertiesArr = [];
  
    if(self.state.showPracticeName_specialistComparisonPatientExpand)
      propertiesArr.push("Practice Name");
    if(self.state.showSpecialityType_specialistComparisonPatientExpand)
      propertiesArr.push("Speciality Type");
    if(self.state.showPatientName_specialistComparisonPatientExpand)
      propertiesArr.push("Patient Name");
    if(self.state.showPcpName_specialistComparisonPatientExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showCost_specialistComparisonPatientExpand)
     propertiesArr.push("Cost");
      
    
  
    const formData = new FormData();
    formData.append('fileQuery', self.state.specialistComparisonPatientExpandReportFileQuery);
  
    fetch(config.serverUrl+'/getSpecialistComparisonPatientExpandReportDataForPrint', {
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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Patient Report Search", documentTitle:"Print-Specialist Comparison Practice Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
  }

  
  generateSpecialistComparisonPatientExpandReportXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.specialistComparisonPatientExpandReportFileQuery);
    formData.append('showPracticeName_specialistComparisonPatientExpand', self.state.showPracticeName_specialistComparisonPatientExpand);
    formData.append('showSpecialityType_specialistComparisonPatientExpand', self.state.showSpecialityType_specialistComparisonPatientExpand);
    formData.append('showPatientName_specialistComparisonPatientExpand', self.state.showPatientName_specialistComparisonPatientExpand);
    formData.append('showPcpName_specialistComparisonPatientExpand', self.state.showPcpName_specialistComparisonPatientExpand);
    formData.append('showCost_specialistComparisonPatientExpand', self.state.showCost_specialistComparisonPatientExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSpecialistComparisonPatientExpandReport: btoa(JSON.stringify(object))});
   }

  backToReports() {
    window.location.href = "#specialistComparisionPrecticeDetails";
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
        if(self.state.showPracticeName_specialistComparisonPatientExpand) {
            document.getElementById("ddItemPracticeName_specialistComparisonExpandPatient").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPracticeName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showSpecialityType_specialistComparisonPatientExpand) {
            document.getElementById("ddItemSpecialityType_specialistComparisonExpandPatient").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemSpecialityType_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showPatientName_specialistComparisonPatientExpand) {
            document.getElementById("ddItemPatientName_specialistComparisonExpandPatient").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showPcpName_specialistComparisonPatientExpand) {
            document.getElementById("ddItemPcpName_specialistComparisonExpandPatient").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showCost_specialistComparisonPatientExpand) {
            document.getElementById("ddItemCost_specialistComparisonExpandPatient").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCost_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
          }
      }
    }, 300);
  }
  showHideColumn_specialistComparisonPatientExpand(columnName) {
    
    if(columnName == "practiceName") {
      this.state.showPracticeName_specialistComparisonPatientExpand = !this.state.showPracticeName_specialistComparisonPatientExpand;
    }
    if(columnName == "specialityType") {
      this.state.showSpecialityType_specialistComparisonPatientExpand = !this.state.showSpecialityType_specialistComparisonPatientExpand  ;
    }
    if(columnName == "patientName") {
      this.state.showPatientName_specialistComparisonPatientExpand = !this.state.showPatientName_specialistComparisonPatientExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_specialistComparisonPatientExpand = !this.state.showPcpName_specialistComparisonPatientExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_specialistComparisonPatientExpand = !this.state.showCost_specialistComparisonPatientExpand;
    }
  
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
  
        if(self.state.showPracticeName_specialistComparisonPatientExpand) {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPatient").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPracticeName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecialityType_specialistComparisonPatientExpand) {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPatient").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_specialistComparisonPatientExpand) {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPatient").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_specialistComparisonPatientExpand) {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPatient").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_specialistComparisonPatientExpand) {
          document.getElementById("ddItemCost_specialistComparisonExpandPatient").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_specialistComparisonExpandPatient").style.backgroundColor = "#d03b3c";
        }
      
        self.generateSpecialistComparisonPatientExpandReportXLSX();
  
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
            <h2>Specialist Comparison Report Patient Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemPracticeName_specialistComparisonExpandPatient" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonPatientExpand("practiceName")}>Practice Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecialityType_specialistComparisonExpandPatient" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonPatientExpand("specialityType")}>Speciality Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_specialistComparisonExpandPatient" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonPatientExpand("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_specialistComparisonExpandPatient" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonPatientExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_specialistComparisonExpandPatient" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonPatientExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        

        <ReactTable
                              manual
                              data={this.state.specialistComparisonPatientExpandReportData}
                              loading={this.state.specialistComparisonPatientExpandReportLoading}
                              pages={this.state.specialistComparisonPatientExpandReportPages} // Display the total number of pages
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
                                      show: this.state.showPracticeName_specialistComparisonPatientExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Speciality Type",
                                      accessor: "specialityType",
                                      show: this.state.showSpecialityType_specialistComparisonPatientExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_specialistComparisonPatientExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_specialistComparisonPatientExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_specialistComparisonPatientExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonPatientExpandReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonPatientExpandReportTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_specialistComparisonPatientReportExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonPatientExpandReportXLSX/'+self.state.jsonDataForSpecialistComparisonPatientExpandReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonPatientExpandReportPDF/'+self.state.jsonDataForSpecialistComparisonPatientExpandReport} target="_blank" >
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
export default SpecialistComparisonReportDetails;
