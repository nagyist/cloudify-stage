/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import UserDetails from './UserDetails';
import CreateModal from './CreateModal';
import PasswordModal from './PasswordModal';
import RoleModal from './RoleModal';
import TenantModal from './TenantModal';
import GroupModal from './GroupModal';

export default class TenantsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: "",
            user: {},
            tenants: {},
            groups: {}
        }
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('users:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('users:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    _selectUser(userName) {
        let selectedUserName = this.props.toolbox.getContext().getValue('userName');
        this.props.toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
    }

    _getAvailableTenants(value, user) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetTenants().then((tenants)=>{
            this.setState({user, tenants, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _getAvailableGroups(value, user) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetGroups().then((groups)=>{
            this.setState({user, groups, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _showModal(value, user) {
        if (value === MenuAction.ADD_TENANT_ACTION) {
            this._getAvailableTenants(value, user);
        } else if (value === MenuAction.ADD_GROUP_ACTION) {
            this._getAvailableGroups(value, user);
        } else {
            this.setState({user, modalType: value, showModal: true});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _deleteUser() {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.user.username).then(()=>{
            this._hideModal();
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    render() {
        let {ErrorMessage, DataTable, Checkmark, Icon, Confirm} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       className="usersTable">

                    <DataTable.Column label="Username" name="username" width="32%" />
                    <DataTable.Column label="Last login" name="last_login_at" width="18%" />
                    <DataTable.Column label="Role" name="role" width="15%" />
                    <DataTable.Column label="Is active" name="active" width="10%" />
                    <DataTable.Column label="# Groups" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.username} expanded={item.isSelected}>
                                    <DataTable.Row key={item.username} selected={item.isSelected} onClick={this._selectUser.bind(this, item.username)}>
                                        <DataTable.Data>{item.username}</DataTable.Data>
                                        <DataTable.Data>{item.last_login_at}</DataTable.Data>
                                        <DataTable.Data>{item.role}</DataTable.Data>
                                        <DataTable.Data><Checkmark value={item.active}/></DataTable.Data>
                                        <DataTable.Data><div className="ui green horizontal label">{item.groupCount}</div></DataTable.Data>
                                        <DataTable.Data><div className="ui blue horizontal label">{item.tenantCount}</div></DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                    <DataTable.DataExpandable>
                                        <UserDetails data={item} toolbox={this.props.toolbox} onError={this._handleError.bind(this)}/>
                                    </DataTable.DataExpandable>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>

                <PasswordModal
                    show={this.state.modalType === MenuAction.SET_PASSWORD_ACTION && this.state.showModal}
                    user={this.state.user}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <RoleModal
                    show={this.state.modalType === MenuAction.SET_ROLE_ACTION && this.state.showModal}
                    user={this.state.user}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <TenantModal
                    show={this.state.modalType === MenuAction.ADD_TENANT_ACTION && this.state.showModal}
                    user={this.state.user}
                    tenants={this.state.tenants}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <GroupModal
                    show={this.state.modalType === MenuAction.ADD_GROUP_ACTION && this.state.showModal}
                    user={this.state.user}
                    groups={this.state.groups}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <Confirm title={`Are you sure you want to remove user ${this.state.user.username}?`}
                         show={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteUser.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}
