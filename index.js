const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const request = require('request-promise')
const path = require('path')
const emailCode = require("./emailCode.js")
const Stealth = StealthPlugin()
const Captch = require("2captcha-ts")

const userinfo = {
    email: 'ungerechtsjazleeat@zohomail.com',
    emailpassword: 'dq088BK99Y',
    userid: 'caldefaws8734',
    password: 'gV2$hB5%mX6#',
    first_name: 'TAMMY',
    list_name: 'THOM',
    dob: '11/07/1984',//
    zip: '28376',
    ssn: '618716661',
    state: 'Delaware',
    street: '236 BRIDGES RD',
    phone: '4088524000',
    bankname: 'The Bancorp Bank',
    routingnumber: '031101279',
    accountnumber: '169135295982',
    license_num: 'c43669991165',
    city: 'RAEFORD',
}

//const pathToExtension = path.join("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
//d:\Downloads\chrome-win
const pathToExtension = path.join("d:\\Downloads\\chrome-win\\chrome.exe")
// console.log(pathToExtension)
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})


const GetRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min



const waitNavigation = async (page, el, step) => {
    await Promise.all([
        page.waitForNavigation(),
        el.click({ delay: GetRandomNum(100, 300) })
    ]).catch(e => {
        console.log(`${step}点击后渲染失败|err:${e}`)
    })
}


const waitTab = async (page, el, step) => {
    try {
        console.log(step)
        await sleep(GetRandomNum(4000, 5000))
        await page.click(el, { delay: GetRandomNum(100, 300) })
    } catch (e) {
        console.log(`${step}点击失败|err:${e}`)
    }
}


const waitbutton = async (page, buttonel, step) => {
    await page.waitForSelector(buttonel, { timeout: 20000 })
    await waitTab(page, buttonel, step)
}


const scrollmove = async (page, dev_width, dev_height, maxNum = 10) => {
    let scrollEnable = true
    var i = 0
    while (scrollEnable && i < maxNum) {
        var l = (parseInt(dev_width / 3 * 2)), m = (parseInt(l / 2)) - GetRandomNum(10, 20), h = (parseInt(dev_height / 3 * 2)) + GetRandomNum(10, 60), t = (parseInt(h / 2)) - GetRandomNum(10, 60)
        var movet = t + GetRandomNum(140, 320)
        await page.mouse.move(l + GetRandomNum(10, m), h, { steps: GetRandomNum(15, 28) })
        await page.mouse.move(l + GetRandomNum(10, m), t, { steps: GetRandomNum(15, 28) })
        scrollEnable = await page.evaluate((scrollStep, dev_height) => {
            let scrollTop = document.documentElement.scrollTop
            document.documentElement.scrollTop = scrollTop + scrollStep
            return document.body.clientHeight > scrollTop + dev_height ? true : false
        }, movet, dev_height)
        i++
        //sleep
        await sleep(GetRandomNum(2000, 4000))
    }
}


const mouseMove = async (page, handle) => {
    let rect = await page.evaluate(el => {
        el.scrollIntoView({ block: "center" })
        let { x, y, width, height } = el.getBoundingClientRect()
        return { x, y, width, height }
    }, handle)
    let handle_x = parseInt(rect.x), handle_y = parseInt(rect.y), ghandle_w = parseInt(rect.width), ghandle_h = parseInt(rect.height)
    if (ghandle_w < 2 || ghandle_h < 2) {
        ghandle_w = GetRandomNum(35, 290)
        ghandle_h = GetRandomNum(10, 35)
    }
    console.log('mouseMove:', handle_x, handle_y)
    await page.mouse.move(GetRandomNum(handle_x, handle_x + ghandle_w), GetRandomNum(handle_y, handle_y + ghandle_h), { steps: GetRandomNum(10, 25) })
    await sleep(GetRandomNum(1000, 2000))
}





