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

class SpecialistComaparisionReport extends Component {

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
      

      specialistComparisonReportLoading: false,
      specialistComparisonReportPages: 0,
      specialistComparisonReportData: [],
      specialistComparisonReportTotalCount: 0,
        specialistComparisonReportFileQuery: "",
        dropdownOpen: new Array(1).fill(false),
        showSpecialityCode_specialistComparison: true,
        showNoOfClaims_specialistComparison: true,
        showNoOfPcp_specialistComparison: true,
        showNoOfBeneficiaries_specialistComparison: true,
        showCostPerClaim_specialistComparison: true,
        showCostPerBeneficiary_specialistComparison: true,
        showTotalCost_specialistComparison: true,
      
      exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchSpecialistComparisonReportData = this.fetchSpecialistComparisonReportData.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchSpecialistComparisonReportData = debounce(this.fetchSpecialistComparisonReportData,500);
  }

  componentDidMount() {
    localStorage.removeItem('specialistComparisonPracticeName');
    localStorage.removeItem('specialistComparisonPatientName');
    localStorage.removeItem('specialistComparisonSpecialityCode');
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList, yearsList:response.yearsList});
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
      self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));  
  }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getSpecialistComparisonReportData(self.state.specialistComparisonGridPageSize, 1, JSON.stringify(self.state.specialistComparisonGridSorted),JSON.stringify(self.state.specialistComparisonGridFiltered));
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

  fetchSpecialistComparisonReportData(state, instance) {
    var page = state.page + 1;
    self.state.specialistComparisonGridPage = page;
    self.state.specialistComparisonGridPageSize = state.pageSize;
    self.state.specialistComparisonGridSorted = state.sorted;
    self.state.specialistComparisonGridFiltered = state.filtered;
    self.getSpecialistComparisonReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getSpecialistComparisonReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ specialistComparisonReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSpecialistComparisonReportData', {
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
          self.setState({specialistComparisonReportData: response.specialistComparisonReportData,specialistComparisonReportPages:response.pages,specialistComparisonReportTotalCount:response.totalCount,specialistComparisonReportFileQuery:response.fileQuery});
          self.setState({ specialistComparisonReportLoading: false });
          self.generateSpecialistComparisonReportXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_specialistComparisonReport() {

    var propertiesArr = [];

    if(self.state.showSpecialityCode_specialistComparison)
      propertiesArr.push("Speciality Code");
    if(self.state.showNoOfPcp_specialistComparison)
      propertiesArr.push("Number Of PCP");
    if(self.state.showNoOfClaims_specialistComparison)
      propertiesArr.push("Number Of Claims");
    if(self.state.showNoOfBeneficiaries_specialistComparison)
      propertiesArr.push("Number Of Beneficiaries");
    if(self.state.showCostPerClaim_specialistComparison)
      propertiesArr.push("Cost Per Claim");
    if(self.state.showCostPerBeneficiary_specialistComparison)
      propertiesArr.push("Cost Per Beneficiary");
    if(self.state.showTotalCost_specialistComparison)
      propertiesArr.push("Total Cost");

    const formData = new FormData();
    formData.append('fileQuery', self.state.specialistComparisonReportFileQuery);

    fetch(config.serverUrl+'/getSpecialistComparisonReportDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Specialist Comparison Report Search", documentTitle:"Print-Specialist Comparison Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  

 generateSpecialistComparisonReportXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.specialistComparisonReportFileQuery);
    formData.append('showSpecialityCode_specialistComparison', self.state.showSpecialityCode_specialistComparison);
    formData.append('showNoOfPcp_specialistComparison', self.state.showNoOfPcp_specialistComparison);
    formData.append('showNoOfPcp_specialistComparison', self.state.showNoOfPcp_specialistComparison);
    formData.append('showNoOfClaims_specialistComparison', self.state.showNoOfClaims_specialistComparison);
    formData.append('showNoOfBeneficiaries_specialistComparison', self.state.showNoOfBeneficiaries_specialistComparison);
    formData.append('showCostPerClaim_specialistComparison', self.state.showCostPerClaim_specialistComparison);
    formData.append('showCostPerBeneficiary_specialistComparison', self.state.showCostPerBeneficiary_specialistComparison);
    formData.append('showTotalCost_specialistComparison', self.state.showTotalCost_specialistComparison);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForSpecialistComparisonReport: btoa(JSON.stringify(object))});
   }

  
  getSpecialistComparisonDataRow(rowInfo) {
     
    localStorage.setItem('specialistComparisonSpecialityCode',rowInfo.row.specialityCode);
    window.location.href = "#/specialistComparisonReportDetails";
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
      if (self.state.showSpecialityCode_specialistComparison) {
        document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showNoOfClaims_specialistComparison) {
        document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showNoOfPcp_specialistComparison) {
        document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showNoOfBeneficiaries_specialistComparison) {
        document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showCostPerClaim_specialistComparison) {
        document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showCostPerBeneficiary_specialistComparison) {
        document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "#d03b3c";
      }
      if (self.state.showTotalCost_specialistComparison) {
        document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "#d03b3c";
      }
    
    }, 300);
  }
  showHideColumn_specialistComparison(columnName) {
    
    if(columnName == "specialityCode") {
      this.state.showSpecialityCode_specialistComparison = !this.state.showSpecialityCode_specialistComparison;
    }
    if(columnName == "numberOfClaims") {
      this.state.showNoOfClaims_specialistComparison = !this.state.showNoOfClaims_specialistComparison;
    }
    if(columnName == "numberOfPcp") {
      this.state.showNoOfPcp_specialistComparison = !this.state.showNoOfPcp_specialistComparison;
    }
    if(columnName == "numberOfBeneficiaries") {
      this.state.showNoOfBeneficiaries_specialistComparison = !this.state.showNoOfBeneficiaries_specialistComparison;
    }
    if(columnName == "costPerClaim") {
      this.state.showCostPerClaim_specialistComparison = !this.state.showCostPerClaim_specialistComparison;
    }
    if(columnName == "costPerBeneficiary") {
      this.state.showCostPerBeneficiary_specialistComparison = !this.state.showCostPerBeneficiary_specialistComparison;
    }
    if(columnName == "totalCost") {
      this.state.showTotalCost_specialistComparison = !this.state.showTotalCost_specialistComparison;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

        if(self.state.showSpecialityCode_specialistComparison) {
          document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecialityCode_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfClaims_specialistComparison) {
          document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfClaims_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfPcp_specialistComparison) {
          document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfPcp_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showNoOfBeneficiaries_specialistComparison) {
          document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNumberOfBeneficiaries_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCostPerClaim_specialistComparison) {
          document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCostPerClaim_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCostPerBeneficiary_specialistComparison) {
          document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCostPerBeneficiary_specialistComparison").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalCost_specialistComparison) {
          document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_specialistComparison").style.backgroundColor = "#d03b3c";
        }

        self.generateSpecialistComparisonReportXLSX();

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
            
            <h2>Specialist Comparison Report</h2>
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
                                  <DropdownItem toggle={false} id="ddItemSpecialityCode_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("specialityCode")}>Speciality Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfPcp_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfPcp")}>Number Of PCP</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfClaims_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfClaims")}>Number Of Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNumberOfBeneficiaries_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("numberOfBeneficiaries")}>Number Of Beneficiaries</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCostPerClaim_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("costPerClaim")}>Cost Per Claim</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCostPerBeneficiary_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("costPerBeneficiary")}>Cost Per Beneficiary</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_specialistComparison" className="commonFontFamily" onClick={e => self.showHideColumn_specialistComparison("totalCost")}>Total Cost</DropdownItem>
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
                              data={this.state.specialistComparisonReportData}
                              loading={this.state.specialistComparisonReportLoading}
                              pages={this.state.specialistComparisonReportPages} 
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Speciality Code",
                                      accessor: "specialityCode",
                                      show: this.state.showSpecialityCode_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Number Of PCP",
                                      accessor: "numberOfPcp",
                                      show: this.state.showNoOfPcp_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Number Of Claims",
                                      accessor: "numberOfClaims",
                                      show: this.state.showNoOfClaims_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Number Of Beneficiaries",
                                      accessor: "numberOfBeneficiaries",
                                      show: this.state.showNoOfBeneficiaries_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Cost Per Claim",
                                      accessor: "costPerClaim",
                                      show: this.state.showCostPerClaim_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Cost Per Beneficiary",
                                      accessor: "costPerBeneficiary",
                                      show: this.state.showCostPerBeneficiary_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_specialistComparison,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterable: false,
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSpecialistComparisonReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.specialistComparisonReportTotalCount+', Page'}
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
                                      if(column.Header == "Speciality Code") {
                                        self.getSpecialistComparisonDataRow(rowInfo);
                                      }
                                    },
                                    style: {
                                      color: column.Header === "Speciality Code" ? "#337ab7" : "",
                                      cursor: column.Header === "Speciality Code" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_specialistComparisonReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonReportXLSX/'+self.state.jsonDataForSpecialistComparisonReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSpecialistComparisonReportPDF/'+self.state.jsonDataForSpecialistComparisonReport} target="_blank" >
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
export default SpecialistComaparisionReport;
