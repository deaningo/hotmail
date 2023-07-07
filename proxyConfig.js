const request = require('request-promise')

exports.oldProxyTypeUrl=async(state='',ipType='rola',country='US')=>{
    
    let oldProxyUrl=false
    let county_code=country.toLowerCase()
    let state_code= state!==''?state.toLowerCase():state

     switch (ipType) {
        
         case 'lumi':
             username = 'brd-customer-hl_cfc27f00-zone-verification01'
             password = 'H2waL7ChHZRkC6P26'
             port = 22225
             session_id = (1000000 * Math.random())|0
            oldProxyUrl = 'http://'+username+'-country-'+county_code+'-session-'+session_id+':'+password+'@zproxy.lum-superproxy.io:'+port
            break;


          case 'smart':
             username = 'ServiceKdL5Wfz2d'
             password = 'Gsmz6B8EmroktOjqGK'
             port = 1000
             session_id = (1000000 * Math.random())|0
            oldProxyUrl = 'http://'+username+'_area-'+country+'_session-'+session_id+'_life-5:'+password+'@proxy.smartproxycn.com:'+port
            break;  
            
            
          case 'jt':
             username = 'v32wk'
             password = 'a32auxob'
             port = 5432
             session_id = (1000000 * Math.random())|0
            oldProxyUrl = 'http://'+username+':'+password+'@115.167.112.61:'+port
            break; 
            
            
         case 'rola':
                let rolaApi=await request({
                  uri: 'http://list.rola.info:8088/user_get_ip_list?token=4nxDSjcdjl0xSubc1672890765510&qty=1&country='+county_code+'&state='+state_code+'&city=&time=10&format=json&protocol=http&filter=1&area=us',
                  timeout:10000,
                  
                }).catch( e=>{
                    console.log('获取rolaApi失败')
                })

                let rolaApiInfo= JSON.parse(rolaApi)
                if(rolaApiInfo.msg!=='成功'){
                    console.log('ip获取失败',rolaApiInfo)
                    return oldProxyUrl
                }        
               oldProxyUrl = 'http://'+rolaApiInfo.data
            break;    
        
    }
   
   return oldProxyUrl
}

