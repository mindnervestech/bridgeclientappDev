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

class DuplicateClaimsDetails extends Component {

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
      
      duplicateClaimsExpandMedicareId:"",
      duplicateClaimsExpandFirstServiceDate:"",
      duplicateClaimsExpandServiceMonth:"",
      duplicateClaimsExpandPaidAmount:"",
      duplicateClaimsExpandClaimType: "",
      duplicateClaimsExpandLoading: false,
      dropdownOpen: new Array(1).fill(false),
      duplicateClaimsExpandPages: 0,
      duplicateClaimsExpandData: [],
      duplicateClaimsExpandTotalCount: 0,
      duplicateClaimsExpandFileQuery: "",

      
      showClaimId_duplicateClaimsExpand: true,
      showClaimDate_duplicateClaimsExpand: true,
      showClaimType_duplicateClaimsExpand: true,
      showClinicName_duplicateClaimsExpand: true,
      showProviderName_duplicateClaimsExpand: true,
      showBetosCat_duplicateClaimsExpand: true,
      showDrgCode_duplicateClaimsExpand: true,
      showIcdCodes_duplicateClaimsExpand: true,
      showHccCodes_duplicateClaimsExpand: true,
      showCost_duplicateClaimsExpand: true,
      exportModeltoggleView: false,

  
      
    };
    self = this;
    self.state.providerSelectValue = { value: 'all', label: 'All' };
    self.state.pcpNameValue = { value: 'all', label: 'All' };
    self.state.yearSelectValue = { value: 'all', label: 'All' };
        
    this.exportModelToggle = this.exportModelToggle.bind(this);
    this.backToReports = this.backToReports.bind(this);
    this.fetchDuplicateClaimsExpandData = this.fetchDuplicateClaimsExpandData.bind(this);
    this.fetchDuplicateClaimsExpandData = debounce(this.fetchDuplicateClaimsExpandData,500);
    
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
      self.state.pcpNameValue =JSON.parse(localStorage.getItem('pcpName'));
    if (localStorage.getItem('year') != null)
      self.state.yearSelectValue =JSON.parse(localStorage.getItem('year'));

    self.getDuplicateClaimReportsRowData();
  }
  getDuplicateClaimReportsRowData(rowInfo) {
    self.setState({
      duplicateClaimsExpandMedicareId: localStorage.getItem('duplicateClaimSubscriberId'),
      duplicateClaimsExpandFirstServiceDate: localStorage.getItem('duplicateClaimsExpandFirstServiceDate'),
      duplicateClaimsExpandServiceMonth: localStorage.getItem('duplicateClaimsExpandServiceMonth'),
      duplicateClaimsExpandPaidAmount: localStorage.getItem('duplicateClaimsExpandPaidAmount'),
      duplicateClaimsExpandClaimType: localStorage.getItem('duplicateClaimsExpandClaimType'),
    });

 }

  fetchDuplicateClaimsExpandData(state, instance) {
    var page = state.page + 1;
    self.getDuplicateClaimsExpandData(state.pageSize,page,JSON.stringify(state.sorted),JSON.stringify(state.filtered));
  }

  getDuplicateClaimsExpandData(pageSize,page,sortedArr,filteredArr) {
    self.setState({ duplicateClaimsExpandLoading: true });
    const formData = new FormData();

      formData.append('year', self.state.yearSelectValue.value);
      formData.append('provider', self.state.providerSelectValue.value);
      formData.append('pcpName', self.state.pcpNameValue.value);
      formData.append('pageSize', pageSize);
      formData.append('page', page);
      formData.append('sortedColumns', sortedArr);
      formData.append('filteredColumns', filteredArr);
      formData.append('medicareId', self.state.duplicateClaimsExpandMedicareId);
      formData.append('serviceMonth', self.state.duplicateClaimsExpandServiceMonth);
      formData.append('firstServiceDate', self.state.duplicateClaimsExpandFirstServiceDate);
      formData.append('paidAmount', self.state.duplicateClaimsExpandPaidAmount.substr(1));
      formData.append('claimTypeValue', self.state.duplicateClaimsExpandClaimType);


      fetch(config.serverUrl+'/getDuplicateClaimsExpandData', {
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
          self.setState({duplicateClaimsExpandData: response.duplicateClaimsExpandData,duplicateClaimsExpandPages:response.pages,duplicateClaimsExpandTotalCount:response.totalCount,duplicateClaimsExpandFileQuery:response.fileQuery});
          self.setState({ duplicateClaimsExpandLoading: false });
          self.generateDuplicateClaimsExpandXLSX();
      });
        
  }
 
  exportModelToggle() {
    this.setState({
      exportModeltoggleView : !this.state.exportModeltoggleView
    })
  }

  printTableData_duplicateClaimsExpand() {

    var propertiesArr = [];

    if(self.state.showClaimId_duplicateClaimsExpand)
      propertiesArr.push("Claim Id");
    if(self.state.showClaimDate_duplicateClaimsExpand)
      propertiesArr.push("Claim Date");
    if(self.state.showClaimType_duplicateClaimsExpand)
      propertiesArr.push("Claim Type");
    if(self.state.showClinicName_duplicateClaimsExpand)
      propertiesArr.push("Clinic Name");
    if(self.state.showProviderName_duplicateClaimsExpand)
      propertiesArr.push("PCP Name");
    if(self.state.showBetosCat_duplicateClaimsExpand)
      propertiesArr.push("Betos Cat");
    if(self.state.showDrgCode_duplicateClaimsExpand)
      propertiesArr.push("DRG Code");
    if(self.state.showIcdCodes_duplicateClaimsExpand)
      propertiesArr.push("ICD 9/10 Code(s)");
    if(self.state.showHccCodes_duplicateClaimsExpand)
      propertiesArr.push("HCC Code(s)");
    if(self.state.showCost_duplicateClaimsExpand)
      propertiesArr.push("Cost");

    const formData = new FormData();
    formData.append('fileQuery', self.state.duplicateClaimsExpandFileQuery);

    fetch(config.serverUrl+'/getDuplicateClaimsExpandDataForPrint', {
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

      printJS({printable: response, properties: propertiesArr, type: 'json', header:"Print-Admissions Report Search", documentTitle:"Print-Admissions Report Search", gridStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;text-align: center;", gridHeaderStyle:"border-collapse:collapse;border-bottom: 1px solid #DCDCDC;border-top: 1px solid #DCDCDC;"});
    
    }).catch((error) => {
      console.log(error);
    });
 }

  
 generateDuplicateClaimsExpandXLSX() {
  const formData = new FormData();
 
  formData.append('fileQuery', self.state.duplicateClaimsExpandFileQuery);
  formData.append('showClaimId_duplicateClaimsExpand', self.state.showClaimId_duplicateClaimsExpand);
  formData.append('showClaimDate_duplicateClaimsExpand', self.state.showClaimDate_duplicateClaimsExpand);
  formData.append('showClaimType_duplicateClaimsExpand', self.state.showClaimType_duplicateClaimsExpand);
  formData.append('showClinicName_duplicateClaimsExpand', self.state.showClinicName_duplicateClaimsExpand);
  formData.append('showProviderName_duplicateClaimsExpand', self.state.showProviderName_duplicateClaimsExpand);
  formData.append('showBetosCat_duplicateClaimsExpand', self.state.showBetosCat_duplicateClaimsExpand);
  formData.append('showDrgCode_duplicateClaimsExpand', self.state.showDrgCode_duplicateClaimsExpand);
  formData.append('showIcdCodes_duplicateClaimsExpand', self.state.showIcdCodes_duplicateClaimsExpand);
  formData.append('showHccCodes_duplicateClaimsExpand', self.state.showHccCodes_duplicateClaimsExpand);
  formData.append('showCost_duplicateClaimsExpand', self.state.showCost_duplicateClaimsExpand);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    
    self.setState({jsonDataForDuplicateClaimsExpand: btoa(JSON.stringify(object))});
 }

  backToReports() {
    window.location.href = "#duplicateClaimsReport";
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
      if(self.state.showClaimDate_duplicateClaimsExpand) {
        document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showClaimType_duplicateClaimsExpand) {
        document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showClinicName_duplicateClaimsExpand) {
        document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showProviderName_duplicateClaimsExpand) {
        document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showBetosCat_duplicateClaimsExpand) {
        document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showDrgCode_duplicateClaimsExpand) {
        document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showIcdCodes_duplicateClaimsExpand) {
        document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showHccCodes_duplicateClaimsExpand) {
        document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      }
      if(self.state.showCost_duplicateClaimsExpand) {
        document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "";
      } else {
        document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
      
      }
    }, 300);
  }
  showHideColumn_duplicateClaimsExpand(columnName) {
    
    if(columnName == "claimId") {
      this.state.showClaimId_duplicateClaimsExpand = !this.state.showClaimId_duplicateClaimsExpand;
    }
    if(columnName == "claimDate") {
      this.state.showClaimDate_duplicateClaimsExpand = !this.state.showClaimDate_duplicateClaimsExpand;
    }
    if(columnName == "claimType") {
      this.state.showClaimType_duplicateClaimsExpand = !this.state.showClaimType_duplicateClaimsExpand;
    }
    if(columnName == "clinicName") {
      this.state.showClinicName_duplicateClaimsExpand = !this.state.showClinicName_duplicateClaimsExpand;
    }
    if(columnName == "providerName") {
      this.state.showProviderName_duplicateClaimsExpand = !this.state.showProviderName_duplicateClaimsExpand;
    }
    if(columnName == "betosCat") {
      this.state.showBetosCat_duplicateClaimsExpand = !this.state.showBetosCat_duplicateClaimsExpand;
    }
    if(columnName == "drgCode") {
      this.state.showDrgCode_duplicateClaimsExpand = !this.state.showDrgCode_duplicateClaimsExpand;
    }
    if(columnName == "icdCodes") {
      this.state.showIcdCodes_duplicateClaimsExpand = !this.state.showIcdCodes_duplicateClaimsExpand;
    }
    if(columnName == "hccCodes") {
      this.state.showHccCodes_duplicateClaimsExpand = !this.state.showHccCodes_duplicateClaimsExpand;
    }
    if(columnName == "cost") {
      this.state.showCost_duplicateClaimsExpand = !this.state.showCost_duplicateClaimsExpand;
    }

      const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === 0 ? true : false);
    });
    this.setState({
      dropdownOpen: newArray
    });

            /*if(self.state.showClaimId_duplicateClaimsExpand) {
              document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimId_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }*/
            if(self.state.showClaimDate_duplicateClaimsExpand) {
              document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimDate_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClaimType_duplicateClaimsExpand) {
              document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClaimType_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showClinicName_duplicateClaimsExpand) {
              document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemClinicName_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showProviderName_duplicateClaimsExpand) {
              document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemProviderName_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showBetosCat_duplicateClaimsExpand) {
              document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemBetosCat_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showDrgCode_duplicateClaimsExpand) {
              document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemDrgCode_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showIcdCodes_duplicateClaimsExpand) {
              document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemIcdCodes_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showHccCodes_duplicateClaimsExpand) {
              document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemHccCodes_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }
            if(self.state.showCost_duplicateClaimsExpand) {
              document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "";
            } else {
              document.getElementById("ddItemCost_duplicateClaimsExpand").style.backgroundColor = "#d03b3c";
            }

            self.generateDuplicateClaimsExpandXLSX();
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
            
            <h2>Duplicate Claims - Details</h2>
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
                                  {/*<DropdownItem id="ddItemClaimId_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimId")}>Claim Id</DropdownItem>*/}
                                  <DropdownItem toggle={false} id="ddItemClaimDate_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimDate")}>Claim Date</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClaimType_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("claimType")}>Claim Type</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemClinicName_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("clinicName")}>Clinic Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemProviderName_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("providerName")}>PCP Name</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemBetosCat_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("betosCat")}>BetosCat</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemDrgCode_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("drgCode")}>DRG Code</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemIcdCodes_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("icdCodes")}>ICD 9/10 Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemHccCodes_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("hccCodes")}>HCC Code(s)</DropdownItem>
                                  <DropdownItem toggle={false} id="ddItemCost_duplicateClaimsExpand" className="commonFontFamily" onClick={e => self.showHideColumn_duplicateClaimsExpand("cost")}>Cost</DropdownItem>
                                </DropdownMenu>
                
                              </Dropdown>
            </FormGroup>
            </Col>
        </Row>
        <Row>
    
        <Col xs="12" md="12" >        

        <ReactTable
                              manual
                              data={this.state.duplicateClaimsExpandData}
                              loading={this.state.duplicateClaimsExpandLoading}
                              pages={this.state.duplicateClaimsExpandPages} // Display the total number of pages
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
                                      show: this.state.showClaimId_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Date",
                                      accessor: "claimDate",
                                      show: this.state.showClaimDate_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Claim Type",
                                      accessor: "claimType",
                                      show: this.state.showClaimType_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Clinic Name",
                                      accessor: "clinicName",
                                      show: this.state.showClinicName_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "PCP Name",
                                      accessor: "providerName",
                                      show: this.state.showProviderName_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Betos Cat",
                                      accessor: "betosCat",
                                      show: this.state.showBetosCat_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "DRG Code",
                                      accessor: "drgCode",
                                      show: this.state.showDrgCode_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "ICD 9/10 Code(s)",
                                      accessor: "icdCodes",
                                      show: this.state.showIcdCodes_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "HCC Code(s)",
                                      accessor: "hccCodes",
                                      show: this.state.showHccCodes_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                    {
                                      Header: "Cost",
                                      accessor: "cost",
                                      show: this.state.showCost_duplicateClaimsExpand,
                                       headerStyle: {fontWeight: "bold",color: "#ffffff", marginTop: "5px"},
                                      filterMethod: (filter, row) =>
                                        row[filter.id].startsWith(filter.value)
                                    },
                                  ]
                                }
                              ]}
                              defaultPageSize={100}
                              onFetchData={this.fetchDuplicateClaimsExpandData}
                              className="-striped -highlight commonFontFamily"
                              pageText={'Total Entries '+this.state.duplicateClaimsExpandTotalCount+', Page'}
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
                    <img id="printButton" src="/img/print-button.png" onClick={e => self.printTableData_duplicateClaimsExpand()} />
                    <p id="text-align-print">Print</p> 
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderDuplicateClaimsExpandXLSX/'+self.state.jsonDataForDuplicateClaimsExpand} target="_blank" >
                    <img id="xlsButton" src="/img/export-doc.png" />
                    </a>
                    <p id="text-align-doc">Doc</p>
                </FormGroup>
                <FormGroup check inline>
                    <a href={config.serverUrl+'/renderDuplicateClaimsExpandPDF/'+self.state.jsonDataForDuplicateClaimsExpand} target="_blank" >
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
export default DuplicateClaimsDetails;
