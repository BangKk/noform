# 基本

- layout: default
- order: 0

最简单的用法。

---

## 可执行 DEMO

````js
import Form, { FormItem, Item, FormCore, If } from '../src';
import repeater  from '../src/repeater';
import * as Antd from 'antd';
import wrapper from '../src/wrapper/antd';
import dialogWrapper from '../src/dialog/antd';
// import '../src/repeater/index.scss';
// import "antd/dist/antd.css";
import "./repeater.scss";

const { Modal, Button, Input, Checkbox, Radio }  = wrapper(Antd);
const Dialog = dialogWrapper(Antd)
const { TableRepeater, InlineRepeater, Selectify, ActionButton } = repeater({ Dialog, Button, Input, Checkbox, Radio });
// const { TableRepeater, InlineRepeater } = repeater({ Dialog, Button, Input });
// 自定义的过滤函数
function filter(value, key){
    return value.filter(item => item.drawerName.startsWith(key))
}

const SelectRepeater = Selectify(TableRepeater);

const formCore = new FormCore({
    autoValidate: true,
    validateConfig: {
        irn: [
            // { required: true, message: 'errrrrrrr' },
            { validator: (rule, value, callback) => {
                console.log(rule, value);
                if (value && value.length > 1) {
                    callback(['mammmmmmx']);
                } else {
                    callback([]);
                }
            }}
            // return new Promise((resolve, reject) => {
            //         setTimeout(() => {
            //             if (value && value.length > 1) {
            //                 reject('iii');
            //             } else {
            //                 resolve('null');
            //             }
                        
            //             // resolve(null);
            //         }, 200);
            //     });
        ]
    },
    onChange: (fireKeys, values) => {
        console.log('====>', fireKeys, values);
    }
});

window.formCore = formCore;
const validateConfig = {
    drawerName: { type: 'string', required: true }
};

const formConfig = {
    validateConfig,
    autoValidate: true,
    onChange: (fireKeys, values) => {
        // console.log('====>', fireKeys, values);
    },
    values: {
        drawerName: 'box',
    }
};

const deepFormConfig = {
    ...formConfig,
    onChange: (fireKeys, values, ctx) => {
        const { dataSource } = values;
        if (fireKeys.indexOf('dataSource') !== -1) {
            
        }
    }
};

const deepCore = new FormCore();
const fuzzCore = new FormCore();
window.deepCore = deepCore;

const dialogConfig = {
    full: true,
    layout: { label: 10, control: 14 },
    custom: (core, type) => {
        let title = '';
        if (type === 'add') {
            title = '增加xxx';
        } else if (type === 'update') {
            title = '修改xxx';
        }

        return {
            title
        }
    }
};

const easyAdd = (values) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const newValues = {
                ...values,
                id: 'add' + Math.random().toString(36).slice(2)
            };

            const { deep } = formCore.getValues();
            const { dataSource } = deep;
            fuzzCore.setValues({
                deep: {
                    ...deep,
                    value: [newValues]
                }
            });

            resolve({
                success: true,
                values: [...dataSource, newValues]
            });
        }, 1500);
    });
};

const asyncAdd = (values) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const newValues = {
                ...values,
                id: 'add' + Math.random().toString(36).slice(2)
            };

            // const { address } = fuzzCore.getValues();
            // const { dataSource } = address;
            // fuzzCore.setValues({
            //     address: {
            //         ...address,
            //         value: [newValues]
            //     }
            // });

            resolve({
                success: true,
                // values: [...dataSource, newValues]
                item: newValues
            });
        }, 1500);
    });
};

const asyncHandler = {
    add: asyncAdd,
    // add: easyAdd,
    save: asyncAdd,
    update: (values) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                debugger;
                resolve({
                    success: true,
                    values
                });
            }, 1500);
        });
    },
    remove: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 1500);
        });
    }
};

