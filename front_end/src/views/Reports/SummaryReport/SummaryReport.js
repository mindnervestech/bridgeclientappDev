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

class SummaryReport extends Component {

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
      
        summaryReportLoading: false,
        summaryReportPages: 0,
        summaryReportData: [],
        summaryReportTotalCount: 0,
      summaryReportFileQuery: "",
      dropdownOpen: new Array(1).fill(false),
      
        showPcpLocation_summary: false,
        showMonth_summary: true,
        showMembers_summary: true,
        showMaPremium_summary: true,
        showPartDPremium_summary: true,
        showTotalPremium_summary: true,
        showIpaPremium_summary: true,
        showPcpCap_summary: true,
        showSpecCost_summary: true,
        showProfClaims_summary: true,
        showInstClaims_summary: true,
        showRxClaims_summary: true,
        showIbnrDollars_summary: true,
        showReinsurancePremium_summary: true,
        showSpecCap_summary: true,
        showTotalExpenses_summary: true,
        showReinsuranceRecovered_summary: true,
        showRxAdmin_summary: true,
        showSilverSneakerUtilization_summary: true,
        showPba_summary: true,
        showHumanaAtHome_summary: true,
        showDentalFFS_summary: true,
  
      
      exportModeltoggleView: false,
      
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };

      
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.fetchSummaryReportData = this.fetchSummaryReportData.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.getPCPForProviders = this.getPCPForProviders.bind(this);

    this.fetchSummaryReportData = debounce(this.fetchSummaryReportData,500);
  }

  componentDidMount() {

    fetch(config.serverUrl + '/getAllPlanAndPCP', {
      method: 'GET'
    }).then(function (res1) {
      return res1.json();
    }).then(function (response) {
      self.setState({ providerList: response.planList, yearsList:response.yearsList});
     
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
    localStorage.setItem('provider', JSON.stringify(e));
      setTimeout(function () {
        self.getSummaryReportData(self.state.summaryGridPageSize, 1, JSON.stringify(self.state.summaryGridSorted),JSON.stringify(self.state.summaryGridFiltered))
    }, 1000);
  }
  setYearValue(e) {
    self.state.yearSelectValue = e;
    localStorage.setItem('year', JSON.stringify(e));
    self.getSummaryReportData(self.state.summaryGridPageSize, 1, JSON.stringify(self.state.summaryGridSorted),JSON.stringify(self.state.summaryGridFiltered));
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
        pcpList: self.state.pcpList.concat({ value: 'all', label: 'All' }),
      });
      self.state.pcpNameValue = { value: 'all', label: 'All' };
      localStorage.setItem('pcpList',JSON.stringify(self.state.pcpList));
    });
  }


  fetchSummaryReportData(state, instance) {
    var page = state.page + 1;
    self.state.summaryGridPage = page;
    self.state.summaryGridPageSize = state.pageSize;
    self.state.summaryGridSorted = state.sorted;
    self.state.summaryGridFiltered = state.filtered;
    self.getSummaryReportData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }


  getSummaryReportData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ summaryReportLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);

      fetch(config.serverUrl+'/getSummaryReportData', {
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
          self.setState({summaryReportData: response.summaryReportData,summaryReportPages:response.pages,summaryReportTotalCount:response.totalCount,summaryReportFileQuery:response.fileQuery});
          self.setState({ summaryReportLoading: false });
          self.generateSummaryReportXLSX();
      });
        
  }
    
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_summaryReport() {

    var propertiesArr = [];

    if(self.state.showPcpLocation_summary)
      propertiesArr.push("PCP Location");
    if(self.state.showMonth_summary)
      propertiesArr.push("Month");
    if(self.state.showMembers_summary)
      propertiesArr.push("Members");
    if(self.state.showMaPremium_summary)
      propertiesArr.push("Ma Premium");
    if(self.state.showPartDPremium_summary)
      propertiesArr.push("Part D Premium");
    if(self.state.showTotalPremium_summary)
      propertiesArr.push("Total Premium");
    if(self.state.showIpaPremium_summary)
      propertiesArr.push("IPA Premium");
    if(self.state.showPcpCap_summary)
      propertiesArr.push("PCP Cap");
    if(self.state.showSpecCost_summary)
      propertiesArr.push("Spec Cost");
    if(self.state.showProfClaims_summary)
      propertiesArr.push("Prof Claims");
    if(self.state.showInstClaims_summary)
      propertiesArr.push("Inst Claims");
    if(self.state.showRxClaims_summary)
      propertiesArr.push("Rx Claims");
    if(self.state.showIbnrDollars_summary)
      propertiesArr.push("IBNR Dollars");
    if(self.state.showReinsurancePremium_summary)
      propertiesArr.push("Reinsurance Premium");
    if(self.state.showSpecCap_summary)
      propertiesArr.push("Spec Cap");
    if(self.state.showTotalExpenses_summary)
      propertiesArr.push("Total Expenses");
    if(self.state.showReinsuranceRecovered_summary)
      propertiesArr.push("Reinsurance Recovered");
    if(self.state.showRxAdmin_summary)
      propertiesArr.push("Rx Admin");
    if(self.state.showSilverSneakerUtilization_summary)
      propertiesArr.push("Silver Sneaker Utilization");
    if(self.state.showPba_summary)
      propertiesArr.push("PBA");
    if(self.state.showHumanaAtHome_summary)
      propertiesArr.push("Humana At Home");
    if(self.state.showDentalFFS_summary)
      propertiesArr.push("Dental FFS");

    const formData = new FormData();
    formData.append('fileQuery', self.state.summaryReportFileQuery);

    fetch(config.serverUrl+'/getSummaryReportDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Summary Report Search", documentTitle:"Print-Summary Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }


  

 generateSummaryReportXLSX() {
    const formData = new FormData();
 
  formData.append('fileQuery', self.state.summaryReportFileQuery);

  formData.append('showPcpLocation_summary', self.state.showPcpLocation_summary);
  formData.append('showMonth_summary', self.state.showMonth_summary);
  formData.append('showMembers_summary', self.state.showMembers_summary);
  formData.append('showMaPremium_summary', self.state.showMaPremium_summary);
  formData.append('showPartDPremium_summary', self.state.showPartDPremium_summary);
  formData.append('showTotalPremium_summary', self.state.showTotalPremium_summary);
  formData.append('showIpaPremium_summary', self.state.showIpaPremium_summary);
  formData.append('showPcpCap_summary', self.state.showPcpCap_summary);
  formData.append('showSpecCost_summary', self.state.showSpecCost_summary);
  formData.append('showProfClaims_summary', self.state.showProfClaims_summary);
  formData.append('showInstClaims_summary', self.state.showInstClaims_summary);
  formData.append('showRxClaims_summary', self.state.showRxClaims_summary);
  formData.append('showIbnrDollars_summary', self.state.showIbnrDollars_summary);
  formData.append('showReinsurancePremium_summary', self.state.showReinsurancePremium_summary);
  formData.append('showSpecCap_summary', self.state.showSpecCap_summary);
  formData.append('showTotalExpenses_summary', self.state.showTotalExpenses_summary);
  formData.append('showReinsuranceRecovered_summary', self.state.showReinsuranceRecovered_summary);
  formData.append('showRxAdmin_summary', self.state.showRxAdmin_summary);
  formData.append('showSilverSneakerUtilization_summary', self.state.showSilverSneakerUtilization_summary);
  formData.append('showPba_summary', self.state.showPba_summary);
  formData.append('showHumanaAtHome_summary', self.state.showHumanaAtHome_summary);
  formData.append('showDentalFFS_summary', self.state.showDentalFFS_summary);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForSummaryReport: btoa(JSON.stringify(object))});
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
        if(self.state.showPcpLocation_summary) {
          document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMonth_summary) {
          document.getElementById("ddItemMonth_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMonth_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMembers_summary) {
          document.getElementById("ddItemMembers_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMembers_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMaPremium_summary) {
          document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPartDPremium_summary) {
          document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalPremium_summary) {
          document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIpaPremium_summary) {
          document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpCap_summary) {
          document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecCost_summary) {
          document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showProfClaims_summary) {
          document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showInstClaims_summary) {
          document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showRxClaims_summary) {
          document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIbnrDollars_summary) {
          document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showReinsurancePremium_summary) {
          document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecCap_summary) {
          document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalExpenses_summary) {
          document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showReinsuranceRecovered_summary) {
          document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showRxAdmin_summary) {
          document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSilverSneakerUtilization_summary) {
          document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPba_summary) {
          document.getElementById("ddItemPba_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPba_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHumanaAtHome_summary) {
          document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDentalFFS_summary) {
          document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "#d03b3c";
        }
      }
    }, 300);
  }
  showHideColumn_summary(columnName) {
    
    if(columnName == "pcpLocation") {
      this.state.showPcpLocation_summary = !this.state.showPcpLocation_summary;
    }
    if(columnName == "month") {
      this.state.showMonth_summary = !this.state.showMonth_summary;
    }
    if(columnName == "members") {
      this.state.showMembers_summary = !this.state.showMembers_summary;
    }
    if(columnName == "maPremium") {
      this.state.showMaPremium_summary = !this.state.showMaPremium_summary;
    }
    if(columnName == "partDPremium") {
      this.state.showPartDPremium_summary = !this.state.showPartDPremium_summary;
    }
    if(columnName == "totalPremium") {
      this.state.showTotalPremium_summary = !this.state.showTotalPremium_summary;
    }
    if(columnName == "ipaPremium") {
      this.state.showIpaPremium_summary = !this.state.showIpaPremium_summary;
    }
    if(columnName == "pcpCap") {
      this.state.showPcpCap_summary = !this.state.showPcpCap_summary;
    }
    if(columnName == "specCost") {
      this.state.showSpecCost_summary = !this.state.showSpecCost_summary;
    }
    if(columnName == "profClaims") {
      this.state.showProfClaims_summary = !this.state.showProfClaims_summary;
    }
    if(columnName == "instClaims") {
      this.state.showInstClaims_summary = !this.state.showInstClaims_summary;
    }
    if(columnName == "rxClaims") {
      this.state.showRxClaims_summary = !this.state.showRxClaims_summary;
    }
    if(columnName == "ibnrDollars") {
      this.state.showIbnrDollars_summary = !this.state.showIbnrDollars_summary;
    }
    if(columnName == "reinsurancePremium") {
      this.state.showReinsurancePremium_summary = !this.state.showReinsurancePremium_summary;
    }
    if(columnName == "specCap") {
      this.state.showSpecCap_summary = !this.state.showSpecCap_summary;
    }
    if(columnName == "totalExpenses") {
      this.state.showTotalExpenses_summary = !this.state.showTotalExpenses_summary;
    }
    if(columnName == "reinsuranceRecovered") {
      this.state.showReinsuranceRecovered_summary = !this.state.showReinsuranceRecovered_summary;
    }
    if(columnName == "rxAdmin") {
      this.state.showRxAdmin_summary = !this.state.showRxAdmin_summary;
    }
    if(columnName == "silverSneakerUtilization") {
      this.state.showSilverSneakerUtilization_summary = !this.state.showSilverSneakerUtilization_summary;
    }
    if(columnName == "pba") {
      this.state.showPba_summary = !this.state.showPba_summary;
    }
    if(columnName == "humanaAtHome") {
      this.state.showHumanaAtHome_summary = !this.state.showHumanaAtHome_summary;
    }
    if(columnName == "dentalFFS") {
      this.state.showDentalFFS_summary = !this.state.showDentalFFS_summary;
    }

    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

    if(self.state.showPcpLocation_summary) {
          document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpLocation_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMonth_summary) {
          document.getElementById("ddItemMonth_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMonth_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMembers_summary) {
          document.getElementById("ddItemMembers_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMembers_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showMaPremium_summary) {
          document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemMaPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPartDPremium_summary) {
          document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPartDPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalPremium_summary) {
          document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIpaPremium_summary) {
          document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIpaPremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPcpCap_summary) {
          document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPcpCap_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecCost_summary) {
          document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecCost_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showProfClaims_summary) {
          document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemProfClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showInstClaims_summary) {
          document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemInstClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showRxClaims_summary) {
          document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRxClaims_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showIbnrDollars_summary) {
          document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemIbnrDollars_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showReinsurancePremium_summary) {
          document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemReinsurancePremium_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSpecCap_summary) {
          document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSpecCap_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showTotalExpenses_summary) {
          document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemTotalExpenses_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showReinsuranceRecovered_summary) {
          document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemReinsuranceRecovered_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showRxAdmin_summary) {
          document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemRxAdmin_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showSilverSneakerUtilization_summary) {
          document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemSilverSneakerUtilization_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showPba_summary) {
          document.getElementById("ddItemPba_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemPba_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showHumanaAtHome_summary) {
          document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemHumanaAtHome_summary").style.backgroundColor = "#d03b3c";
        }
        if(self.state.showDentalFFS_summary) {
          document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "";
        } else {
          document.getElementById("ddItemDentalFFS_summary").style.backgroundColor = "#d03b3c";
        }

        self.generateSummaryReportXLSX();

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
            
            <h2>Summary Report</h2>
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
                                  <DropdownItem toggle={false} id="ddItemPcpLocation_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pcpLocation")}>PCP Location</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMonth_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("month")}>Month</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMembers_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("members")}>Members</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemMaPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("maPremium")}>Ma Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPartDPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("partDPremium")}>Part D Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("totalPremium")}>Total Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIpaPremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("ipaPremium")}>IPA Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPcpCap_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pcpCap")}>PCP Cap</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecCost_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("specCost")}>Spec Cost</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProfClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("profClaims")}>Prof Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemInstClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("instClaims")}>Inst Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRxClaims_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("rxClaims")}>Rx Claims</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIbnrDollars_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("ibnrDollars")}>IBNR Dollars</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemReinsurancePremium_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("reinsurancePremium")}>Reinsurance Premium</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSpecCap_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("specCap")}>Spec Cap</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemTotalExpenses_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("totalExpenses")}>Total Expenses</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemReinsuranceRecovered_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("reinsuranceRecovered")}>Reinsurance Recovered</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemRxAdmin_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("rxAdmin")}>Rx Admin</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemSilverSneakerUtilization_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("silverSneakerUtilization")}>Silver Sneaker Utilization</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemPba_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("pba")}>PBA</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHumanaAtHome_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("humanaAtHome")}>Humana at Home</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDentalFFS_summary" className="commonFontFamily" onClick={e => self.showHideColumn_summary("dentalFFS")}>Dental FFS</DropdownItem>
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
         
         
          
        </Col>
        <Col xs="12" md="9" >        

        <ReactTable
                              manual
                              data={this.state.summaryReportData}
                              loading={this.state.summaryReportLoading}
                              pages={this.state.summaryReportPages} // Display the total number of pages
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
                                      show: this.state.showPcpLocation_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Month",
                                      accessor: "month",
                                      show: this.state.showMonth_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Members",
                                      accessor: "members",
                                      show: this.state.showMembers_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Ma Premium",
                                      accessor: "maPremium",
                                      show: this.state.showMaPremium_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Part D Premium",
                                      accessor: "partDPremium",
                                      show: this.state.showPartDPremium_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Premium",
                                      accessor: "totalPremium",
                                      show: this.state.showTotalPremium_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IPA Premium",
                                      accessor: "ipaPremium",
                                      show: this.state.showIpaPremium_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Cap",
                                      accessor: "pcpCap",
                                      show: this.state.showPcpCap_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cost",
                                      accessor: "specCost",
                                      show: this.state.showSpecCost_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Prof Claims",
                                      accessor: "profClaims",
                                      show: this.state.showProfClaims_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Inst Claims",
                                      accessor: "instClaims",
                                      show: this.state.showInstClaims_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Rx Claims",
                                      accessor: "rxClaims",
                                      show: this.state.showRxClaims_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "IBNR Dollars",
                                      accessor: "ibnrDollars",
                                      show: this.state.showIbnrDollars_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance Premium",
                                      accessor: "reinsurancePremium",
                                      show: this.state.showReinsurancePremium_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Spec Cap",
                                      accessor: "specCap",
                                      show: this.state.showSpecCap_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Total Expenses",
                                      accessor: "totalExpenses",
                                      show: this.state.showTotalExpenses_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Reinsurance recovered",
                                      accessor: "reinsuranceRecovered",
                                      show: this.state.showReinsuranceRecovered_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Rx Admin",
                                      accessor: "rxAdmin",
                                      show: this.state.showRxAdmin_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Silver Sneaker Utilization",
                                      accessor: "silverSneakerUtilization",
                                      show: this.state.showSilverSneakerUtilization_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PBA",
                                      accessor: "pba",
                                      show: this.state.showPba_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Humana at Home",
                                      accessor: "humanaAtHome",
                                      show: this.state.showHumanaAtHome_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Dental FFS",
                                      accessor: "dentalFFS",
                                      show: this.state.showDentalFFS_summary,
                                      headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchSummaryReportData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.summaryReportTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_summaryReport()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSummaryReportXLSX/'+self.state.jsonDataForSummaryReport} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderSummaryReportPDF/'+self.state.jsonDataForSummaryReport} target="_blank" >
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
export default SummaryReport;
