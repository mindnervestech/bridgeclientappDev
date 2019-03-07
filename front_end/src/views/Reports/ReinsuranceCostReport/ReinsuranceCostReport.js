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

class ReinsuranceCostReport extends Component {

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
      

        reinsuranceCostReportLoading: false,
        reinsuranceCostReportPages:0,
        reinsuranceCostReportData:[],
        reinsuranceCostReportTotalCount:0,
        reinsuranceCostReportFileQuery:"",
        exportModeltoggleView: false,
        
        showPlanName_reinsuranceCostReport:true,
        showPolicyPeriod_reinsuranceCostReport:true,
        showPatientName_reinsuranceCostReport:true,
        showSubscriberID_reinsuranceCostReport:true,
        showEffectiveDate_reinsuranceCostReport:true,
        showTermedMonth_reinsuranceCostReport:true,
        showDateOfBirth_reinsuranceCostReport:true,
        showStatus_reinsuranceCostReport:true,
        showGender_reinsuranceCostReport:true,
        showPcpName_reinsuranceCostReport:true,
        showTotalClaimsCost_reinsuranceCostReport:true,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchReinsuranceCostReportData = this.fetchReinsuranceCostReportData.bind(this);
    this.backToReports = this.backToReports.bind(this);

    this.fetchReinsuranceCostReportData = debounce(this.fetchReinsuranceCostReportData,500);
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

