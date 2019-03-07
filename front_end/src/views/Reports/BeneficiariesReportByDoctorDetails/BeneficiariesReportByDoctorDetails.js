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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import Select from 'react-select';

class BeneficiariesReportByDoctorDetails extends Component {

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
            
  
            beneficiariesManagementByDoctorExpandModal: false,
            beneficiariesManagementByDoctorExpandLoading: false,
            beneficiariesManagementByDoctorExpandPages: 0,
            beneficiariesManagementByDoctorExpandData: [],
            beneficiariesManagementByDoctorExpandTotalCount: 0,
            beneficiariesManagementByDoctorExpandFileQuery: "",
      
            beneficiariesManagementSelectedPcpId  :"",

            showClaimId_beneficiariesManagementByDoctorExpand: true,
            showClaimDate_beneficiariesManagementByDoctorExpand: true,
            showClaimType_beneficiariesManagementByDoctorExpand: true,
            showClinicName_beneficiariesManagementByDoctorExpand: true,
            showPcpName_beneficiariesManagementByDoctorExpand: true,
            showIcdCodes_beneficiariesManagementByDoctorExpand: true,
            showHccCodes_beneficiariesManagementByDoctorExpand: true,
            showDrgCode_beneficiariesManagementByDoctorExpand: true,
            showBetosCat_beneficiariesManagementByDoctorExpand: true,
            showCost_beneficiariesManagementByDoctorExpand: true,


            exportModeltoggleView: false,
 
        };
                self = this;
                self.state.providerSelectValue = { value: 'all', label: 'All' };
                self.state.pcpNameValue = { value: 'all', label: 'All' };
                self.state.yearSelectValue = { value: 'all', label: 'All' };
                
                this.exportModelToggle = this.exportModelToggle.bind(this);
                this.backToReports = this.backToReports.bind(this);
                this.fetchBeneficiariesManagementByDoctorExpandData = this.fetchBeneficiariesManagementByDoctorExpandData.bind(this);
                this.fetchBeneficiariesManagementByDoctorExpandData = debounce(this.fetchBeneficiariesManagementByDoctorExpandData, 500);
            
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
      
      if (localStorage.getItem('provider') != null)
        self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
      if (localStorage.getItem('pcpName') != null)
        self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
      if (localStorage.getItem('year') != null)
        
        self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));
        self.state.beneficiariesManagementSelectedPcpId = localStorage.getItem('beneficiariesManagementSelectedPcpId');
 
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


