/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Auth from '../utils/auth';
import Consts from '../utils/consts';
import { push } from 'connected-react-router';
import Manager from '../utils/Manager';
import {clearContext} from './context';
import {setLicense} from './license';
import {setVersion} from './version';

function requestLogin() {
    return {
        type: types.REQ_LOGIN
    }
}

function receiveLogin(username, role, licenseRequired) {
    return {
        type: types.RES_LOGIN,
        username,
        role,
        licenseRequired,
        receivedAt: Date.now()
    }
}

function errorLogin(username,err) {
    return {
        type: types.ERR_LOGIN,
        username,
        error: err,
        receivedAt: Date.now()
    }
}


export function login (username, password, redirect) {
    return function (dispatch, getState) {
        dispatch(requestLogin());
        return Auth.login(username,password)
            .then(({role, version, license, rbac}) => {
                dispatch(receiveLogin(username, role, !_.isNull(license)));
                dispatch(setVersion(version));
                dispatch(setLicense(license));
                dispatch(storeRBAC(rbac));
            })
            .then(() => {
                if(redirect){
                    window.location = redirect;
                } else{
                    dispatch(push(Consts.HOME_PAGE_PATH));
                }
            })
            .catch((err) => {
                console.log(err);
                if(err.status === 403){
                    dispatch(errorLogin(username));
                    dispatch(push({pathname: Consts.ERROR_NO_TENANTS_PAGE_PATH, search: redirect ? '?redirect='+redirect : ''}));
                } else{
                    dispatch(errorLogin(username, err));
                }
            });
    }
}


function responseUserData(username, systemRole, groupSystemRoles, tenantsRoles){
    return {
        type: types.SET_USER_DATA,
        username,
        role: systemRole,
        groupSystemRoles,
        tenantsRoles
    }
}

export function getUserData() {
    return function (dispatch, getState) {
        return Auth.getUserData(getState().manager)
            .then(data => {
                dispatch(responseUserData(data.username, data.role, data.groupSystemRoles, data.tenantsRoles));
            });
    }
}

function doLogout(err) {
    return {
        type: types.LOGOUT,
        error: err,
        receivedAt: Date.now()
    }
}
export function logout(err, path) {
    return function (dispatch, getState) {
        var localLogout = () => {
            dispatch(push(path || (err ? Consts.ERROR_PAGE_PATH : Consts.LOGOUT_PAGE_PATH)));
            dispatch(clearContext());
            dispatch(doLogout(err));
        };

        return Auth.logout(getState().manager).then(localLogout, localLogout);
    }
}

export function storeRBAC(RBAC) {
    return {
        type: types.STORE_RBAC,
        roles: RBAC.roles,
        permissions: RBAC.permissions
    }
}

export function setMaintenanceStatus(maintenance) {
    return {
        type: types.SET_MAINTENANCE_STATUS,
        maintenance,
        receivedAt: Date.now()
    }
}

export function getMaintenanceStatus(manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doGet('/maintenance')
            .then((data) => {
                dispatch(setMaintenanceStatus(data.status));
            }).catch((err) => {
                console.error(err);
            });
    }
}

export function switchMaintenance(manager, activate) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doPost(`/maintenance/${activate?'activate':'deactivate'}`)
            .then((data)=>{
                dispatch(setMaintenanceStatus(data.status));
                dispatch(push(activate ? Consts.MAINTENANCE_PAGE_PATH : Consts.HOME_PAGE_PATH));
            });
    }
}

export function setActiveExecutions(activeExecutions) {
    return {
        type: types.SET_ACTIVE_EXECUTIONS,
        activeExecutions
    }
}

export function getActiveExecutions(manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doGet('/executions?_include=id,workflow_id,status,deployment_id',
                                     {status: ['pending', 'started', 'cancelling', 'force_cancelling']})
            .then((data)=>{
                dispatch(setActiveExecutions(data));
            });
    }
}

export function cancelExecution(execution, action) {
    return {
        type: types.CANCEL_EXECUTION,
        execution,
        action
    }
}

export function doCancelExecution(manager, execution, action) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doPost(`/executions/${execution.id}`, null,
                                      {deployment_id: execution.deployment_id, action})
            .then(()=>{
                dispatch(cancelExecution(execution, action));
            });
    }
}
