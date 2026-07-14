import { describe, expect, it, vi } from 'vitest'
import writeExcelFile from 'write-excel-file/universal'
import type { Cell } from 'write-excel-file/browser'

import { buildExportSheets } from './exportToXlsx'
import type { GameRecord, ScoreFormatter } from '@/types/domain'

const cellValue = (cell: Cell): unknown => {
  if (cell !== null && typeof cell === 'object' && 'value' in cell) {
    return cell.value
  }
  return cell
}

describe('Excel export data', () => {
  it('preserves sheets, score formatting, rank, and remarks', () => {
    const scoreFormatter: ScoreFormatter = vi.fn(() => '100.00(10-0=10)')
    const records: GameRecord[] = [
      { name: 'Alice', pointadd: 10, pointmin: 0, sumScore: 10, tips: 'clean', game: 'Final' },
      { name: '', pointadd: 5, pointmin: 1, sumScore: 4, tips: '', game: 'Final' }
    ]
    const sheets = buildExportSheets({
      groupedRecords: { Final: records },
      primaryColor: '#f01654',
      scoreFormatter,
      sortOrder: '1'
    })

    expect(sheets).toHaveLength(1)
    expect(sheets[0].sheet).toBe('Final')
    expect(sheets[0].data[0][0]).toMatchObject({
      value: 'Final',
      columnSpan: 4,
      backgroundColor: '#f01654'
    })
    expect(sheets[0].data[2].map(cellValue)).toEqual([
      'Alice',
      '100.00(10-0=10)',
      1,
      'clean'
    ])
    expect(sheets[0].data[3].map(cellValue)).toEqual([
      '--',
      '100.00(10-0=10)',
      2,
      '--'
    ])
    expect(scoreFormatter).toHaveBeenCalledTimes(2)
  })

  it('produces a non-empty XLSX blob', async () => {
    const records: GameRecord[] = [{ name: 'Alice', pointadd: 0, pointmin: 0, sumScore: 10, tips: '', game: 'Final' }]
    const sheets = buildExportSheets({
      groupedRecords: { Final: records },
      primaryColor: '#f01654',
      scoreFormatter: () => '10',
      sortOrder: '1'
    })

    const blob = await writeExcelFile(sheets).toBlob()
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    expect(blob.size).toBeGreaterThan(1000)
  })
})
