import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import { ANY_CHANGE, EDIT, HIDDEN } from '../static';

const formItemPrefix = 'no-form';

class FormItem extends Component {
    static propTypes = {
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.object,
        children: PropTypes.any,
    }
    // 上有form下有if
    static contextTypes = {
        form: PropTypes.object,
        ifCore: PropTypes.object,
    };

    static childContextTypes = {
        form: PropTypes.object,
        ifCore: PropTypes.object,
    };

    static defaultProps = {
        name: '',
        children: null,
    }

    constructor(props, context) {
        super(props, context);
        if (!context.form) {
            return this;
        }

        this.form = context.form;
        this.ifCore = context.ifCore;
        if (props.name) {
            this.name = props.name;
        }
    }

    getChildContext() { // 传递form
        return { form: this.form, ifCore: this.ifCore };
    }

    componentDidMount() {
        // 绑定set事件就会执行更新 TODO：优化渲染
        this.form.on(ANY_CHANGE, this.update);
        this.didMount = true;
    }

    componentWillUnmount() {
        // 解绑
        this.form.removeListener(ANY_CHANGE, this.update);
        this.didMount = false;
    }

    update = () => { // 强制刷新
        if (this.didMount) {
            this.forceUpdate();
        }
    }

    render() {
        const { children, ...itemProps } = this.props;
        const { name, style = {} } = itemProps;
        let { className = '' } = itemProps;
        const props = this.form.getItemProps(name) || {}; // 动态props
        const status = this.form.getItemStatus(name); // 动态status
        const error = this.form.getItemError(name); // 动态error

        // 保留item关键字属性
        const {
            label, top, suffix, prefix, help, required, full: coreFull,
        } = { ...this.props, ...props };

        const errInfo = error && typeof error === 'object' ? error.__error : error;
        const hasError = !!errInfo;

        if (status === HIDDEN) {
            return null;
        }

        if (required && status === EDIT) {
            className += ' required';
        }

        // 处理布局
        const { inset = false, layout = {}, full: jsxFull } = {
            ...this.form.jsx.props, ...itemProps,
        };

        const full = jsxFull || coreFull || inset;
        const componentProps = { };

        const errCls = hasError ? `${formItemPrefix}-item-has-error` : '';
        const insetCls = inset ? `${formItemPrefix}-item-inset` : '';
        const layoutCls = (layout.label && layout.control) ? `${formItemPrefix}-item-has-layout` : '';

        return (
            <div name={`form-item-${name}`} className={`${formItemPrefix}-item ${className} ${layoutCls}`} style={style}>
                <div className={`${insetCls} ${errCls}`}>
                    <span className={`${formItemPrefix}-item-label ${layout.label ? `col-${layout.label}` : ''}`} >{label}</span>
                    <span className={`${formItemPrefix}-item-control ${layout.control ? `col-${layout.control}` : ''}`} >
                        { top ? <span className={`${formItemPrefix}-item-top`}>{top}</span> : null }
                        <span className={`${formItemPrefix}-item-content ${full ? `${formItemPrefix}-full` : ''}`}>
                            { prefix ? <span className={`${formItemPrefix}-item-content-prefix`}>{prefix}</span> : null }
                            <span className={`${formItemPrefix}-item-content-elem is-${status}`}><Item {...itemProps} {...componentProps} >{children}</Item></span>
                            { suffix ? <span className={`${formItemPrefix}-item-content-suffix`}>{suffix}</span> : null }
                        </span>
                        { help ? <span className={`${formItemPrefix}-item-help`}>{help}</span> : null }
                        { (!inset && hasError) ? <span className={`${formItemPrefix}-item-error`}>{errInfo}</span> : null }
                    </span>
                </div>
                { (inset && hasError) ? <span className={`${formItemPrefix}-item-error`}>{errInfo}</span> : null }
            </div>);
    }
}

FormItem.displayName = 'FormItem';

export default FormItem;
