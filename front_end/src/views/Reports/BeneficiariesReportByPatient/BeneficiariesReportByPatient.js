import React, { Component } from "react";
import ReactTable from "react-table";
var debounce = require("lodash.debounce");
import config from '../../Config/ServerUrl';
import '../ReportsStyle.css';
import classnames from 'classnames';
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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import Select from 'react-select';

class BeneficiariesReportByPatient extends Component {

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
      dropdownOpen: new Array(4).fill(false),
      taggleTabId: '1',
        
        beneficiariesManagementLoading: false,  
        beneficiariesManagementPages: 0,
        beneficiariesManagementData: [],
        beneficiariesManagementTotalCount: 0,
        beneficiariesManagementFileQuery: "",

        beneficiariesManagementGridPage:0,
        beneficiariesManagementGridPageSize:0,
        beneficiariesManagementGridSorted:{},
        beneficiariesManagementGridFiltered:{},

        showPlanName_beneficiariesManagement: true,
        showHicn_beneficiariesManagement: true,
        showPatientName_beneficiariesManagement: true,
        showDob_beneficiariesManagement: true,
        showEligibleMonth_beneficiariesManagement: true,
        showTermedMonth_beneficiariesManagement: true,
        showPcpName_beneficiariesManagement: true,
        showPcpLocation_beneficiariesManagement: true,
        showMra_beneficiariesManagement: true,
        showTotalCost_beneficiariesManagement: true,
        showAddress_beneficiariesManagement: false,
        showRecentAppointmentDate_beneficiariesManagement: false,
        showNextAppointmentDate_beneficiariesManagement: false,
        showFacilityLocation_beneficiariesManagement: false,
        showPhoneNumber_beneficiariesManagement: false,
        showLastClaimsDate_beneficiariesManagement: false,
        showIcdCode_beneficiariesManagement: false,
        activeTab:'1',
        exportModeltoggleView: false,

        beneficiariesManagementByLocationModal: false,
        beneficiariesManagementByLocationLoading: false,
        beneficiariesManagementByLocationPages: 0,
        beneficiariesManagementByLocationData: [],
        beneficiariesManagementByLocationTotalCount: 0,
        beneficiariesManagementByLocationFileQuery: "",

        showPcpLocation_beneficiariesManagementByLocation: true,
        showMra_beneficiariesManagementByLocation: true,
        showTotalCost_beneficiariesManagementByLocation: true,
        

        showPcpName_beneficiariesManagementByDoctor: true,
        showPcpLocation_beneficiariesManagementByDoctor: true,
        showAverageMra_beneficiariesManagementByDoctor: true,
        showTotalCost_beneficiariesManagementByDoctor: true,

        beneficiariesManagementByDoctorModal: false,
        beneficiariesManagementByDoctorLoading: false,
        beneficiariesManagementByDoctorPages: 0,
        beneficiariesManagementByDoctorData: [],
        beneficiariesManagementByDoctorTotalCount: 0,
        beneficiariesManagementByDoctorFileQuery: "",
        
        beneficiariesManagementByClinicLoading: false,
        beneficiariesManagementByClinicPages: 0,
        beneficiariesManagementByClinicData: [],
        beneficiariesManagementByClinicTotalCount: 0,
        beneficiariesManagementByClinicFileQuery: "",

