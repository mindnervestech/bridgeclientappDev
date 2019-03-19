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

class BeneficiariesReportByClinicDetails extends Component {

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

            beneficiariesManagementByClinicExpandModal: false,
            beneficiariesManagementByClinicExpandLoading: false,
            beneficiariesManagementByClinicExpandPages: 0,
            beneficiariesManagementByClinicExpandData: [],
            beneficiariesManagementByClinicExpandTotalCount: 0,
            beneficiariesManagementByClinicExpandFileQuery: "",
            beneficiariesManagementSelectedClinicName:"",

            showClaimId_beneficiariesManagementByClinicExpand: true,
            showClaimDate_beneficiariesManagementByClinicExpand: true,
            showClaimType_beneficiariesManagementByClinicExpand: true,
            showClinicName_beneficiariesManagementByClinicExpand: true,
            showPcpName_beneficiariesManagementByClinicExpand: true,
            showIcdCodes_beneficiariesManagementByClinicExpand: true,
            showHccCodes_beneficiariesManagementByClinicExpand: true,
            showDrgCode_beneficiariesManagementByClinicExpand: true,
            showBetosCat_beneficiariesManagementByClinicExpand: true,
            showCost_beneficiariesManagementByClinicExpand: true,

            exportModeltoggleView: false,
 
        };
                self = this;
                self.state.providerSelectValue = { value: 'all', label: 'All' };
                self.state.pcpNameValue = { value: 'all', label: 'All' };
                self.state.yearSelectValue = { value: 'all', label: 'All' };
                
                this.exportModelToggle = this.exportModelToggle.bind(this);
                this.backToReports = this.backToReports.bind(this);
                this.fetchBeneficiariesManagementByClinicExpandData = this.fetchBeneficiariesManagementByClinicExpandData.bind(this);
                this.fetchBeneficiariesManagementByClinicExpandData = debounce(this.fetchBeneficiariesManagementByClinicExpandData, 500);
            
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

    self.state.beneficiariesManagementSelectedClinicName = localStorage.getItem('beneficiariesManagementSelectedClinicName');

    if (localStorage.getItem('provider') != null)
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
    if (localStorage.getItem('pcpName') != null)
      self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
  
}  

fetchBeneficiariesManagementByClinicExpandData(state,instance)
{
  var page =state.page+1;
  self.getBeneficiariesManagementByClinicExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
}


  getBeneficiariesManagementByClinicExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByClinicExpandLoading: true });
    const formData = new FormData();

    formData.append('year', self.state.yearSelectValue.value);
    formData.append('provider', self.state.providerSelectValue.value);
    formData.append('clinicName', self.state.beneficiariesManagementSelectedClinicName);
    formData.append('pcpName', self.state.pcpNameValue.value);
    formData.append('pageSize', pageSize);
    formData.append('page', page);
    formData.append('sortedColumns', sortedArr);
    formData.append('filteredColumns', filteredArr);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicExpandData', {
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
        self.setState({beneficiariesManagementByClinicExpandData: response.beneficiariesManagementByClinicExpandData,beneficiariesManagementByClinicExpandPages:response.pages,beneficiariesManagementByClinicExpandTotalCount:response.totalCount,beneficiariesManagementByClinicExpandFileQuery:response.fileQuery});
        self.setState({ beneficiariesManagementByClinicExpandLoading: false });
        self.generateBeneficiariesManagementByClinicExpandXLSX();
    });
      
}
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementByClinicExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementByClinicExpand)
     propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpLocation_beneficiariesManagementByClinicExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementByClinicExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementByClinicExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementByClinicExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicExpandDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Clinic Details", documentTitle:"Print- Beneficiaries Management By Clinic Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }  
  
 generateBeneficiariesManagementByClinicExpandXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicExpandFileQuery);
    formData.append('showClaimId_beneficiariesManagementByClinicExpand', self.state.showClaimId_beneficiariesManagementByClinicExpand);
    formData.append('showClaimDate_beneficiariesManagementByClinicExpand', self.state.showClaimDate_beneficiariesManagementByClinicExpand);
    formData.append('showClaimType_beneficiariesManagementByClinicExpand', self.state.showClaimType_beneficiariesManagementByClinicExpand);
    formData.append('showPcpName_beneficiariesManagementByClinicExpand', self.state.showPcpName_beneficiariesManagementByClinicExpand);
    formData.append('showClinicName_beneficiariesManagementByClinicExpand', self.state.showClinicName_beneficiariesManagementByClinicExpand);
    formData.append('showIcdCodes_beneficiariesManagementByClinicExpand', self.state.showIcdCodes_beneficiariesManagementByClinicExpand);
    formData.append('showHccCodes_beneficiariesManagementByClinicExpand', self.state.showHccCodes_beneficiariesManagementByClinicExpand);
    formData.append('showDrgCode_beneficiariesManagementByClinicExpand', self.state.showDrgCode_beneficiariesManagementByClinicExpand);
    formData.append('showBetosCat_beneficiariesManagementByClinicExpand', self.state.showBetosCat_beneficiariesManagementByClinicExpand);
    formData.append('showCost_beneficiariesManagementByClinicExpand', self.state.showCost_beneficiariesManagementByClinicExpand);
    
      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByClinicExpand: btoa(JSON.stringify(object))});
   }

  backToReports() {
    window.location.href = "#beneficiariesReport";
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
        if(self.state.showClaimId_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimDate_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimType_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClinicName_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpName_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showHccCodes_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showDrgCode_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showBetosCat_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showCost_beneficiariesManagementByClinicExpand) {
          document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
        }
      }
    }, 300);
  }
  showHideColumn_beneficiariesManagementByClinicExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementByClinicExpand = !this.state.showClaimId_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementByClinicExpand = !this.state.showClaimDate_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementByClinicExpand = !this.state.showClaimType_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementByClinicExpand = !this.state.showClinicName_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_beneficiariesManagementByClinicExpand = !this.state.showPcpName_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementByClinicExpand = !this.state.showIcdCodes_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementByClinicExpand = !this.state.showHccCodes_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementByClinicExpand = !this.state.showDrgCode_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementByClinicExpand = !this.state.showBetosCat_beneficiariesManagementByClinicExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementByClinicExpand = !this.state.showCost_beneficiariesManagementByClinicExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimDate_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimType_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClinicName_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showPcpName_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showIcdCodes_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showHccCodes_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showDrgCode_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showBetosCat_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showCost_beneficiariesManagementByClinicExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementByClinicExpand").style.backgroundColor = "#d03b3cfa ";
            }
            
            self.generateBeneficiariesManagementByClinicExpandXLSX();

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
            
            <h2>Beneficiaries Management Report By Clinic - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByClinicExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinicExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByClinicExpandData}
                              loading={this.state.beneficiariesManagementByClinicExpandLoading}
                              pages={this.state.beneficiariesManagementByClinicExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementByClinicExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementByClinicExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByClinicExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByClinicExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByClinicExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicExpandPDF/'+self.state.jsonDataForBeneficiariesManagementByClinicExpand} target="_blank" >
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
export default BeneficiariesReportByClinicDetails;