const renderList = () => {
    const fuzzValues = fuzzCore.getValues();
    const { address } = fuzzValues || {};
    const { dataSource, value } = address || {};

    const tmp = new FormCore({
        values: {
            list: address
        },
        onChange: (fireKeys, values) => {
            const { list } = values;
            console.log('list change....', list);
            // fuzzCore.setValues({
            //     address: list
            // });
        }
    });
    Dialog.show({
        title: 'hello',
        content: <Form core={tmp}>
            <Item name="list">
                <SelectRepeater selectMode="single" asyncHandler={asyncHandler} formConfig={formConfig} hasAdd={false}>
                    <FormItem label="开票人" name="drawerName"><Input /></FormItem>
                    <FormItem label="税号" name="taxpayerNumber"><Input /></FormItem>
                </SelectRepeater>
            </Item>                
        </Form>,
        // onOk: (values, hide) => {
        //     hide();
        // }
        footer: (hide) => {
            return <div><Button onClick={hide}>xxx</Button></div>
        }
    });
}

const customView = (_, ctx) => {
    const fuzzValues = fuzzCore.getValues();
    const { address } = fuzzValues || {};
    const { dataSource, value } = address || {};

    let selectElement = null;
    if (value && value.length > 0) {
        selectElement = <a href="#" onClick={renderList}>重新选择</a>
    }

    let addElement = null;
    if (!(dataSource && dataSource.length === 5)) {
        addElement = <ActionButton type="add">添加新地址</ActionButton>;
    }
    
    return <div>
        {selectElement}{addElement}
    </div>
}

const CustomEle = ({ onChange }) => {
    return <Form core={fuzzCore} onChange={onChange}>
        <Item name="address">
            <SelectRepeater dialogConfig={dialogConfig} selectFormConfig={deepFormConfig} selectMode="single" asyncHandler={asyncHandler} formConfig={formConfig} view={customView} hasAdd={false}>
                <FormItem label="开票人" name="drawerName"><Input /></FormItem>
                <FormItem label="税号" name="taxpayerNumber"><Input /></FormItem>
            </SelectRepeater>
        </Item>
    </Form>
}

const defaultValue = {
    deep: {
        dataSource: [
            { drawerName: 'aa', taxpayerNumber: 'bb', id: 1 },
            { drawerName: 'cc', taxpayerNumber: 'dd', id: 2 },
            { drawerName: 'ee', taxpayerNumber: 'ff', id: 3 }
        ],
        value: []
    },
    fuzz: {
        address: {
            dataSource: [
                { drawerName: 'aa', taxpayerNumber: 'bb', id: 1 },
                { drawerName: 'cc', taxpayerNumber: 'dd', id: 2 },
                { drawerName: 'ee', taxpayerNumber: 'ff', id: 3 }
            ],
            value: []
        }
    },
}; 

formCore.setValues({
    ir: [
        {  drawerName: '1' },
        {  drawerName: '2' }
    ],
    irn: [
        {  drawerName: '1' },
        {  drawerName: '2' }
    ],
    name: 'billy'
});

const inlineAsyncHandler = {
    add: () => {
        return {
            success: true,
            // item: { drawerName: 'abcd' }
            // values: [{
            //     drawerName: 'abcd'
            // }]
        }
    },
    save: (values) => {
        console.log('save===>', values);
        return true;
    }
};

