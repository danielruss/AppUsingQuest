// synchronizing questionnaire to donate

console.log(`syncDonate.mjs imported\n ${Date()}`);

let dona = await import('https://episphere.github.io/donate/methods.js')

function getToken(){ // extract parameters from search or hash
    let donateToken=null
    if(location.href.match(/donateToken=[^&#]+/)){
        donateToken=(location.search+location.hash).match(/donateToken=[^&#]+/)[0].split('=')[1]
        //location.href=location.href.replace(/[#&]donateToken=[^&#]+/,'')
    }
    return donateToken
}

let token = getToken()

async function sync(dt,token=token,url="https://donate.jonasalmeida.repl.co"){ // synch data to donate backend
    await dona.setUrl(url)
    console.log('deployment:',dona)
    let old = JSON.parse(await dona.get(url))
    console.log('old data:',old)
    return await dona.post(token,dt)
}

export{
    token,
    sync
}