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

class ERPatientVisitReportDetails extends Component {

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
            patientVisitExpandReportModal: false,
            patientVisitExpandReportLoading: false,
            patientVisitExpandReportPages: 0,
            patientVisitExpandReportData: [],
            patientVisitExpandReportTotalCount: 0,
            patientVisitExpandReportFileQuery: "",
            ERPatientVisitExpandReportMedicareId:"",
            showClaimId_patientVisitExpand: true,
            showClaimDate_patientVisitExpand: true,
            showClaimType_patientVisitExpand: true,
            showClinicName_patientVisitExpand: true,
            showPcpName_patientVisitExpand: true,
            showIcdCodes_patientVisitExpand: true,
            showHccCodes_patientVisitExpand: true,
            showDrgCode_patientVisitExpand: true,
            showBetosCat_patientVisitExpand: true,
            showCost_patientVisitExpand: true,

            exportModeltoggleView: false,
 
        };
        self = this;
        self.state.providerSelectValue = { value: 'all', label: 'All' };
        self.state.pcpNameValue = { value: 'all', label: 'All' };
        self.state.yearSelectValue = { value: 'all', label: 'All' };
        
        this.exportModelToggle = this.exportModelToggle.bind(this);
        this.backToReports = this.backToReports.bind(this);
        this.fetchPatientVisitExpandReportData = this.fetchPatientVisitExpandReportData.bind(this);
        this.fetchPatientVisitExpandReportData = debounce(this.fetchPatientVisitExpandReportData, 500);
    
    }

    componentDidMount() {

    if (localStorage.getItem("user") != null) {
      var check = 0;
      JSON.parse(localStorage.getItem("user")).permissions.forEach(function (permission) {

        if (permission.module == "Reports") {
          check = 1;
        }
      })

      if (check == 0) {
        window.location.href = "#/AuthorizationError";
      }
    }

    fetch(config.serverUrl + '/getMaintenanceMode', {
      method: 'GET'
    }).then(function (res1) {
      if (!res1.ok) {
        if (error.message) {
          self.setState({ errorMessage: error.message });
        }
      }
      return res1.json();
    }).then(function (response) {

      if (response.maintenanceMode == "true") {
        window.location.href = "#/maintenance";
      }

    });

    self.state.ERPatientVisitExpandReportMedicareId = localStorage.getItem('ERPatientVisitExpandReportMedicareId');
  
    if (localStorage.getItem('provider') != null)
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
    if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
    }
 

