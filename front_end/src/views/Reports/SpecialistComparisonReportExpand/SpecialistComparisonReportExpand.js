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

class SpecialistComparisonReportExpand extends Component {

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
      
      specialistComparisonExpandReportModal: false,
      specialistComparisonExpandReportLoading: false,
      specialistComparisonExpandReportPages: 0,
      specialistComparisonExpandReportData: [],
      specialistComparisonExpandReportTotalCount: 0,
      specialistComparisonExpandReportFileQuery: "",
      exportModeltoggleView: false,
      specialistComparisonSpecialityCode: "",

      showPracticeName_specialistComparisonExpand: true,
      showSpecialityType_specialistComparisonExpand: true,
      showNoOfClaims_specialistComparisonExpand: true,
      showAverageCostPerClaim_specialistComparisonExpand: true,
      showCost_specialistComparisonExpand: true,

  
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);

    this.getValueFromLocalStorage = this.getValueFromLocalStorage.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchSpecialistComparisonExpandReportData = this.fetchSpecialistComparisonExpandReportData.bind(this);
    this.fetchSpecialistComparisonExpandReportData = debounce(this.fetchSpecialistComparisonExpandReportData,500);
    
  }

  componentDidMount() {
    localStorage.removeItem('specialistComparisonPracticeName');
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
    self.getDuplicateClaimReportsRowData();
 
  }
  getDuplicateClaimReportsRowData(rowInfo) {
    self.setState({
      specialistComparisonSpecialityCode: localStorage.getItem('specialistComparisonSpecialityCode'),

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


fetchSpecialistComparisonExpandReportData(state, instance) {
  var page = state.page + 1;
  self.state.specialistComparisonExpandGridPage = page;
  self.state.specialistComparisonExpandGridPageSize = state.pageSize;
  self.state.specialistComparisonExpandGridSorted = state.sorted;
  self.state.specialistComparisonExpandGridFiltered = state.filtered;
  self.getSpecialistComparisonExpandReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
}

  getSpecialistComparisonExpandReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonExpandReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('speciality', self.state.specialistComparisonSpecialityCode);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonExpandReportData', {
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
          self.setState({specialistComparisonExpandReportData: response.specialistComparisonExpandReportData,specialistComparisonExpandReportPages:response.pages,specialistComparisonExpandReportTotalCount:response.totalCount,specialistComparisonExpandReportFileQuery:response.fileQuery});
          self.setState({ specialistComparisonExpandReportLoading: false });
          self.generateSpecialistComparisonExpandReportXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_specialistComparisonReportExpand() {

    var propertiesArr = [];

    if(self.state.showPracticeName_specialistComparisonExpand)
      propertiesArr.push("Practice Name");
    if(self.state.showSpecialityType_specialistComparisonExpand)
      propertiesArr.push("Speciality Type");
    if(self.state.showNoOfClaims_specialistComparisonExpand)
      propertiesArr.push("Number Of Claims");
    if(self.state.showAverageCostPerClaim_specialistComparisonExpand)
      propertiesArr.push("Average Cost Per Claim");
    if(self.state.showCost_specialistComparisonExpand)
      propertiesArr.push("Cost");
    

    const formData = new FormData();
    formData.append('fileQuery', self.state.specialistComparisonExpandReportFileQuery);

    fetch(config.serverUrl+'/getSpecialistComparisonExpandReportDataForPrint', {
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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Report Search", documentTitle:"Print-Specialist Comparison Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generateSpecialistComparisonExpandReportXLSX() {
  const formData = new FormData();
 
  formData.append('fileQuery', self.state.specialistComparisonExpandReportFileQuery);
  formData.append('showPracticeName_specialistComparisonExpand', self.state.showPracticeName_specialistComparisonExpand);
  formData.append('showSpecialityType_specialistComparisonExpand', self.state.showSpecialityType_specialistComparisonExpand);
  formData.append('showNoOfClaims_specialistComparisonExpand', self.state.showNoOfClaims_specialistComparisonExpand);
  formData.append('showAverageCostPerClaim_specialistComparisonExpand', self.state.showAverageCostPerClaim_specialistComparisonExpand);
  formData.append('showCost_specialistComparisonExpand', self.state.showCost_specialistComparisonExpand);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForSpecialistComparisonExpandReport: btoa(JSON.stringify(object))});
 }


 getSpecialistComparisonExpandDataRow(rowInfo) {
  localStorage.setItem('specialistComparisonPracticeName', rowInfo.row.practiceName);
   window.location.href = "#/specialistComparisionPrecticeExpand";
}
  backToReports() {
    window.location.href = "#specialistComaparisionReport";
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
        if(self.state.showSpecialityType_specialistComparisonExpand) {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfClaims_specialistComparisonExpand) {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showAverageCostPerClaim_specialistComparisonExpand) {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_specialistComparisonExpand) {
          document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_specialistComparisonExpand(columnName) {
    
    if(columnName == "specialityType") {
      this.state.showSpecialityType_specialistComparisonExpand = !this.state.showSpecialityType_specialistComparisonExpand;
    }
    if(columnName == "numberOfClaims") {
      this.state.showNoOfClaims_specialistComparisonExpand = !this.state.showNoOfClaims_specialistComparisonExpand;
    }
    if(columnName == "averageCostPerClaim") {
      this.state.showAverageCostPerClaim_specialistComparisonExpand = !this.state.showAverageCostPerClaim_specialistComparisonExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_specialistComparisonExpand = !this.state.showCost_specialistComparisonExpand;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

        if(self.state.showSpecialityType_specialistComparisonExpand) {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityType_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfClaims_specialistComparisonExpand) {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfClaims_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showAverageCostPerClaim_specialistComparisonExpand) {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAverageCostPerClaim_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_specialistComparisonExpand) {
          document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_specialistComparisonExpand").style.backgroundColor = "#d03b3c";
        }

        self.generateSpecialistComparisonExpandReportXLSX();

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
            <h2>Specialist Comparison Report - {self.state.specialistComparisonSpecialityCode} Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemSpecialityType_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("specialityType")}>Speciality Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageCostPerClaim_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("averageCostPerClaim")}>Average Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_specialistComparisonExpand" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparisonExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        

        <ReactTable
                              manual
                              data={this.state.specialistComparisonExpandReportData}
                              loading={this.state.specialistComparisonExpandReportLoading}
                              pages={this.state.specialistComparisonExpandReportPages} // Display the total number of pages
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
                                      show: this.state.showPracticeName_specialistComparisonExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Speciality Type",
                                      accessor: "specialityType",
                                      show: this.state.showSpecialityType_specialistComparisonExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparisonExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Average Cost Per Claim",
                                      accessor: "averageCostPerClaim",
                                      show: this.state.showAverageCostPerClaim_specialistComparisonExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_specialistComparisonExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonExpandReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonExpandReportTotalCount+', Page'}
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
                                      if(column.Header == "Practice Name") {
                                        self.getSpecialistComparisonExpandDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "Practice Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Practice Name" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_specialistComparisonReportExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportXLSX/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonExpandReportPDF/'+self.state.jsonDataForSpecialistComparisonExpandReport} target="_blank" >
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
export default SpecialistComparisonReportExpand;
