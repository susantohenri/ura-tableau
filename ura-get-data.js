const fs = require('fs')
var AccessKey = '82a93672-8507-486e-84f9-2080735b6103'

function getToken() {
    return new Promise((resolve, reject) => {
        var https = require('follow-redirects').https;

        var options = {
            'method': 'GET',
            'hostname': 'www.ura.gov.sg',
            'path': '/uraDataService/insertNewToken.action',
            'headers': {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Pragma': 'no-cache',
                'AccessKey': AccessKey,
                'Cookie': 'BIGipServerIAPP-HTTPS_A83-WWW.URA.GOV.SG_V4.app~IAPP-HTTPS_A83-WWW.URA.GOV.SG_V4_pool=935897280.20480.0000; TS0117b822=01e0d9e46e06b5f2489a5b1f8c262582d13c92ce6ab3828d0237b8773b35fb617fe1e2622507ea7e3e480f83f1c50ea356769f5dd4'
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(JSON.parse(body.toString()).Result)
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        req.end();
    })
}

function getData(token, batch) {
    return new Promise((resolve, reject) => {
        var https = require('follow-redirects').https;

        var options = {
            'method': 'GET',
            'hostname': 'www.ura.gov.sg',
            'path': '/uraDataService/invokeUraDS?service=PMI_Resi_Transaction&batch=' + batch,
            'headers': {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Pragma': 'no-cache',
                'AccessKey': AccessKey,
                'Token': token,
                'Cookie': 'BIGipServerIAPP-HTTPS_A83-WWW.URA.GOV.SG_V4.app~IAPP-HTTPS_A83-WWW.URA.GOV.SG_V4_pool=935897280.20480.0000; TS0117b822=01e0d9e46e35a0d31e6593c6ee8fea95057b63db85dd33729b3858e532a0ccef40b3d72e9bac2bcb941a26c292f58bef964d77514f'
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(JSON.parse(body.toString()).Result)
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        req.end();

    })
}

getToken().then(token => {
    Promise.all([
        getData(token, 1),
        getData(token, 2),
        getData(token, 3),
        getData(token, 4)
    ])
        .then(result => {
            var final_result = result[0]
            if (result[1]) final_result = final_result.concat(result[1])
            if (result[2]) final_result = final_result.concat(result[2])
            if (result[3]) final_result = final_result.concat(result[3])
            fs.writeFileSync(`Examples/json/ura.json`, JSON.stringify(final_result))
        })
})