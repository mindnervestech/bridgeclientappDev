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

class BeneficiariesReportByClinic extends Component {

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
      
        beneficiariesManagementByClinicLoading: false,
        beneficiariesManagementByClinicPages: 0,
        beneficiariesManagementByClinicData: [],
        beneficiariesManagementByClinicTotalCount: 0,
        beneficiariesManagementByClinicFileQuery: "",

        showClinicName_beneficiariesManagementByClinic: true,
        showTotalCost_beneficiariesManagementByClinic: true,

         exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchBeneficiariesManagementDataByClinic = this.fetchBeneficiariesManagementDataByClinic.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchBeneficiariesManagementDataByClinic = debounce(this.fetchBeneficiariesManagementDataByClinic,500);
  }

  componentDidMount() {
    localStorage.removeItem('beneficiariesManagementSelectedClinicName');
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
        self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
      }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
  }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
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

  fetchBeneficiariesManagementDataByClinic(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByClinicGridPage = page;
    self.state.beneficiariesManagementByClinicGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByClinicGridSorted = state.sorted;
    self.state.beneficiariesManagementByClinicGridFiltered = state.filtered;
    self.getBeneficiariesManagementByClinicData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getBeneficiariesManagementByClinicData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByClinicLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByClinicData', {
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
          self.setState({beneficiariesManagementByClinicData: response.beneficiariesManagementByClinicData,beneficiariesManagementByClinicPages:response.pages,beneficiariesManagementByClinicTotalCount:response.totalCount,beneficiariesManagementByClinicFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByClinicLoading: false });
          self.generateBeneficiariesManagementByClinicXLSX();
      });
        
  }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementByClinic() {

    var propertiesArr = [];
    
    if(self.state.showClinicName_beneficiariesManagementByClinic)
      propertiesArr.push("Clinic Name");
    if(self.state.showTotalCost_beneficiariesManagementByClinic)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Clinic", documentTitle:"Print- Beneficiaries Management Report By Clinic ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  

 generateBeneficiariesManagementByClinicXLSX() {
  const formData = new FormData();
  
  formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);
  formData.append('showClinicName_beneficiariesManagementByClinic', self.state.showClinicName_beneficiariesManagementByClinic);
  formData.append('showTotalCost_beneficiariesManagementByClinic', self.state.showTotalCost_beneficiariesManagementByClinic);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForBeneficiariesManagementByClinic: btoa(JSON.stringify(object))});
 }

 getBeneficiariesManagementByClinicDataRow(rowInfo)
 {
    localStorage.setItem('beneficiariesManagementSelectedClinicName',rowInfo.row.clinicName);
   window.location.href = "#/beneficiariesReportByClientDetails";
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
            
            <h2>Beneficiaries Management Report By Clinic</h2>
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
                              data={this.state.beneficiariesManagementByClinicData}
                              loading={this.state.beneficiariesManagementByClinicLoading}
                              pages={this.state.beneficiariesManagementByClinicPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByClinic,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                       show: this.state.showTotalCost_beneficiariesManagementByClinic,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Id",
                                      accessor: "clinicId",
                                       show: false,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByClinic}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByClinicTotalCount+', Page'}
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
                                      if(column.Header == "Clinic Name") {
                                     self.getBeneficiariesManagementByClinicDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Clinic Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Clinic Name" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByClinic()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicXLSX/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicPDF/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" >
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
export default BeneficiariesReportByClinic;
