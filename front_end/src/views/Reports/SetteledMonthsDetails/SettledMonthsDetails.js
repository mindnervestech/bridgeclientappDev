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

class SettledMonthsDetails extends Component {

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

            settledMonthsExpandModal: false,
            settledMonthsExpandLoading: false,
            settledMonthsExpandPages: 0,
            settledMonthsExpandData: [],
            settledMonthsExpandTotalCount: 0,
            settledMonthsExpandFileQuery: "",
            settledMonthsSelectedMonth: "",

            showPatientName_settledMonthsExpand: true,
            showPcpName_settledMonthsExpand: true,
            showPcpLocation_settledMonthsExpand: true,
            showCost_settledMonthsExpand: true,
            showClaimType_settledMonthsExpand: true,
            showMra_settledMonthsExpand: true,

            exportModeltoggleView: false,
 
        };
        self = this;
        self.state.providerSelectValue = { value: 'all', label: 'All' };
        self.state.pcpNameValue = { value: 'all', label: 'All' };
        self.state.yearSelectValue = { value: 'all', label: 'All' };
        
        this.exportModelToggle = this.exportModelToggle.bind(this);

        this.getValueFromLocalStorage = this.getValueFromLocalStorage.bind(this);
        this.backToReports = this.backToReports.bind(this);
        this.fetchSettledMonthsExpandData = this.fetchSettledMonthsExpandData.bind(this);
        this.fetchSettledMonthsExpandData = debounce(this.fetchSettledMonthsExpandData, 500);
    
    }

    componentDidMount() {

      
        fetch(config.serverUrl + '/getAllPlanAndPCP', {
            method: 'GET'
        }).then(function (res1) {
            return res1.json();
        }).then(function (response) {
            self.setState({ providerList: response.planList, pcpList: response.pcpList, yearsList: response.yearsList });
     
            for (var i = 0; i < self.state.yearsList.length; i++) {
                if (self.state.yearsList[i].value >= self.state.currentYear) {
                    self.state.currentYear = self.state.yearsList[i].value;
                }
                if (localStorage.getItem('year') == null)
                    self.state.yearSelectValue = { value: self.state.currentYear, label: self.state.currentYear };
            }
            self.setState({
                providerList: self.state.providerList.concat({ value: 'all', label: 'All' }),
                pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' }),
                yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
            });
        });
        self.getValueFromLocalStorage();
        self.getSettledMonthsRowData();
 
    }

  getSettledMonthsRowData()
  {
    self.state.settledMonthsSelectedMonth = localStorage.getItem('settledMonthsSelectedMonth');
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

fetchSettledMonthsExpandData(state, instance) {
    var page = state.page + 1;
    self.getSettledMonthsExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

   getSettledMonthsExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ settledMonthsExpandLoading: true });
    const formData = new FormData();

      formData.append('selectedMonth', self.state.settledMonthsSelectedMonth);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSettledMonthsExpandData', {
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
          self.setState({settledMonthsExpandData: response.settledMonthsExpandData,settledMonthsExpandPages:response.pages,settledMonthsExpandTotalCount:response.totalCount,settledMonthsExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ settledMonthsExpandLoading: false });
          self.generateSettledMonthsExpandXLSX();
      });
        
  }
 
    
  backToReports() {
    window.location.href = "#settledMonthsReport";
  }
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_settledMonthsExpandReport() {

    var propertiesArr = [];

    if(self.state.showPatientName_settledMonthsExpand)
      propertiesArr.push("Patient Name");
    if(self.state.showPcpName_settledMonthsExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showPcpLocation_settledMonthsExpand)
      propertiesArr.push("PCP Location");
    if(self.state.showCost_settledMonthsExpand)
      propertiesArr.push("Cost");
    if(self.state.showClaimType_settledMonthsExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showMra_settledMonthsExpand)
      propertiesArr.push("MRA");
    

    const formData = new FormData();
    formData.append('fileQuery', self.state.settledMonthsExpandFileQuery);

    fetch(config.serverUrl+'/getSettledMonthsExpandReportDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Settled Months Details Report Search", documentTitle:"Print-Settled Months Details Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }
  
 generateSettledMonthsExpandXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.settledMonthsExpandFileQuery);
  formData.append('showPatientName_settledMonthsExpand', self.state.showPatientName_settledMonthsExpand);
  formData.append('showPcpName_settledMonthsExpand', self.state.showPcpName_settledMonthsExpand);
  formData.append('showPcpLocation_settledMonthsExpand', self.state.showPcpLocation_settledMonthsExpand);
  formData.append('showCost_settledMonthsExpand', self.state.showCost_settledMonthsExpand);
  formData.append('showClaimType_settledMonthsExpand', self.state.showClaimType_settledMonthsExpand);
  formData.append('showMra_settledMonthsExpand', self.state.showMra_settledMonthsExpand);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForSettledMonthsExpand: btoa(JSON.stringify(object))});
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
            
            <h2>Settled Months - Details</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
          </FormGroup>
          </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.settledMonthsExpandData}
                              loading={this.state.settledMonthsExpandLoading}
                              pages={this.state.settledMonthsExpandPages} // Display the total number of pages
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
                                      show: this.state.showPatientName_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_settledMonthsExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSettledMonthsExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.settledMonthsExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_settledMonthsExpandReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSettledMonthsExpandReportXLSX/'+self.state.jsonDataForSettledMonthsExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSettledMonthsExpandReportPDF/'+self.state.jsonDataForSettledMonthsExpand} target="_blank" >
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
export default SettledMonthsDetails;
