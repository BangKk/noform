export default function messages(locale) {
    return {
        zh_CN: {
            required: '必填',
            string: '必须是字符串',
            singleChar: '只允许输入单字符',
            alphabet: '只允许输入大小写字母',
            minLength: '长度必须大于等于{min}',
            maxLength: '长度必须小于等于{max}',
            length: '长度必须等于{length}',
            array: '必须是数组',
            number: '必须是数字',
            min: '必须大于{min}',
            max: '必须小于{max}',
            decimal: '必须精确到{decimal}位小数点',
            integer: '必须是整数',
            pattern: '请输入正确的{label}',
            email: '请输入正确的邮箱',
            url: '请输入正确的链接,http:// 或 https:// 开头',
            phone: '请输入正确的手机格式',
            tel: '请输入正确的电话格式',
            date: '请输入正确的日期',
            datetime: '请输入正确的时间',
            enum: '必须是{enum}之一',
        },
        en_US: {
            required: 'Required',
            string: 'String only',
            singleChar: 'Single char only',
            alphabet: 'Alphabet only',
            minLength: 'The length of {label} must be greater than or equal to {min}',
            maxLength: 'The length of {label} must be less than or equal to {max}',
            length: 'The length of {label} must be equal to {length}',
            array: 'Array only',
            number: 'Number only',
            min: '{label} must be greater than or equal to {min}',
            max: '{label} must be less than or equal to {max}',
            decimal: 'Please accurate to {decimal} decimal places',
            integer: 'Integer only',
            pattern: 'Please enter the correct format of {label}',
            email: 'Please enter the correct format of email',
            url: 'Please input correct link which begin with http(s)://',
            phone: 'Please enter the correct format of phone information',
            tel: 'Please enter the correct format of tel information',
            date: 'Please enter the correct format of date',
            datetime: 'Please enter the correct format of datetime',
            enum: '{label} must be one of {enum}',
        },
    }[locale];
}
