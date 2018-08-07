/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';
import React from 'react';


class PluginsStepActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading(id)
            .then(this.props.fetchData)
            .then(({stepData}) => this.props.onNext(id, {plugins: {..._.pickBy(stepData, (plugin) => plugin.status !== PluginsStepContent.installed_ParametersMatched)}}))
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class PluginsStepContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            pluginsInCatalog: [],
            pluginsInManager: [],
            stepData: {}
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static installed_ParametersMatched = 'installed_ParametersMatched';
    static installed_ParametersUnmatched = 'installed_ParametersUnmatched';
    static notInstalled_InCatalog = 'notInstalled_InCatalog';
    static notInstalled_NotInCatalog = 'notInstalled_NotInCatalog';

    static getPluginStatus(pluginName, pluginsInBlueprint, pluginsInManager, pluginsInCatalog) {
        const plugin = pluginsInBlueprint[pluginName];
        const version = _.get(plugin, 'params.version');
        const distribution = _.get(plugin, 'params.distribution');

        const pluginInManager = pluginsInManager[pluginName];
        const pluginInCatalog = pluginsInCatalog[pluginName];

        let pluginStatus = '';

        if (!_.isNil(pluginInManager)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInManager.version)) &&
                (_.isNil(distribution) || _.isEqual(distribution, pluginInManager.distribution))) {
                pluginStatus = PluginsStepContent.installed_ParametersMatched;
            } else {
                pluginStatus = PluginsStepContent.installed_ParametersUnmatched;
            }
        } else if (!_.isNil(pluginInCatalog)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInCatalog.version))) { // TODO: Check distribution
                pluginStatus = PluginsStepContent.notInstalled_InCatalog;
            } else {
                pluginStatus = PluginsStepContent.notInstalled_NotInCatalog;
            }
        } else {
            pluginStatus = PluginsStepContent.notInstalled_NotInCatalog;
        }

        return pluginStatus;
    }

    componentDidMount() {
        this.props.onLoading(this.props.id)
            .then(() => Promise.all([
                this.props.toolbox.getManager().doGet('/plugins?_include=distribution,package_name,package_version'),
                this.props.toolbox.getExternal().doGet('http://repository.cloudifysource.org/cloudify/wagons/plugins.json')
            ]))
            .then(([pluginsInManager, pluginsInCatalog]) => {
                const pluginsInBlueprint = _.get(this.props.wizardData, 'blueprint.plugins', {});

                pluginsInManager = pluginsInManager.items;
                pluginsInManager = _.reduce(pluginsInManager, (result, pluginObject) => {
                    result[pluginObject.package_name] = {
                        version: pluginObject.package_version,
                        distribution: pluginObject.distribution
                    };
                    return result;
                }, {});

                pluginsInCatalog = _.reduce(pluginsInCatalog, (result, pluginObject) => {
                    result[pluginObject.name] = {
                        ..._.omit(pluginObject, 'name')
                    };
                    return result;
                }, {});

                let stepData = {};
                for (let plugin of _.keys(pluginsInBlueprint)) {
                    const status = PluginsStepContent.getPluginStatus(plugin, pluginsInBlueprint, pluginsInManager, pluginsInCatalog);
                    let wagonUrl = '';
                    let wagonFile = '';
                    let yamlUrl = '';
                    let yamlFile = '';
                    if (status === PluginsStepContent.notInstalled_InCatalog) {
                        const distro = `${this.props.toolbox.getManager().getDistributionName().toLowerCase()} ${this.props.toolbox.getManager().getDistributionRelease().toLowerCase()}`;
                        const wagon = _.find(pluginsInCatalog[plugin].wagons, (wagon) => {
                            return wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any';
                        });

                        wagonUrl = wagon.url;
                        yamlUrl = pluginsInCatalog[plugin].link;
                    }

                    stepData[plugin] = {
                        yamlUrl, yamlFile, wagonUrl, wagonFile,
                        status, ...this.props.stepData[plugin]
                    };
                }

                return {stepData, pluginsInManager, pluginsInCatalog};
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady(this.props.id));
    }

    getPluginInstalled(pluginName) {
        const status = _.get(this.state.stepData[pluginName], 'status');
        let {Checkmark} = Stage.Basic;

        switch (status) {
            case PluginsStepContent.installed_ParametersMatched:
                return <Checkmark value={true}/>;
            case PluginsStepContent.installed_ParametersUnmatched:
            case PluginsStepContent.notInstalled_NotInCatalog:
            case PluginsStepContent.notInstalled_InCatalog:
            default:
                return <Checkmark value={false}/>;
        }
    }

    getPluginAction(pluginName) {
        const status = _.get(this.state.stepData[pluginName], 'status');
        let {Icon} = Stage.Basic;
        let action = null;

        switch (status) {
            case PluginsStepContent.installed_ParametersMatched:
                action = <strong><Icon name='check circle' color='green' /> Plugin already installed. No action required.</strong>;
                break;
            case PluginsStepContent.installed_ParametersUnmatched:
                action = <strong><Icon name='warning circle' color='yellow' /> Plugin installed but with different parameters. Provide details.</strong>;
                break;
            case PluginsStepContent.notInstalled_NotInCatalog:
                action = <strong><Icon name='warning circle' color='yellow' /> Cannot find plugin. Provide details.</strong>;
                break;
            case PluginsStepContent.notInstalled_InCatalog:
                action = <strong><Icon name='check circle' color='green' /> Plugin has been found in catalog and will be installed automatically. No action required.</strong>;
                break;
            default:
                action = null;
        }

        return action;
    }

    getPluginIcon(pluginName) {
        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];
        let {Image} = Stage.Basic;

        if (!_.isNil(pluginInCatalog)) {
            return <Image src={pluginInCatalog.icon} inline height='25' />;
        } else {
            return null;
        }
    }

    getPluginUserFriendlyName(pluginName) {
        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];

        if (!_.isNil(pluginInCatalog)) {
            return pluginInCatalog.title;
        } else {
            return pluginName;
        }
    }

    render() {
        let {Table, Wizard} = Stage.Basic;
        const plugins = _.get(this.props.wizardData, 'blueprint.plugins', {});

        return (
            <Wizard.Step.Content {...this.props}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Plugin</Table.HeaderCell>
                            <Table.HeaderCell>Version</Table.HeaderCell>
                            <Table.HeaderCell>Distribution</Table.HeaderCell>
                            <Table.HeaderCell>Installed</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {
                        _.map(_.keys(plugins), (pluginName) =>
                            <Table.Row key={pluginName}>
                                <Table.Cell textAlign='center' width={1}>{this.getPluginIcon(pluginName)}</Table.Cell>
                                <Table.Cell>{this.getPluginUserFriendlyName(pluginName)}</Table.Cell>
                                <Table.Cell>{plugins[pluginName].version || '-'}</Table.Cell>
                                <Table.Cell>{plugins[pluginName].distribution || '-'}</Table.Cell>
                                <Table.Cell textAlign='center' width={1}>{this.getPluginInstalled(pluginName)}</Table.Cell>
                                <Table.Cell>{this.getPluginAction(pluginName)}</Table.Cell>
                            </Table.Row>
                        )
                    }
                    </Table.Body>

                    <Table.Footer>

                    </Table.Footer>
                </Table>
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep('plugins', 'Plugins', 'Select plugins', PluginsStepContent, PluginsStepActions);
