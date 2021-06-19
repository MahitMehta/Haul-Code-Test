const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/userData', (req, res) => {
    let pageNum = req.query.pageNum ? parseInt(req.query.pageNum) : undefined;

    let mostRecentFileNum = 3; 
    let hasNextPage = false; 
    let hasPrevPage = false; 

    const dataFilesDir = path.join(__dirname, "../data/");

    fs.readdir(dataFilesDir, (err, data) => {
        if (err) {
            console.log(err);
            return; 
        }
        
        data.forEach(fname => {
            const fnamePageNum = parseInt(fname.split("dataset")[1].substring(0, 1));
            if (fnamePageNum > mostRecentFileNum) mostRecentFileNum = fnamePageNum;
        });

        // Need ">=" to have back and fourth 
        hasNextPage = pageNum ? mostRecentFileNum >= pageNum : mostRecentFileNum > 1;
        hasPrevPage = pageNum > 0 && pageNum < mostRecentFileNum;
;
        const pageToQuery = pageNum ? pageNum : mostRecentFileNum;  

        fs.readFile(path.join(__dirname,`../data/dataset${pageToQuery}.json`), 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ error: true, userData: [] });
                return; 
            };
            
            if (data) {
                res.status(200).json({ error: false, page: pageToQuery, hasPrevPage, hasNextPage, userData: JSON.parse(data)});
            } else res.status(500).json({ error: false, userData: [] });
        });
    });
});

module.exports = router; 