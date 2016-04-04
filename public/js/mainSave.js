var xhr = require("xhr")
console.log('HELLO!!!!')
function downloadTest(callback){
    console.log('inside downTest')
    var begin = Date.now() 
    //console.log('begin time', begin)
    xhr('/file.m4a', function (err, resp, body) {
        console.log('Inside xhr callback, for download')
        if (err) console.log(err)
        else{ 
            var end = Date.now() 
            var miliElapse = end - begin
            mBytesSize = resp.headers['content-length']
            mBitsPerSecond = (mBytesSize/miliElapse)
            //console.log('Doewnload fileSize', resp.headers['content-length'])
            //console.log('mBytesSize', mBytesSize) 
            //console.log('miliElapse', Number(miliElapse)) 
            callback(mBitsPerSecond, body, resp.headers['content-length'])
        }
    })
}
    
function uploadTest(body, fileSize, callback){
    console.log('inside upTest')
    xhr({'method': 'POST', 'uri': '/uploadTest', 'body': body }, function(err, resp, miliElapse){
        //console.log('Inside xhr callback, for upload')
        if (err) console.log('err',err)
        else{
            //console.log('Upload fileSize', fileSize)
            miliElapse = Number(miliElapse)
            var mBytesSize = fileSize, 
            mBitsPerSecond = (fileSize/miliElapse)*8000
            //console.log('mBitsPerSecond Up', mBitsPerSecond)
            callback(mBitsPerSecond)
        }
    })
}

var newSpeedTestForms = document.querySelectorAll('.addSpeedTest')

for (var i =0; i< newSpeedTestForms.length; i++) (function(form){
    console.log('newSpeedTestForm conditional')
    form.addEventListener('click', function(event){
        console.log('addSpeedTest Event Triggered')
        event.preventDefault()
        //console.log('addSpeedTest Event Triggered')
        downloadTest(function(downloadSpeed, body, fileSize){
            uploadTest(body, fileSize, function(uploadSpeed){
                
                var now = new Date(),
                timeStamp = now.toISOString()
                console.log('xhr log')
                var postInfo = {
                    headers: {'content-type': 'application/json' },
                    method: 'POST', 
                    uri: '/addSpeedTest', 
                    body: JSON.stringify({
                        id: form.elements.id.value,
                        test: {
                            timeStamp: timeStamp,
                            downloadSpeed: Math.round(downloadSpeed*10)/10, 
                            uploadSpeed: Math.round(uploadSpeed*10)/10
                        }
                    })
                }
                
                console.log('downloadSpeed',downloadSpeed) 
                console.log('uploadTest',uploadSpeed)
                console.log('postInfo',postInfo)
                
                xhr(postInfo, function(err) {   
                    if (err) console.log(err) 
                    location.reload()
               
                })
            })
       
        })
         
    })
})(newSpeedTestForms[i])
console.log("Add test event listeners added")
var newCafeForm = document.querySelector('#new-cafe')
newCafeForm.addEventListener('submit', function(event){
    event.preventDefault()
    downloadTest(function(downloadSpeed, body, fileSize){
        uploadTest(body, fileSize, function(uploadSpeed){
            
            var now = new Date(),
            timeStamp = now.toISOString()
            
            var postInfo = {
                headers: {'content-type': 'application/json' },
                method: 'POST', 
                uri: '/addCafe', 
                body: JSON.stringify({
                    name: newCafeForm.elements.name.value,
                    address: newCafeForm.elements.address.value,
                    testList: [{timeStamp: timeStamp,
                                downloadSpeed: Math.round(downloadSpeed*10)/10, 
                                uploadSpeed: Math.round(uploadSpeed*10)/10}]
                    
                    //testList: [3, 'test', {}]
                })
            } 
            xhr(postInfo, function(err) {   
                if (err) console.log(err) 
                location.reload()
           
            }) 
        })
   
    })
})