fetchPatientVisitExpandReportData(state, instance) {
    var page = state.page + 1;
    self.getPatientVisitExpandReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getPatientVisitExpandReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ patientVisitExpandReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('medicareId', self.state.ERPatientVisitExpandReportMedicareId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getPatientVisitExpandReportData', {
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
          self.setState({patientVisitExpandReportData: response.patientVisitExpandReportData,patientVisitExpandReportPages:response.pages,patientVisitExpandReportTotalCount:response.totalCount,patientVisitExpandReportFileQuery:response.fileQuery});
          self.setState({ patientVisitExpandReportLoading: false });
          self.generatePatientVisitExpandReportXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_patientVisitExpandReport() {

    var propertiesArr = [];

    if(self.state.showClaimId_patientVisitExpand)
      propertiesArr.push("Claim ID");
    if(self.state.showClaimDate_patientVisitExpand)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_patientVisitExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_patientVisitExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpName_patientVisitExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_patientVisitExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_patientVisitExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_patientVisitExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_patientVisitExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_patientVisitExpand)
      propertiesArr.push("Cost");

    const formData = new FormData();
    formData.append('fileQuery', self.state.patientVisitExpandReportFileQuery);

    fetch(config.serverUrl+'/getPatientVisitExpandReportDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-ER Patient Visit Report Search", documentTitle:"Print-ER Patient Visit Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generatePatientVisitExpandReportXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.patientVisitExpandReportFileQuery);
  formData.append('showClaimId_patientVisitExpand', self.state.showClaimId_patientVisitExpand);
  formData.append('showClaimDate_patientVisitExpand', self.state.showClaimDate_patientVisitExpand);
  formData.append('showClaimType_patientVisitExpand', self.state.showClaimType_patientVisitExpand);
  formData.append('showClinicName_patientVisitExpand', self.state.showClinicName_patientVisitExpand);
  formData.append('showPcpName_patientVisitExpand', self.state.showPcpName_patientVisitExpand);
  formData.append('showIcdCodes_patientVisitExpand', self.state.showIcdCodes_patientVisitExpand);
  formData.append('showHccCodes_patientVisitExpand', self.state.showHccCodes_patientVisitExpand);
  formData.append('showDrgCode_patientVisitExpand', self.state.showDrgCode_patientVisitExpand);
  formData.append('showBetosCat_patientVisitExpand', self.state.showBetosCat_patientVisitExpand);
  formData.append('showCost_patientVisitExpand', self.state.showCost_patientVisitExpand);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForPatientVisitExpandReport: btoa(JSON.stringify(object))});
 }

  backToReports() {
    window.location.href = "#erPatientVisitReport";
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
    setTimeout(function () {
      if(self.state.showClaimDate_patientVisitExpand) {
        document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showClaimType_patientVisitExpand) {
        document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showClinicName_patientVisitExpand) {
        document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showPcpName_patientVisitExpand) {
        document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showIcdCodes_patientVisitExpand) {
        document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showHccCodes_patientVisitExpand) {
        document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showDrgCode_patientVisitExpand) {
        document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showBetosCat_patientVisitExpand) {
        document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showCost_patientVisitExpand) {
        document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "#d03b3c";
      }
  
    }, 300);
  }
  showHideColumn_patientVisitExpand(columnName) {
    
    if(columnName == "claimDate") {
      this.state.showClaimDate_patientVisitExpand = !this.state.showClaimDate_patientVisitExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_patientVisitExpand = !this.state.showClaimType_patientVisitExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_patientVisitExpand = !this.state.showClinicName_patientVisitExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_patientVisitExpand = !this.state.showPcpName_patientVisitExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_patientVisitExpand = !this.state.showIcdCodes_patientVisitExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_patientVisitExpand = !this.state.showHccCodes_patientVisitExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_patientVisitExpand = !this.state.showDrgCode_patientVisitExpand;
    }
    if(columnName == "betosCat") {showHideColumn_patientVisitExpand
      this.state.showBetosCat_patientVisitExpand = !this.state.showBetosCat_patientVisitExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_patientVisitExpand = !this.state.showCost_patientVisitExpand;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimDate_patientVisitExpand) {
              document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClaimType_patientVisitExpand) {
              document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClinicName_patientVisitExpand) {
              document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPcpName_patientVisitExpand) {
              document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showIcdCodes_patientVisitExpand) {
              document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showHccCodes_patientVisitExpand) {
              document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showDrgCode_patientVisitExpand) {
              document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showBetosCat_patientVisitExpand) {
              document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showCost_patientVisitExpand) {
              document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_patientVisitExpand").style.backgroundColor = "#d03b3c";
            }

            self.generatePatientVisitExpandReportXLSX();

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
            
            <h2>ER Patient Visit Report - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimDate_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_patientVisitExpand" className="commonFontFamily" onClick={e => self.showHideColumn_patientVisitExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.patientVisitExpandReportData}
                              loading={this.state.patientVisitExpandReportLoading}
                              pages={this.state.patientVisitExpandReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Claim Id",
                                      accessor: "claimId",
                                      show: this.state.showClaimId_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_patientVisitExpand,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchPatientVisitExpandReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.patientVisitExpandReportTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_patientVisitExpandReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPatientVisitExpandReportXLSX/'+self.state.jsonDataForPatientVisitExpandReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderPatientVisitExpandReportPDF/'+self.state.jsonDataForPatientVisitExpandReport} target="_blank" >
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
export default ERPatientVisitReportDetails;
