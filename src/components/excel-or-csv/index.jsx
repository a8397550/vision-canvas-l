import React from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import {Parser} from 'json2csv';
import XLSX from 'xlsx';
import {Buffer} from 'buffer';

class ExcelOrCsv extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
    options: {
      width: 200,
      height: 36,
      title: '按钮名称-导出',
      filename: "导出文件名",
    },
    data:[[{a: 111, b: 111, c: 111}]] // excel 格式
    // data:[{a: 111, b: 111, c: 111}] // csv 格式
  };

  onClickCsv = () => {
    let {data, options: {filename}} = this.props;

    if (!data || !Array.isArray(data)) {
      data = [];
    }

    const fields = data.length > 0 ? Object.keys(data[0]) : [];
    const opts = {
      fields: fields,
      //  quotes: '',
      excelStrings: true
    };

    if (filename === '' || filename === undefined) {
      filename = 'csv001';
    }

    try {
      const parser = new Parser(opts);
      const csv = parser.parse(data);
      const blob = new Blob([csv], {type: 'text/csv'});
      const myFile = new File([blob], filename + '.csv');
      const a = this.ref;
      const reader = new FileReader();
      const evt = document.createEvent('MouseEvent');

      evt.initMouseEvent('click', true, true);
      reader.readAsDataURL(myFile);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
      reader.onload = function (event) {
        a.href = event.target.result; // base64
        a.download = filename + '.csv';

        a.dispatchEvent(evt);
      };
    } catch (err) {
      console.error(err);  // eslint-disable-line
    }
  }

  onClickExcel = () => {
    let {options: {filename}} = this.props;
    const {data} = this.props;

    if (!data || !Array.isArray(data) || data.length === 0 || data.filter((temp) => {
      return !Array.isArray(temp) || data.length === 0;
    }).length !== 0) {
      console.error('导出excel文件数据源异常'); // eslint-disable-line

      return;
    }

    const fields = [];

    for (let i = 0; i < data.length; i += 1) { // 每行的第一个单元格
      fields.push(Object.keys(data[i][0]));
    }

    data.length > 0 ? Object.keys(data[0]) : [];


    if (filename === '' || filename === undefined) {
      filename = 'excel001';
    }

    const s2ab = function (s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);

      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;

      return buf;
    };


    try {
      let workbook;

      for (let i = 0; i < data.length; i += 1) {
        const opts = {
          fields: fields[i],
          //  quotes: '',
          excelStrings: true
        };
        const parser = new Parser(opts);
        const csv = parser.parse(data[i]);

        if (!workbook) {
          workbook = XLSX.read(csv, {type: 'binary'});
        } else {
          var temp = XLSX.read(csv, {type: 'binary'});
          const key = 'Sheet' + (i + 1);

          workbook.SheetNames.push(key);
          temp.Sheets[key] = temp.Sheets[temp.SheetNames[0]];
          delete temp.Sheets[temp.SheetNames[0]];
          Object.assign(workbook.Sheets, temp.Sheets);
        }
      }

      const a = this.ref;
      const reader = new FileReader();
      const evt = document.createEvent('MouseEvent');


      var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};

      var wbout = XLSX.write(workbook, wopts);


      const buffer = Buffer.from(s2ab(wbout));

      const blob = new Blob([buffer], {type: 'application/vnd.ms-excel'});
      const myFile = new File([blob], filename + '.xlsx');


      evt.initMouseEvent('click', true, true);
      reader.readAsDataURL(myFile);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
      reader.onload = function (event) {
        a.href = event.target.result; // base64
        a.download = filename + '.xlsx';

        a.dispatchEvent(evt);
      };
    } catch (err) {
      console.error(err);  // eslint-disable-line
    }
  }

  onClickImportExcel() {
    window.XLSX = XLSX;
    const fileDom = document.createElement("input");
    fileDom.type = 'file';
    fileDom.accept = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    fileDom.addEventListener("change", (data) => {
      debugger;
      var reader = new FileReader();
      reader.readAsArrayBuffer(fileDom.files[0]);//读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
      reader.onload = function(event){
        debugger;
        const arrayBuffer = event.target.result // ArrayBuffer
        const workbook = XLSX.read(arrayBuffer, {type:"array"});
        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2',……]
        // 根据表名获取对应某张表
        const worksheet = workbook.Sheets[sheetNames[0]];
        const workjson = XLSX.utils.sheet_to_json(worksheet);
        const workarr = [workjson.map(item => {
          return Object.keys(item).map(key => item[key]);
        })]
      }
    });
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, true);
    fileDom.dispatchEvent(evt);
  }

  render() {
    const {style, className, options: {width, height, title}} = this.props;
    const _style = {};

    Object.assign(_style, style || {});
    if (width) {
      _style.width = width;
    }

    if (height) {
      _style.height = height;
    }

    return (
      <div className={[className].join(' ')} style={_style}>
        <a ref={(ref) => {
          if (ref) {
            this.ref = ref;
          }
        }} />
        <Button style={_style} onClick={this.onClickImportExcel}>{title}</Button>
      </div>
    );
  }
}

export default ExcelOrCsv;