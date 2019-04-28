const readline = require('readline');
const fs = require('fs');
const ejs = require('ejs');
const recman = require('./libs/record-manip.js');

/* Generate logs with
    git log --reverse --all -M -C --numstat --format="--%ct--%cn"
*/

const rl = readline.createInterface({
    input: fs.createReadStream('gitlog.txt'),
    crlfDelay: Infinity
});

let buffer = '';
/*
months 
  jan
    fileList
      index.htm
        add: 10
        remove: 10
        total: 20
        ppl
          bob
            add: 1
            remove: 1
          tony
            add: 9
            remove: 9
      index.css
        add: 19
        remove: 1
        */
let months = {};
const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

rl.on('line', (line) => {
    if (line[0] === '-' && line[1] === '-') {
        recman.processRecord(buffer, months, 2016);
        buffer = '';
    }
    buffer += line + "\n";
}).on('close', async () => {
    let tmplMonths = [];
    Object.keys(months).forEach((month) => {
        let tmp = { name: monthName[month], files: [] };
        let sortFileList = [];
        for (let file in months[month].fileList) {
            sortFileList.push({
                file: file,
                add: months[month].fileList[file].add,
                remove: months[month].fileList[file].remove,
                total: months[month].fileList[file].total
            });
        }
        sortFileList.sort((a, b) => {
            return b.total - a.total;
        });
        // Only show top x files
        sortFileList.slice(0, 25).forEach((file) => {
            tmp.files.push({ name: file.file, add: file.add, remove: file.remove });
        });
        tmplMonths.push(tmp);
    });
    //console.log(tmplMonths);
    let tmpl = ejs.render(fs.readFileSync('tmpl/yearly-churn.html', { encoding: 'utf8' }), { months: tmplMonths });
    fs.writeFileSync('yearlyChurn.html', tmpl);

    tmplMonths = [];
    Object.keys(months).forEach((month) => {
        let tmp = { name: monthName[month], files: [] };
        let sortFileList = [];
        for (let file in months[month].fileList) {
            sortFileList.push({
                file: file,
                people: months[month].fileList[file].people,
                totalPeople: Object.keys(months[month].fileList[file].people).length
            });
        }
        sortFileList.sort((a, b) => {
            return b.totalPeople - a.totalPeople;
        });
        // Only show top x files
        sortFileList.slice(0, 10).forEach((file) => {
            tmp.files.push({ name: file.file, people: file.people });
        });
        tmplMonths.push(tmp);
    });
    //console.log(tmplMonths);
    tmpl = ejs.render(fs.readFileSync('tmpl/yearly-crowded.html', { encoding: 'utf8' }), { months: tmplMonths });
    fs.writeFileSync('yearlyCrowded.html', tmpl);
});