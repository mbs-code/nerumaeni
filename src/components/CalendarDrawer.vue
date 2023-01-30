<template>
  <van-action-sheet
    v-model:show="show"
    title="日付の選択"
    style="--van-action-sheet-max-height: 95%"
  >
    <div class="p-4 flex flex-col gap-2">
      <!-- タイトルヘッダ -->
      <div class="flex items-center gap-1">
        <van-button
          class="!min-w-0 w-[55px]"
          icon="arrow-left"
          size="small"
          @click="onMoveMonth(-1)"
        />

        <div class="flex-grow text-center font-bold">
          {{ title }}
        </div>

        <van-button
          class="!min-w-0 w-[55px]"
          icon="arrow"
          size="small"
          @click="onMoveMonth(1)"
        />
      </div>

      <!-- 曜日ヘッダ -->
      <div class="my-1 flex gap-1">
        <div
          v-for="(label, _) of weekHeaders"
          :key="_"
          class="flex-1 !min-w-0 text-center"
        >
          {{ label }}
        </div>
      </div>

      <!-- カレンダー本体 -->
      <div class="flex flex-col gap-1">
        <div
          v-for="(week, _) of monthItems"
          :key="_"
          class="flex gap-1"
        >
          <template v-for="(day, __) of week" :key="`${_}-${__}`">
            <van-button
              v-bind="day.bind"
              class="flex-1 !min-w-0"
              @click="onClickDate(day)"
            >
              {{ day.label }}
            </van-button>
          </template>
        </div>
      </div>

      <van-button type="primary" block :disabled="!selectedDate" @click="onSelect">
        選択
      </van-button>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { DateTime, Info } from 'luxon'

type DateItem = {
  date: DateTime,
  label: string,
  bind: { [key: string]: unknown },
}

const props = defineProps<{
  modelValue: boolean,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'input', value: DateTime): void,
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

/// ////////////////////////////////////////////////////////////

const selectedDate = ref<DateTime>()

const onClickDate = (item: DateItem) => {
  selectedDate.value = item.date
}

const onMoveMonth = (delta: number) => {
  baseDate.value = baseDate.value.plus({ month: delta })
}

const onSelect = () => {
  if (selectedDate.value) {
    emit('input', selectedDate.value)

    show.value = false
  }
}

/// ////////////////////////////////////////////////////////////

const baseDate = ref<DateTime>(DateTime.local()) // 表示している日
const startWeekday = ref<0 | 2 | 3 | 1 | 4 | 5 | 6>(0) // 週の開始曜日

const title = computed(() => baseDate.value.toFormat('yyyy年M月'))

const ranges = computed(() => {
  const date = baseDate.value.startOf('month')

  // 週の開始曜日とのズレを算出
  const targetWod = date.weekday // 曜日
  let delta = targetWod - startWeekday.value // 基準曜日への加算日数
  if (delta > 0) { delta = delta - 7 } // 曜日またぎ修正

  // 左上の日を算出
  let start = date.plus({ days: -delta })

  // 終了日が 8日以降になる場合は一週間早める
  let end = start.plus({ days: 7 * 6 - 1 })
  if (end.day >= 8) {
    start = start.plus({ days: -7 })
    end = end.plus({ days: -7 })
  }

  return { start, end }
})

const monthItems = computed(() => {
  const today = DateTime.local().startOf('day') // 今日

  // 週 x 曜日 で回してカレンダーを生成
  let ptr = ranges.value.start // 参照ポインタ
  const weeks: DateItem[][] = []

  for (let w = 0; w < 6; w++) {
    const week: DateItem[] = []
    for (let d = 0; d < 7; d++) {
      const bind: DateItem['bind'] = {}

      // 当日だったら青線
      if (ptr.hasSame(today, 'day')) {
        bind.type = 'primary'
        bind.plain = true
      }

      // 選択中なら青
      if (selectedDate.value && ptr.hasSame(selectedDate.value, 'day')) {
        bind.type = 'primary'
        bind.plain = false
      }

      // 日付を追加
      week.push({
        date: ptr,
        label: String(ptr.day),
        bind,
      })

      // 一日進める
      ptr = ptr.plus({ days: 1 })
    }
    weeks.push(week)
  }

  return weeks
})

const weekHeaders = computed(() => {
  const shorts = Info.weekdays('short')

  return [...new Array(7)]
    .map((_, i) => {
      let idx = i - startWeekday.value - 1 // shorts が月曜始まりなので1ずらす
      if (idx < 0) { idx = 7 + idx }
      return idx
    })
    .map(i => shorts.at(i))
})
</script>
