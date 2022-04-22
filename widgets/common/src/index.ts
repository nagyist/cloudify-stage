import Actions from './actions';
import BlueprintMarketplace from './blueprintMarketplace';
import Blueprints from './blueprints';
import Components from './components';
import Deployments from './deployments';
import DeploymentsView from './deploymentsView';
import DeployBlueprintModal from './deployModal/DeployBlueprintModal';
import Workflows from './executeWorkflow';
import Executions from './executions';
import Filters from './filters';
import Inputs from './inputs';
import Labels from './labels';
import Map from './map';
import NodeInstancesConsts from './nodes/NodeInstancesConsts';
import Plugins from './plugins';
import Roles from './roles';
import SecretActions from './secrets/SecretActions';
import TerraformModal from './terraformModal';
import EventUtils from './utils/EventUtils';
import Consts from './Consts';
import StagePropTypes from './props';
import StageHooks from './hooks';

const StageCommon = {
    Actions,
    BlueprintMarketplace,
    Blueprints,
    Components,
    Deployments,
    DeploymentsView,
    DeployBlueprintModal,
    Workflows,
    Executions,
    Filters,
    Inputs,
    Labels,
    Map,
    NodeInstancesConsts,
    Plugins,
    Roles,
    SecretActions,
    TerraformModal,
    EventUtils,
    Consts
};

type StagePropTypes = typeof StagePropTypes;
type StageHooks = typeof StageHooks;

declare global {
    namespace Stage {
        const Common: typeof StageCommon;
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface PropTypes extends StagePropTypes {}
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Hooks extends StageHooks {}
    }
}

Stage.defineCommon(StageCommon);
Stage.definePropTypes(StagePropTypes);
Stage.defineHooks(StageHooks);