    if (localStorage.getItem('providerForReports') != null) {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('providerForReports'));
    }
    if (localStorage.getItem('pcpNameForReports') != null) {
      self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpNameForReports'));
    }
    if (localStorage.getItem('yearForReports') != null){
      self.state.yearSelectValue = JSON.parse(localStorage.getItem('yearForReports'));

  }
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

  fetchReinsuranceCostReportData(state,instance){
    var page = state.page + 1;
    self.state.reinsuranceCostReportGridPage = page;
    self.state.reinsuranceCostReportGridPageSize = state.pageSize;
    self.state.reinsuranceCostReportGridSorted = state.sorted;
    self.state.reinsuranceCostReportGridFiltered = state.filtered;
    self.getReinsuranceCostReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getReinsuranceCostReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ reinsuranceCostReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      fetch(config.serverUrl+'/getReinsuranceCostReportData', {
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
          self.setState({reinsuranceCostReportData: response.reinsuranceCostReportData,reinsuranceCostReportPages:response.pages,reinsuranceCostReportTotalCount:response.totalCount,reinsuranceCostReportFileQuery:response.fileQuery});
          self.setState({ reinsuranceCostReportLoading: false });
          self.generateReinsuranceCostReportXLSX();
      });
    }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }
  printTableData_reinsuranceCostReport () {

    var propertiesArr = [];
  
    if(self.state.showPlanName_reinsuranceCostReport)
      propertiesArr.push("Plan Name");
    if(self.state.showPolicyPeriod_reinsuranceCostReport)
      propertiesArr.push("Policy Period");
    if(self.state.showPatientName_reinsuranceCostReport)
      propertiesArr.push("Patient Name");
    if(self.state.showSubscriberID_reinsuranceCostReport)
      propertiesArr.push("HICN/SubscriberID");
    if(self.state.showEffectiveDate_reinsuranceCostReport)
      propertiesArr.push("Effective Date");
    if(self.state.showTermedMonth_reinsuranceCostReport)
      propertiesArr.push("Termed Month");
    if(self.state.showDateOfBirth_reinsuranceCostReport)
      propertiesArr.push("DOB");
      if(self.state.showStatus_reinsuranceCostReport)
      propertiesArr.push("Status");
    if(self.state.showGender_reinsuranceCostReport)
      propertiesArr.push("Gender");
    if(self.state.showPcpName_reinsuranceCostReport)
      propertiesArr.push("PCP Name");
    if(self.state.showTotalClaimsCost_reinsuranceCostReport)
      propertiesArr.push("Total Claims Cost");
  
    const formData = new FormData();
    formData.append('fileQuery', self.state.reinsuranceCostReportFileQuery);
  
    fetch(config.serverUrl+'/getReinsuranceCostReportDataForPrint', {
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
      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Reinsurance Cost Report Search", documentTitle:"Print-Reinsurance Cost Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    }).catch((error) => {
      console.log(error);
    });
  }
  

  generateReinsuranceCostReportXLSX() {
    const formData = new FormData();
  
  formData.append('fileQuery', self.state.reinsuranceCostReportFileQuery);
  formData.append('showPlanName_reinsuranceCostReport', self.state.showPlanName_reinsuranceCostReport);
  formData.append('showPolicyPeriod_reinsuranceCostReport', self.state.showPolicyPeriod_reinsuranceCostReport);
  formData.append('showPatientName_reinsuranceCostReport', self.state.showPatientName_reinsuranceCostReport);
  formData.append('showSubscriberID_reinsuranceCostReport', self.state.showSubscriberID_reinsuranceCostReport);
  formData.append('showEffectiveDate_reinsuranceCostReport', self.state.showEffectiveDate_reinsuranceCostReport);
  formData.append('showTermedMonth_reinsuranceCostReport', self.state.showTermedMonth_reinsuranceCostReport);
  formData.append('showDateOfBirth_reinsuranceCostReport', self.state.showDateOfBirth_reinsuranceCostReport);
  formData.append('showStatus_reinsuranceCostReport', self.state.showStatus_reinsuranceCostReport);
  formData.append('showGender_reinsuranceCostReport', self.state.showGender_reinsuranceCostReport);
  formData.append('showPcpName_reinsuranceCostReport', self.state.showPcpName_reinsuranceCostReport);
  formData.append('showTotalClaimsCost_reinsuranceCostReport', self.state.showTotalClaimsCost_reinsuranceCostReport);
  
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForReinsuranceCostReport: btoa(JSON.stringify(object))});
  }
  

  backToReports() {
    window.location.href = "#reports";
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
        if(self.state.showSubscriberID_reinsuranceCostReport) {
          document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPlanName_reinsuranceCostReport) {
          document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPatientName_reinsuranceCostReport) {
          document.getElementById("ddItemPatientName_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpName_reinsuranceCostReport) {
          document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTermedMonth_reinsuranceCostReport) {
          document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDateOfBirth_reinsuranceCostReport) {
          document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showGender_reinsuranceCostReport) {
          document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalClaimsCost_reinsuranceCostReport) {
          document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showStatus_reinsuranceCostReport) {
          document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }if(self.state.showEffectiveDate_reinsuranceCostReport) {
          document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }if(self.state.showPolicyPeriod_reinsuranceCostReport) {
          document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_ReinsuranceCostReportData(columnName) {
    if(columnName == "subscriberID") {
      this.state.showSubscriberID_reinsuranceCostReport = !this.state.showSubscriberID_reinsuranceCostReport;
    }
    if(columnName == "planName") {
      this.state.showPlanName_reinsuranceCostReport = !this.state.showPlanName_reinsuranceCostReport;
    }
    if(columnName == "patientName") {
      this.state.showPatientName_reinsuranceCostReport = !this.state.showPatientName_reinsuranceCostReport;
    }
    
    if(columnName == "policyPeriod") {
      this.state.showPolicyPeriod_reinsuranceCostReport = !this.state.showPolicyPeriod_reinsuranceCostReport;
    }
    if(columnName == "pcpName") {
      this.state.showPcpName_reinsuranceCostReport = !this.state.showPcpName_reinsuranceCostReport;
    }
    if(columnName == "termedMonth") {
      this.state.showTermedMonth_reinsuranceCostReport = !this.state.showTermedMonth_reinsuranceCostReport;
    }
    if(columnName == "effectiveDate") {
      this.state.showEffectiveDate_reinsuranceCostReport = !this.state.showEffectiveDate_reinsuranceCostReport;
    }
    if(columnName == "dob") {
      this.state.showDateOfBirth_reinsuranceCostReport = !this.state.showDateOfBirth_reinsuranceCostReport;
    }
    
    if(columnName == "status") {
      this.state.showStatus_reinsuranceCostReport = !this.state.showStatus_reinsuranceCostReport;
    }
    if(columnName == "gender") {
      this.state.showGender_reinsuranceCostReport = !this.state.showGender_reinsuranceCostReport;
    }
    if(columnName == "totalClaimsCost") {
      this.state.showTotalClaimsCost_reinsuranceCostReport = !this.state.showTotalClaimsCost_reinsuranceCostReport;
    }
  
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });
  
            if(self.state.showSubscriberID_reinsuranceCostReport) {
              document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemSubscriberID_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPlanName_reinsuranceCostReport) {
              document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPlanName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPatientName_reinsuranceCostReport) {
              document.getElementById("ddItemPatientName_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPatientName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showPcpName_reinsuranceCostReport) {
              document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTermedMonth_reinsuranceCostReport) {
              document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTermedMonth_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showDateOfBirth_reinsuranceCostReport) {
              document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDateOfBirth_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showGender_reinsuranceCostReport) {
              document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemGender_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showTotalClaimsCost_reinsuranceCostReport) {
              document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalClaimsCost_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showStatus_reinsuranceCostReport) {
              document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemStatus_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }if(self.state.showEffectiveDate_reinsuranceCostReport) {
              document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemEffectiveDate_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }if(self.state.showPolicyPeriod_reinsuranceCostReport) {
              document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPolicyPeriod_reinsuranceCostReport").style.backgroundColor = "#d03b3c";
            }
  
            self.generateReinsuranceCostReportXLSX();
   
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
            
            <h2>Reinsurance Cost Report</h2>
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
                                  <DropdownItem toggle={false} id="ddItemPlanName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPolicyPeriod_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("policyPeriod")}>Policy Period</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSubscriberID_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("subscriberID")}>SubscriberID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEffectiveDate_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("effectiveDate")}>Effective Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDateOfBirth_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("dob")}>DOB</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemStatus_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("status")}>Status</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemGender_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("gender")}>Gender</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalClaimsCost_reinsuranceCostReport" className="commonFontFamily" onClick={e => self.showHideColumn_ReinsuranceCostReportData("totalClaimsCost")}>Total Claims Cost</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
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
                              data={this.state.reinsuranceCostReportData}
                              loading={this.state.reinsuranceCostReportLoading}
                              pages={this.state.reinsuranceCostReportPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Plan Name",
                                      accessor: "planName",
                                      show: this.state.showPlanName_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Policy Period",
                                      accessor: "policyPeriod",
                                      show: this.state.showPolicyPeriod_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN/SuscriberID",
                                      accessor: "subscriberID",
                                      show: this.state.showSubscriberID_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Effective Date",
                                      accessor: "effectiveDate",
                                      show: this.state.showEffectiveDate_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },     
                                    {
                                      Header: "DOB",
                                      accessor: "dob",
                                      show: this.state.showDateOfBirth_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    }, 
                                    {
                                      Header: "Status",
                                      accessor: "status",
                                      show: this.state.showStatus_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Gender",
                                      accessor: "gender",
                                      show: this.state.showGender_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },            
                                    {
                                      Header: "Total Claims Cost",
                                      accessor: "totalClaimsCost",
                                      show: this.state.showTotalClaimsCost_reinsuranceCostReport,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchReinsuranceCostReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.reinsuranceCostReportTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_reinsuranceCostReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderReinsuranceCostReportXLSX/'+self.state.jsonDataForReinsuranceCostReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderReinsuranceCostPDF/'+self.state.jsonDataForReinsuranceCostReport} target="_blank" >
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
export default ReinsuranceCostReport;
