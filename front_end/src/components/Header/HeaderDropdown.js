import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  logOut() {
    localStorage.clear();
    window.location.href = "#/login";
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <Nav>
            <NavItem className="d-md-down-none">
              <NavLink style={{ marginLeft: "4px"}}>
              <img src={'img/profile-pic.png'} className="img-avatar"/>
              <b style={{textTransform:"capitalize",fontFamily:"serif",color:"#4c4c4c"}}>{localStorage.getItem("user")!=null ? JSON.parse(localStorage.getItem("user")).firstName : ""}&nbsp;{localStorage.getItem("user")!=null ? JSON.parse(localStorage.getItem("user")).lastName : ""}</b>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-sort-down"></i>
            </NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink>
            </NavLink>
          </NavItem>
        </Nav>
          {/*<i class="icon-logout icons font-2xl d-block" title="Logout" onClick={this.logOut}></i>*/}
          {/*<a onClick={this.logOut}>Logout</a>*/}
        </DropdownToggle>
        <DropdownMenu right>
          {/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
          <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
          <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
          <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
          <DropdownItem divider/>
          <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
          <DropdownItem onClick={this.logOut}><i className="fa fa-lock"></i> Logout</DropdownItem>*/}
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const {...attributes} = this.props;
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;
