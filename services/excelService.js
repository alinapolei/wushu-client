//TODO: do we use it? if yes add documentation
app.service('excelService', function () {
    this.dropZoneDropFile = function (e, callback) {
        e.stopPropagation();
        e.preventDefault();
        let files = e.dataTransfer.files, i, f;
        let ans = new Object();
        f = files[0]
        let reader = new FileReader();
        ans.fileName = f.name;
        reader.onload = function (e) {
            let
                data = e.target.result,
                fixedData = fixData(data),
                workbook = XLSX.read(btoa(fixedData), {type: 'base64'}),
                firstSheetName = workbook.SheetNames[0],
                worksheet = workbook.Sheets[firstSheetName];
            let range = XLSX.utils.decode_range(workbook.Sheets[firstSheetName]['!ref']);
            range.s.c = 0; // 0 == XLSX.utils.decode_col("A")
            range.e.c = 20; // 6 == XLSX.utils.decode_col("Q")
            let new_range = XLSX.utils.encode_range(range);
            ans.result = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
                header:1,
                blankrows: false,
                //defval: '',
                range: new_range
            });
            //ans.result = XLSX.utils.sheet_to_json(worksheet);

            console.log(ans.result)

            callback(ans);
        };
        reader.readAsArrayBuffer(f);
    }

    this.uploadExcel = function (e, callback) {
        let input = e.target;
        let reader = new FileReader();
        let results;
        reader.onload = function () {
            let fileData = reader.result,
                fixedData = fixData(fileData),
                workbook = XLSX.read(btoa(fixedData), {type: 'base64',sheetStubs: true}),
                firstSheetName = workbook.SheetNames[0],
                worksheet = workbook.Sheets[firstSheetName];
            let range = XLSX.utils.decode_range(workbook.Sheets[firstSheetName]['!ref']);
            range.s.c = 0; // 0 == XLSX.utils.decode_col("A")
            range.e.c = 20; // 6 == XLSX.utils.decode_col("Q")
            let new_range = XLSX.utils.encode_range(range);
            results = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
                header: 1,
                blankrows: false,
                //defval: '',
                range: new_range
            });
            console.log(results)
            callback(results);
        };
        reader.readAsArrayBuffer(input.files[0]);
    };


    function fixData(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

});

