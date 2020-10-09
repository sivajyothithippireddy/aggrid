import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
]);
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  tablerowData;
  data;
  filteredList;
  selectedItem;
  columnDefs;
  splitedValue: any;
  rangeFirstValue: any;
  rangeSecondValue: any;
  gridApi: any;
  gridColumnApi: any;
  searchData = [
    { range: '10000-20000' },
    { range: '20000-30000' },
    { range: '30000-40000' },
    { range: '40000-100000' },
  ]
  constructor(private service: ServiceService) { }
  ngOnInit(): void {
    this.getJsonData();
  }
  getJsonData() {
    this.service.getJsonData().subscribe(res => {
      this.tablerowData = res;
    })
  }

  range(e) {
    this.selectedItem = e;
    this.splitedValue = this.selectedItem.split('-');
    this.rangeFirstValue = this.selectedItem[0];
    this.rangeSecondValue = this.splitedValue[1];
  }
// import
  generateColumns(data: any[]) {
    let columnDefinitions = [];
    data.map(object => {
      Object
        .keys(object)
        .map(key => {
          let mappedColumn = {
            headerName: key.toUpperCase(),
            field: key
          }
          columnDefinitions.push(mappedColumn);
        })
    })
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )
    return columnDefinitions;
  }
  getExelFile(fileInput: any) {
    let fileReaded = fileInput.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(fileReaded);
    reader.onload = (e) => {
      let csv: any = reader.result;
      let lines = csv.split("\n");
      let result = [];
      let headers = lines[0].split(",");
      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
          let dataString = String(currentline[j])
          console.log(dataString.toString());
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      console.log(result);
      this.tablerowData = result;
      this.columnDefs = this.generateColumns(this.tablerowData)
    }
  }
// export
  Excel() {
    this.gridApi.exportDataAsCsv();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.getJsonData().subscribe((data) => {
      this.tablerowData = data;
      this.columnDefs = this.generateColumns(this.tablerowData)
      params.api.setRowData(data)
    });
  }

}
