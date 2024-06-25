<template>
  <div class="main">
    <el-row type="flex" justify="center" class="header-row">
      <el-col :span="24">
        <h2 class="main-title">用户管理中心</h2>
      </el-col>
    </el-row>

    <el-table
      :data="users"
      style="width: 100%"
      height="800px"
    >
      <el-table-column
        prop="user_name"
        label="用户名"
        >
      </el-table-column>
      <el-table-column
        prop="user_level"
        label="是否为管理员"
        >
        <template slot-scope="scope">
          <el-switch
            v-model="convertedLevels[scope.$index]"
            @change="handleLevelChange(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="pageSize">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserAdminManagement',
  data () {
    return {
      users: [],
      admin: [],
      convertedLevels: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.fetchData()
    },
    fetchData () {
      axios.get('http://localhost:3000/token', {
        headers: { Authorization: localStorage.getItem('token') }
      }).then(res => {
        axios.get('http://localhost:3000/token').then(ret => {
          this.isAdmin = ret.data.level
          if (this.isAdmin === 0 || this.isAdmin === 1) {
            alert('您的权限不足')
            this.$router.push('/')
          } else {
            this.getAllUsers()
            // this.getAllAdmins()
          }
        })
      }).catch(error => {
        console.error('Error fetching token:', error)
      })
    },
    getAllUsers () {
      axios.get(`http://localhost:3000/admin/allusers?page=${this.currentPage}&pageSize=${this.pageSize}`)
        .then(response => {
          this.users = response.data.data
          this.total = response.data.total
          // console.log("res: ", response)
          this.convertedLevels = this.users.map(user => user.user_level === 1)
          // console.log('Users loaded:', this.users)
        })
        .catch(error => {
          console.error('Error fetching users:', error)
        })
    },
    handleLevelChange (index, user) {
      const level = this.convertedLevels[index] ? 1 : 0
      this.promoteUser(user.user_name)
      console.log(`User ${user.user_name} level changed to: ${level}`)
    },
    promoteUser (username) {
      axios.put(`http://localhost:3000/admin/level_up/${username}`)
        .then(response => {
          console.log(`User ${username} level changed`)
        })
        .catch(error => {
          console.error('Error updating user level', error)
        })
    }
  }
}
</script>

<style scoped>
.main {
  max-width: 80%;
  margin: 0 auto;
  margin-top: 5px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
  overflow: auto;
}

.main-title, .admin-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

/* 添加样式来确保分页组件位于底部 */
.el-pagination {
  margin-top: auto; /* 将分页组件推到底部 */
}
</style>
