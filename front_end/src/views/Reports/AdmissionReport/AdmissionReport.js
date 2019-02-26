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
} from 'reactstrap';

class AdmissionReport extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

      admissionsReportData: [],
      loading: false,
      admissionsReportPages: 0,
      exportModeltoggleView: false,

      showPatientName_admissions: true,
      showSubscriberId_admissions: true,
      showPcpName_admissions: true,
      showEligibleMonth_admissions: true,
      showTotalNoOfAdmissions_admissions: true,
      showTotalCost_admissions: true,
      
      fetchAdmissionsReportData: [],
      admissionsReportYearSelectValue: "all",
      admissionsReportProviderSelectValue: { value: 'all', label: 'All' },
      admissionsReportPcpNameValue: "",

      admissionsReportGridPage: 0,
      admissionsReportGridPageSize: 0,
      admissionsReportGridSorted: {},
      admissionsReportGridFiltered: {}
    };
    self = this;
    
    self.state.admissionsReportPcpNameValue = { value: 'all', label: 'All' };
    
    this.fetchAdmissionsReportData = this.fetchAdmissionsReportData.bind(this);
    this.getAdmissionsReports = this.getAdmissionsReports.bind(this);
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchAdmissionsReportData = debounce(this.fetchAdmissionsReportData, 500);
    
  }

  toggleAdmissionsReportModal() {
    this.state.admissionsReportProviderSelectValue = this.state.claimTotalsProviderSelect;
    this.state.admissionsReportPcpNameValue = self.state.optionSelectValue;
    this.setState({
      pcpReportList: this.state.pcpList
    })
    this.setState({
      admissionsReportModal: !this.state.admissionsReportModal
    });
    this.state.loading = false;
  }

  setAdmissionsReportProviderValue(e) {
    self.state.admissionsReportProviderSelectValue = e;
    self.getPCPForReportProviders(self.state.admissionsReportProviderSelectValue.value);
    setTimeout(function () {
      self.getAdmissionsReports(self.state.admissionsReportGridPageSize, 1, JSON.stringify(self.state.admissionsReportGridSorted), JSON.stringify(self.state.admissionsReportGridFiltered));
    }, 1000);
  }

  fetchAdmissionsReportData(state, instance) {
    console.log("fetch data");
    var page = state.page + 1;
    self.state.admissionsReportGridPage = page;
    self.state.admissionsReportGridPageSize = state.pageSize;
    self.state.admissionsReportGridSorted = state.sorted;
    self.state.admissionsReportGridFiltered = state.filtered;
    self.getAdmissionsReports(state.pageSize, page, JSON.stringify(state.sorted), JSON.stringify(state.filtered));
  }

  getAdmissionsReports(pageSize, page, sortedArr, filteredArr) {
    self.setState({ loading: true });
    const formData = new FormData();
    console.log("reaport data")
    formData.append("year", self.state.admissionsReportYearSelectValue);
    formData.append("provider", self.state.admissionsReportProviderSelectValue.value);
    formData.append("pcpName", self.state.admissionsReportPcpNameValue.value);
    formData.append("pageSize", pageSize);
    formData.append("page", page);
    formData.append("sortedColumns", sortedArr);
    formData.append("filteredColumns", filteredArr);

    fetch(config.serverUrl + "/getAdmissionsReportData", {
      method: "POST",
      body: formData
    })
      .then(function (res1) {
        if (!res1.ok) {
          if (error.message) {
            self.setState({ errorMessage: error.message });
          }
        }
        return res1.json();
      })
      .then(function (response) {
        self.setState({
          admissionsReportData: response.admissionsReportData,
          admissionsReportPages: response.pages,
          admissionsReportTotalCount: response.totalCount,
          admissionsReportFileQuery: response.fileQuery
        });
        //console.log(response);
        self.setState({ loading: false });
        self.generateAdmissionsReportXLSX();
        self.generateAdmissionsReportHeaderXLSX();
        console.log("url");
      });
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
    console.log("clicked");
    console.log(this.state.exportModeltoggleView);
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
        <row className="header">
    
          <FormGroup check inline>
            <img id="backButton" onClick={this.backToReports}  src="/img/header-back-button.png" />
          </FormGroup>
          <FormGroup check inline>
            
            <h2>Admission Report Data</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
          </FormGroup>

        </row>

        <div>
          <ReactTable
            manual
            data={this.state.admissionsReportData}
            loading={this.state.loading}
            pages={this.state.admissionsReportPages} // Display the total number of pages
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
     
    
{/*     
    -----------------------------------Export Model------------------------ */}
        
    <Modal isOpen={this.state.exportModeltoggleView} toggle={this.exportModelToggle}
        className={'modal-lg ' + this.props.className + ' exportModalWidth'}>
         {/* <ModalHeader toggle={this.exportModelToggle}>
        
          </ModalHeader> */}
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
