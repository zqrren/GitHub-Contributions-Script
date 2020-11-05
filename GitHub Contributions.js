// GitHub：https://github.com/zqrren/GitHub-Contributions-Script
const now = new Date()
const today = new Date(now).setHours(0,0,0,0)
const hour = new Date(now).setMinutes(0,0,0)
const dateToday = new Date(today)
const dateHour = new Date(hour)

const regex = /<rect class="day" width="[0-9]{2}" height="[0-9]{2}" x="[0-9\-]{0,3}" y="[0-9\-]{0,3}" fill="var\((.*)\)" data-count="(\d{0,3})" data-date="(\d{4}-\d{2}-\d{2})"\/>/g;

const reg = /<li style="background-color: var\((.*)\)"><\/li>/g;

function formatDate(date,formatStr){
  let formatter = new DateFormatter()
  formatter.dateFormat = formatStr
  let forDate = formatter.string(date)
  return forDate
}

let w = new ListWidget()

let user = ""

if(config.runsInWidget){
  let name = args.widgetParameter
  user = name
  // 设置一小时更新一次
  w.refreshAfterDate = new Date(dateHour.setHours(dateHour.getHours()+1))
}

let url = "https://github.com/users/"+user+"/contributions?date-to="+formatDate(dateToday, "yyyy-MM-dd");
let req = new Request(url);
let resp = await req.loadString()
let array = [...resp.matchAll(regex)].slice(-91)
let color = [...resp.matchAll(reg)]
const header = w.addText("GitHub Contributions")
header.font = Font.heavySystemFont(16)

colors = ["#ebedf0","#9be9a8","#40c463","#30a14e","#216e39"]

req_color = {}

for(let [i,c] of color.entries()){
  req_color[c[1]] = colors[i]
}

// 设置主要内容
const rect = "■ "
// 初始化每一行
let l1 = w.addStack()
let l2 = w.addStack()
let l3 = w.addStack()
let l4 = w.addStack()
let l5 = w.addStack()
let l6 = w.addStack()
let l7 = w.addStack()
let ls = [l1,l2,l3,l4,l5,l6,l7]
for (let [i,l] of ls.entries()){
  // 设置水平放置
  l.layoutHorizontally()
  l.addSpacer()
  // 获取日期对应的星期
  let date = new Date(array[i][3])
  let t = l.addText(" " + formatDate(date, "E"))
  t.font = new Font("Menlo-Regular", 12)
  l.addSpacer()
}
// 填充每一个小绿块
for (let [i,day] of array.entries()){
  let color = req_color[day[1]]
  let t = ls[i%7].addText(rect)
  t.textColor = new Color(color,1)
  t.font = Font.regularSystemFont(12)
}

for (let l of ls){
  l.addSpacer()
}

const footer = w.addText(formatDate(now, "yyyy-MM-dd HH:mm"))
footer.font = Font.mediumSystemFont(8)
footer.rightAlignText()

Script.setWidget(w)
w.presentMedium()
