import { FunctionComponent } from 'react';
import CommonDropdown, { KeyAndValueDropdownProps } from './CommonDropdown';

interface KeyDropdownProps extends KeyAndValueDropdownProps {
    collectionName: string;
    onChange: (value: string) => void;
    value: string;
}

const KeyDropdown: FunctionComponent<KeyDropdownProps> = ({
    allowAdditions = false,
    collectionName,
    innerRef,
    onChange,
    toolbox,
    value
}) => {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            type="key"
            innerRef={innerRef}
            fetchUrl={`/labels/${collectionName}`}
            noResultsMessage={value && !allowAdditions ? i18n.t('widgets.common.labels.newKey') : undefined}
            placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
            name="labelKey"
            tabIndex={0}
            onChange={onChange}
            toolbox={toolbox}
            additionLabel={`${i18n.t('widgets.common.labels.newKey')} `}
            allowAdditions={allowAdditions}
            value={value}
        />
    );
};
export default KeyDropdown;
