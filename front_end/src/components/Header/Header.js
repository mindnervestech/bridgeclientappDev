import React, {Component} from 'react';
import {
  Nav,
  NavItem,
  NavbarToggler,
  NavbarBrand,
  NavLink,
} from 'reactstrap';
import HeaderDropdown from './HeaderDropdown';

class Header extends Component {

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
      <header className="app-header navbar">
         <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
        <NavbarBrand href="#"></NavbarBrand>
          <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
            <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
          <Nav className="ml-auto" navbar>
            <NavItem className="d-md-down-none">
            <NavLink><b style={{textTransform:"capitalize",fontFamily:"serif"}}>{localStorage.getItem("user")!=null ? JSON.parse(localStorage.getItem("user")).firstName : ""}&nbsp;{localStorage.getItem("user")!=null ? JSON.parse(localStorage.getItem("user")).lastName : ""}</b></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink></NavLink>
          </NavItem>
          <HeaderDropdown/>
        </Nav>
        {
          /*<NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
          </NavbarToggler>*/
        }
      </header>
    );
  }
}

export default Header;