const waitTabPage = async (el, step) => {
    try {
        console.log(step)
        await sleep(GetRandomNum(4000, 5000))
        await el.click({ delay: GetRandomNum(100,300) })
    } catch (e) {
        console.log(`${step}点击失败|err:${e}`)
    }
}

const generatePasswordWithSalt = async(id, minLength, maxLength) => {
    const salt = 'CommonMySalt'; // 加盐字符串
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const combinedString = id.toString() + salt; // 将ID与盐字符串拼接
    // 使用拼接后的字符串生成随机密码
    let password = '';
    for (let i = 0; i < combinedString.length; i++) {
      const charIndex = combinedString.charCodeAt(i) % characters.length;
      password += characters.charAt(charIndex);
    }
    // 根据密码长度限制修剪密码
    const trimmedPassword = password.slice(0, Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength);
    return trimmedPassword;
}


const generateRandomDate = async(startYear)  => {
    const currentYear = new Date().getFullYear();
  
    const startTimestamp = new Date(startYear, 0, 1).getTime();
    const currentTimestamp = new Date().getTime();
  
    const randomTimestamp = Math.floor(Math.random() * (currentTimestamp - startTimestamp) + startTimestamp);
    const randomDate = new Date(randomTimestamp);
  
    const year = String(randomDate.getFullYear());
    const month = String(randomDate.getMonth() + 1); 
    const day = String(randomDate.getDate()); 
  
    return {
      year: year,
      month: month,
      day: day
    };
}

const captch_robot = async(pageurl,publickey) => {
    const solver = new Captch.Solver('01c1d5f97509694e34d4c32923c5adb6')
    solver.funCaptcha({
        publickey: publickey,
        pageurl: pageurl
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })
}

