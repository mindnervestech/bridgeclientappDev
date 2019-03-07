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

class BeneficiariesReportByLocationDetails extends Component {

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

            beneficiariesManagementByLocationExpandLoading: false,
            beneficiariesManagementByLocationExpandPages: 0,
            beneficiariesManagementByLocationExpandData: [],
            beneficiariesManagementByLocationExpandTotalCount: 0,
            beneficiariesManagementByLocationExpandFileQuery: "",
            beneficiariesManagementSelectedPcpLocation:"",
            showClaimId_beneficiariesManagementByLocationExpand: true,
            showClaimDate_beneficiariesManagementByLocationExpand: true,
            showClaimType_beneficiariesManagementByLocationExpand: true,
            showClinicName_beneficiariesManagementByLocationExpand: true,
            showPcpLocation_beneficiariesManagementByLocationExpand: true,
            showIcdCodes_beneficiariesManagementByLocationExpand: true,
            showHccCodes_beneficiariesManagementByLocationExpand: true,
            showDrgCode_beneficiariesManagementByLocationExpand: true,
            showBetosCat_beneficiariesManagementByLocationExpand: true,
            showCost_beneficiariesManagementByLocationExpand: true,

            exportModeltoggleView: false,
 
        };
                self = this;
                self.state.providerSelectValue = { value: 'all', label: 'All' };
                self.state.pcpNameValue = { value: 'all', label: 'All' };
                self.state.yearSelectValue = { value: 'all', label: 'All' };
                
                this.exportModelToggle = this.exportModelToggle.bind(this);
                this.backToReports = this.backToReports.bind(this);
                this.fetchBeneficiariesManagementByLocationExpandData = this.fetchBeneficiariesManagementByLocationExpandData.bind(this);
                this.fetchBeneficiariesManagementByLocationExpandData = debounce(this.fetchBeneficiariesManagementByLocationExpandData, 500);
            
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
    self.state.beneficiariesManagementSelectedPcpLocation = localStorage.getItem('beneficiariesManagementSelectedPcpLocation');

  if (localStorage.getItem('provider') != null)
    self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
  if (localStorage.getItem('pcpName') != null)
    self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
  if (localStorage.getItem('year') != null)
    self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
  
  }


fetchBeneficiariesManagementByLocationExpandData(state,instance)
{
  var page =state.page+1;
  self.getBeneficiariesManagementByLocationExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
}


 
getBeneficiariesManagementByLocationExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByLocationExpandLoading: true });
    const formData = new FormData();

    formData.append('year', self.state.yearSelectValue.value);
    formData.append('provider', self.state.providerSelectValue.value);
    formData.append('pcpLocation', self.state.beneficiariesManagementSelectedPcpLocation);
    formData.append('pcpName', self.state.pcpNameValue.value);
    formData.append('pageSize', pageSize);
    formData.append('page', page);
    formData.append('sortedColumns', sortedArr);
    formData.append('filteredColumns', filteredArr);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationExpandData', {
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
        self.setState({beneficiariesManagementByLocationExpandData: response.beneficiariesManagementByLocationExpandData,beneficiariesManagementByLocationExpandPages:response.pages,beneficiariesManagementByLocationExpandTotalCount:response.totalCount,beneficiariesManagementByLocationExpandFileQuery:response.fileQuery});
        //console.log(response);
        self.setState({ beneficiariesManagementByLocationExpandLoading: false });
        self.generateBeneficiariesManagementByLocationExpandXLSX();
    });
      
}

 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementByLocationExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementByLocationExpand)
     propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand)
      propertiesArr.push("PCP Location");
    if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementByLocationExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementByLocationExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementByLocationExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationExpandDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Location Details", documentTitle:"Print- Beneficiaries Management By Location Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
    }
    
    generateBeneficiariesManagementByLocationExpandXLSX() {
        const formData = new FormData();
        
        formData.append('fileQuery', self.state.beneficiariesManagementByLocationExpandFileQuery);
        formData.append('showClaimId_beneficiariesManagementByLocationExpand', self.state.showClaimId_beneficiariesManagementByLocationExpand);
        formData.append('showClaimDate_beneficiariesManagementByLocationExpand', self.state.showClaimDate_beneficiariesManagementByLocationExpand);
        formData.append('showClaimType_beneficiariesManagementByLocationExpand', self.state.showClaimType_beneficiariesManagementByLocationExpand);
        formData.append('showClinicName_beneficiariesManagementByLocationExpand', self.state.showClinicName_beneficiariesManagementByLocationExpand);
        formData.append('showPcpLocation_beneficiariesManagementByLocationExpand', self.state.showPcpLocation_beneficiariesManagementByLocationExpand);
        formData.append('showIcdCodes_beneficiariesManagementByLocationExpand', self.state.showIcdCodes_beneficiariesManagementByLocationExpand);
        formData.append('showHccCodes_beneficiariesManagementByLocationExpand', self.state.showHccCodes_beneficiariesManagementByLocationExpand);
        formData.append('showDrgCode_beneficiariesManagementByLocationExpand', self.state.showDrgCode_beneficiariesManagementByLocationExpand);
        formData.append('showBetosCat_beneficiariesManagementByLocationExpand', self.state.showBetosCat_beneficiariesManagementByLocationExpand);
        formData.append('showCost_beneficiariesManagementByLocationExpand', self.state.showCost_beneficiariesManagementByLocationExpand);
        
          var object = {};
          formData.forEach(function(value, key){
              object[key] = value;
          });
          
          self.setState({jsonDataForBeneficiariesManagementByLocationExpand: btoa(JSON.stringify(object))});
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
        if(self.state.showClaimId_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimDate_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimType_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClinicName_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showHccCodes_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showDrgCode_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showBetosCat_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showCost_beneficiariesManagementByLocationExpand) {
          document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
        }
      }
    }, 300);
  }
  showHideColumn_beneficiariesManagementByLocationExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementByLocationExpand = !this.state.showClaimId_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementByLocationExpand = !this.state.showClaimDate_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementByLocationExpand = !this.state.showClaimType_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementByLocationExpand = !this.state.showClinicName_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_beneficiariesManagementByLocationExpand = !this.state.showPcpLocation_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementByLocationExpand = !this.state.showIcdCodes_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementByLocationExpand = !this.state.showHccCodes_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementByLocationExpand = !this.state.showDrgCode_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementByLocationExpand = !this.state.showBetosCat_beneficiariesManagementByLocationExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementByLocationExpand = !this.state.showCost_beneficiariesManagementByLocationExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimDate_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimType_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClinicName_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showPcpLocation_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showIcdCodes_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showHccCodes_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showDrgCode_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showBetosCat_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showCost_beneficiariesManagementByLocationExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementByLocationExpand").style.backgroundColor = "#d03b3cfa ";
            }
            
            self.generateBeneficiariesManagementByLocationExpandXLSX();

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
            
            <h2>Beneficiaries Management Report By Location - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByLocationExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocationExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByLocationExpandData}
                              loading={this.state.beneficiariesManagementByLocationExpandLoading}
                              pages={this.state.beneficiariesManagementByLocationExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD Codes",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Codes",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "BetosCat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_beneficiariesManagementByLocationExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementByLocationExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByLocationExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByLocationExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByLocationExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationExpandPDF/'+self.state.jsonDataForBeneficiariesManagementByLocationExpand} target="_blank" >
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
export default BeneficiariesReportByLocationDetails;