fetchBeneficiariesManagementByDoctorExpandData(state, instance) {
  var page = state.page + 1;
  self.getBeneficiariesManagementByDoctorExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
}

 
getBeneficiariesManagementByDoctorExpandData(pageSize,page,sortedArr,filteredArr) {
  self.setState({ beneficiariesManagementByDoctorExpandLoading: true });
  const formData = new FormData();

  formData.append('year', self.state.yearSelectValue.value);
  formData.append('provider', self.state.providerSelectValue.value);
  formData.append('pcpId', self.state.beneficiariesManagementSelectedPcpId);
  formData.append('pageSize', pageSize);
  formData.append('page', page);
  formData.append('sortedColumns', sortedArr);
  formData.append('filteredColumns', filteredArr);

  fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorExpandData', {
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
      self.setState({beneficiariesManagementByDoctorExpandData: response.beneficiariesManagementByDoctorExpandData,beneficiariesManagementByDoctorExpandPages:response.pages,beneficiariesManagementByDoctorExpandTotalCount:response.totalCount,beneficiariesManagementByDoctorExpandFileQuery:response.fileQuery});
      //console.log(response);
      self.setState({ beneficiariesManagementByDoctorExpandLoading: false });
      self.generateBeneficiariesManagementByDoctorExpandXLSX();
  });
    
}

 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagementByDoctorExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showPcpName_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("ICD Codes");
    if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("HCC Codes");
    if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showCost_beneficiariesManagementByDoctorExpand)
      propertiesArr.push("Cost");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByDoctorExpandFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorExpandDataForPrint', {
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


      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Doctor Details", documentTitle:"Print- Beneficiaries Management By Doctor Details", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }
 generateBeneficiariesManagementByDoctorExpandXLSX() {
  const formData = new FormData();
  
  formData.append('fileQuery', self.state.beneficiariesManagementByDoctorExpandFileQuery);
  formData.append('showClaimId_beneficiariesManagementByDoctorExpand', self.state.showClaimId_beneficiariesManagementByDoctorExpand);
  formData.append('showClaimDate_beneficiariesManagementByDoctorExpand', self.state.showClaimDate_beneficiariesManagementByDoctorExpand);
  formData.append('showClaimType_beneficiariesManagementByDoctorExpand', self.state.showClaimType_beneficiariesManagementByDoctorExpand);
  formData.append('showClinicName_beneficiariesManagementByDoctorExpand', self.state.showClinicName_beneficiariesManagementByDoctorExpand);
  formData.append('showPcpName_beneficiariesManagementByDoctorExpand', self.state.showPcpName_beneficiariesManagementByDoctorExpand);
  formData.append('showIcdCodes_beneficiariesManagementByDoctorExpand', self.state.showIcdCodes_beneficiariesManagementByDoctorExpand);
  formData.append('showHccCodes_beneficiariesManagementByDoctorExpand', self.state.showHccCodes_beneficiariesManagementByDoctorExpand);
  formData.append('showDrgCode_beneficiariesManagementByDoctorExpand', self.state.showDrgCode_beneficiariesManagementByDoctorExpand);
  formData.append('showBetosCat_beneficiariesManagementByDoctorExpand', self.state.showBetosCat_beneficiariesManagementByDoctorExpand);
  formData.append('showCost_beneficiariesManagementByDoctorExpand', self.state.showCost_beneficiariesManagementByDoctorExpand);
  
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForBeneficiariesManagementByDoctorExpand: btoa(JSON.stringify(object))});
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
        if(self.state.showClaimId_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClaimType_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClinicName_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpName_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showCost_beneficiariesManagementByDoctorExpand) {
          document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
        }
      }
    }, 300);
  }
  showHideColumn_beneficiariesManagementByDoctorExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_beneficiariesManagementByDoctorExpand = !this.state.showClaimId_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_beneficiariesManagementByDoctorExpand = !this.state.showClaimDate_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_beneficiariesManagementByDoctorExpand = !this.state.showClaimType_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_beneficiariesManagementByDoctorExpand = !this.state.showClinicName_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_beneficiariesManagementByDoctorExpand = !this.state.showPcpName_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_beneficiariesManagementByDoctorExpand = !this.state.showIcdCodes_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_beneficiariesManagementByDoctorExpand = !this.state.showHccCodes_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_beneficiariesManagementByDoctorExpand = !this.state.showDrgCode_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_beneficiariesManagementByDoctorExpand = !this.state.showBetosCat_beneficiariesManagementByDoctorExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_beneficiariesManagementByDoctorExpand = !this.state.showCost_beneficiariesManagementByDoctorExpand;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showClaimId_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimDate_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClaimType_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showClinicName_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showPcpName_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showIcdCodes_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showHccCodes_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showDrgCode_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showBetosCat_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showCost_beneficiariesManagementByDoctorExpand) {
              document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_beneficiariesManagementByDoctorExpand").style.backgroundColor = "#d03b3cfa ";
            }
            
            self.generateBeneficiariesManagementByDoctorExpandXLSX();

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
            
            <h2>Beneficiaries Management Report By Doctor - Details</h2>
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
                                  <DropdownItem toggle={false} id="ddItemClaimId_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimId")}>Claim Id</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimDate_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("icdCodes")}>ICD Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("hccCodes")}>HCC Codes</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_beneficiariesManagementByDoctorExpand" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctorExpand("cost")}>Cost</DropdownItem>
                                  
                                </DropdownMenu>
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        
        <ReactTable
              manual
              data={this.state.beneficiariesManagementByDoctorExpandData}
              loading={this.state.beneficiariesManagementByDoctorExpandLoading}
              pages={this.state.beneficiariesManagementByDoctorExpandPages} // Display the total number of pages
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
                      show: this.state.showClaimId_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "Claim Date",
                      accessor: "claimDate",
                      show: this.state.showClaimDate_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "Claim Type",
                      accessor: "claimType",
                      show: this.state.showClaimType_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "Clinic Name",
                      accessor: "clinicName",
                      show: this.state.showClinicName_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "PCP Name",
                      accessor: "pcpName",
                      show: this.state.showPcpName_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "ICD Codes",
                      accessor: "icdCodes",
                      show: this.state.showIcdCodes_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "HCC Codes",
                      accessor: "hccCodes",
                      show: this.state.showHccCodes_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "DRG Code",
                      accessor: "drgCode",
                      show: this.state.showDrgCode_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "BetosCat",
                      accessor: "betosCat",
                      show: this.state.showBetosCat_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                    {
                      Header: "Cost",
                      accessor: "cost",
                      show: this.state.showCost_beneficiariesManagementByDoctorExpand,
                        headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                      filterMethod: (filter, row) =>
                        row[filter.id].startsWith(filter.value)
                    },
                  ]
                }
              ]}
              defaultPageSize={100}
              onFetchData={this.fetchBeneficiariesManagementByDoctorExpandData}
              className="-striped -highlight commonFontFamily"
              pageText={'Total Entries ' + this.state.beneficiariesManagementByDoctorExpandTotalCount + ', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByDoctorExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctorExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorExpandXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctorExpand} target="_blank" >
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
export default BeneficiariesReportByDoctorDetails;
