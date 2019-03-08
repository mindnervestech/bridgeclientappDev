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

class BeneficiariesReportByPatientExpand extends Component {

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

            showClaimId_beneficiariesManagementExpand: true,
            showClaimDate_beneficiariesManagementExpand: true,
            showClaimType_beneficiariesManagementExpand: true,
            showClinicName_beneficiariesManagementExpand: true,
            showPcpName_beneficiariesManagementExpand: true,
            showIcdCodes_beneficiariesManagementExpand: true,
            showHccCodes_beneficiariesManagementExpand: true,
            showDrgCode_beneficiariesManagementExpand: true,
            showBetosCat_beneficiariesManagementExpand: true,
            showCost_beneficiariesManagementExpand: true,

            beneficiariesManagementExpandModal: false,
            beneficiariesManagementExpandLoading: false,
            beneficiariesManagementExpandPages: 0,
            beneficiariesManagementExpandData: [],
            beneficiariesManagementExpandTotalCount: 0,
            beneficiariesManagementExpandFileQuery: "",

            exportModeltoggleView: false,
 
        };
                self = this;
                self.state.providerSelectValue = { value: 'all', label: 'All' };
                self.state.pcpNameValue = { value: 'all', label: 'All' };
                self.state.yearSelectValue = { value: 'all', label: 'All' };
                
                this.exportModelToggle = this.exportModelToggle.bind(this);
                this.backToReports = this.backToReports.bind(this);
                this.fetchBeneficiariesManagementExpandData = this.fetchBeneficiariesManagementExpandData.bind(this);
                this.fetchBeneficiariesManagementExpandData = debounce(this.fetchBeneficiariesManagementExpandData, 500);
            
    }

    componentDidMount() {

    self.state.beneficiariesManagementSelectedMedicareId = localStorage.getItem('beneficiariesManagementSelectedMedicareId');
 
    if (localStorage.getItem('provider') != null)
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
    if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
    }

fetchBeneficiariesManagementExpandData(state, instance) {
    var page = state.page + 1;
    self.getBeneficiariesManagementExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

getBeneficiariesManagementExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('medicareId', self.state.beneficiariesManagementSelectedMedicareId);
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
          self.setState({beneficiariesManagementExpandData: response.beneficiariesManagementExpandData,beneficiariesManagementExpandPages:response.pages,beneficiariesManagementExpandTotalCount:response.totalCount,beneficiariesManagementExpandFileQuery:response.fileQuery});
          //console.log(response);
          self.setState({ beneficiariesManagementExpandLoading: false });
          self.generateBeneficiariesManagementExpandXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementExpand)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpName_beneficiariesManagementExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_beneficiariesManagementExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementExpandFileQuery);

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

      //console.log(response);
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Details", documentTitle:"Print- Beneficiaries Management Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 } 
 generateBeneficiariesManagementExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementExpand', self.state.showClaimId_beneficiariesManagementExpand);
    formData.append('showClaimDate_beneficiariesManagementExpand', self.state.showClaimDate_beneficiariesManagementExpand);
    formData.append('showClaimType_beneficiariesManagementExpand', self.state.showClaimType_beneficiariesManagementExpand);
    formData.append('showClinicName_beneficiariesManagementExpand', self.state.showClinicName_beneficiariesManagementExpand);
    formData.append('showPcpName_beneficiariesManagementExpand', self.state.showPcpName_beneficiariesManagementExpand);
    formData.append('showIcdCodes_beneficiariesManagementExpand', self.state.showIcdCodes_beneficiariesManagementExpand);
    formData.append('showHccCodes_beneficiariesManagementExpand', self.state.showHccCodes_beneficiariesManagementExpand);
    formData.append('showDrgCode_beneficiariesManagementExpand', self.state.showDrgCode_beneficiariesManagementExpand);
    formData.append('showBetosCat_beneficiariesManagementExpand', self.state.showBetosCat_beneficiariesManagementExpand);
    formData.append('showCost_beneficiariesManagementExpand', self.state.showCost_beneficiariesManagementExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementExpand: btoa(JSON.stringify(object))});
   }

  backToReports() {
    window.location.href = "#beneficiariesReportByPatient";
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
        if(self.state.showClaimId_beneficiariesManagementExpand) {
          document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimDate_beneficiariesManagementExpand) {
          document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimType_beneficiariesManagementExpand) {
          document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClinicName_beneficiariesManagementExpand) {
          document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpName_beneficiariesManagementExpand) {
          document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showIcdCodes_beneficiariesManagementExpand) {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showHccCodes_beneficiariesManagementExpand) {
          document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showDrgCode_beneficiariesManagementExpand) {
          document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showBetosCat_beneficiariesManagementExpand) {
          document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showCost_beneficiariesManagementExpand) {
          document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
        }
      }
    }, 300);
  }

  showHideColumn_beneficiariesManagementExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementExpand = !this.state.showClaimId_beneficiariesManagementExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementExpand = !this.state.showClaimDate_beneficiariesManagementExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementExpand = !this.state.showClaimType_beneficiariesManagementExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementExpand = !this.state.showClinicName_beneficiariesManagementExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_beneficiariesManagementExpand = !this.state.showPcpName_beneficiariesManagementExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementExpand = !this.state.showIcdCodes_beneficiariesManagementExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementExpand = !this.state.showHccCodes_beneficiariesManagementExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementExpand = !this.state.showDrgCode_beneficiariesManagementExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementExpand = !this.state.showBetosCat_beneficiariesManagementExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementExpand = !this.state.showCost_beneficiariesManagementExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimDate_beneficiariesManagementExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimType_beneficiariesManagementExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClinicName_beneficiariesManagementExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showPcpName_beneficiariesManagementExpand) {
              document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showIcdCodes_beneficiariesManagementExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showHccCodes_beneficiariesManagementExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showDrgCode_beneficiariesManagementExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showBetosCat_beneficiariesManagementExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showCost_beneficiariesManagementExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementExpand").style.backgroundColor = "#d03b3cfa ";
            }
            
            self.generateBeneficiariesManagementExpandXLSX();

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
            
            <h2>Beneficiaries Management Report By Patient - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.beneficiariesManagementExpandData}
                              loading={this.state.beneficiariesManagementExpandLoading}
                              pages={this.state.beneficiariesManagementExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementExpandPDF/'+self.state.jsonDataForBeneficiariesManagementExpand} target="_blank" >
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
export default BeneficiariesReportByPatientExpand;
