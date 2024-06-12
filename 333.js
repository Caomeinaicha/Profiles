/*******************************
Quantumult X 资源解析器

功能：根据订阅参数设置UDP转发和Fast Open，删除节点名称中的国旗

使用方法：
在订阅链接后使用#添加参数，并用&连接不同的参数。
示例：your_subscription_link#udp=1&tfo=1&emoji=0
*******************************/

const url = $resource.link;
const hasParams = url.includes('#');
const params = hasParams ? Object.fromEntries(url.split('#')[1].split('&').map(param => param.split('='))) : {};
const udp = params.udp === '1' ? true : params.udp === '0' ? false : null;
const tfo = params.tfo === '1' ? true : params.tfo === '0' ? false : null;
const emoji = params.emoji === '0'; // 只有当emoji=0时删除国旗

const data = $resource.content;

let result = data;

if (udp !== null && tfo !== null) {
    // 根据参数设置 UDP 和 Fast Open
    if (udp && tfo) {
        // 设置 UDP 转发和 Fast Open
        result = result.replace(/"udp":\s*(true|false)/g, `"udp": true`);
        result = result.replace(/"tfo":\s*(true|false)/g, `"tfo": true`);
        result = result.replace(/"udp-relay":\s*(true|false)/g, `"udp-relay": true`);
    } else {
        // 关闭 UDP 转发和 Fast Open
        result = result.replace(/"udp":\s*(true|false)/g, `"udp": false`);
        result = result.replace(/"tfo":\s*(true|false)/g, `"tfo": false`);
        result = result.replace(/"udp-relay":\s*(true|false)/g, `"udp-relay": false`);
    }
}

if (emoji) {
    // 删除节点名称中的国旗
    const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
    result = result.replace(flagRegex, "").trim();
}

$done({content: result});
