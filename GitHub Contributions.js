// GitHub：https://github.com/zqrren/GitHub-Contributions-Script
// version：0.5
// changes：add solution when request return 404
function formatDate(date,formatStr){
  let formatter = new DateFormatter()
  formatter.dateFormat = formatStr
  let forDate = formatter.string(date)
  return forDate
}
// 获取数据
const regex = /<rect class="day" width="[0-9]{2}" height="[0-9]{2}" x="[0-9\-]{0,3}" y="[0-9\-]{0,3}" fill="(#[a-z0-9]{6})" data-count="(\d{0,3})" data-date="(\d{4}-\d{2}-\d{2})"\/>/g;
let user = args.widgetParameter
let url = "https://github.com/users/"+user+"/contributions?to="+formatDate(new Date(), "yyyy-MM-dd");
let url1 = "https://github.com/users/"+user+"/contributions"
let req = new Request(url);
let resp = await req.loadString()  
if(resp === "Not Found"){
  req = new Request(url1);
  resp = await req.loadString()
}
let array = [...resp.matchAll(regex)].slice(-91)
// 设置小组件头部
let w = new ListWidget()
const header = w.addText("Github contributions")
header.leftAlignText()
header.font = Font.heavySystemFont(18)
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
  // 获取日期对应的星期
  let date = new Date(array[i][3])
  let t = l.addText("     " + formatDate(date, "E") + "     ")
  t.font = Font.regularSystemFont(12)
}

// 填充每一个小绿块
for (let [i,day] of array.entries()){
  let color = day[1]
  let t = ls[i%7].addText(rect)
  t.textColor = new Color(color,1)
  t.font = Font.regularSystemFont(12)
}

// 设置小组件尾部
const footer = w.addText(formatDate(new Date(), "更新于 yyyy-MM-dd HH:mm"))
  footer.rightAlignText()
  footer.font = Font.mediumSystemFont(8)

w.presentMedium()
