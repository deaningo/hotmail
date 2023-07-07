(async () => {
    const puppeteer = require('puppeteer-extra')
    const path = require('path')
    let Phone = {
        name: "windows2023040600 3",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        viewport: {
            width: 1920,
            height: 1080,
            deviceScaleFactor: "1.00",
            isMobile: false,
            hasTouch: false,
            isLandscape: false
        }
    }
    const pathToExtension = path.join("d:\\Downloads\\chrome-win\\chrome.exe")
    Phone.viewport.deviceScaleFactor = Number(Phone.viewport.deviceScaleFactor)
    var browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--lang=en-US',
            `--window-size=${Phone.viewport.width},${Phone.viewport.height}`,
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process', // 很关键...
            //  `--proxy-server=${newProxyUrl}`
        ],
        'ignoreDefaultArgs': ['--enable-automation'],
        ignoreHTTPSErrors: true, 
        dumpio: false,
        executablePath: pathToExtension,
    })
    const page = await browser.newPage();

    await page.goto('https://www.iggsettlement.com/submit-claim');
    
    const sleep = time => new Promise(resolve => {
        setTimeout(resolve, time)
    })
    const GetRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    await sleep(GetRandomNum(4000, 6000))
    await page.waitForSelector('input#skip-guard')
    await page.click('input#skip-guard')
    await sleep(GetRandomNum(2000, 4000))
    
    await page.waitForFunction(() => {
      const dstPaymentDiv = document.getElementById('dst-payment');
      return dstPaymentDiv && dstPaymentDiv.querySelector('iframe') !== null;
    });
    
    const iframeHandle = await page.$('#dst-payment > iframe');
    const frameContent = await iframeHandle.contentFrame();
    
    if (frameContent) {
        console.log('成功获取到 iframe 的 contentFrame');
        // 在这里可以对 frameContent 进行进一步操作
    } else {
        console.log('无法获取到 iframe 的 contentFrame');
    }
})();
