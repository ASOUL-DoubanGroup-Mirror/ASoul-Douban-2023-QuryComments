<script setup>
import { ref } from 'vue';
import axios from "axios"
import { ElMessage } from 'element-plus'

const uid = ref('')
const result_uid = ref('')
const author_name = ref('未知')
const isload = ref(false)
const isshow = ref(false)

const comments_num = ref(0)
const comments_data = ref(null)

const topics_num = ref(0)
const topics_data = ref(null)

function submitQuery() {
  isload.value = true
  if(uid.value.length > 16){
    ElMessage.error("请输入合法uid！")
    isload.value = false
    return
  }

  axios.get(`${window._TEST_SERVER}/comments/${uid.value}`).then(
    (res) => {
      if (res.status != 200) {
        ElMessage.error("查询失败，请输入合法uid")
        return
      }

      if (res.data.length == 0) {
        ElMessage.info("该用户没有发言记录。这可能是uid输入错误造成的，还请检查一下。")
        isload.value = false
        isshow.value = false
      }

      comments_num.value = res.data.length
      comments_data.value = res.data

      if (comments_num != 0) {
        author_name.value = res.data[0]["author_name"]
      }
    }
  ).then(
    () => {
      axios.get(`${window._TEST_SERVER}/topics/${uid.value}`).then(
        (res) => {
          if (res.status != 200) {
            ElMessage.error("查询失败，请输入合法uid")
            return
          }

          if (res.data.length == 0) {
            ElMessage.info("该用户没有发言记录。这可能是uid输入错误造成的，还请检查一下。")
            isload.value = false
            isshow.value = false
          }

          topics_num.value = res.data.length
          topics_data.value = res.data

          if (topics_data != 0 && author_name.value != "未知") {
            author_name.value = res.data[0]["author_name"]
          }

        }
      )
    }
  ).then(
    () => {
      isload.value = false
      isshow.value = true
      const v = uid.value
      result_uid.value = v
    }
  )

}
</script>

<template>
  <el-main>
    <h2 style="text-align: center;">豆瓣魂组-2023年1月-4月发言记录查询(全记录版)</h2>
    <el-row>
      <el-input placeholder="请输入用户uid" v-model="uid"></el-input>
    </el-row>
    <el-row justify="center">
      <el-button type="info" :loading="isload" style="text-align: center;margin-top: 10px;" size="large"
        @click="submitQuery">点击查询</el-button>
    </el-row>

    <div v-if="isshow" style="text-align:center">
      <h4>uid为 <span style="color:coral">{{ result_uid }}</span> ,id为 <span style="color:brown"> {{ author_name }}</span>
        的用户:</h4>
      <h4>在豆瓣魂组 <span style="color:darkorange">2023-1-1到2023-4-30</span>的发言记录为，</h4>
      <h1>回复数共计 <span style="color:brown"> {{ comments_num }}</span> 条</h1>
      <h1>发帖数共计 <span style="color:brown"> {{ topics_num }}</span> 条</h1>
      <h4>下面是具体回复记录：</h4>

      <h2>主题帖：</h2>

      <el-table :data="topics_data" height="250" style="width: 100%">
        <el-table-column prop="title" label="主题帖名" />
        <el-table-column prop="create_time" label="日期" />
        <el-table-column prop="url" label="链接" />
      </el-table>

      <h2>回复：</h2>

      <el-table :data="comments_data" height="1000" style="width: 100%">
        <el-table-column prop="reply_text" label="回复内容" />
        <el-table-column prop="reply_time" label="日期" />
      </el-table>
    </div>

  </el-main>
</template>
