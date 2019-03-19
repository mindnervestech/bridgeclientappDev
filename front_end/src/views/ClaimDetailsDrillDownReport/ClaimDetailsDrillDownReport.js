import React, { Component } from "react";
import ReactTable from "react-table";
var debounce = require("lodash.debounce");
import config from '../Config/ServerUrl';
import '../Reports/ReportsStyle.css';
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

class ClaimDetailsDrillDownReport extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {

        dropdownOpen: new Array(1).fill(false),
        claimDetailsExpandModal: false,
        claimDetailsExpandLoading: false,
        claimDetailsExpandPages: 0,
        ClaimDetailsDrillDownData: [],
        claimDetailsExpandTotalCount: 0,
        claimDetailsExpandFileQuery: "",
        claimDetailsSelectedMedicareId: "",
        fromDate: "",

        showClaimId_claimDetailsDrillDown: true,
        showClaimDate_claimDetailsDrillDown: true,
        showClaimType_claimDetailsDrillDown: true,
        showClinicName_claimDetailsDrillDown: true,
        showIcdCodes_claimDetailsDrillDown: true,
        showHccCodes_claimDetailsDrillDown: true,
        showDrgCode_claimDetailsDrillDown: true,
        showCost_claimDetailsDrillDown: true,
      
      
    };
    self = this;
      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchClaimDetailsDrillDownData = this.fetchClaimDetailsDrillDownData.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchClaimDetailsDrillDownData = debounce(this.fetchClaimDetailsDrillDownData,500);
  }

  componentDidMount() {

      self.state.claimDetailsSelectedMedicareId = localStorage.getItem('claimDetailsSelectedMedicareId');
      self.state.planSelectValue = localStorage.getItem('planSelectValue');
      self.state.fromDate = localStorage.getItem('fromDate');


}  

  setProviderValue(e) {
    self.state.providerSelectValue = e;
    self.getPCPForProviders(self.state.providerSelectValue.value);
    localStorage.setItem('provider', JSON.stringify(e));
    setTimeout(function(){
      self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
    }, 1000);
    
  }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
   }
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getReinsuranceCostReportData(self.state.reinsuranceCostReportGridPageSize, 1, JSON.stringify(self.state.reinsuranceCostReportGridSorted),JSON.stringify(self.state.reinsuranceCostReportGridFiltered));
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

    fetchClaimDetailsDrillDownData(state, instance) {
        var page = state.page + 1;
        setTimeout(function () {
            self.getClaimDetailsDrillDownData(state.pageSize, page, JSON.stringify(state.sorted), JSON.stringify(state.filtered));
        }, 1000);
    }


  getClaimDetailsDrillDownData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ claimDetailsExpandLoading: true });
    const formData = new FormData();
    
      if(self.state.fromDate == "") {
        formData.append('year', "all");
      } else {
        formData.append('year', self.state.fromDate);
      }
      
      formData.append('provider', self.state.planSelectValue);
      formData.append('medicareId', self.state.claimDetailsSelectedMedicareId);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementExpandData', {
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
          self.setState({ClaimDetailsDrillDownData: response.beneficiariesManagementExpandData,claimDetailsExpandPages:response.pages,claimDetailsExpandTotalCount:response.totalCount,claimDetailsExpandFileQuery:response.fileQuery});
          self.setState({ claimDetailsExpandLoading: false });
          self.generateClaimDetailsExpandXLSX();
      });
        
  }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }
  printTableData_claimDetailsDrillDown() {

    var propertiesArr = [];

    if(self.state.showClaimId_claimDetailsDrillDown)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_claimDetailsDrillDown)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_claimDetailsDrillDown)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_claimDetailsDrillDown)
      propertiesArr.push("Clinic Name");
    
    if(self.state.showIcdCodes_claimDetailsDrillDown)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_claimDetailsDrillDown)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_claimDetailsDrillDown)
      propertiesArr.push("DRG Code");
    
    if(self.state.showCost_claimDetailsDrillDown)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.claimDetailsExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementExpandDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Details", documentTitle:"Print- Beneficiaries Management Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }
  

  generateClaimDetailsExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.claimDetailsExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementExpand', self.state.showClaimId_claimDetailsDrillDown);
    formData.append('showClaimDate_beneficiariesManagementExpand', self.state.showClaimDate_claimDetailsDrillDown);
    formData.append('showClaimType_beneficiariesManagementExpand', self.state.showClaimType_claimDetailsDrillDown);
    formData.append('showClinicName_beneficiariesManagementExpand', self.state.showClinicName_claimDetailsDrillDown);
    formData.append('showIcdCodes_beneficiariesManagementExpand', self.state.showIcdCodes_claimDetailsDrillDown);
    formData.append('showHccCodes_beneficiariesManagementExpand', self.state.showHccCodes_claimDetailsDrillDown);
    formData.append('showDrgCode_beneficiariesManagementExpand', self.state.showDrgCode_claimDetailsDrillDown);
    formData.append('showCost_beneficiariesManagementExpand', self.state.showCost_claimDetailsDrillDown);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForclaimDetailsDrillDown: btoa(JSON.stringify(object))});
      
   }
  

  backToReports() {
    window.location.href = "#claimDetails";
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
        if(self.state.showClaimId_claimDetailsDrillDown) {
            document.getElementById("ddItemClaimId_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimId_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showClaimDate_claimDetailsDrillDown) {
            document.getElementById("ddItemClaimDate_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimDate_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showClaimType_claimDetailsDrillDown) {
            document.getElementById("ddItemClaimType_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClaimType_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showClinicName_claimDetailsDrillDown) {
            document.getElementById("ddItemClinicName_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemClinicName_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showIcdCodes_claimDetailsDrillDown) {
            document.getElementById("ddItemIcdCodes_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIcdCodes_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showHccCodes_claimDetailsDrillDown) {
            document.getElementById("ddItemHccCodes_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHccCodes_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showDrgCode_claimDetailsDrillDown) {
            document.getElementById("ddItemDrgCode_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDrgCode_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
          if(self.state.showCost_claimDetailsDrillDown) {
            document.getElementById("ddItemCost_claimDetailsDrillDown").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemCost_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
          }
      }
    }, 300);
  }
  showHideColumn_claimDetailsDrillDown(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_claimDetailsDrillDown = !this.state.showClaimId_claimDetailsDrillDown;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_claimDetailsDrillDown = !this.state.showClaimDate_claimDetailsDrillDown;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_claimDetailsDrillDown = !this.state.showClaimType_claimDetailsDrillDown;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_claimDetailsDrillDown = !this.state.showClinicName_claimDetailsDrillDown;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_claimDetailsDrillDown = !this.state.showIcdCodes_claimDetailsDrillDown;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_claimDetailsDrillDown = !this.state.showHccCodes_claimDetailsDrillDown;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_claimDetailsDrillDown = !this.state.showDrgCode_claimDetailsDrillDown;
    }
    if(columnName == "cost") {
      this.state.showCost_claimDetailsDrillDown = !this.state.showCost_claimDetailsDrillDown;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_claimDetailsDrillDown) {
              document.getElementById("ddItemClaimId_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClaimDate_claimDetailsDrillDown) {
              document.getElementById("ddItemClaimDate_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClaimType_claimDetailsDrillDown) {
              document.getElementById("ddItemClaimType_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClinicName_claimDetailsDrillDown) {
              document.getElementById("ddItemClinicName_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showIcdCodes_claimDetailsDrillDown) {
              document.getElementById("ddItemIcdCodes_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showHccCodes_claimDetailsDrillDown) {
              document.getElementById("ddItemHccCodes_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showDrgCode_claimDetailsDrillDown) {
              document.getElementById("ddItemDrgCode_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showCost_claimDetailsDrillDown) {
              document.getElementById("ddItemCost_claimDetailsDrillDown").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_claimDetailsDrillDown").style.backgroundColor = "#d03b3c";
            }
            
            self.generateClaimDetailsExpandXLSX();

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
            
            <h2>Claim Details </h2>
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
                                <DropdownMenu style={{maxHeight:300,overflowY:"auto"}}>
                                   <DropdownItem toggle={false} id="ddItemClaimId_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("claimId")}>Claim Id</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemClaimDate_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("claimDate")}>Claim Date</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemClaimType_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("claimType")}>Claim Type</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemClinicName_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("clinicName")}>Clinic Name</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemIcdCodes_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("icdCodes")}>ICD 9/10 Code(s)</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemHccCodes_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("hccCodes")}>HCC Code(s)</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemDrgCode_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("drgCode")}>DRUG Code</DropdownItem>
                                   <DropdownItem toggle={false} id="ddItemCost_claimDetailsDrillDown" className="commonFontFamily" onClick={e => self.showHideColumn_claimDetailsDrillDown("cost")}>Cost</DropdownItem>
                                 </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>

        <Col xs="12" md="12" >        

        <ReactTable
                              manual
                              data={this.state.ClaimDetailsDrillDownData}
                              loading={this.state.claimDetailsExpandLoading}
                              pages={this.state.claimDetailsExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRUG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_claimDetailsDrillDown,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchClaimDetailsDrillDownData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.claimDetailsExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_claimDetailsDrillDown()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementExpandXLSX/'+self.state.jsonDataForclaimDetailsDrillDown} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementExpandPDF/'+self.state.jsonDataForclaimDetailsDrillDown} target="_blank" >
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
export default ClaimDetailsDrillDownReport;
