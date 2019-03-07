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
} from 'reactstrap';
import Select from 'react-select';

class BeneficiariesReportByDoctor extends Component {

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
        showPcpName_beneficiariesManagementByDoctor: true,
        showPcpLocation_beneficiariesManagementByDoctor: true,
        showAverageMra_beneficiariesManagementByDoctor: true,
        showTotalCost_beneficiariesManagementByDoctor: true,

        beneficiariesManagementByDoctorModal: false,
        beneficiariesManagementByDoctorLoading: false,
        beneficiariesManagementByDoctorPages: 0,
        beneficiariesManagementByDoctorData: [],
        beneficiariesManagementByDoctorTotalCount: 0,
        beneficiariesManagementByDoctorFileQuery: "",

  
      
      exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchBeneficiariesManagementDataByDoctor = this.fetchBeneficiariesManagementDataByDoctor.bind(this);
    this.getValueFromLocalStorage = this.getValueFromLocalStorage.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchBeneficiariesManagementDataByDoctor = debounce(this.fetchBeneficiariesManagementDataByDoctor,500);
  }

  componentDidMount() {
    localStorage.removeItem('beneficiariesManagementSelectedPcpId');
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList,pcpList:response.pcpList, yearsList:response.yearsList});

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
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
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
    self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
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

  fetchBeneficiariesManagementDataByDoctor(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByDoctorGridPage = page;
    self.state.beneficiariesManagementByDoctorGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByDoctorGridSorted = state.sorted;
    self.state.beneficiariesManagementByDoctorGridFiltered = state.filtered;
    self.getBeneficiariesManagementByDoctorData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getBeneficiariesManagementByDoctorData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByDoctorLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorData', {
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
          self.setState({beneficiariesManagementByDoctorData: response.beneficiariesManagementByDoctorData,beneficiariesManagementByDoctorPages:response.pages,beneficiariesManagementByDoctorTotalCount:response.totalCount,beneficiariesManagementByDoctorFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByDoctorLoading: false });
          self.generateBeneficiariesManagementByDoctorXLSX();
      });
        
  }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementByDoctor() {

    var propertiesArr = [];

    if(self.state.showPcpName_beneficiariesManagementByDoctor)
      propertiesArr.push("PCP Name");
    if(self.state.showPcpLocation_beneficiariesManagementByDoctor)
      propertiesArr.push("PCP Location");
    if(self.state.showAverageMra_beneficiariesManagementByDoctor)
      propertiesArr.push("Average MRA");
    if(self.state.showTotalCost_beneficiariesManagementByDoctor)
      propertiesArr.push("Total Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Doctor", documentTitle:"Print- Beneficiaries Management By Doctor", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

 getBeneficiariesManagementByDoctorDataRow(rowInfo) {
    localStorage.setItem('beneficiariesManagementSelectedPcpId',rowInfo.row.pcpId);
     window.location.href = "#/beneficiariesReportByDoctorDetails";
 }
  

 generateBeneficiariesManagementByDoctorXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);
    formData.append('showPcpName_beneficiariesManagementByDoctor', self.state.showPcpName_beneficiariesManagementByDoctor);
    formData.append('showPcpLocation_beneficiariesManagementByDoctor', self.state.showPcpLocation_beneficiariesManagementByDoctor);
    formData.append('showAverageMra_beneficiariesManagementByDoctor', self.state.showAverageMra_beneficiariesManagementByDoctor);
    formData.append('showTotalCost_beneficiariesManagementByDoctor', self.state.showTotalCost_beneficiariesManagementByDoctor);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByDoctor: btoa(JSON.stringify(object))});
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
            
            <h2>Beneficiaries Management Report By Doctor</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
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
                              data={this.state.beneficiariesManagementByDoctorData}
                              loading={this.state.beneficiariesManagementByDoctorLoading}
                              pages={this.state.beneficiariesManagementByDoctorPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Name", 
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "averageMra",
                                      show: this.state.showAverageMra_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP ID",
                                      accessor: "pcpId",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Prem",
                                      accessor: "reinsurancePrem",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "RX Claims",
                                      accessor: "rxClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByDoctor}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByDoctorTotalCount+', Page'}
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
                                      if(column.Header == "PCP Name") {
                                        self.getBeneficiariesManagementByDoctorDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Name" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Name" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByDoctor()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorPDF/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" >
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
export default BeneficiariesReportByDoctor;
