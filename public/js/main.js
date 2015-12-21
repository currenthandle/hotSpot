var xhr = require("xhr")
function downloadTest(callback){
    console.log('inside downTest')
    var begin = Date.now() 
    console.log('begin time', begin)
    xhr('/test.mp3', function (err, resp, body) {
        console.log('Inside xhr callback, for download')
        if (err) console.log(err)
        else{ 
            var end = Date.now() 
            var miliElapse = end - begin
			var secondElapse = miliElapse * Math.pow(10, -3)
			
            var bytesSize = Number(resp.headers['content-length'])
			var megaBitsSize = bytesSize * 8 * Math.pow(10, -6)
            megaBitsPerSecond = (megaBitsSize/secondElapse)
			
            console.log('miliElapse', miliElapse) 
            console.log('secondElapse', secondElapse) 
            
			//console.log("resp.headers['content-length']", resp.headers['content-length'])
            console.log('bytesSize', bytesSize) 
            console.log('megaBitsSize', megaBitsSize) 
			
            callback(megaBitsPerSecond, body, megaBitsSize)
        }
    })
}
    
function uploadTest(body, megaBitsSize, callback){
    console.log('inside upTest')
    xhr({'method': 'POST', 'uri': '/uploadTest', 'body': body }, function(err, resp, miliElapse){
        console.log('Inside xhr callback, for upload')
        if (err) console.log('err',err)
        else{
            console.log('megaBitsSize', megaBitsSize)
            console.log('MiliElapse', miliElapse)
            miliElapse = Number(miliElapse)
			var secondElapse = miliElapse * Math.pow(10, -3)
            megaBitsPerSecond = megaBitsSize/secondElapse
            //console.log('mBitsPerSecond Up', mBitsPerSecond)
            callback(megaBitsPerSecond)
        }
    })
}

var downloadHeader = document.querySelector('#downloadHeader')
downloadHeader.addEventListener('click', function(event){
		
    xhr({'method': 'POST', 'uri': '/uploadTest', 'body': body }, function(err, resp, miliElapse){
        console.log('Inside xhr callback, for upload')
        if (err) console.log('err',err)
        else{
            console.log('Upload fileSize', fileSize)
            miliElapse = Number(miliElapse)
            var mBytesSize = fileSize, 
            mBitsPerSecond = (fileSize/miliElapse)*8000
            console.log('mBitsPerSecond Up', mBitsPerSecond)
            callback(mBitsPerSecond)
        }
    })
	
	event.preventDefault()

})

var newSpeedTestForms = document.querySelectorAll('.addTest')
//console.log('newSpeedTestForms', newSpeedTestForms)
for (var i = 0; i < newSpeedTestForms.length; i++) (function(form){
    console.log('newSpeedTestForm conditional')
    form.addEventListener('click', function(event){
		console.log('form.elements.id.value,',form.elements.id.value)
        console.log('addSpeedTest Event Triggered')
        event.preventDefault()
        console.log('addSpeedTest Event Triggered')
		console.log('calling downloadTest on next line')
        downloadTest(function(downloadSpeed, body, fileSize){
            uploadTest(body, fileSize, function(uploadSpeed){
                
                var now = new Date(),
                timeStamp = now.toISOString()
                //console.log('xhr log')
                var postInfo = {
                    headers: {'content-type': 'application/json' },
                    method: 'POST', 
                    uri: '/addTest', 
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
                console.log('uploadSpeed',uploadSpeed)
                console.log('postInfo',postInfo)
                
                xhr(postInfo, function(err) {   
                    if (err) console.log(err) 
                    location.reload()
               
                })
            })
       
        })
         
    })
})(newSpeedTestForms[i])

var newCafeForm = document.querySelector('#addCafe')
newCafeForm.addEventListener('submit', function(event){
	console.log('inside add event listener')
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
                                uploadSpeed: Math.round(uploadSpeed*10)/10}],
					downAvg: Math.round(downloadSpeed*10)/10, 
                   	upAvg: Math.round(uploadSpeed*10)/10
                })
            } 
			console.log('postInfo', postInfo)
            xhr(postInfo, function(err) {   
                if (err) console.log(err) 
                location.reload()
           
            }) 
        })
   
    })
})
