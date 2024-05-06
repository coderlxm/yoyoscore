<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useResultStore } from "@/stores/result";
import { useRecordStore } from "@/stores/record";
import resultTable from "@/components/resultTable.vue"
import { showConfirmDialog } from 'vant';
import { useSettingStore } from "@/stores/setting";
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
const isEditMode = ref(false)
// 默认为1 总分模式1 计数模式0
const scoreMode = ref(1)
const store = useResultStore()
const recordStore = useRecordStore()
const edit = () => {
  isEditMode.value = !isEditMode.value
}
const del = (item) => {
  const itemAtIndex = recordStore.$state.recordedGames.findIndex((record) => item.name === record.name)
  // console.log(itemAtIndex);
  recordStore.$state.recordedGames.splice(itemAtIndex, 1)
}
const toggleScoreMode = () => {
  scoreMode.value === 0 ? scoreMode.value = 1 : scoreMode.value = 0
}
const router = useRouter()
const back = () => {
  router.push({ name: 'home' })
}

const delGame = (item) => {
  showConfirmDialog({
    title: `确认要删除比赛${item[0].game}吗？`,
    theme: 'round-button',
    confirmButtonColor: '#f01654',
    cancelButtonColor: useSettingStore().darkTheme === 'dark' ? '#111' : '#fff',
  })
    .then(() => {
      // 下面这个方法是错的,有数组数组索引偏移的问题
      // recordStore.recordedGames.forEach((record, index) => {
      //   if (item[0].game === record.game) {
      //     recordStore.recordedGames.splice(index, 1)
      //   }
      // })
      recordStore.recordedGames = recordStore.recordedGames.filter((record) => item[0].game !== record.game)
    })
    .catch(() => {
      // on cancel
    });
}
const exportResults = () => {
  const gameData = Object.values(recordStore.recordGroupedAndRanked).map((item, index) => {
    return {
      data: item.map((item2, index) => {
        return {
          name: item2.name || '-',
          score: store.dealScoreDisplay({ scoreMode: 'full', results: item }, item2),
          rank: useSettingStore().settingForm.sort === '1' ? index + 1 : item.length -
            index,
        }
      })
    }
  })
  const tables = Object.keys(recordStore.recordGroupedAndRanked).map((item, index) => {
    return {
      title: item,
      headers: [["选手姓名", "得分", "排名"]],
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
        vertical: 'middle'
      };
    });
  };
  // 创建 Excel 文件
  const createExcelFile = async (filename) => {
    const workbook = new ExcelJS.Workbook();

    tables.forEach(table => {
      const worksheet = workbook.addWorksheet(table.title || ' ');

      // 添加标题
      worksheet.mergeCells('A1', 'C1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = table.title || ' ';
      titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F01654' }
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
      headerRow.height = 22.5; // 默认行高的1.5倍（15 * 1.5）
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F01654' }
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
      // 添加数据
      table.data.forEach(item => {
        const dataRow = Object.values(item);
        const row = worksheet.addRow(dataRow);
        row.height = 17.5
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
watchEffect(() => {
  if (useSettingStore().darkTheme === 'dark') {
    document.documentElement.style.setProperty(
      '--cancel-button-color', '#fff'
    );
  } else {
    document.documentElement.style.setProperty(
      '--cancel-button-color', 'black')
  }
})
</script>
<template>
  <div class="flex gap-3 mb-5 w-full mt-8">
    <van-button class="flex-1" @click="toggleScoreMode" size="small" color="#f01654">切换分数显示模式</van-button>
    <van-button plain class="flex-1" @click="edit" size="small" color="#f01654">{{ isEditMode ? '退出编辑' : '编辑'
      }}</van-button>
  </div>
  <van-collapse v-model="store.$state.activeNames">
    <van-collapse-item :name="key" v-for="(item, key) in recordStore.recordGroupedAndRanked" :key="key">
      <template #title>
        <div class="flex justify-between items-center">
          <div class="pr-2 flex flex-1 justify-between font-700 font-size-4 color-#f01654">
            <div>比赛名称</div>
            <div>{{ key }}</div>
          </div>
          <div class="mt--1" v-if="isEditMode"><van-button @click.stop="delGame(item)" size="mini"
              color="#f01654">删除</van-button></div>
        </div>
      </template>
      <result-table @del="del" :scoreMode="scoreMode" :isEditMode="isEditMode" :results="item"></result-table>
    </van-collapse-item>
    <!-- <van-collapse-item title="选手姓名" name="2">
      <van-cell-group inset>
        <van-field v-model="store.$state.name" label="请输入" placeholder="选手姓名" />
      </van-cell-group>
    </van-collapse-item> -->
  </van-collapse>
  <div class="grid gap-4 mt-4">
    <van-button :disabled="!Object.keys(recordStore.recordGroupedAndRanked).length" @click="exportResults" round block
      color="#f01654">导出比赛成绩为Excel表格</van-button>
    <van-button color="#f01654" @click="back" round block plain>
      返回
    </van-button>
  </div>
</template>
<style>
:root {
  --cancel-button-color: black;
  /* 默认颜色 */
}

.van-dialog__cancel {
  color: var(--cancel-button-color) !important;
  /* 示例颜色 */
}
</style>