        showClinicName_beneficiariesManagementByClinic: true,
        showTotalCost_beneficiariesManagementByClinic: true,
      
      };
      
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);

    this.backToReports = this.backToReports.bind(this);
    this.fetchBeneficiariesManagementData = this.fetchBeneficiariesManagementData.bind(this);
    this.fetchBeneficiariesManagementData = debounce(this.fetchBeneficiariesManagementData,500);
    this.fetchBeneficiariesManagementDataByLocation = this.fetchBeneficiariesManagementDataByLocation.bind(this);
    this.fetchBeneficiariesManagementDataByLocation = debounce(this.fetchBeneficiariesManagementDataByLocation,500);
    this.fetchBeneficiariesManagementDataByClinic = this.fetchBeneficiariesManagementDataByClinic.bind(this);
    this.fetchBeneficiariesManagementDataByClinic = debounce(this.fetchBeneficiariesManagementDataByClinic, 500);
    this.fetchBeneficiariesManagementDataByDoctor = this.fetchBeneficiariesManagementDataByDoctor.bind(this);
    this.fetchBeneficiariesManagementDataByDoctor = debounce(this.fetchBeneficiariesManagementDataByDoctor, 500);
    
  }

  componentDidMount() {
    localStorage.removeItem('ERPatientVisitExpandReportMedicareId');
    localStorage.removeItem('beneficiariesManagementSelectedClinicName');
    localStorage.removeItem('beneficiariesManagementSelectedPcpLocation');
    localStorage.removeItem('beneficiariesManagementSelectedPcpId');
    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList, yearsList: response.yearsList });
 
      self.setState({
        providerList: self.state.providerList.concat({ value: 'all', label: 'All' }),
        pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' }),
        yearsList: self.state.yearsList.concat({ value: 'all', label: 'All' })
      });
    });

    if(localStorage.getItem('provider') !=null)      {
      self.state.providerSelectValue = JSON.parse(localStorage.getItem('provider'));
      self.state.pcpList = JSON.parse(localStorage.getItem('pcpList'));
    }
  if(localStorage.getItem('pcpName')!=null){
    self.state.pcpNameValue = JSON.parse(localStorage.getItem('pcpName'));
  }
  if(localStorage.getItem('year')!=null){
    self.state.yearSelectValue = JSON.parse(localStorage.getItem('year'));
  }
  }

    setProviderValue(e) {
      self.state.providerSelectValue = e;
      self.getPCPForProviders(self.state.providerSelectValue.value);
      localStorage.setItem('provider', JSON.stringify(e));
       if(self.state.activeTab == '1') {
          setTimeout(function(){
            self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
          }, 1000);
        }
        if(self.state.activeTab == '2') {
          setTimeout(function(){
            self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
          }, 1000);
        }
        if(self.state.activeTab == '3') {
            setTimeout(function(){
              self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
            }, 1000);
        }
        
        if(self.state.activeTab == '4') {
          setTimeout(function(){
              self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
            }, 1000);
        }
        
    }

  setPcpName(e) {
    self.state.pcpNameValue = e;
    localStorage.setItem('pcpName', JSON.stringify(e));
    if(self.state.activeTab == '1') {
      self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
    }
    if(self.state.activeTab == '2') {
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
    }
    if(self.state.activeTab == '3') {
      self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    }
    if(self.state.activeTab == '4') {
      self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
    }
}
 
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    if(self.state.activeTab == '1') {
      self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
    }
    if(self.state.activeTab == '2') {
        self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
    }
    if(self.state.activeTab == '3') {
      self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
    }
    if(self.state.activeTab == '4') {
      self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered));
    }}
  toggleReportsTab(tab) {

  if (this.state.activeTab !== tab) {
    this.setState({
      activeTab: tab
    });
  if(tab==1)
    self.getBeneficiariesManagementData(self.state.beneficiariesManagementGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementGridSorted),JSON.stringify(self.state.beneficiariesManagementGridFiltered));
  if(tab==2)
  self.getBeneficiariesManagementByDoctorData(self.state.beneficiariesManagementByDoctorGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByDoctorGridSorted),JSON.stringify(self.state.beneficiariesManagementByDoctorGridFiltered));
  if(tab==3)
  self.getBeneficiariesManagementByLocationData(self.state.beneficiariesManagementByLocationGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByLocationGridSorted),JSON.stringify(self.state.beneficiariesManagementByLocationGridFiltered));
  if(tab==4)
  self.getBeneficiariesManagementByClinicData(self.state.beneficiariesManagementByClinicGridPageSize, 1, JSON.stringify(self.state.beneficiariesManagementByClinicGridSorted),JSON.stringify(self.state.beneficiariesManagementByClinicGridFiltered)); 
  }
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
      self.setState({ pcpList: response });
      self.setState({
        pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' })
      });
      self.state.pcpNameValue = { value: 'all', label: 'All' };
      localStorage.setItem('pcpList',JSON.stringify(self.state.pcpList));
    });
  }

  fetchBeneficiariesManagementData(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementGridPage = page;
    self.state.beneficiariesManagementGridPageSize = state.pageSize;
    self.state.beneficiariesManagementGridSorted = state.sorted;
    self.state.beneficiariesManagementGridFiltered = state.filtered;
    self.getBeneficiariesManagementData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }
  fetchBeneficiariesManagementDataByDoctor(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByDoctorGridPage = page;
    self.state.beneficiariesManagementByDoctorGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByDoctorGridSorted = state.sorted;
    self.state.beneficiariesManagementByDoctorGridFiltered = state.filtered;
    if(self.state.activeTab==2)
    self.getBeneficiariesManagementByDoctorData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }
  fetchBeneficiariesManagementDataByClinic(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByClinicGridPage = page;
    self.state.beneficiariesManagementByClinicGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByClinicGridSorted = state.sorted;
    self.state.beneficiariesManagementByClinicGridFiltered = state.filtered;
    if(self.state.activeTab==4)
    self.getBeneficiariesManagementByClinicData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }
  
  fetchBeneficiariesManagementDataByLocation(state, instance) {
    var page = state.page + 1;
    self.state.beneficiariesManagementByLocationGridPage = page;
    self.state.beneficiariesManagementByLocationGridPageSize = state.pageSize;
    self.state.beneficiariesManagementByLocationGridSorted = state.sorted;
    self.state.beneficiariesManagementByLocationGridFiltered = state.filtered;
    if(self.state.activeTab==3)
    self.getBeneficiariesManagementByLocationData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getBeneficiariesManagementData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementData', {
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
          self.setState({beneficiariesManagementData: response.beneficiariesManagementData,beneficiariesManagementPages:response.pages,beneficiariesManagementTotalCount:response.totalCount,beneficiariesManagementFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementLoading: false });
          self.generateBeneficiariesManagementXLSX();
      });
        
  }
  getBeneficiariesManagementByDoctorData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByDoctorLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorData', {
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
          self.setState({beneficiariesManagementByDoctorData: response.beneficiariesManagementByDoctorData,beneficiariesManagementByDoctorPages:response.pages,beneficiariesManagementByDoctorTotalCount:response.totalCount,beneficiariesManagementByDoctorFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByDoctorLoading: false });
          self.generateBeneficiariesManagementByDoctorXLSX();
      });
        
  }

  getBeneficiariesManagementByLocationData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByLocationLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByLocationData', {
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
          self.setState({beneficiariesManagementByLocationData: response.beneficiariesManagementByLocationData,beneficiariesManagementByLocationPages:response.pages,beneficiariesManagementByLocationTotalCount:response.totalCount,beneficiariesManagementByLocationFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByLocationLoading: false });
          self.generateBeneficiariesManagementByLocationXLSX();
      });
        
  }

  getBeneficiariesManagementByClinicData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ beneficiariesManagementByClinicLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getBeneficiariesManagementByClinicData', {
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
          self.setState({beneficiariesManagementByClinicData: response.beneficiariesManagementByClinicData,beneficiariesManagementByClinicPages:response.pages,beneficiariesManagementByClinicTotalCount:response.totalCount,beneficiariesManagementByClinicFileQuery:response.fileQuery});
          self.setState({ beneficiariesManagementByClinicLoading: false });
          esManagementByClinicXLSX();
      });
        
  }

    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_beneficiariesManagement() {

    var propertiesArr = [];

    if(self.state.showPlanName_beneficiariesManagement)
      propertiesArr.push("Plan Name");
    if(self.state.showHicn_beneficiariesManagement)
      propertiesArr.push("HICN/ Subscriber ID");
    if(self.state.showPatientName_beneficiariesManagement)
      propertiesArr.push("Patient Name");
    if(self.state.showDob_beneficiariesManagement)
      propertiesArr.push("DOB");
    if(self.state.showEligibleMonth_beneficiariesManagement)
      propertiesArr.push("Eligible Month");
    if(self.state.showTermedMonth_beneficiariesManagement)
      propertiesArr.push("Termed Month");
    if(self.state.showPcpName_beneficiariesManagement)
      propertiesArr.push("PCP Name");
    if(self.state.showPcpLocation_beneficiariesManagement)
      propertiesArr.push("PCP Location");
    if(self.state.showMra_beneficiariesManagement)
      propertiesArr.push("MRA");
    if(self.state.showTotalCost_beneficiariesManagement)
      propertiesArr.push("Total Cost");
    if(self.state.showAddress_beneficiariesManagement)
      propertiesArr.push("Address");
    if(self.state.showRecentAppointmentDate_beneficiariesManagement)
      propertiesArr.push("Recent Appointment Date");
    if(self.state.showNextAppointmentDate_beneficiariesManagement)
      propertiesArr.push("Next Appointment Date");
    if(self.state.showFacilityLocation_beneficiariesManagement)
      propertiesArr.push("Facility Location");
    if(self.state.showPhoneNumber_beneficiariesManagement)
      propertiesArr.push("Phone Number");
    if(self.state.showLastClaimsDate_beneficiariesManagement)
      propertiesArr.push("Last Claims Date");
    if(self.state.showIcdCode_beneficiariesManagement)
      propertiesArr.push("ICD 9/10 Code");
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report", documentTitle:"Print- Beneficiaries Management Report", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
  }
  printTableData_beneficiariesManagementByClinic() {

    var propertiesArr = [];
    
    if(self.state.showClinicName_beneficiariesManagementByClinic)
      propertiesArr.push("Clinic Name");
    if(self.state.showTotalCost_beneficiariesManagementByClinic)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByClinicDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Clinic", documentTitle:"Print- Beneficiaries Management Report By Clinic ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
  }
  printTableData_beneficiariesManagementByLocation() {

    var propertiesArr = [];

    
    if(self.state.showPcpLocation_beneficiariesManagementByLocation)
      propertiesArr.push("PCP Location");
    if(self.state.showMra_beneficiariesManagementByLocation)
      propertiesArr.push("Average MRA");
    if(self.state.showTotalCost_beneficiariesManagementByLocation)
      propertiesArr.push("Total Cost");
   
    
    const formData = new FormData();
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);

    fetch(config.serverUrl+'/getBeneficiariesManagementByLocationDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management Report By Location", documentTitle:"Print- Beneficiaries Management Report By Location ", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

 printTableData_beneficiariesManagementByDoctor() {

  var propertiesArr = [];

  if(self.state.showPcpName_beneficiariesManagementByDoctor)
    propertiesArr.push("PCP Name");
  if(self.state.showPcpLocation_beneficiariesManagementByDoctor)
    propertiesArr.push("PCP Location");
  if(self.state.showAverageMra_beneficiariesManagementByDoctor)
    propertiesArr.push("Average MRA");
  if(self.state.showTotalCost_beneficiariesManagementByDoctor)
    propertiesArr.push("Total Cost");
  
  const formData = new FormData();
  formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);

  fetch(config.serverUrl+'/getBeneficiariesManagementByDoctorDataForPrint', {
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

    printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print- Beneficiaries Management By Doctor", documentTitle:"Print- Beneficiaries Management By Doctor", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
  
  }).catch((error) => {
    console.log(error);
  });
}

