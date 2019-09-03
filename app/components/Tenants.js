/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EventBus from '../utils/EventBus';
import { Dropdown, Loader, Icon } from './basic';

export default class Tenants extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        onTenantChange: PropTypes.func.isRequired,
        onTenantsRefresh: PropTypes.func.isRequired
    };

    componentDidMount() {
        EventBus.on('menu.tenants:refresh', this.props.onTenantsRefresh, this);
    }

    onTenantSelected(tenant) {
        this.props.onTenantChange(tenant.name);
    }

    render() {
        const { tenants } = this.props.manager;
        if (!tenants || !tenants.items || tenants.isFetching) {
            return <Loader active inverted inline size="small" />;
        }

        const selectedTenant = tenants.selected || _.get(this.props.manager, 'tenants.items[0].name');

        const tenantMenuTrigger = (
            <span>
                <Icon name="male" />
                <span>{selectedTenant || 'No Tenants'}</span>
            </span>
        );

        return (
            <Dropdown item pointing="top right" className="tenantsMenu" trigger={tenantMenuTrigger}>
                <Dropdown.Menu>
                    {tenants.items.map(tenant => (
                        <Dropdown.Item
                            key={tenant.name}
                            text={tenant.name}
                            selected={tenant.name === selectedTenant}
                            active={tenant.name === selectedTenant}
                            onClick={this.onTenantSelected.bind(this, tenant)}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
