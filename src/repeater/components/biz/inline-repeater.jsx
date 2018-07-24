import React from 'react';
import Form from '../../../component/Form';
import TableCom from '../core/TableCom';
import ContainerJSX from '../core/Container';
import RowRenderJSX from '../core/RowRender';
import createActionButton from '../core/ActionButton';

export default function bind(source) {
    const ActionButton = createActionButton(source);

    function Container(props) {
        return (<ContainerJSX
            {...props}
            render={(context) => {
                const { itemsConfig } = context;
                const {
                    searchEle, className, jsxProps, children,
                } = context.props;
                const {
                    status,
                    addText = 'add', hasAdd = true, addPosition = 'top',
                    multiple = false,
                } = jsxProps;

                const editable = status === 'edit';

                const header = itemsConfig.map(conf => (<th className="repeater-table-header-node" key={`${conf.label}${conf.name}`}>
                    <div className="repeater-table-cell-wrapper"> {conf.label} </div>
                </th>));

                if (editable) {
                    header.push(<th className="repeater-table-header-node" key="last">
                        <div className="repeater-table-cell-wrapper"> 操作 </div>
                    </th>);
                }

                const addType = multiple ? 'addMultipleInline' : 'addInline';
                let addBtnEle = null;
                if (hasAdd && editable) {
                    addBtnEle = <ActionButton type={addType} addText={addText} />;
                }

                return (<div className={className}>
                    {searchEle}
                    {addPosition === 'top' ? addBtnEle : null}
                    <TableCom header={header}>{children}</TableCom>
                    {addPosition === 'bottom' ? addBtnEle : null}
                </div>);
            }}
        />);
    }

    function RowRender(props) {
        return (<RowRenderJSX
            {...props}
            render={(context) => {
                const {
                    val, idx, core, className,
                } = context.props;
                const { itemsConfig, jsxProps } = context;

                const {
                    status,
                    multiple = false,
                    hasDelete = true, hasUpdate = true,
                    updateText = 'update', deleteText = 'delete',
                    saveText = 'save', cancelText = 'cancel',
                    children,
                } = jsxProps;

                const focusMode = core.$focus;
                const editable = status === 'edit';

                const updateBtn = !multiple && !focusMode && hasUpdate ? <ActionButton type="updateInline" updateText={updateText} /> : null;
                const deleteBtn = (!focusMode || multiple) && hasDelete ? <ActionButton type="delete" deleteText={deleteText} /> : null;

                const saveBtn = !multiple && focusMode ? <ActionButton type="save" saveText={saveText} /> : null;
                const cancelBtn = !multiple && focusMode ? <ActionButton type="cancel" cancelText={cancelText} /> : null;

                let listItems = null;
                const childMap = {};
                children.forEach((childitem) => {
                    const { label, name } = childitem.props;
                    childMap[`${label}${name}`] = React.cloneElement(childitem, { label: undefined });
                });

                // 遍历渲染数据
                listItems = itemsConfig.map((conf) => {
                    let innerItem = null;
                    if (focusMode) {
                        innerItem = (<div className="repeater-table-cell-wrapper inline-repeater-focus">
                            {childMap[`${conf.label}${conf.name}`]}
                        </div>);
                    } else {
                        innerItem = (<div className="repeater-table-cell-wrapper">
                            {val[conf.name]}
                        </div>);
                    }

                    return (<td key={`${conf.label}${conf.name}`}>
                        {innerItem}
                    </td>);
                });

                const operEle = (<td>
                    {editable ? <div className="repeater-table-cell-wrapper">
                        {saveBtn}
                        {cancelBtn}
                        {updateBtn}
                        {deleteBtn}
                    </div> : null}
                </td>);

                return (<Form core={core} className={className} key={idx}>
                    {listItems}
                    {operEle}
                </Form>);
            }}
        />);
    }

    return {
        Container,
        RowRender,
        inline: true,
    };
}
