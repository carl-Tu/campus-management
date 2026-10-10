/* 用户信息类型 */
export interface UserInfo {
  id: number
  username: string
  realName: string
  phone: string
  role: 'admin' | 'manager' | 'teacher' | 'student' | 'visitor'
  department?: string
  status: 'active' | 'disabled'
  createTime: string
}

/* 登录表单 */
export interface LoginForm {
  username: string
  password: string
}

/* 访客类型枚举 */
export type VisitorType = 'visitor' | 'teacher' | 'student' | 'manager'

/* 访客登记表单 */
export interface VisitorForm {
  name: string
  phone: string
  visitorType: VisitorType
  idCard?: string
  reason?: string
  targetPerson?: string
  expectTime?: string
}

/* 出入申请 */
export interface AccessApplication {
  id: number
  applicantName: string
  applicantType: VisitorType
  phone: string
  reason: string
  targetArea: string
  applyTime: string
  expectedTime: string
  status: 'pending' | 'approved' | 'rejected'
  reviewer?: string
  reviewTime?: string
  remark?: string
}

/* 出入记录 */
export interface AccessRecord {
  id: number
  personName: string
  personType: VisitorType
  phone: string
  direction: 'in' | 'out'
  gate: string
  time: string
  verifyMethod: 'face' | 'card' | 'qr'
}

/* 异常预警 */
export interface AlertRecord {
  id: number
  type: 'unauthorized' | 'overdue' | 'frequency' | 'blacklist'
  personName: string
  personType: VisitorType
  phone: string
  description: string
  time: string
  status: 'unread' | 'read' | 'handled'
}

/* 角色权限 */
export interface RoleInfo {
  id: number
  name: string
  label: string
  permissions: string[]
}

/* 统计数据 */
export interface StatisticsData {
  totalIn: number
  totalOut: number
  todayVisitors: number
  pendingApplications: number
  alertCount: number
  weeklyData: { date: string; count: number }[]
  typeDistribution: { type: string; count: number }[]
}
