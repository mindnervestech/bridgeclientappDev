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

class PMPMByPrecticeDetails extends Component {

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
            

            pmpmByPracticeExpandModal: false,
            pmpmByPracticeExpandLoading: false,
            pmpmByPracticeExpandPages: 0,
            pmpmByPracticeExpandData: [],
            pmpmByPracticeExpandTotalCount: 0,
            pmpmByPracticeExpandFileQuery: "",
            pmpmByPracticeSelectedPcpId:"",
            dropdownOpen: new Array(1).fill(false),

            
            showPatientName_pmpmByPracticeExpand: true,
            showPcpName_pmpmByPracticeExpand: true,
            showPcpLocation_pmpmByPracticeExpand: true,
            showMra_pmpmByPracticeExpand: true,
            showCost_pmpmByPracticeExpand: true,
            showClaimType_pmpmByPracticeExpand: true,


            exportModeltoggleView: false,
 
        };
        self = this;
        self.state.providerSelectValue = { value: 'all', label: 'All' };
        self.state.pcpNameValue = { value: 'all', label: 'All' };
        self.state.yearSelectValue = { value: 'all', label: 'All' };
        
        this.exportModelToggle = this.exportModelToggle.bind(this);
        this.backToReports = this.backToReports.bind(this);
        this.fetchPmpmByPracticeExpandData = this.fetchPmpmByPracticeExpandData.bind(this);
        this.fetchPmpmByPracticeExpandData = debounce(this.fetchPmpmByPracticeExpandData, 500);
    
    }

    componentDidMount() {


      self.state.pmpmByPracticeSelectedPcpId = localStorage.getItem('pmpmByPracticeSelectedPcpId');
    if (localStorage.getItem('provider') != null)
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
    if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
  }


fetchPmpmByPracticeExpandData(state, instance) {
    var page = state.page + 1;
    self.getPmpmByPracticeExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getPmpmByPracticeExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ pmpmByPracticeExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pmpmByPracticeSelectedPcpId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPmpmByPracticeExpandData', {
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
          self.setState({pmpmByPracticeExpandData: response.pmpmByPracticeExpandData,pmpmByPracticeExpandPages:response.pages,pmpmByPracticeExpandTotalCount:response.totalCount,pmpmByPracticeExpandFileQuery:response.fileQuery});
          self.setState({ pmpmByPracticeExpandLoading: false });
          self.generatePmpmByPracticeExpandXLSX();
      });
        
  }
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_pmpmByPracticeExpandReport() {

    var propertiesArr = [];

    if(self.state.showPatientName_pmpmByPracticeExpand)
      propertiesArr.push("Patient Name");
    if(self.state.showPcpName_pmpmByPracticeExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showPcpLocation_pmpmByPracticeExpand)
      propertiesArr.push("PCP Location");
    if(self.state.showMra_pmpmByPracticeExpand)
      propertiesArr.push("MRA");
    if(self.state.showCost_pmpmByPracticeExpand)
      propertiesArr.push("Cost");
    if(self.state.showClaimType_pmpmByPracticeExpand)
      propertiesArr.push("Claim Type");
    

    const formData = new FormData();
    formData.append('fileQuery', self.state.pmpmByPracticeExpandFileQuery);

    fetch(config.serverUrl+'/getPmpmByPracticeExpandReportDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-PMPM Details", documentTitle:"Print-PMPM Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generatePmpmByPracticeExpandXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.pmpmByPracticeExpandFileQuery);
  formData.append('showPatientName_pmpmByPracticeExpand', self.state.showPatientName_pmpmByPracticeExpand);
  formData.append('showPcpName_pmpmByPracticeExpand', self.state.showPcpName_pmpmByPracticeExpand);
  formData.append('showPcpLocation_pmpmByPracticeExpand', self.state.showPcpLocation_pmpmByPracticeExpand);
  formData.append('showMra_pmpmByPracticeExpand', self.state.showMra_pmpmByPracticeExpand);
  formData.append('showCost_pmpmByPracticeExpand', self.state.showCost_pmpmByPracticeExpand);
  formData.append('showClaimType_pmpmByPracticeExpand', self.state.showClaimType_pmpmByPracticeExpand);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForPmpmByPracticeExpand: btoa(JSON.stringify(object))});
 }
  backToReports() {
    window.location.href = "#pmpmByPrecticeReport";
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
    setTimeout(function () {
      if (i == 0) {
        if(self.state.showPatientName_pmpmByPracticeExpand) {
          document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_pmpmByPracticeExpand) {
          document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpLocation_pmpmByPracticeExpand) {
          document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMra_pmpmByPracticeExpand) {
          document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_pmpmByPracticeExpand) {
          document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimType_pmpmByPracticeExpand) {
          document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
        }

    }
    }, 300);
  }
  showHideColumn_pmpmByPracticeExpand(columnName) {
    
    if(columnName == "patientName") {
      this.state.showPatientName_pmpmByPracticeExpand = !this.state.showPatientName_pmpmByPracticeExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_pmpmByPracticeExpand = !this.state.showPcpName_pmpmByPracticeExpand;
    }
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_pmpmByPracticeExpand = !this.state.showPcpLocation_pmpmByPracticeExpand;
    }
    if(columnName == "mra") {
      this.state.showMra_pmpmByPracticeExpand = !this.state.showMra_pmpmByPracticeExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_pmpmByPracticeExpand = !this.state.showCost_pmpmByPracticeExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_pmpmByPracticeExpand = !this.state.showClaimType_pmpmByPracticeExpand;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showPatientName_pmpmByPracticeExpand) {
              document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPatientName_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPcpName_pmpmByPracticeExpand) {
              document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPcpLocation_pmpmByPracticeExpand) {
              document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpLocation_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showMra_pmpmByPracticeExpand) {
              document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemMra_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showCost_pmpmByPracticeExpand) {
              document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClaimType_pmpmByPracticeExpand) {
              document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_pmpmByPracticeExpand").style.backgroundColor = "#d03b3c";
            }

            self.generatePmpmByPracticeExpandXLSX();

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
            
            <h2>PMPM By Practice - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemPatientName_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("cost")}>Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_pmpmByPracticeExpand" className="commonFontFamily" onClick={e => self.showHideColumn_pmpmByPracticeExpand("claimType")}>Claim Type</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.pmpmByPracticeExpandData}
                              loading={this.state.pmpmByPracticeExpandLoading}
                              pages={this.state.pmpmByPracticeExpandPages} // Display the total number of pages
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
                                      show: this.state.showPatientName_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_pmpmByPracticeExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPmpmByPracticeExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.pmpmByPracticeExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_pmpmByPracticeExpandReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPmpmByPracticeExpandReportXLSX/'+self.state.jsonDataForPmpmByPracticeExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPmpmByPracticeExpandReportPDF/'+self.state.jsonDataForPmpmByPracticeExpand} target="_blank" >
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
export default PMPMByPrecticeDetails;
