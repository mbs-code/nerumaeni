<template>
  <van-popup
    v-model:show="show"
    position="right"
    class="w-full h-full flex flex-col"
  >
    <van-nav-bar
      :title="title"
      left-text="Back"
      left-arrow
      @click-left="onCancel"
    />

    <div
      class="flex-grow px-2 py-4 flex flex-col gap-4"
      :style="{ background: 'var(--van-background)' }"
    >
      <van-cell-group inset>
        <van-field label="今の気分">
          <template #input>
            <van-rate
              v-model="form.rate"
              :size="25"
              color="#ffd21e"
              void-icon="star-o"
              void-color="#eee"
            />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset class="flex-grow">
        <van-field
          v-model="form.text"
          type="textarea"
          class="article-field"
          placeholder="日記を記入！"
        />
      </van-cell-group>
    </div>

    <div class="px-6 py-2">
      <van-button icon="success" type="primary" block @click="onSave">
        保存
      </van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { Article } from '~~/src/databases/entity'

const props = defineProps<{
  modelValue: boolean,
  article?: Article,
  dateTime: DateTime,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'save', value: Article): void,
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const title = computed(() => {
  return props.dateTime.setLocale('ja').toFormat('yyyy年M月d日 (EEE)')
})

/// ////////////////////////////////////////////////////////////

const form = reactive<Partial<{
  rate: number
  text: string
}>>({})

const onCancel = () => {
  // eslint-disable-next-line no-console
  console.log('cancel')
  show.value = false
}

const onSave = async () => {
  if (!form.text) { return }

  const article = new Article()
  article.date = props.dateTime.toFormat('yyyy-MM-dd')
  article.rate = form.rate ?? 0
  article.text = form.text
  await article.save()

  emit('save', article)

  show.value = false
}
</script>

<style lang="scss">
.article-field {
  height: 100%;
  .van-field__body {
    height: 100%;
    .van-field__control {
      height: 100%;
    }
  }
}
</style>
