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

class BeneficiariesReportByLocation extends Component {

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

        beneficiariesManagementByLocationModal: false,
        beneficiariesManagementByLocationLoading: false,
        beneficiariesManagementByLocationPages: 0,
        beneficiariesManagementByLocationData: [],
        beneficiariesManagementByLocationTotalCount: 0,
        beneficiariesManagementByLocationFileQuery: "",

        showPcpLocation_beneficiariesManagementByLocation: true,
        showMra_beneficiariesManagementByLocation: true,
        showTotalCost_beneficiariesManagementByLocation: true,
  
      
      exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchBeneficiariesManagementDataByLocation = this.fetchBeneficiariesManagementDataByLocation.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchBeneficiariesManagementDataByLocation = debounce(this.fetchBeneficiariesManagementDataByLocation,500);
  }

  componentDidMount() {
    localStorage.removeItem('beneficiariesManagementSelectedPcpLocation');
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
        self.getPCPForProviders(self.state.providerSelectValue.value);
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
    localStorage.setItem('provider', self.state.providerSelectValue.value);
    self.getPCPForProviders(self.state.providerSelectValue.value);
      setTimeout(function () {
        self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    }, 1000);
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', self.state.pcpNameValue.value);
    localStorage.setItem('pcpNameLabel', self.state.pcpNameValue.label);
    self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
}
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', self.state.yearSelectValue.value);
    self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
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

  fetchBeneficiariesManagementDataByLocation(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByLocationGridPage = page;
    self.state.beneficiariesManagementByLocationGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByLocationGridSorted = state.sorted;
    self.state.beneficiariesManagementByLocationGridFiltered = state.filtered;
    self.getBeneficiariesManagementByLocationData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

   getBeneficiariesManagementByLocationData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByLocationLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByLocationData', {
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
          self.setState({beneficiariesManagementByLocationData: response.beneficiariesManagementByLocationData,beneficiariesManagementByLocationPages:response.pages,beneficiariesManagementByLocationTotalCount:response.totalCount,beneficiariesManagementByLocationFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByLocationLoading: false });
          self.generateBeneficiariesManagementByLocationXLSX();
      });
        
  }

    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }


  printTableData_beneficiariesManagementByLocation() {

    var propertiesArr = [];

    
    if(self.state.showPcpLocation_beneficiariesManagementByLocation)
      propertiesArr.push("PCP Location");
    if(self.state.showMra_beneficiariesManagementByLocation)
      propertiesArr.push("Average MRA");
    if(self.state.showTotalCost_beneficiariesManagementByLocation)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Location", documentTitle:"Print- Beneficiaries Management Report By Location ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  

 generateBeneficiariesManagementByLocationXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);
    formData.append('showPcpLocation_beneficiariesManagementByLocation', self.state.showPcpLocation_beneficiariesManagementByLocation);
    formData.append('showMra_beneficiariesManagementByLocation', self.state.showMra_beneficiariesManagementByLocation);
    formData.append('showTotalCost_beneficiariesManagementByLocation', self.state.showTotalCost_beneficiariesManagementByLocation);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByLocation: btoa(JSON.stringify(object))});
   }
    
  getBeneficiariesManagementByLocationDataRow(rowInfo)
  {
    console.log('working');
    localStorage.setItem('beneficiariesManagementSelectedPcpLocation',rowInfo.row.pcpLocation);
    window.location.href = "#/beneficiariesReportByLocationExpand";
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
            
            <h2>Beneficiaries Management Report By Location </h2>
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
                              data={this.state.beneficiariesManagementByLocationData}
                              loading={this.state.beneficiariesManagementByLocationLoading}
                              pages={this.state.beneficiariesManagementByLocationPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                      
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
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
                                       show: this.state.showTotalCost_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByLocation}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByLocationTotalCount+', Page'}
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
                                      if(column.Header == "PCP Location") {
                                         self.getBeneficiariesManagementByLocationDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Location" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Location" ? "pointer" : ""
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByLocation()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationXLSX/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationPDF/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" >
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
export default BeneficiariesReportByLocation;
