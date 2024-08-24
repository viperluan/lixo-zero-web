import { useAuth } from "~context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, Media, UncontrolledDropdown } from "reactstrap"

const UserLoggedDropDown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate()
    return (
        <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                        <img
                            alt="..."
                            src={require("../../assets/img/theme/team-1-800x800.jpg")}
                        />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                            {user?.nome}
                        </span>
                    </Media>
                </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Bem vindo!</h6>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => { logout(); navigate("/") }}>
                    <i className="ni ni-user-run" />
                    <span>Sair</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )

}

export { UserLoggedDropDown }
