
import numbro from 'numbro';



// 生成随机字符串
function randomStr() {
    return Math.random().toString(36).substring(2);
}

function render(template, context, tokenReg, hasDollarPrefix?, resultProcessor?) {
    return template.replace(tokenReg, (word, slash1, token, slash2) => {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }

        let variables = token.replace(/\s/g, '').split('.');
        let currentObject = context;
        for (let i = 0; i < variables.length; i++) {
            let variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) {
                if (hasDollarPrefix === true) {
                    return '${' + token + '}';
                } else {
                    return '{' + token + '}';
                }
            }
        }

        if (resultProcessor) {
            return resultProcessor(currentObject);
        } else {
            return currentObject;
        }
    });
}


export class CBoardCommonUtils {

    length;

    render(context) {
        return render(this, context, /(\\)?\{([^\{\}\\]+)(\\)?\}/g);
    }

    render2(context, resultProcessor) {
        return render(this, context, /(\\)?\$\{([^\{\}\\]+)(\\)?\}/g, true, resultProcessor);
    }

    hashCode(charCodeAt) {
        let hash = 0, i, chr;
        if (this.length === 0) {
            return hash;
        }
        for (let i = 0; i < this.length; i++) {
            chr = charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}

function dataStructure(d) {
    let dataString = d ? d.toString() : '';
    let isNumber = /^\d+(\.\d+)?$/.test(dataString);
    let intBit = isNumber ? dataString.split('\.')[0].length : 0;
    let floatBit = isNumber && dataString.indexOf('.') !== -1 ? dataString.split('\.')[1].length : 0;
    return {
        isNumber: isNumber,
        intBit: intBit,
        floatBit: floatBit
    };
}

function dataFormat(d) {
    let ds = dataStructure(d);
    if (ds.isNumber) {
        return numbro(d).format('0.[0000]');
    } else {
        return d;
    }
}

function verifyAggExpRegx(exp) {
    let result = { isValid: false, msg: '' };
    let expStr = exp.replace(/\s/g, '').replace(/(sum|avg|count|max|min)\([\u4e00-\u9fa5_a-zA-Z0-9]+\)/g, '1');
    try {
        // tslint:disable-next-line:no-eval
        eval(expStr);
    } catch (e) {
        result.msg = e.message;
        return result;
    }

    result.isValid = true;
    result.msg = 'ok!';
    return result;
}

function cboardTranslate(path) {
    let keys = path.split('.');
    let exp = 'CB_I18N';
    for (let i = 0; i < keys.length; i++) {
        exp += `['${keys[i]}']`;
    }
    // tslint:disable-next-line:no-eval
    let result = eval(exp);
    return result ? result : path;
}

function UserException(message) {
    this.message = message;
    this.name = 'UserException';
}
