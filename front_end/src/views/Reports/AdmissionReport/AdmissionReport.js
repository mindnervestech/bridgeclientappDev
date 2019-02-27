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
      self.state.admissionsReportPcpNameValue = { value: localStorage.getItem('pcpName'), label: localStorage.getItem('pcpName') };
    if (localStorage.getItem('year') != null)
      self.state.admissionsReportYearSelectValue = { value: localStorage.getItem('year'), label: localStorage.getItem('year') }; 
  }

  setAdmissionsReportProviderValue(e) {
    self.state.admissionsReportProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.admissionsReportProviderSelectValue.value);
    setTimeout(function(){
      self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
    }, 1000);
  }
  setAdmissionsReportPcpName(e) {
    self.state.admissionsReportPcpNameValue = e;
    self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted),JSON.stringify(self.state.admissionsReportGridFiltered));
  }
 
  setAdmissionsReportYearValue(e) {
    self.state.admissionsReportYearSelectValue = e;
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
          self.generateAdmissionsReportHeaderXLSX();
      });
        
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

  render() {
    return (
      <React.Fragment>
        <Row className="header">
        <Col md="10">
          <FormGroup check inline>
            <img id="backButton" onClick={this.backToReports}  src="/img/header-back-button.png" />
          </FormGroup>
          <FormGroup check inline>
            
            <h2>Admission Report Data</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
          </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <Row>
              <Card id="selectCardStyle">
              <CardHeader Style={{backgroundColor:'white'}}>Year</CardHeader>
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
            </Row>
            <Row>
              <Card id="selectCardStyle">
              <CardHeader>Health Plan</CardHeader>
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
            </Row>
            <Row>
              <Card id="selectCardStyle">
              <CardHeader>Doctor</CardHeader>
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
            </Row>
          </Col>
          <Col md="9">          
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
