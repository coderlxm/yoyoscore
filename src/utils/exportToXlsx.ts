import writeExcelFile from 'write-excel-file/browser'
import type { CellObject, Cell } from 'write-excel-file/browser'

import { useRecordStore } from '@/stores/record'
import { useResultStore } from '@/stores/result'
import { useSettingStore } from '@/stores/setting'
import type { GroupedRecords, ScoreFormatter, SortDirection } from '@/types/domain'

const headers = ['选手姓名', '得分', '排名', '备注']
const columns = [
  { width: 20 },
  { width: 25 },
  { width: 10 },
  { width: 40 }
]

const borderedCell: CellObject = {
  align: 'center',
  alignVertical: 'center',
  borderColor: '#000000',
  borderStyle: 'thin',
  wrap: true
}

export function buildExportSheets({
  groupedRecords,
  primaryColor,
  scoreFormatter,
  sortOrder
}: {
  groupedRecords: GroupedRecords
  primaryColor: string
  scoreFormatter: ScoreFormatter
  sortOrder: SortDirection
}) {
  return Object.entries(groupedRecords).map(([title, results]) => {
    const titleCell: CellObject = {
      ...borderedCell,
      value: title || ' ',
      columnSpan: 4,
      height: 40,
      fontSize: 14,
      fontWeight: 'bold',
      textColor: '#FFFFFF',
      backgroundColor: primaryColor
    }
    const headerRow: CellObject[] = headers.map((value) => ({
      ...borderedCell,
      value,
      height: 30,
      fontWeight: 'bold',
      textColor: '#FFFFFF',
      backgroundColor: primaryColor
    }))
    const dataRows: Cell[][] = results.map((result, index) => {
      const rank = sortOrder === '1' ? index + 1 : results.length - index
      return [
        result.name || '--',
        scoreFormatter({ scoreMode: 'full', results }, result),
        rank,
        result.tips || '--'
      ].map((value): CellObject => ({ ...borderedCell, value, height: 25 }))
    })

    return {
      sheet: title || ' ',
      columns,
      data: [[titleCell, null, null, null], headerRow, ...dataRows]
    }
  })
}

export default async function exportResults(): Promise<void> {
  const recordStore = useRecordStore()
  const resultStore = useResultStore()
  const settingStore = useSettingStore()
  const sheets = buildExportSheets({
    groupedRecords: recordStore.recordGroupedAndRanked,
    primaryColor: settingStore.primaryColor,
    scoreFormatter: resultStore.dealScoreDisplay,
    sortOrder: settingStore.settingForm.sort
  })

  await writeExcelFile(sheets).toFile('比赛成绩表.xlsx')
}
