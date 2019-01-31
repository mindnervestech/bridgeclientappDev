import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import ProviderMapping from '../../views/ProviderMapping/';
import PermissionGroups from '../../views/PermissionGroups/';
import AddPermissionGroup from '../../views/PermissionGroups/AddPermissionGroup/';
import EditPermissionGroup from '../../views/PermissionGroups/EditPermissionGroup/';
import CreateUser from '../../views/CreateUser/';
import CreatedUsers from '../../views/CreatedUsers/';
import EditUser from '../../views/EditUser/';
import Authorization from '../../views/Authorization/';
import ClaimDetails from '../../views/ClaimDetails/';
import Settings from '../../views/Settings/';
import Maintenance from '../../views/Maintenance/';


class Full extends Component {
  componentDidMount() {
    //console.log("Application on load...");
    //console.log(localStorage.getItem("user"));
    if(localStorage.getItem("user") == null || localStorage.getItem("user") == undefined) {
      window.location.href = "#/login";
    }

  }
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
            <Sidebar {...this.props}/>
          {
            <main className="main" style={{backgroundColor:"#F9F9F9"}}>
              
              <Container fluid>
                <Switch>
                  <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                  <Route path="/provider" name="ProviderMapping" component={ProviderMapping}/>
                  <Route path="/permissions" name="PermissionGroups" component={PermissionGroups}/>
                  <Route path="/addPermissions" name="AddPermissionGroup" component={AddPermissionGroup}/>
                  <Route path="/editPermissions/:id" name="EditPermissionGroup" component={EditPermissionGroup}/>
                  <Route path="/editUser/:id" name="EditUser" component={EditUser}/>
                  <Route exact path="/createdUsers" name="CreatedUsers" component={CreatedUsers}/>
                  <Route exact path="/createUser" name="CreateUser" component={CreateUser}/>
                  <Route exact path="/AuthorizationError" name="Authorization" component={Authorization}/>
                  <Route path="/claimDetails" name="ClaimDetails" component={ClaimDetails}/>
                  <Route path="/settings" name="Settings" component={Settings}/>
                  <Route path="/maintenance" name="Maintenance" component={Maintenance}/>
                  <Redirect from="/" to="/dashboard"/>
                </Switch>
              </Container>
            </main>
          }
          
          {
            /*
            <Aside />
            */
          }
        </div>
        {
          /*
          <Footer />
          */
        }
      </div>
    );
  }
}

export default Full;
