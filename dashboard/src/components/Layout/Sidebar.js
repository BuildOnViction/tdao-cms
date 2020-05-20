import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdAccountCircle,
  MdDashboard,
  MdEventNote
} from 'react-icons/lib/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';
import connect from "react-redux/es/connect/connect";

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const pageContents = [
  // { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle }
];

let navItems = [
  { to: '/', name: 'dashboard', exact: true, Icon: MdDashboard },
  { to: '/jobs', name: 'Jobs', exact: true, Icon: MdEventNote },
  { to: '/transactions', name: 'Transactions', exact: true, Icon: MdEventNote },
  { to: '/admins', name: 'Admins', exact: true, Icon: MdAccountCircle },
  { to: '/users', name: 'Người dùng ', exact: true, Icon: MdAccountCircle }



];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    let sidebar;
    if(this.props.admin === 'admin'){
        sidebar = navItems.map(({ to, name, exact, Icon }, index) => (
            <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}>
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                </BSNavLink>
            </NavItem>
        ))
    }else{
        navItems = [
            { to: '/', name: 'dashboard', exact: true, Icon: MdDashboard },
            { to: '/jobs', name: 'ĐƠn hàng', exact: true, Icon: MdEventNote }
    ]
            sidebar = navItems.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                    <BSNavLink
                        id={`navItem-${name}-${index}`}
                        className="text-uppercase"
                        tag={NavLink}
                        to={to}
                        activeClassName="active"
                        exact={exact}>
                        <Icon className={bem.e('nav-item-icon')} />
                        <span className="">{name}</span>
                    </BSNavLink>
                </NavItem>
            ))
    }
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <span className="text-white">
                Tomo Bridge CMS
              </span>
            </SourceLink>
          </Navbar>
          <Nav vertical>
              {sidebar}
            <Collapse isOpen={this.state.isOpenPages}>
              {pageContents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}>
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default connect((state) => {
    return  {
        admin: state.persist.auth.user.roles,
    }
})(Sidebar);
