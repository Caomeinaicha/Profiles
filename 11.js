/*******************************
Quantumult X 资源解析器

功能：根据参数强制启用/禁用UDP转发和Fast Open，删除节点名称中的国旗

使用方法：
在订阅链接后使用#添加参数，并用&连接不同的参数。
示例：your_subscription_link#udp=1&tfo=1&emoji=0
********************************/

// 解析URL和参数
const url = $resource.link;
const defaultParams = { udp: '1', tfo: '1', emoji: '0' }; // 默认参数
const params = Object.fromEntries(
  (url.split('#')[1] || '').split('&').map(param => param.split('='))
);
const udp = params.udp === '1' ? true : params.udp === '0' ? false : defaultParams.udp === '1';
const tfo = params.tfo === '1' ? true : params.tfo === '0' ? false : defaultParams.tfo === '1';
const emoji = params.emoji === '0'; // 只有当emoji=0时删除国旗

// 获取资源内容
const data = $resource.content;

// 处理数据
const lines = data.split('\n').map(line => {
  let decoded = Buffer.from(line, 'base64').toString('utf-8');

  if (emoji) {
    const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
    decoded = decoded.replace(flagRegex, '').trim();
  }

  if (udp !== defaultParams.udp) {
    decoded = decoded.replace(/"udp":\s*(true|false)/g, `"udp": ${udp}`);
  }

  if (tfo !== defaultParams.tfo) {
    decoded = decoded.replace(/"tfo":\s*(true|false)/g, `"tfo": ${tfo}`);
  }

  const encoded = Buffer.from(decoded, 'utf-8').toString('base64');
  return encoded;
});

const result = lines.join('\n');

$done({ content: result });
