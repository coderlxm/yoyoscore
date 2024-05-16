// import { recordStore, resultStore, settingStore } from "@/stores";
import { useRecordStore } from "@/stores/record";
import { useResultStore } from "@/stores/result";
import { useSettingStore } from "@/stores/setting";
import ExcelJS from 'exceljs';
const recordStore = useRecordStore()
const settingStore = useSettingStore()
const resultStore = useResultStore()
const exportResults = () => {
  const gameData = Object.values(recordStore.recordGroupedAndRanked).map((item) => {
    return {
      data: item.map((item2, index) => {
        return {
          name: item2.name || '--',
          score: resultStore.dealScoreDisplay({ scoreMode: 'full', results: item }, item2),
          rank: settingStore.settingForm.sort === '1' ? index + 1 : item.length -
            index,
          tips: item2.tips || '--'
        }
      })
    }
  })
  const tables = Object.keys(recordStore.recordGroupedAndRanked).map((item, index) => {
    return {
      title: item,
      headers: [["选手姓名", "得分", "排名", "备注"]],
      ...gameData[index]
    }
  })
  // 为所有单元格添加边框样式的函数
  const addBorders = (row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
    });
  };
  // 创建 Excel 文件
  const createExcelFile = async (filename) => {
    const workbook = new ExcelJS.Workbook();

    tables.forEach(table => {
      const worksheet = workbook.addWorksheet(table.title || ' ');

      // 添加标题
      worksheet.mergeCells('A1', 'D1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = table.title || ' ';
      titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: settingStore.primaryColor.slice(1) }
      };

      // 设置标题单元格的行高
      worksheet.getRow(1).height = 40;
      addBorders(worksheet.getRow(1)); // 为标题行添加边框

      // 添加空行
      // worksheet.addRow([]);

      // 添加表头
      const headers = table.headers[0];
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.height = 30; // 默认行高的1.5倍（15 * 1.5）
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: settingStore.primaryColor.slice(1) }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      addBorders(headerRow); // 为表头行添加边框
      // 设置选手姓名列的宽度为默认宽度的2倍
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 25;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 40;
      // 添加数据
      table.data.forEach(item => {
        const dataRow = Object.values(item);
        const row = worksheet.addRow(dataRow);
        row.height = 25
        addBorders(row); // 为数据行添加边框
      });
    });

    // 导出 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // 导出 Excel
  createExcelFile('比赛成绩表.xlsx');
}

export default exportResults