const task = async (page_url) => {
    try {

        var reason = "", step = '0'
        userinfo.status = 1
        userinfo.check = 1
        userinfo.reason = ''
        userinfo.img = ''
        userinfo.ip = ''
        // userinfo.phone = generateRandomILPhoneNumber()

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
        Phone.viewport.deviceScaleFactor = Number(Phone.viewport.deviceScaleFactor)
        var dev_width = Phone.viewport.width, dev_height = Phone.viewport.height
        //地理信息
        const locationsinfo = await request({
            uri: `http://lumtest.com/myip.json`,
            timeout: 20000,
            //proxy:oldProxyUr
        })

        let locations = JSON.parse(locationsinfo)
        //navigator.platform
        // Stealth.enabledEvasions.add('navigator.platform')
        puppeteer.use(Stealth)
        // puppeteer.use(require('puppeteer-extra-plugin-repl')())
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: '2captcha',
                    token: '01c1d5f97509694e34d4c32923c5adb6' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY 
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        )

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


        //开启地理位置的权限
        const context = browser.defaultBrowserContext()
        await context.overridePermissions(page_url, ['geolocation'])
        const page = await browser.newPage();

        //监听弹窗
        page.on('dialog', async dialog => {
            await dialog.accept()
        })

        // 设置浏览器信息

        await Promise.all([
            page.setDefaultNavigationTimeout(30000),
            page.emulate(Phone),
            page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9', 'DNT': '1', referer: '' }),
            //基于ip时区
            page.emulateTimezone(locations.geo.tz),
            //基于ip地理位置
            page.setGeolocation({ latitude: locations.geo.latitude, longitude: locations.geo.longitude }),
            // 允许运行js
            page.setJavaScriptEnabled(true),
            page.setDefaultNavigationTimeout(0)
        ])

        await page.goto(page_url, { timeout: 8000 }).catch(e => {
            console.log(` | 目标页面加载超时---${page_url}`)
        })

        userinfo.list_name = userinfo.list_name.toLocaleLowerCase()
        userinfo.first_name = userinfo.first_name.toLocaleLowerCase()

        await sleep(GetRandomNum(1000, 3000))
        step = 'fill user name'
        await page.waitForSelector('input[name="MemberName"]')
        let rand2_3 = GetRandomNum(10,999)
        let username = `${userinfo.list_name}${userinfo.list_name}${rand2_3}`   //firtst_name list_name +  2-3位数字组合
        console.log(step + ' ' + username)
        await page.type('input[name="MemberName"]',username,{ delay: GetRandomNum(300, 600)})
        // await page.waitForSelector('input#iSignupAction')
        // await page.click('input#iSignupAction')
        // await sleep(GetRandomNum(200, 400))

        step = 'select domain'
        page.select('select[name="LiveDomainBoxList"]','hotmail.com')
        await sleep(GetRandomNum(2000, 3000))

        step = 'submit form'
        await page.waitForSelector('input#iSignupAction')
        await page.click('input#iSignupAction')
        await sleep(GetRandomNum(2000, 4000))

        step = 'fill password'
        let pwd = await generatePasswordWithSalt(123,8,10)
        console.log(`${step}: ${pwd}`)
        await page.waitForSelector('input[name="Password"]')
        await page.type('input[name="Password"]',pwd,{ delay: GetRandomNum(300, 600)})
        
        step = 'select option email'
        // await page.click('input#iOptinEmail')
        console.log(step)
        await page.waitForSelector('input#iSignupAction')
        await page.click('input#iSignupAction')
        await sleep(GetRandomNum(2000, 4000))

        step = 'fill userinfo'
        await page.waitForSelector('input[name="FirstName"]')
        await page.focus('input[name="FirstName"]')
        await page.type('input[name="FirstName"]',userinfo.first_name,{ delay: GetRandomNum(300, 600)})
        await page.focus('input[name="LastName"]')
        await page.type('input[name="LastName"]',userinfo.list_name,{ delay: GetRandomNum(300, 600)})
        await page.waitForSelector('input#iSignupAction')
        await page.click('input#iSignupAction')
        
        step = 'country and birth'
        console.log(step)
        let country = 'US'
        await page.waitForSelector('select[name="Country"]')
        await page.select('select[name="Country"]',country)
        await sleep(GetRandomNum(300, 400))
        let startYear = 1990
        const randomDate = await generateRandomDate(startYear)
        const month = randomDate.month.toString()
        const date = randomDate.day.toString()
        const year =  randomDate.year.toString()
        await page.type('input[name="BirthYear"]',year,{ delay: GetRandomNum(300, 600)})
        await page.select('select[name="BirthMonth"]',month)
        await sleep(GetRandomNum(300, 400))
        await page.select('select[name="BirthDay"]',date)
        await sleep(GetRandomNum(300, 400))

        let birth = `${month.padStart(2, '0')}/${date.padStart(2, '0')}/${year}`
        console.log(birth)
        await page.waitForSelector('input#iSignupAction')
        await page.click('input#iSignupAction')
        await sleep(GetRandomNum(6000, 8000))

        step = 'robot validate'
        console.log(step)
        await scrollmove(page, dev_width, dev_height).catch(e => { console.log('scrollmove not move!') })
        await page.waitForSelector('iframe#enforcementFrame')
        const src = await page.$eval('iframe#enforcementFrame', iframe => iframe.src)
        const publickey = src.split('/')[3]
        console.log(`publickey ${publickey}`)
        // const url = new URL(iframeurl);
        // const searchParams = new URLSearchParams(url.search)
        // const publickey = searchParams.get('pk')
        // const surl = searchParams.get('surl')
        const surl = 'https://client-api.arkoselabs.com'
        await captch_robot(surl,publickey)
        console.log('arkoselabs 验证完成')
        await sleep(GetRandomNum(16000, 18000))

        step = 'click continue'
        await waitTab(page,'button.ms-Button.ms-Button--primary.root-121')

        step = 'stay status'
        await page.click('input#idSIButton9')
        await sleep(GetRandomNum(12000,15000))

        
        
    } catch (e) {
        reason = e.message
        userinfo.check = 0
        userinfo.status = 0
        userinfo.reason = reason
        console.log(`注册过程发生错误${step} | error: ${e}`)
    }
}


task('https://outlook.live.com/owa/?nlp=1&signup=1')