export async function onRequest({ request }) {
  // 只允许 POST 请求
  if (request.method !== "POST") {
    return Response.json({ success: false, message: "仅支持POST请求" }, { status: 405 });
  }

  try {
    const reqBody = await request.json();
    const licenseKey = reqBody.license_key;

    if (!licenseKey) {
      return Response.json({ success: false, message: "许可证Key不能为空" }, { status: 400 });
    }

    // Lemon Squeezy 许可证校验接口
    const lemonRes = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": "Bearer 在这里填入你的 Lemon Squeezy API Key"
      },
      body: JSON.stringify({
        license_key: licenseKey
      })
    });

    const result = await lemonRes.json();

    if (lemonRes.ok && result.data) {
      return Response.json({
        success: true,
        valid: true,
        data: result.data
      });
    } else {
      return Response.json({
        success: true,
        valid: false,
        message: "许可证无效"
      });
    }

  } catch (error) {
    return Response.json({
      success: false,
      message: "接口出错：" + error.message
    }, { status: 500 });
  }
}
