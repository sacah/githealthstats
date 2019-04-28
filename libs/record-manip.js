function processRecord(record, records, forYear = new Date().getFullYear()) {
    let log = record.split("\n");
    let [ gap, timestamp, author ] = log[0].split('--');
    let month = new Date(timestamp * 1000).getMonth();
    let year = new Date(timestamp * 1000).getFullYear();
    if (year != forYear) return;
    if (!records[month]) {
        records[month] = {
            fileList: {}
        };
    }
    author = author.replace(/\s/g, '').toLowerCase();
    log.forEach((line) => {
        if (!isNaN(~~line[0])) {
            const [add, remove, file] = line.split("\t");
            if (file) {
                if (!records[month].fileList[file]) {
                    records[month].fileList[file] = {
                        add: 0,
                        remove: 0,
                        total: 0,
                        people: {}
                    };
                }
                if (!records[month].fileList[file].people[author]) {
                    records[month].fileList[file].people[author] = {
                        add: 0,
                        remove: 0,
                        total: 0
                    };
                }
                records[month].fileList[file].add += ~~add;
                records[month].fileList[file].remove += ~~remove;
                records[month].fileList[file].total += (~~add + ~~remove);
                records[month].fileList[file].people[author].add += ~~add;
                records[month].fileList[file].people[author].remove += ~~remove;
                records[month].fileList[file].people[author].total += (~~add + ~~remove);
            }
        }
    });
}

module.exports = {
  processRecord
};