ReactDOM.render(<Form core={formCore} onChange={console.log} value={defaultValue}>
    {/* <FormItem name="tabledemo" >
        <TableRepeater formConfig={formConfig}>
            <FormItem label="username" name="username"><Input /></FormItem>
        </TableRepeater>
    </FormItem>
    <FormItem name="tabledemo" >
        <InlineRepeater multiple formConfig={formConfig}>
            <FormItem label="username" name="username"><Input /></FormItem>
        </InlineRepeater>
    </FormItem>
    <FormItem name="deepselect">
        <SelectRepeater selectMode="single" asyncHandler={asyncHandler} formConfig={formConfig}>
            <FormItem label="username" name="username"><Input /></FormItem>
        </SelectRepeater>        
    </FormItem>

    <FormItem defaultValue={{ dataSource: [{username: 'a', id: 'a'}, {username: 'b', id: 'b'}] }} name="deepselectxxxxx">
        <SelectRepeater selectMode="single" formConfig={formConfig}>
            <FormItem label="username" name="username"><Input /></FormItem>
        </SelectRepeater>        
    </FormItem> */}

    {/* <FormItem name="deepselect">
         <InlineRepeater filter={filter} formConfig={formConfig} addPosition="bottom">
            <FormItem required label="开票人" name="drawerName"><Input /></FormItem>
       </InlineRepeater>      
    </FormItem> */}
    
    {/* <Item name="tableRepeat" >
        <TableRepeater formConfig={formConfig}>
            <FormItem label="开票人" name="drawerName"><Input /></FormItem>
            <FormItem label="税号" name="taxpayerNumber"><Input /></FormItem>
            <FormItem label="子公司" name="branchName"><Input /></FormItem>
            <FormItem label="核查结果" name="checkResultName"><Input /></FormItem>
            <FormItem label="拒绝原因" name="denyReason"><Input /></FormItem>
            <FormItem label="创建人" name="creatorName"><Input /></FormItem>
        </TableRepeater>
    </Item> */}

    {/* <FormItem label="inlineRepeat" name="inlineRepeat">
        <InlineRepeater filter={filter} formConfig={formConfig} addPosition="bottom">
            <FormItem required label="开票人" name="drawerName"><Input /></FormItem>
            <FormItem required label="税号" name="taxpayerNumber"><Input /></FormItem>
            <FormItem required label="子公司" name="branchName"><Input /></FormItem>
            <FormItem required label="核查结果" name="checkResultName"><Input /></FormItem>
            <FormItem required label="拒绝原因" name="denyReason"><Input /></FormItem>
            <FormItem required label="创建人" name="creatorName"><Input /></FormItem>
        </InlineRepeater>
    </FormItem> */}

    {/* <FormItem required label="username" name="username"><Input /></FormItem>
    <If when={(values) => {
        const { username } = values || {};
        return username === 'billy';
    }}>
        <FormItem label="inlineRepeat" name="inlineRepeat">
            <InlineRepeater addPosition="bottom">
                <FormItem required label="开票人" name="drawerName"><Input /></FormItem>
            </InlineRepeater>
        </FormItem>
    </If> */}

    <br/>
    <hr/>

    <FormItem name="deep">
        <SelectRepeater selectMode="multiple" asyncHandler={asyncHandler} formConfig={formConfig}>
            <FormItem label="开票人" name="drawerName"><Input /></FormItem>
            <FormItem label="税号" name="taxpayerNumber"><Input /></FormItem>
        </SelectRepeater>        
    </FormItem>

    {/* <FormItem name="fuzz">
        <CustomEle />
    </FormItem> */}

    {/* <FormItem name="irn">
        <InlineRepeater multiple asyncHandler={inlineAsyncHandler} filter={filter} formConfig={formConfig} addPosition="bottom">
            <FormItem label="开票人" name="drawerName"><Input /></FormItem>
            <FormItem label="multi" multiple required>
                <div>
                    <FormItem name="aaa"><Input addonBefore="xxoo" style={{ width: '100px' }}  /></FormItem>
                    <FormItem name="bbb"><Input /></FormItem>
                </div>
            </FormItem>
            <FormItem label="税号" name="taxpayerNumber"><Input /></FormItem>
        </InlineRepeater>
    </FormItem> */}

{/*     
    <If when={(values) => {
        return values.name === 'billy';
    }}>
        <FormItem name="ir">
            <InlineRepeater multiple filter={filter} formConfig={formConfig} addPosition="bottom">
                <FormItem label="开票人" name="drawerName"><Input /></FormItem>
            </InlineRepeater>
        </FormItem>
    </If> */}
</Form>, mountNode);
````

````css
body {
    background-color: #FFF;
}
````