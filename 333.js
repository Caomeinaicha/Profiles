/******************************
Quantumult X 资源解析器

功能：强制启用/禁用UDP转发和Fast Open，删除节点名称中的国旗

使用方法：
在订阅链接后使用#添加参数，并用&连接不同的参数。
示例：your_subscription_link#udp=1&tfo=1&emoji=0
******************************/

const url = $request.url;
const params = Object.fromEntries(url.split('#')[1].split('&').map(param => param.split('=')));
const udp = params.udp === '1' ? true : params.udp === '0' ? false : null;
const tfo = params.tfo === '1' ? true : params.tfo === '0' ? false : null;
const emoji = params.emoji === '0'; // 只有当emoji=0时删除国旗

// HTTP请求
$httpClient.get(url.split('#')[0], (error, response, data) => {
    if (error) {
        $notification.post("资源解析失败", "", error);
        $done();
        return;
    }
    
    // 处理数据
    const lines = data.split('\n').map(line => {
        if (line.startsWith("vmess://") || line.startsWith("ss://") || line.startsWith("trojan://") || line.startsWith("https://") || line.startsWith("http://")) {
            let decoded = Buffer.from(line.split("://")[1], 'base64').toString();
            
            if (emoji) {
                const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
                decoded = decoded.replace(flagRegex, "").trim();
            }

            if (udp !== null) {
                decoded = decoded.replace(/"udp":\s*(true|false)/g, `"udp": ${udp}`);
            }
            
            if (tfo !== null) {
                decoded = decoded.replace(/"tfo":\s*(true|false)/g, `"tfo": ${tfo}`);
            }

            const encoded = Buffer.from(decoded).toString('base64');
            return `${line.split("://")[0]}://${encoded}`;
        }
        return line;
    });
    
    const result = lines.join('\n');
    
    $done({ response: { status: 200, body: result } });
});