generateBeneficiariesManagementByDoctorXLSX() {
  const formData = new FormData();
  
  formData.append('fileQuery', self.state.beneficiariesManagementByDoctorFileQuery);
  formData.append('showPcpName_beneficiariesManagementByDoctor', self.state.showPcpName_beneficiariesManagementByDoctor);
  formData.append('showPcpLocation_beneficiariesManagementByDoctor', self.state.showPcpLocation_beneficiariesManagementByDoctor);
  formData.append('showAverageMra_beneficiariesManagementByDoctor', self.state.showAverageMra_beneficiariesManagementByDoctor);
  formData.append('showTotalCost_beneficiariesManagementByDoctor', self.state.showTotalCost_beneficiariesManagementByDoctor);
  
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForBeneficiariesManagementByDoctor: btoa(JSON.stringify(object))});
 }

 generateBeneficiariesManagementByLocationXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementByLocationFileQuery);
    formData.append('showPcpLocation_beneficiariesManagementByLocation', self.state.showPcpLocation_beneficiariesManagementByLocation);
    formData.append('showMra_beneficiariesManagementByLocation', self.state.showMra_beneficiariesManagementByLocation);
    formData.append('showTotalCost_beneficiariesManagementByLocation', self.state.showTotalCost_beneficiariesManagementByLocation);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagementByLocation: btoa(JSON.stringify(object))});
   }

 generateBeneficiariesManagementByClinicXLSX() {
  const formData = new FormData();
  
  formData.append('fileQuery', self.state.beneficiariesManagementByClinicFileQuery);
  formData.append('showClinicName_beneficiariesManagementByClinic', self.state.showClinicName_beneficiariesManagementByClinic);
  formData.append('showTotalCost_beneficiariesManagementByClinic', self.state.showTotalCost_beneficiariesManagementByClinic);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForBeneficiariesManagementByClinic: btoa(JSON.stringify(object))});
 }

 generateBeneficiariesManagementXLSX() {
    const formData = new FormData();
    
    formData.append('fileQuery', self.state.beneficiariesManagementFileQuery);
    formData.append('showPlanName_beneficiariesManagement', self.state.showPlanName_beneficiariesManagement);
    formData.append('showHicn_beneficiariesManagement', self.state.showHicn_beneficiariesManagement);
    formData.append('showPatientName_beneficiariesManagement', self.state.showPatientName_beneficiariesManagement);
    formData.append('showDob_beneficiariesManagement', self.state.showDob_beneficiariesManagement);
    formData.append('showEligibleMonth_beneficiariesManagement', self.state.showEligibleMonth_beneficiariesManagement);
    formData.append('showTermedMonth_beneficiariesManagement', self.state.showTermedMonth_beneficiariesManagement);
    formData.append('showPcpName_beneficiariesManagement', self.state.showPcpName_beneficiariesManagement);
    formData.append('showPcpLocation_beneficiariesManagement', self.state.showPcpLocation_beneficiariesManagement);
    formData.append('showMra_beneficiariesManagement', self.state.showMra_beneficiariesManagement);
    formData.append('showTotalCost_beneficiariesManagement', self.state.showTotalCost_beneficiariesManagement);
    formData.append('showAddress_beneficiariesManagement', self.state.showAddress_beneficiariesManagement);
    formData.append('showRecentAppointmentDate_beneficiariesManagement', self.state.showRecentAppointmentDate_beneficiariesManagement);
    formData.append('showNextAppointmentDate_beneficiariesManagement', self.state.showNextAppointmentDate_beneficiariesManagement);
    formData.append('showFacilityLocation_beneficiariesManagement', self.state.showFacilityLocation_beneficiariesManagement);
    formData.append('showPhoneNumber_beneficiariesManagement', self.state.showPhoneNumber_beneficiariesManagement);
    formData.append('showLastClaimsDate_beneficiariesManagement', self.state.showLastClaimsDate_beneficiariesManagement);
    formData.append('showIcdCode_beneficiariesManagement', self.state.showIcdCode_beneficiariesManagement);

      var object = {};
      formData.forEach(function(value, key){
          object[key] = value;
      });
      
      self.setState({jsonDataForBeneficiariesManagement: btoa(JSON.stringify(object))});
   }

  getBeneficiariesManagementDataRow(rowInfo) {
    localStorage.setItem('beneficiariesManagementSelectedMedicareId',rowInfo.row.medicareId);
    window.location.href = "#/beneficiariesReportByPatientDetails";
    }
    
    getBeneficiariesManagementByClinicDataRow(rowInfo)
    {
       localStorage.setItem('beneficiariesManagementSelectedClinicName',rowInfo.row.clinicName);
      window.location.href = "#/beneficiariesReportByClinicDetails";
  }
  getBeneficiariesManagementByLocationDataRow(rowInfo)
  {
    localStorage.setItem('beneficiariesManagementSelectedPcpLocation',rowInfo.row.pcpLocation);
    window.location.href = "#/beneficiariesReportByLocationDetails";
  }
  getBeneficiariesManagementByDoctorDataRow(rowInfo) {
    localStorage.setItem('beneficiariesManagementSelectedPcpId',rowInfo.row.pcpId);
     window.location.href = "#/beneficiariesReportByDoctorDetails";
  }

  backToReports() {
    window.location.href = "#reports";
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
        if(self.state.showPlanName_beneficiariesManagement) {
          document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showHicn_beneficiariesManagement) {
          document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPatientName_beneficiariesManagement) {
          document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showDob_beneficiariesManagement) {
          document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showEligibleMonth_beneficiariesManagement) {
          document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showTermedMonth_beneficiariesManagement) {
          document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpName_beneficiariesManagement) {
          document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpLocation_beneficiariesManagement) {
          document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showMra_beneficiariesManagement) {
          document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showTotalCost_beneficiariesManagement) {
          document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showAddress_beneficiariesManagement) {
          document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showRecentAppointmentDate_beneficiariesManagement) {
          document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showNextAppointmentDate_beneficiariesManagement) {
          document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showFacilityLocation_beneficiariesManagement) {
          document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPhoneNumber_beneficiariesManagement) {
          document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showLastClaimsDate_beneficiariesManagement) {
          document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showIcdCode_beneficiariesManagement) {
          document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpName_beneficiariesManagementByDoctor) {
          document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpLocation_beneficiariesManagementByDoctor) {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showAverageMra_beneficiariesManagementByDoctor) {
          document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showTotalCost_beneficiariesManagementByDoctor) {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showPcpLocation_beneficiariesManagementByLocation) {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showMra_beneficiariesManagementByLocation) {
          document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showTotalCost_beneficiariesManagementByLocation) {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showClinicName_beneficiariesManagementByClinic) {
          document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "#d03b3cfa ";
        }
        if(self.state.showTotalCost_beneficiariesManagementByClinic) {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "#d03b3cfa ";
        }
      }
    }, 300);
  }

  showHideColumn_beneficiariesManagementByDoctor(columnName) {
    
    if(columnName == "pcpName") {
      this.state.showPcpName_beneficiariesManagementByDoctor = !this.state.showPcpName_beneficiariesManagementByDoctor;
    }
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_beneficiariesManagementByDoctor = !this.state.showPcpLocation_beneficiariesManagementByDoctor;
    }
    if(columnName == "averageMra") {
      this.state.showAverageMra_beneficiariesManagementByDoctor = !this.state.showAverageMra_beneficiariesManagementByDoctor;
    }
    if(columnName == "totalCost") {
      this.state.showTotalCost_beneficiariesManagementByDoctor = !this.state.showTotalCost_beneficiariesManagementByDoctor;
    }
    
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            if(self.state.showPcpName_beneficiariesManagementByDoctor) {
              document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpName_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showPcpLocation_beneficiariesManagementByDoctor) {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemPcpLocation_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showAverageMra_beneficiariesManagementByDoctor) {
              document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemAverageMra_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
            }
            if(self.state.showTotalCost_beneficiariesManagementByDoctor) {
              document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemTotalCost_beneficiariesManagementByDoctor").style.backgroundColor = "#d03b3cfa ";
            }
            
            self.generateBeneficiariesManagementByDoctorXLSX();

 }
 showHideColumn_beneficiariesManagement(columnName) {
    
  if(columnName == "planName") {
    this.state.showPlanName_beneficiariesManagement = !this.state.showPlanName_beneficiariesManagement;
  }
  if(columnName == "hicn") {
    this.state.showHicn_beneficiariesManagement = !this.state.showHicn_beneficiariesManagement;
  }
  if(columnName == "patientName") {
    this.state.showPatientName_beneficiariesManagement = !this.state.showPatientName_beneficiariesManagement;
  }
  if(columnName == "dob") {
    this.state.showDob_beneficiariesManagement = !this.state.showDob_beneficiariesManagement;
  }
  if(columnName == "eligibleMonth") {
    this.state.showEligibleMonth_beneficiariesManagement = !this.state.showEligibleMonth_beneficiariesManagement;
  }
  if(columnName == "termedMonth") {
    this.state.showTermedMonth_beneficiariesManagement = !this.state.showTermedMonth_beneficiariesManagement;
  }
  if(columnName == "pcpName") {
    this.state.showPcpName_beneficiariesManagement = !this.state.showPcpName_beneficiariesManagement;
  }
  if(columnName == "pcpLocation") {
    this.state.showPcpLocation_beneficiariesManagement = !this.state.showPcpLocation_beneficiariesManagement;
  }
  if(columnName == "mra") {
    this.state.showMra_beneficiariesManagement = !this.state.showMra_beneficiariesManagement;
  }
  if(columnName == "totalCost") {
    this.state.showTotalCost_beneficiariesManagement = !this.state.showTotalCost_beneficiariesManagement;
  }
  if(columnName == "address") {
    this.state.showAddress_beneficiariesManagement = !this.state.showAddress_beneficiariesManagement;
  }
  if(columnName == "recentAppointmentDate") {
    this.state.showRecentAppointmentDate_beneficiariesManagement = !this.state.showRecentAppointmentDate_beneficiariesManagement;
  }
  if(columnName == "nextAppointmentDate") {
    this.state.showNextAppointmentDate_beneficiariesManagement = !this.state.showNextAppointmentDate_beneficiariesManagement;
  }
  if(columnName == "facilityLocation") {
    this.state.showFacilityLocation_beneficiariesManagement = !this.state.showFacilityLocation_beneficiariesManagement;
  }
  if(columnName == "phoneNumber") {
    this.state.showPhoneNumber_beneficiariesManagement = !this.state.showPhoneNumber_beneficiariesManagement;
  }
  if(columnName == "lastClaimsDate") {
    this.state.showLastClaimsDate_beneficiariesManagement = !this.state.showLastClaimsDate_beneficiariesManagement;
  }
  if(columnName == "icdCode") {
    this.state.showIcdCode_beneficiariesManagement = !this.state.showIcdCode_beneficiariesManagement;
  }

  const newArray = this.state.dropdownOpen.map((element, index) => {
    return (index === 0 ? true : false);
  });
  this.setState({
    dropdownOpen: newArray
  });

          if(self.state.showPlanName_beneficiariesManagement) {
            document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPlanName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showHicn_beneficiariesManagement) {
            document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemHicn_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showPatientName_beneficiariesManagement) {
            document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPatientName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showDob_beneficiariesManagement) {
            document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemDob_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showEligibleMonth_beneficiariesManagement) {
            document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemEligibleMonth_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showTermedMonth_beneficiariesManagement) {
            document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTermedMonth_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showPcpName_beneficiariesManagement) {
            document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpName_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showPcpLocation_beneficiariesManagement) {
            document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPcpLocation_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showMra_beneficiariesManagement) {
            document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemMra_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showTotalCost_beneficiariesManagement) {
            document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemTotalCost_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showAddress_beneficiariesManagement) {
            document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemAddress_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showRecentAppointmentDate_beneficiariesManagement) {
            document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemRecentAppointmentDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showNextAppointmentDate_beneficiariesManagement) {
            document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemNextAppointmentDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showFacilityLocation_beneficiariesManagement) {
            document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemFacilityLocation_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showPhoneNumber_beneficiariesManagement) {
            document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemPhoneNumber_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showLastClaimsDate_beneficiariesManagement) {
            document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemLastClaimsDate_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }
          if(self.state.showIcdCode_beneficiariesManagement) {
            document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "";
          } else {
            document.getElementById("ddItemIcdCode_beneficiariesManagement").style.backgroundColor = "#d03b3cfa ";
          }

          self.generateBeneficiariesManagementXLSX();

}
showHideColumn_beneficiariesManagementByLocation(columnName){
  if(columnName == "pcpLocation") {
    this.state.showPcpLocation_beneficiariesManagementByLocation = !this.state.showPcpLocation_beneficiariesManagementByLocation;
  }
  if(columnName == "mra") {
    this.state.showMra_beneficiariesManagementByLocation = !this.state.showMra_beneficiariesManagementByLocation;
  }
  if(columnName == "totalCost") {
    this.state.showTotalCost_beneficiariesManagementByLocation = !this.state.showTotalCost_beneficiariesManagementByLocation;
  }
  
  const newArray = this.state.dropdownOpen.map((element, index) => {
    return (index === 0 ? true : false);
  });
  this.setState({
    dropdownOpen: newArray
  });

  if(self.state.showPcpLocation_beneficiariesManagementByLocation) {
    document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "";
  } else {
    document.getElementById("ddItemPcpLocation_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
  }
  if(self.state.showMra_beneficiariesManagementByLocation) {
    document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "";
  } else {
    document.getElementById("ddItemMra_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
  }
  if(self.state.showTotalCost_beneficiariesManagementByLocation) {
    document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "";
  } else {
    document.getElementById("ddItemTotalCost_beneficiariesManagementByLocation").style.backgroundColor = "#d03b3cfa ";
  }
  self.generateBeneficiariesManagementByLocationXLSX();
 }
 showHideColumn_beneficiariesManagementByClinic(columnName) {

  if(columnName == "clinicName") {
    this.state.showClinicName_beneficiariesManagementByClinic = !this.state.showClinicName_beneficiariesManagementByClinic;
  }
  if(columnName == "totalCost") {
    this.state.showTotalCost_beneficiariesManagementByClinic = !this.state.showTotalCost_beneficiariesManagementByClinic;
  }
  
  const newArray = this.state.dropdownOpen.map((element, index) => {
    return (index === 0 ? true : false);
  });
  this.setState({
    dropdownOpen: newArray
  });

  if(self.state.showClinicName_beneficiariesManagementByClinic) {
    document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "";
  } else {
    document.getElementById("ddItemClinicName_beneficiariesManagementByClinic").style.backgroundColor = "#d03b3cfa ";
  }
  if(self.state.showTotalCost_beneficiariesManagementByClinic) {
    document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "";
  } else {
    document.getElementById("ddItemTotalCost_beneficiariesManagementByClinic").style.backgroundColor = "#d03b3cfa ";
  }
  self.generateBeneficiariesManagementByClinicXLSX();

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
            <h2>Beneficiaries Management Report - Details</h2>
          </FormGroup>
          <FormGroup check inline>
            <img id="uploadButton" onClick={this.exportModelToggle} src="/img/upload-header-button.png" />
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
            <Nav tabs>
              
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggleReportsTab('1'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Patients</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggleReportsTab('2'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Doctors</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '3' })}
                        onClick={() => { this.toggleReportsTab('3'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Location</b></Label>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '4' })}
                        onClick={() => { this.toggleReportsTab('4'); }}
                      >
                        <Label className="commonFontFamilyColor"><b>By Clinic</b></Label>
                </NavLink>
                
              </NavItem>
              <Col>
              <FormGroup check inline style={{ float: "right" }}>
            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                              <DropdownToggle style={{backgroundColor:"#f7f3f0",borderColor:"#f7f3f0",padding:"0rem 0rem"}}>
                                  <i class="icon-grid icons font-2xl d-block" title="More" style={{cursor:"pointer",color:"rgba(208, 82, 89, 0.95)",position:"absolute" }}></i>
                                  
                                </DropdownToggle>
                <DropdownMenu tabId="1">
                <TabContent activeTab={this.state.activeTab} style={{padding: "0rem !important"}}>
              <TabPane tabId="1"  style={{padding: 0}}>
                                  <DropdownItem toggle={false} id="ddItemPlanName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("planName")}>Plan Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHicn_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("hicn")}>HICN/ Subscriber ID</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPatientName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("patientName")}>Patient Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDob_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("dob")}>DOB</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemEligibleMonth_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("eligibleMonth")}>Eligible Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTermedMonth_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("termedMonth")}>Termed Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("mra")}>MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("totalCost")}>Total Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAddress_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("address")}>Address</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRecentAppointmentDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("recentAppointmentDate")}>Recent Appointment Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemNextAppointmentDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("nextAppointmentDate")}>Next Appointment Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemFacilityLocation_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("facilityLocation")}>Facility Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPhoneNumber_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("phoneNumber")}>Phone Number</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemLastClaimsDate_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("lastClaimsDate")}>Last Claims Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCode_beneficiariesManagement" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagement("icdCode")}>ICD 9/10 Code</DropdownItem>
                    </TabPane>
                    <TabPane tabId="2" style={{padding: 0}}>
                                 <DropdownItem toggle={false} id="ddItemPcpName_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("pcpName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemAverageMra_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("averageMra")}>Average MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByDoctor" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByDoctor("totalCost")}>Total Cost</DropdownItem>
                                  
                    </TabPane>
                    <TabPane tabId="3" style={{padding: 0}}>
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMra_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("mra")}>Average MRA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByLocation" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByLocation("totalCost")}>Total Cost</DropdownItem>
                    </TabPane>
                    <TabPane tabId="4" style={{padding: 0}}>
                                  <DropdownItem toggle={false} id="ddItemClinicName_beneficiariesManagementByClinic" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinic("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalCost_beneficiariesManagementByClinic" className="commonFontFamily" onClick={e => self.showHideColumn_beneficiariesManagementByClinic("totalCost")}>Total Cost</DropdownItem>
                    </TabPane>
                    </TabContent>
                  
                                </DropdownMenu>
                  </Dropdown>
         
              </FormGroup>
                         </Col>     
            </Nav>
            
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                <ReactTable
                              manual
                              data={this.state.beneficiariesManagementData}
                              loading={this.state.beneficiariesManagementLoading}
                              pages={this.state.beneficiariesManagementPages} // Display the total number of pages
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
                                      show: this.state.showPlanName_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HICN/SubscriberID",
                                      accessor: "hicn",
                                      show: this.state.showHicn_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Patient Name",
                                      accessor: "patientName",
                                      show: this.state.showPatientName_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DOB",
                                      accessor: "dob",
                                      show: this.state.showDob_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Eligible Month",
                                      accessor: "eligibleMonth",
                                      show: this.state.showEligibleMonth_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Termed Month",
                                      accessor: "termedMonth",
                                      show: this.state.showTermedMonth_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Address",
                                      accessor: "address",
                                      show: this.state.showAddress_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Recent Appointment Date",
                                      accessor: "recentAppointmentDate",
                                      show: this.state.showRecentAppointmentDate_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Next Appointment Date",
                                      accessor: "nextAppointmentDate",
                                      show: this.state.showNextAppointmentDate_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Facility Location",
                                      accessor: "facilityLocation",
                                      show: this.state.showFacilityLocation_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Phone Number",
                                      accessor: "phoneNumber",
                                      show: this.state.showPhoneNumber_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Last Claims Date",
                                      accessor: "lastClaimsDate",
                                      show: this.state.showLastClaimsDate_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD 9/10 Code",
                                      accessor: "icdCode",
                                      show: this.state.showIcdCode_beneficiariesManagement,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Medicare ID",
                                      accessor: "medicareId",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Prem",
                                      accessor: "reinsurancePrem",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "RX Claims",
                                      accessor: "rxClaims",
                                      show: false,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementTotalCount+', Page'}
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
                                      if(column.Header == "Patient Name") {
                                        self.getBeneficiariesManagementDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Patient Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Patient Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />

                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByDoctorData}
                              loading={this.state.beneficiariesManagementByDoctorLoading}
                              pages={this.state.beneficiariesManagementByDoctorPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Name", 
                                      accessor: "pcpName",
                                      show: this.state.showPcpName_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "averageMra",
                                      show: this.state.showAverageMra_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                      show: this.state.showTotalCost_beneficiariesManagementByDoctor,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaims+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP ID",
                                      accessor: "pcpId",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Prem",
                                      accessor: "reinsurancePrem",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "RX Claims",
                                      accessor: "rxClaims",
                                      show: false,
                                     headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByDoctor}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByDoctorTotalCount+', Page'}
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
                                      if(column.Header == "PCP Name") {
                                        self.getBeneficiariesManagementByDoctorDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Name" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByLocationData}
                              loading={this.state.beneficiariesManagementByLocationLoading}
                              pages={this.state.beneficiariesManagementByLocationPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "PCP Location",
                                      accessor: "pcpLocation",
                                      show: this.state.showPcpLocation_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                      
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Average MRA",
                                      accessor: "mra",
                                      show: this.state.showMra_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                       show: this.state.showTotalCost_beneficiariesManagementByLocation,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      Cell: row => <div>
                                                        <span title={"Spec Cost : "+row.original.specCost+"\n"+
                                                                      "PCP Cap : "+row.original.pcpCap+"\n"+
                                                                      "ReinsurancePrem : "+row.original.reinsurancePrem+"\n"+
                                                                      "Inst Claims : "+row.original.instClaim+"\n"+
                                                                      "Prof Claims : "+row.original.profClaims+"\n"+
                                                                      "RX Claims : "+row.original.rxClaims+"\n"
                                                      }>{row.value}</span>
                                                        
                                                  </div>,
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByLocation}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByLocationTotalCount+', Page'}
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
                                      if(column.Header == "PCP Location") {
                                         self.getBeneficiariesManagementByLocationDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "PCP Location" ? "#337ab7" : "",
                                      cursor: column.Header === "PCP Location" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                </Row>

              </TabPane>
              <TabPane tabId="4"> 
                <Row>
                <ReactTable
                              manual
                              data={this.state.beneficiariesManagementByClinicData}
                              loading={this.state.beneficiariesManagementByClinicLoading}
                              pages={this.state.beneficiariesManagementByClinicPages} // Display the total number of pages
                              filterable
                              defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                              columns={[
                                {
                                  Header: "",
                                  columns: [
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_beneficiariesManagementByClinic,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Cost",
                                      accessor: "totalCost",
                                       show: this.state.showTotalCost_beneficiariesManagementByClinic,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Id",
                                      accessor: "clinicId",
                                       show: false,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchBeneficiariesManagementDataByClinic}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.beneficiariesManagementByClinicTotalCount+', Page'}
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
                                      if(column.Header == "Clinic Name") {
                                     self.getBeneficiariesManagementByClinicDataRow(rowInfo);

                                      }
                                    },
                                    style: {
                                      color: column.Header === "Clinic Name" ? "#337ab7" : "",
                                      cursor: column.Header === "Clinic Name" ? "pointer" : ""
                                    }
                                  }
                                }}
                            />
                </Row>
              </TabPane>
              </TabContent>
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
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
          <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagement()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementXLSX/'+self.state.jsonDataForBeneficiariesManagement} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementPDF/'+self.state.jsonDataForBeneficiariesManagement} target="_blank" >
                    <img id="pdfButton" src="/img/pdfButton.png" />
                    </a>
                    <p id="text-align-pdf">Pdf</p>
              </FormGroup>
                </Row>
              </TabPane>
              <TabPane tabId="2">
              <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByDoctor()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorXLSX/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByDoctorPDF/'+self.state.jsonDataForBeneficiariesManagementByDoctor} target="_blank" >
                    <img id="pdfButton" src="/img/pdfButton.png" />
                    </a>
                    <p id="text-align-pdf">Pdf</p>
              </FormGroup>
            </Row>
              </TabPane>
              <TabPane tabId="3">
              <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByLocation()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationXLSX/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByLocationPDF/'+self.state.jsonDataForBeneficiariesManagementByLocation} target="_blank" >
                    <img id="pdfButton" src="/img/pdfButton.png" />
                    </a>
                    <p id="text-align-pdf">Pdf</p>
              </FormGroup>
            </Row>
              </TabPane>
              <TabPane tabId="4">
              <Row>
                <FormGroup check inline>
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_beneficiariesManagementByClinic()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicXLSX/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderBeneficiariesManagementByClinicPDF/'+self.state.jsonDataForBeneficiariesManagementByClinic} target="_blank" >
                    <img id="pdfButton" src="/img/pdfButton.png" />
                    </a>
                    <p id="text-align-pdf">Pdf</p>
              </FormGroup>
            </Row>
              </TabPane>

              
              </TabContent>
          <Row>
        </Row>
      </ModalBody>
    </Modal>

    </React.Fragment>
  );
  }
}
export default BeneficiariesReportByPatient;
