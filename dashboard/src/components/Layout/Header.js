import React from 'react';

import bn from 'utils/bemnames';

import {
  Navbar,
  // NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';

import {
  MdClearAll,
  MdExitToApp,
} from 'react-icons/lib/md';
import {logout} from '../../store/actions/auth';
import { UserCard } from 'components/Card';
import SearchInput from 'components/SearchInput';


import connect from "react-redux/es/connect/connect";

const bem = bn.create('header');



class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {

    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Nav navbar>
          <SearchInput />
        </Nav>

        <Nav navbar className={bem.e('nav-right')}>
          <NavItem>
            <NavLink id="Popover2">

              <div onClick={this.toggleUserCardPopover}>
                  {this.props.admin.name}
              </div>
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={this.state.isOpenUserCardPopover}
              toggle={this.toggleUserCardPopover}
              target="Popover2"
              className="p-0 border-0"
              style={{ minWidth: 250 }}>
              <PopoverBody className="p-0 border-light">
                <UserCard
                  title={this.props.admin.name}
                  subtitle={this.props.admin.email}
                  className="border-light">
                  <ListGroup flush>
                    <ListGroupItem tag="button" action className="border-light" onClick={this.props.logout}>
                      <MdExitToApp /> Signout
                    </ListGroupItem>
                  </ListGroup>
                </UserCard>
              </PopoverBody>
            </Popover>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default connect((state) => {
    return  {
        admin: state.persist.auth.user,
    }
},{logout})(Header);
