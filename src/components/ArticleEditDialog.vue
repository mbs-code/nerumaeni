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
      @click-right="isEdit && onDelete()"
    >
      <template #right>
        <van-icon v-if="isEdit" name="delete-o" color="red" />
      </template>
    </van-nav-bar>

    <div
      class="border-t-1 flex-grow px-2 py-4 flex flex-col gap-4"
      :style="{ background: 'var(--van-background)' }"
    >
      <van-cell-group inset>
        <van-field label="今の気分">
          <template #input>
            <AppRate
              v-model="form.rate"
              :size="25"
            />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset class="flex-grow">
        <van-field
          ref="textareaRef"
          v-model="form.text"
          type="textarea"
          class="article-text"
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
import { showConfirmDialog } from 'vant'
import { App as CapacitorApp } from '@capacitor/app'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { Article, FormArticle } from '~~/src/databases/models/Article'

const props = defineProps<{
  modelValue: boolean,
  article?: Article,
  dateTime: DateTime,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'save', value: Article): void,
  (e: 'delete', value: Article): void,
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const title = computed(() => {
  return props.dateTime.setLocale('ja').toFormat('yyyy年M月d日 (EEE)')
})

watch(() => show.value, (val) => {
  if (val) { onInit() }
})

/// ////////////////////////////////////////////////////////////

const form = reactive<Partial<FormArticle>>({})
const textareaRef = ref()

const isEdit = computed(() => Boolean(props.article?.id))

const onInit = () => {
  form.date = props.article?.date ?? props.dateTime
  form.rate = props.article?.rate ?? 0
  form.text = props.article?.text ?? ''

  // textarea スクロール
  nextTick(() => {
    const scroll = textareaRef.value?.$el?.querySelector('textarea')
    if (scroll) { scroll.scrollTop = 0 }
  })
}

const onSave = async () => {
  const article = isEdit.value
    ? await ArticleAPI.update(props.article!.id, form)
    : await ArticleAPI.create(form)

  emit('save', article)
  show.value = false
}

const onDelete = () => {
  showConfirmDialog({
    title: '日記の削除',
    message: `「${title.value}」\nの日記を削除しますか？`,
    confirmButtonText: '削除',
    confirmButtonColor: 'red',
  }).then(async () => {
    if (props.article) {
      await ArticleAPI.remove(props.article.id)

      emit('delete', props.article)
      show.value = false
    }
  })
}

const onCancel = () => {
  show.value = false
}
</script>

<style lang="scss">
.article-text {
  height: 100%;
  .van-field__body {
    height: 100%;
    .van-field__control {
      height: 100%;
    }
  }
}
</style>
