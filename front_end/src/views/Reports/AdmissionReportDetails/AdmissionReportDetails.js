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

class AdmissionReportDetails extends Component {

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
      
      admissionsReportExpandPatientName:"",
      admissionsReportExpandSubscriberId:"",
      admissionsReportExpandPcpName:"",
      admissionsReportExpandEligibleMonth:"",
      admissionsReportExpandData: [],
      admissionsReportExpandPages: 0,
      admissionsReportExpandTotalCount: 0,
      admissionsReportExpandFileQuery: "",
      admissionsReportExpandLoading: false,

      showClaimId_admissionsExpand: true,
      showClaimDate_admissionsExpand: true,
      showClaimType_admissionsExpand: true,
      showClinicName_admissionsExpand: true,
      showPcpName_admissionsExpand: true,
      showIcdCodes_admissionsExpand: true,
      showHccCodes_admissionsExpand: true,
      showDrgCode_admissionsExpand: true,
      showBetosCat_admissionsExpand: true,
      showCost_admissionsExpand: true,
      exportModeltoggleView: false,
 
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);

    this.backToReports = this.backToReports.bind(this);
    this.fetchAdmissionsReportExpandData = this.fetchAdmissionsReportExpandData.bind(this);
    this.fetchAdmissionsReportExpandData = debounce(this.fetchAdmissionsReportExpandData,500);
    
  }

  componentDidMount() {

      
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

    if (localStorage.getItem('provider') != null)
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
      if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpName'));
     if (localStorage.getItem('year') != null)
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('year'));
    self.state.admissionsReportExpandSubscriberId = localStorage.getItem('admissionsReportExpandSubscriberId');
  
}  

fetchAdmissionsReportExpandData(state, instance) {
    var page = state.page + 1;
    self.state.admissionsReportExpandGridPage = page;
    self.state.admissionsReportExpandGridPageSize = state.pageSize;
    self.state.admissionsReportExpandGridSorted = state.sorted;
    self.state.admissionsReportExpandGridFiltered = state.filtered;
    self.getAdmissionsReportExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getAdmissionsReportExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ admissionsReportExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      formData.append('subscriberIdAdmissionsExpand', self.state.admissionsReportExpandSubscriberId);

      fetch(config.serverUrl+'/getAdmissionsReportExpandData', {
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
          self.setState({admissionsReportExpandData: response.admissionsReportExpandData,admissionsReportExpandPages:response.pages,admissionsReportExpandTotalCount:response.totalCount,admissionsReportExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ admissionsReportExpandLoading: false });
          self.generateAdmissionsReportExpandXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_admissionsReportExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_admissionsExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_admissionsExpand)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_admissionsExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_admissionsExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpName_admissionsExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_admissionsExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_admissionsExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_admissionsExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_admissionsExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_admissionsExpand)
      propertiesArr.push("Cost");

    const formData = new FormData();
    formData.append('fileQuery', self.state.admissionsReportExpandFileQuery);

    fetch(config.serverUrl+'/getAdmissionsReportExpandDataForPrint', {
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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generateAdmissionsReportExpandXLSX() {
    const formData = new FormData();
   
    formData.append('fileQuery', self.state.admissionsReportExpandFileQuery);
    formData.append('showClaimId_admissionsExpand', self.state.showClaimId_admissionsExpand);
    formData.append('showClaimDate_admissionsExpand', self.state.showClaimDate_admissionsExpand);
    formData.append('showClaimType_admissionsExpand', self.state.showClaimType_admissionsExpand);
    formData.append('showClinicName_admissionsExpand', self.state.showClinicName_admissionsExpand);
    formData.append('showPcpName_admissionsExpand', self.state.showPcpName_admissionsExpand);
    formData.append('showIcdCodes_admissionsExpand', self.state.showIcdCodes_admissionsExpand);
    formData.append('showHccCodes_admissionsExpand', self.state.showHccCodes_admissionsExpand);
    formData.append('showDrgCode_admissionsExpand', self.state.showDrgCode_admissionsExpand);
    formData.append('showBetosCat_admissionsExpand', self.state.showBetosCat_admissionsExpand);
    formData.append('showCost_admissionsExpand', self.state.showCost_admissionsExpand);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForAdmissionsReportExpand: btoa(JSON.stringify(object))});
   }

  backToReports() {
    window.location.href = "#admissionreport";
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
        if(self.state.showClaimId_admissionsExpand) {
          document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimDate_admissionsExpand) {
          document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimType_admissionsExpand) {   
          document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClinicName_admissionsExpand) {
          document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_admissionsExpand) {
          document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIcdCodes_admissionsExpand) {
          document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHccCodes_admissionsExpand) {
          document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDrgCode_admissionsExpand) {
          document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showBetosCat_admissionsExpand) {
          document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_admissionsExpand) {
          document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_admissionsExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_admissionsExpand = !this.state.showClaimId_admissionsExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_admissionsExpand = !this.state.showClaimDate_admissionsExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_admissionsExpand = !this.state.showClaimType_admissionsExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_admissionsExpand = !this.state.showClinicName_admissionsExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_admissionsExpand = !this.state.showPcpName_admissionsExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_admissionsExpand = !this.state.showIcdCodes_admissionsExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_admissionsExpand = !this.state.showHccCodes_admissionsExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_admissionsExpand = !this.state.showDrgCode_admissionsExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_admissionsExpand = !this.state.showBetosCat_admissionsExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_admissionsExpand = !this.state.showCost_admissionsExpand;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

    if(self.state.showClaimId_admissionsExpand) {
          document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimDate_admissionsExpand) {
          document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClaimType_admissionsExpand) {
          document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showClinicName_admissionsExpand) {
          document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_admissionsExpand) {
          document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIcdCodes_admissionsExpand) {
          document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHccCodes_admissionsExpand) {
          document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDrgCode_admissionsExpand) {
          document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showBetosCat_admissionsExpand) {
          document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_admissionsExpand").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showCost_admissionsExpand) {
          document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_admissionsExpand").style.backgroundColor = "#d03b3c";
        }

        self.generateAdmissionsReportExpandXLSX();

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
            
            <h2>Admissions Report - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimId_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("betosCat")}>Betos Cat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_admissionsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_admissionsExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.admissionsReportExpandData}
                              loading={this.state.admissionsReportExpandLoading}
                              pages={this.state.admissionsReportExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_admissionsExpand,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchAdmissionsReportExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.admissionsReportExpandTotalCount+', Page'}
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

                                    },
                                    style: {
                                      
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_admissionsReportExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderAdmissionsReportExpandXLSX/'+self.state.jsonDataForAdmissionsReportExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderAdmissionsReportExpandPDF/'+self.state.jsonDataForAdmissionsReportExpand} target="_blank" >
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
export default AdmissionReportDetails;
