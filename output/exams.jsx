/* eslint-disable */
// 高考真题图库数据 — 10 年 × 8 套常见卷型，每卷收录 1-3 道需画图的代表题
// 数据为示意级（题干为典型高考物理题型，参数和模板对接到工坊）

const PAPERS = [
  { id:'gk1',    short:'全国甲',   name:'全国甲卷',      region:'全国', tier:'core' },
  { id:'gk2',    short:'全国乙',   name:'全国乙卷',      region:'全国', tier:'core' },
  { id:'xgk1',   short:'新高考Ⅰ',  name:'新高考 I 卷',   region:'全国', tier:'core' },
  { id:'xgk2',   short:'新高考Ⅱ',  name:'新高考 II 卷',  region:'全国', tier:'core' },
  // 2017-2020 新课标 I/II/III 卷（旧大纲版，区别于 2021+ 的"新高考 I/II"）
  { id:'xkbI',   short:'新课标Ⅰ',  name:'新课标 I 卷',   region:'全国', tier:'core' },
  { id:'xkbII',  short:'新课标Ⅱ',  name:'新课标 II 卷',  region:'全国', tier:'core' },
  { id:'xkbIII', short:'新课标Ⅲ',  name:'新课标 III 卷', region:'全国', tier:'core' },
  { id:'bj',     short:'北京',     name:'北京卷',        region:'地方', tier:'local' },
  { id:'sh',     short:'上海',     name:'上海卷',        region:'地方', tier:'local' },
  { id:'tj',     short:'天津',     name:'天津卷',        region:'地方', tier:'local' },
  { id:'zj',     short:'浙江',     name:'浙江卷',        region:'地方', tier:'local' },
];

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

// 题型 → 工坊模板 id 映射
// q.tplId 复用 templates.jsx 中的 id

const PROBLEMS = [
  // 2025
  { id:'2025-xgk1-25', year:2025, paper:'xgk1', no:'25', module:'电磁学', tplId:'rod',        title:'导体棒在水平导轨上做切割磁感线运动',          summary:'两根光滑平行导轨水平放置，间距 L=0.8m，磁感应强度 B=0.5T 垂直于导轨平面向下，导体棒以恒定速度 v=4m/s 向右滑动，外接电阻 R=2Ω。求感应电动势及通过电阻的电流。', diff:'中', heat:1820, hasAnim:true },
  { id:'2025-xgk1-18', year:2025, paper:'xgk1', no:'18', module:'力学',   tplId:'projectile', title:'平抛运动求落地点',                              summary:'某物体从离地面 h=20m 高的平台水平抛出，初速度 v₀=15m/s，不计空气阻力，g 取 9.8m/s²。求物体落地时的水平距离及末速度方向。', diff:'易', heat:2410, hasAnim:true },
  { id:'2025-gk1-23',  year:2025, paper:'gk1',  no:'23', module:'电磁学', tplId:'particle',   title:'带电粒子进入匀强磁场偏转',                      summary:'一带正电粒子以速度 v=3×10⁶ m/s 沿水平方向进入垂直于纸面向里的匀强磁场区域，B=0.5T。求粒子做圆周运动的半径，并讨论离开磁场时的位置。', diff:'难', heat:1320, hasAnim:true, paid:true },
  { id:'2025-bj-22',   year:2025, paper:'bj',   no:'22', module:'光学',   tplId:'lens',       title:'凸透镜成像 (实物两倍焦距外)',                   summary:'焦距为 15cm 的凸透镜，物体放在主光轴上距透镜 30cm 处。求像的位置、大小及性质。', diff:'易', heat:980, hasAnim:true },

  // 2024
  { id:'2024-xgk1-22', year:2024, paper:'xgk1', no:'22', module:'力学',   tplId:'incline',    title:'斜面上物块在摩擦下的下滑',                      summary:'倾角 θ=30° 的固定斜面上，质量 m=5kg 的物块由静止释放，与斜面间动摩擦系数 μ=0.20。求物块沿斜面下滑的加速度并讨论运动情况。', diff:'易', heat:1684, hasAnim:true },
  { id:'2024-xgk2-24', year:2024, paper:'xgk2', no:'24', module:'力学',   tplId:'collide-i',  title:'两物体在光滑水平面发生完全非弹性碰撞',          summary:'质量 m₁=2kg 的小车以 v₁=4m/s 与静止的 m₂=3kg 小车在光滑水平面上发生完全非弹性碰撞。求碰后共同速度及损失的动能。', diff:'中', heat:962, hasAnim:false, paid:true },
  { id:'2024-gk1-19',  year:2024, paper:'gk1',  no:'19', module:'振动波动', tplId:'wave',     title:'横波在弦线上的传播',                            summary:'一列横波在弦线上以波速 v=2.5m/s 沿 x 轴正方向传播，波长 λ=2m，振幅 A=2cm。写出波动方程并描述某质点的运动。', diff:'中', heat:712, hasAnim:true },
  { id:'2024-sh-29',   year:2024, paper:'sh',   no:'29', module:'电磁学', tplId:'efield',     title:'带电粒子在匀强电场中加速',                       summary:'两平行金属板间距 d=4cm，电压 U=200V，带电粒子从负极板由静止开始加速，求到达正极板时的速度（粒子电荷量给定）。', diff:'中', heat:512, hasAnim:true, paid:true },

  // 2023
  { id:'2023-xgk1-18', year:2023, paper:'xgk1', no:'18', module:'运动学', tplId:'circular',   title:'圆周运动求向心力',                              summary:'质量 m=1kg 的小球用细绳系在转轴上做匀速圆周运动，半径 r=1.5m，角速度 ω=2 rad/s。求绳的拉力。', diff:'易', heat:1156, hasAnim:true },
  { id:'2023-zj-20',   year:2023, paper:'zj',   no:'20', module:'光学',   tplId:'doubleslit', title:'双缝干涉条纹间距',                              summary:'用单色光做双缝干涉实验，双缝间距 d=0.2mm，缝到屏的距离 D=1m，求相邻亮条纹间距。', diff:'中', heat:524, hasAnim:false, paid:true },

  // 2022
  { id:'2022-gk2-23',  year:2022, paper:'gk2',  no:'23', module:'力学',   tplId:'spring',     title:'弹簧振子的简谐运动',                            summary:'劲度系数 k=20N/m 的轻弹簧一端固定，另一端连接质量 m=0.5kg 的物块，物块在光滑水平面上做简谐运动。求周期。', diff:'易', heat:588, hasAnim:true },
  { id:'2022-xgk1-22', year:2022, paper:'xgk1', no:'22', module:'力学',   tplId:'projectile', title:'平抛运动 + 斜面',                                summary:'物体从倾角 30° 斜面顶端水平抛出，初速度 v₀=10m/s，求落到斜面上时经历的时间。', diff:'中', heat:1402, hasAnim:true },
  { id:'2022-bj-19',   year:2022, paper:'bj',   no:'19', module:'电磁学', tplId:'capacitor',  title:'平行板电容器电场强度',                           summary:'平行板电容器极板面积 S，间距 d，电压 U。讨论极板间电场强度的方向与大小，以及如果增大间距 d 后，E、U、Q 的变化情况。', diff:'中', heat:384, hasAnim:false, paid:true },
  { id:'2022-tj-22',   year:2022, paper:'tj',   no:'22', module:'运动学', tplId:'free-fall',  title:'自由落体多段时间求高度',                        summary:'物体从高 H 处自由下落，最后 1s 内下落的距离为整个高度的 9/25，求 H。', diff:'中', heat:412, hasAnim:true },

  // 2021
  { id:'2021-gk1-24',  year:2021, paper:'gk1',  no:'24', module:'电磁学', tplId:'particle',   title:'带电粒子先匀加速后偏转',                        summary:'带正电粒子从静止开始经电场加速后进入垂直于运动方向的匀强磁场。讨论粒子在磁场中的圆周半径与磁场强度的关系。', diff:'难', heat:920, hasAnim:true, paid:true },
  { id:'2021-xgk2-19', year:2021, paper:'xgk2', no:'19', module:'力学',   tplId:'incline',    title:'斜面上的连接体',                                summary:'倾角 37° 的固定斜面，质量 m₁=2kg 与 m₂=3kg 的物块用轻绳相连，整体由静止释放，μ=0.15。求加速度及绳上张力。', diff:'中', heat:836, hasAnim:true },
  { id:'2021-sh-26',   year:2021, paper:'sh',   no:'26', module:'光学',   tplId:'lens',       title:'凸透镜成像求物距',                              summary:'凸透镜成倒立缩小实像，物距是焦距的 3 倍，求像距与焦距之比。', diff:'中', heat:478, hasAnim:true, paid:true },

  // 2020
  { id:'2020-gk1-22',  year:2020, paper:'gk1',  no:'22', module:'实验',   tplId:'micrometer', title:'螺旋测微器读数',                                summary:'用螺旋测微器测量小球直径，主尺读数为 5mm，可动刻度对齐 15.0 格，求该次测量的读数（精度 0.01mm）。', diff:'易', heat:845, hasAnim:false },
  { id:'2020-xgk1-19', year:2020, paper:'xgk1', no:'19', module:'振动波动', tplId:'wave',     title:'横波传播方向判断',                              summary:'某时刻横波波形如图，已知 P 点正在向上运动，判断波的传播方向并求经过 0.5T 后波形。', diff:'中', heat:690, hasAnim:true },
  { id:'2020-zj-18',   year:2020, paper:'zj',   no:'18', module:'力学',   tplId:'pulley',     title:'轻绳定滑轮系统',                                summary:'轻绳跨过定滑轮，两端分别系 m₁=3kg 和 m₂=2kg 的物体，求系统加速度及绳中张力（不计摩擦）。', diff:'易', heat:745, hasAnim:false },

  // 2019
  { id:'2019-gk2-25',  year:2019, paper:'gk2',  no:'25', module:'电磁学', tplId:'rod',        title:'导体棒在斜面导轨上下滑',                        summary:'倾角 θ=30° 的光滑导轨，磁感应强度 B 垂直于导轨平面，质量 m 的导体棒由静止释放，求最终速度。', diff:'难', heat:1180, hasAnim:true, paid:true },
  { id:'2019-xgk1-23', year:2019, paper:'xgk1', no:'23', module:'力学',   tplId:'collide-i',  title:'子弹打入木块',                                  summary:'子弹质量 m=20g，水平射入静止木块 M=1kg，子弹嵌入木块。已知子弹射入前速度 v=400m/s，求碰后共同速度。', diff:'中', heat:732, hasAnim:false },
  { id:'2019-bj-20',   year:2019, paper:'bj',   no:'20', module:'实验',   tplId:'vernier',    title:'游标卡尺读数 (10 分度)',                        summary:'用 10 分度游标卡尺测量金属棒长度，主尺整数部分为 23mm，游标第 6 格与主尺刻线对齐，求测量值。', diff:'易', heat:612, hasAnim:false },

  // 2018
  { id:'2018-gk1-25',  year:2018, paper:'gk1',  no:'25', module:'力学',   tplId:'projectile', title:'斜抛 / 平抛混合分析',                            summary:'从离地 h=45m 高处水平抛出物体，落地时速度方向与水平方向夹角为 60°，求初速度大小。', diff:'中', heat:1240, hasAnim:true },
  { id:'2018-xgk2-24', year:2018, paper:'xgk2', no:'24', module:'电磁学', tplId:'efield',     title:'电场中带电小球的平衡',                          summary:'匀强电场 E 水平方向，质量 m 的带电小球用绝缘细绳悬挂，平衡时绳与竖直方向夹角 θ。求小球的电荷量。', diff:'中', heat:602, hasAnim:true, paid:true },

  // 2017
  { id:'2017-gk1-24',  year:2017, paper:'gk1',  no:'24', module:'力学',   tplId:'incline',    title:'斜面上物块的临界加速度',                        summary:'倾角 37° 的斜面随小车一起向左加速。求小车的临界加速度，使物块即将沿斜面向上滑动（μ=0.5）。', diff:'难', heat:984, hasAnim:true, paid:true },
  { id:'2017-tj-21',   year:2017, paper:'tj',   no:'21', module:'光学',   tplId:'lens',       title:'放大镜成像',                                    summary:'用焦距 10cm 的凸透镜作放大镜，物体放在距镜 6cm 处，求像距及放大率。', diff:'易', heat:402, hasAnim:true },

  // 2016
  { id:'2016-gk2-22',  year:2016, paper:'gk2',  no:'22', module:'运动学', tplId:'circular',   title:'圆锥摆模型',                                    summary:'质量 m 的小球用长 L 的轻绳系在固定点，做半径 r 的水平圆锥摆，求绳与竖直方向的夹角与角速度。', diff:'中', heat:856, hasAnim:true },
  { id:'2016-xgk1-21', year:2016, paper:'xgk1', no:'21', module:'电磁学', tplId:'particle',   title:'带电粒子进入磁场偏转后离开',                    summary:'带电粒子从某点垂直进入边界为直线的匀强磁场区域，求粒子离开磁场时的位置与方向。', diff:'难', heat:524, hasAnim:true, paid:true },
];

// ─── 真实已动画化题目（带 htmlPath，通过 iframe 嵌入）───
// 每题 htmlPath 指向独立 HTML（output/{paperDir}/questions/qNN/index.html）
// 这些题已通过四关 agent 审核（A 题目识别 / B 物理推导 / D 代码审 / C 视觉跳过）
const REAL_PROBLEMS = [
  // ─── 2024 全国甲卷 12 题（已上线 12/12） ───
  { id:'2024-gk1-q01', year:2024, paper:'gk1', no:'1',  module:'近代',   tplId:null, title:'氘核聚变 · 反应方程平衡',           summary:'氘核 6 ²₁D 聚变成 He、H、n，由质量数+电荷数守恒求 x、y。', diff:'易', heat:50, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q01/index.html' },
  { id:'2024-gk1-q02', year:2024, paper:'gk1', no:'2',  module:'力学',   tplId:null, title:'滑轮+物块+砝码 · a-m 图',          summary:'P 物块在粗糙桌面，绳跨滑轮挂砝码盘。判断 a 与 m 的图像关系。', diff:'中', heat:80, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q02/index.html' },
  { id:'2024-gk1-q03', year:2024, paper:'gk1', no:'3',  module:'天体',   tplId:null, title:'嫦娥六号 · 月球采样',               summary:'环月飞行 + 月面采样 + 月地转移，月面 g≈g/6 与地球重力对比。', diff:'易', heat:120, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q03/index.html' },
  { id:'2024-gk1-q04', year:2024, paper:'gk1', no:'4',  module:'力学',   tplId:null, title:'大圆环上小环下滑',                  summary:'光滑大圆环固定在竖直平面，小环从顶端经 Q 点滑至底部，求作用力变化。', diff:'难', heat:90, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q04/index.html', paid:true },
  { id:'2024-gk1-q05', year:2024, paper:'gk1', no:'5',  module:'电磁学', tplId:null, title:'两点电荷 · 等势线分析',             summary:'由 V=0 等势线位置推 q₁、q₂ 正负与电荷量比。', diff:'中', heat:65, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q05/index.html' },
  { id:'2024-gk1-q06', year:2024, paper:'gk1', no:'6',  module:'电磁学', tplId:null, title:'理想变压器 + 滑动变阻器',           summary:'U₂、R 联动调控 R₁ 热功率，ABCD 四工况自动循环。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q06/index.html' },
  { id:'2024-gk1-q07', year:2024, paper:'gk1', no:'7',  module:'力学',   tplId:null, title:'蹦床运动员 · F-t 图',              summary:'上抛对称性 + 动量定理求 v=10 m/s 与平均力 3000 N。', diff:'中', heat:110, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q07/index.html' },
  { id:'2024-gk1-q08', year:2024, paper:'gk1', no:'8',  module:'电磁学', tplId:null, title:'滑轮+磁场+线框 · v-t 图',           summary:'数值积分 v(t)，A/C 模型可切换（m>M vs m=M）。', diff:'难', heat:95, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q08/index.html', paid:true },
  { id:'2024-gk1-q09', year:2024, paper:'gk1', no:'9',  module:'实验',   tplId:null, title:'电梯+弹簧测力计 · 超失重',          summary:'静止 5.0 N → 上行减速失重，加速度 1.0 m/s²。', diff:'易', heat:70, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q09/index.html' },
  { id:'2024-gk1-q10', year:2024, paper:'gk1', no:'10', module:'实验',   tplId:null, title:'氧气传感器 · 定标',                summary:'分压式 + 内接电流表 + V-O₂% 定标曲线反查。', diff:'中', heat:55, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q10/index.html' },
  { id:'2024-gk1-q11', year:2024, paper:'gk1', no:'11', module:'力学',   tplId:null, title:'救护车 · 声速 · 鸣笛',              summary:'匀加速→匀速 + 声波传播，求 v=20 m/s 与停笛距离 680 m。', diff:'中', heat:88, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q11/index.html' },
  { id:'2024-gk1-q12', year:2024, paper:'gk1', no:'12', module:'电磁学', tplId:null, title:'金属棒+磁场+电容 · 综合',           summary:'恒力加速到 v₀ + 电容充电过渡，求 v、U_C、外力做功。', diff:'难', heat:135, hasAnim:true, htmlPath:'2024_全国甲卷/questions/q12/index.html', paid:true },

  // ─── 2025 陕晋宁青卷 13 题（已上线 13/14，Q5 跳过） ───
  // 暂归 xgk2（新高考 II）— 实际是新课标变体
  { id:'2025-xgk2-q01', year:2025, paper:'xgk2', no:'1',  module:'电磁学', tplId:null, title:'静电场电场线分布',                 summary:'三大原则：不相交、不闭合、平行须等间距。', diff:'易', heat:60, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q01/index.html' },
  { id:'2025-xgk2-q02', year:2025, paper:'xgk2', no:'2',  module:'天体',   tplId:null, title:'天问三号 · 万有引力',               summary:'由轨道半径 r 和周期 T 推算火星质量。', diff:'易', heat:80, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q02/index.html' },
  { id:'2025-xgk2-q03', year:2025, paper:'xgk2', no:'3',  module:'力学',   tplId:null, title:'F-t 图判断 v-t 图',                 summary:'分拣机器人 m=20kg，三段动力学：加速 → 匀速 → 减速。', diff:'易', heat:90, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q03/index.html' },
  { id:'2025-xgk2-q04', year:2025, paper:'xgk2', no:'4',  module:'力学',   tplId:null, title:'钢管悬绳 · 静力平衡',               summary:'地面对钢管摩擦力为零（与角度 θ 无关）。', diff:'易', heat:55, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q04/index.html' },
  { id:'2025-xgk2-q06', year:2025, paper:'xgk2', no:'6',  module:'电磁学', tplId:null, title:'双线框进出磁场',                   summary:'甲（R）、乙（2R）线框比较合力、速度、焦耳热（Q₁:Q₂=4:3）。', diff:'难', heat:140, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q06/index.html', paid:true },
  { id:'2025-xgk2-q07', year:2025, paper:'xgk2', no:'7',  module:'振动波动', tplId:null, title:'横波 · 振动图求波形',               summary:'a→b 与 b→a 双向传播分析，t=T/4 时波形（答案 AD）。', diff:'中', heat:75, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q07/index.html' },
  { id:'2025-xgk2-q08', year:2025, paper:'xgk2', no:'8',  module:'光学',   tplId:null, title:'双缝干涉 · 双色光',                 summary:'蓝/红激光复合，比较条纹间距与重合点（答案 BC）。', diff:'中', heat:65, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q08/index.html' },
  { id:'2025-xgk2-q09', year:2025, paper:'xgk2', no:'9',  module:'力学',   tplId:null, title:'弹性绳 · 滑块 · 斜杆',               summary:'摩擦+弹性+几何综合，f 恒定 1.28N，s = 0.5m。', diff:'难', heat:130, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q09/index.html', paid:true },
  { id:'2025-xgk2-q10', year:2025, paper:'xgk2', no:'10', module:'实验',   tplId:null, title:'探究 a 与 F、m 的关系',             summary:'补偿摩擦 + 化曲为直 (a-1/m) + 槽码移动法减小误差。', diff:'中', heat:60, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q10/index.html' },
  { id:'2025-xgk2-q11', year:2025, paper:'xgk2', no:'11', module:'实验',   tplId:null, title:'多用电表 + 电路定位',               summary:'电压表反推 E、C、R 在哪两接线柱间。', diff:'中', heat:70, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q11/index.html' },
  { id:'2025-xgk2-q12', year:2025, paper:'xgk2', no:'12', module:'热学',   tplId:null, title:'卡车轮胎气体 · 热一律',             summary:'P-V 线性变化 → 状态方程求 p₂；W = 面积 → 内能。', diff:'中', heat:85, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q12/index.html' },
  { id:'2025-xgk2-q13', year:2025, paper:'xgk2', no:'13', module:'电磁学', tplId:null, title:'磁控法测电子比荷',                  summary:'圆筒磁场临界 e/m = 2v₀/(B₀R)，击壁面积 S = πR²√(B₀²−B²)/B。', diff:'难', heat:155, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q13/index.html', paid:true },
  { id:'2025-xgk2-q14', year:2025, paper:'xgk2', no:'14', module:'电磁学', tplId:null, title:'双带电粒子 · 动量动能守恒',         summary:'共速 v₀/3，s_B = v₀t₀/3 − r₀/6，t_F = 2r₀/v₀。', diff:'难', heat:175, hasAnim:true, htmlPath:'2025_陕晋宁青/questions/q14/index.html', paid:true },

  // ─── 2024 新课标卷 12 题（已上线，q10 因电路实验题跳过）———
  { id:'2024-xgk1-q01', year:2024, paper:'xgk1', no:'1',  module:'力学',     tplId:null, title:'直线运动 · x-t / v-t 图判断',     summary:'函数判定：垂直扫描线穿过曲线交点数 · 仅 v-t 单值合法。', diff:'易', heat:60, hasAnim:true, htmlPath:'2024_新课标卷/questions/q01/index.html' },
  { id:'2024-xgk1-q02', year:2024, paper:'xgk1', no:'2',  module:'力学',     tplId:null, title:'福建舰弹射小车 · 平抛',           summary:'动能 4 倍 → 速度 2 倍 → h 不变 t 不变 → 落点距离 2 倍。', diff:'易', heat:80, hasAnim:true, htmlPath:'2024_新课标卷/questions/q02/index.html' },
  { id:'2024-xgk1-q03', year:2024, paper:'xgk1', no:'3',  module:'天体',     tplId:null, title:'红矮星 + GJ1002c · 开普勒',       summary:'M ∝ r³/T²，0.07³/0.06² ≈ 0.1 太阳质量。', diff:'易', heat:55, hasAnim:true, htmlPath:'2024_新课标卷/questions/q03/index.html' },
  { id:'2024-xgk1-q04', year:2024, paper:'xgk1', no:'4',  module:'近代',     tplId:null, title:'量子点 · 蓝光 vs 红光',            summary:'E=hν · p=h/λ · v=c/n · 频率穿介质不变。', diff:'易', heat:70, hasAnim:true, htmlPath:'2024_新课标卷/questions/q04/index.html' },
  { id:'2024-xgk1-q05', year:2024, paper:'xgk1', no:'5',  module:'电磁学',   tplId:null, title:'双正电小球 · 水平电场静电平衡',    summary:'两绳夹角相等 + 列水平/竖直方程联立 → m_P > m_Q。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_新课标卷/questions/q05/index.html' },
  { id:'2024-xgk1-q06', year:2024, paper:'xgk1', no:'6',  module:'振动波动', tplId:null, title:'简谐横波 · 周期 / 振幅 / 速度',   summary:'P 起振时波源第 2 次到波谷 → t=7T/4 → v=10 m/s。', diff:'中', heat:90, hasAnim:true, htmlPath:'2024_新课标卷/questions/q06/index.html' },
  { id:'2024-xgk1-q07', year:2024, paper:'xgk1', no:'7',  module:'电磁学',   tplId:null, title:'磁极旋转 · 线圈感应电动势',         summary:'B⊥线圈时 Φ_max 但 dΦ/dt=0 → 转 90° 后 I_max + 方向 Q→P。', diff:'中', heat:85, hasAnim:true, htmlPath:'2024_新课标卷/questions/q07/index.html' },
  { id:'2024-xgk1-q08', year:2024, paper:'xgk1', no:'8',  module:'热学',     tplId:null, title:'柴油机循环 · 4 过程',              summary:'绝热-等压-绝热-等容 4 过程 + 热一律分析。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_新课标卷/questions/q08/index.html' },
  { id:'2024-xgk1-q09', year:2024, paper:'xgk1', no:'9',  module:'实验',     tplId:null, title:'动量守恒验证 · 平抛 + 碰撞',       summary:'同 h → 同 t → v ∝ x，m_a·OP = m_a·OM + m_b·ON。', diff:'中', heat:65, hasAnim:true, htmlPath:'2024_新课标卷/questions/q09/index.html' },
  { id:'2024-xgk1-q11', year:2024, paper:'xgk1', no:'11', module:'力学',     tplId:null, title:'双绳缓降 · 力平衡 + 总功',          summary:'P/Q 角度 53°/37° → T_P=48N, T_Q=64N · W_绳=−800 J。', diff:'中', heat:80, hasAnim:true, htmlPath:'2024_新课标卷/questions/q11/index.html' },
  { id:'2024-xgk1-q12', year:2024, paper:'xgk1', no:'12', module:'力学',     tplId:null, title:'薄板物块 · 滑动 + 平抛',            summary:'板移 d 时物块飞出，平台高 H = 0.125 m，v₀ = 4 m/s。', diff:'难', heat:120, hasAnim:true, htmlPath:'2024_新课标卷/questions/q12/index.html', paid:true },
  { id:'2024-xgk1-q13', year:2024, paper:'xgk1', no:'13', module:'电磁学',   tplId:null, title:'速度空间 · 电场磁场交替',           summary:'P 沿 ab→bc→ca 闭合曲线匀速 → r=mv₀/(qB), T=2πm/(qB), E=v₀B。', diff:'难', heat:140, hasAnim:true, htmlPath:'2024_新课标卷/questions/q13/index.html', paid:true },

  // ─── 2024 北京卷 17 题（跳过 q12 加速度计 / q13 阿秒光 / q14 忆阻器 / q17 水果电池） ───
  { id:'2024-bj-q01', year:2024, paper:'bj', no:'1',  module:'近代',     tplId:null, title:'钍 234 半衰期',                    summary:'半衰期 24 天，48 天 = 2T → 剩 0.25 g。', diff:'易', heat:55, hasAnim:true, htmlPath:'2024_北京/questions/q01/index.html' },
  { id:'2024-bj-q02', year:2024, paper:'bj', no:'2',  module:'力学',     tplId:null, title:'汽车制动距离',                     summary:'v-t 图三角面积 = ½·v₀·t = 10 m。', diff:'易', heat:60, hasAnim:true, htmlPath:'2024_北京/questions/q02/index.html' },
  { id:'2024-bj-q03', year:2024, paper:'bj', no:'3',  module:'热学',     tplId:null, title:'气泡上浮 · 等温膨胀',               summary:'恒温 + 上浮 p ↓ V ↑ ΔU=0 → 气体吸热。', diff:'易', heat:50, hasAnim:true, htmlPath:'2024_北京/questions/q03/index.html' },
  { id:'2024-bj-q04', year:2024, paper:'bj', no:'4',  module:'力学',     tplId:null, title:'飞船与空间站作用力',                summary:'整体牛二 + 隔离法 → F\' = MF/(m+M)。', diff:'易', heat:55, hasAnim:true, htmlPath:'2024_北京/questions/q04/index.html' },
  { id:'2024-bj-q05', year:2024, paper:'bj', no:'5',  module:'电磁学',   tplId:null, title:'理想变压器 + 6V 3W 灯泡',          summary:'I₂ = P/U₂ = 0.5 A，无能量损失 P_in = P_out。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_北京/questions/q05/index.html' },
  { id:'2024-bj-q07', year:2024, paper:'bj', no:'7',  module:'力学',     tplId:null, title:'弹簧 + 光滑半圆轨道',               summary:'恰好到 C → mg 提供向心力 → a_C = g。', diff:'中', heat:85, hasAnim:true, htmlPath:'2024_北京/questions/q07/index.html' },
  { id:'2024-bj-q08', year:2024, paper:'bj', no:'8',  module:'力学',     tplId:null, title:'上抛 + 空气阻力（f=kv）',           summary:'上升加速度大 + 时间短 + 冲量大；4 项对比。', diff:'中', heat:80, hasAnim:true, htmlPath:'2024_北京/questions/q08/index.html' },
  { id:'2024-bj-q09', year:2024, paper:'bj', no:'9',  module:'力学',     tplId:null, title:'弹簧振子 · 手机加速度传感',          summary:'a-t 正弦曲线 → a = A·sin(2πt/T)。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_北京/questions/q09/index.html' },
  { id:'2024-bj-q10', year:2024, paper:'bj', no:'10', module:'力学',     tplId:null, title:'水平传送带 · 加速过程',              summary:'传送带越快 → 加速时间越长 (t = v_带/μg)。', diff:'中', heat:70, hasAnim:true, htmlPath:'2024_北京/questions/q10/index.html' },
  { id:'2024-bj-q11', year:2024, paper:'bj', no:'11', module:'电磁学',   tplId:null, title:'等量异种点电荷 · 电场对称',          summary:'对称 E_P=E_Q · q×2 → E×2 · U×2。', diff:'中', heat:65, hasAnim:true, htmlPath:'2024_北京/questions/q11/index.html' },
  { id:'2024-bj-q15', year:2024, paper:'bj', no:'15', module:'光学',     tplId:null, title:'玻璃折射率',                        summary:'折射定律 n = sin(i)/sin(r)。', diff:'易', heat:50, hasAnim:true, htmlPath:'2024_北京/questions/q15/index.html' },
  { id:'2024-bj-q16', year:2024, paper:'bj', no:'16', module:'实验',     tplId:null, title:'楞次定律实验',                      summary:'N/S 极插拔螺线管 → 看电流表指针方向。', diff:'易', heat:55, hasAnim:true, htmlPath:'2024_北京/questions/q16/index.html' },
  { id:'2024-bj-q18', year:2024, paper:'bj', no:'18', module:'实验',     tplId:null, title:'动量守恒 · 斜槽碰撞 + 摆球',         summary:'两版：m₁OP=m₁OM+m₂ON 与 ml₁=-ml₂+Ml₃。', diff:'中', heat:80, hasAnim:true, htmlPath:'2024_北京/questions/q18/index.html' },
  { id:'2024-bj-q19', year:2024, paper:'bj', no:'19', module:'力学',     tplId:null, title:'排水管满口排水 · 平抛 + 流量',       summary:'t=√(2h/g), v=d/t, Q=Sv。', diff:'中', heat:75, hasAnim:true, htmlPath:'2024_北京/questions/q19/index.html' },
  { id:'2024-bj-q20', year:2024, paper:'bj', no:'20', module:'电磁学',   tplId:null, title:'电磁枪 · 电容驱动导轨',              summary:'I₀=Q/(CR), a₀=BLQ/(mCR), v 单调增渐缓。', diff:'中', heat:95, hasAnim:true, htmlPath:'2024_北京/questions/q20/index.html' },
  { id:'2024-bj-q21', year:2024, paper:'bj', no:'21', module:'天体',     tplId:null, title:'宇宙膨胀 · 哈勃定律',               summary:'ρ ∝ 1/r³，ΔKE 由能量守恒，H 随 t 减。', diff:'难', heat:130, hasAnim:true, htmlPath:'2024_北京/questions/q21/index.html', paid:true },
  { id:'2024-bj-q22', year:2024, paper:'bj', no:'22', module:'电磁学',   tplId:null, title:'霍尔推进器 · 电场磁场综合',          summary:'a=qE/M, B\'=√(2mEd/q)/R, F=nk√(2qEdM)。', diff:'难', heat:160, hasAnim:true, htmlPath:'2024_北京/questions/q22/index.html', paid:true },

  // ─── 2025 全国卷 12 题（已上线 12/14：Q1-Q12） ───
  { id:'2025-gk1-q01', year:2025, paper:'gk1', no:'1',  module:'力学',     tplId:null, title:'CR450 动车减速',                    summary:'v₀=120 m/s 匀减速 14.4 km 停止，求 a=0.5 m/s²。', diff:'易', heat:60, hasAnim:true, htmlPath:'2025_全国卷/questions/q01/index.html' },
  { id:'2025-gk1-q02', year:2025, paper:'gk1', no:'2',  module:'天体',     tplId:null, title:'天都一号 · 环月椭圆轨道',           summary:'开普勒第二定律：近月点速度大、引力大。', diff:'易', heat:80, hasAnim:true, htmlPath:'2025_全国卷/questions/q02/index.html' },
  { id:'2025-gk1-q03', year:2025, paper:'gk1', no:'3',  module:'力学',     tplId:null, title:'撑杆跳高 · 能量守恒',                summary:'h = v₀²/(2g) = 5 m。', diff:'易', heat:55, hasAnim:true, htmlPath:'2025_全国卷/questions/q03/index.html' },
  { id:'2025-gk1-q04', year:2025, paper:'gk1', no:'4',  module:'电磁学',   tplId:null, title:'匀强电场 · 正电荷运动轨迹',          summary:'共线 → 直线；垂直 → 类平抛曲线。', diff:'中', heat:75, hasAnim:true, htmlPath:'2025_全国卷/questions/q04/index.html' },
  { id:'2025-gk1-q05', year:2025, paper:'gk1', no:'5',  module:'电磁学',   tplId:null, title:'正方形磁场 · 电子轨道',              summary:'3 种 R/θ 几何分析：t₁<t₂=t₃。', diff:'中', heat:90, hasAnim:true, htmlPath:'2025_全国卷/questions/q05/index.html' },
  { id:'2025-gk1-q06', year:2025, paper:'gk1', no:'6',  module:'热学',     tplId:null, title:'理想气体 V-T 图压强比较',           summary:'V/T 斜率 ∝ 1/p，p_c > p_b = p_a。', diff:'中', heat:70, hasAnim:true, htmlPath:'2025_全国卷/questions/q06/index.html' },
  { id:'2025-gk1-q07', year:2025, paper:'gk1', no:'7',  module:'振动波动', tplId:null, title:'队列简谐波 · 波峰波谷距离',         summary:'(2n+1)·λ/2 = 2m, 6m, ...', diff:'中', heat:85, hasAnim:true, htmlPath:'2025_全国卷/questions/q07/index.html' },
  { id:'2025-gk1-q08', year:2025, paper:'gk1', no:'8',  module:'电磁学',   tplId:null, title:'圆环转动磁场 · 感应电动势',          summary:'e=Bωr²[1-cos(2ωt)]，OP 平行虚线时 e 最大。', diff:'难', heat:130, hasAnim:true, htmlPath:'2025_全国卷/questions/q08/index.html', paid:true },
  { id:'2025-gk1-q11', year:2025, paper:'gk1', no:'11', module:'电磁学',   tplId:null, title:'电容器键盘 · U 与 E 变化',            summary:'(1) Q 守恒 U\'=U/2 (2) U 守恒 E\'=2E。', diff:'中', heat:85, hasAnim:true, htmlPath:'2025_全国卷/questions/q11/index.html' },
  { id:'2025-gk1-q12', year:2025, paper:'gk1', no:'12', module:'力学',     tplId:null, title:'圆弧+板+弹簧 4 问',                  summary:'(1) mgR (2) v₀=2√(2gR), h=3R (3) M=m/9 (4) M\'=m/2。', diff:'难', heat:170, hasAnim:true, htmlPath:'2025_全国卷/questions/q12/index.html', paid:true },

  // ─── 2023 全国甲卷（陆续上线） ───
  { id:'2023-gk1-q01', year:2023, paper:'gk1', no:'1',  module:'力学',     tplId:null, title:'铅球平抛 · 四量分析',                summary:'平抛仅受重力 → a=g 恒；|v| 增；E_k 增；E 守恒。答案 B。', diff:'易', heat:55, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q01/index.html' },
  { id:'2023-gk1-q03', year:2023, paper:'gk1', no:'3',  module:'运动学',   tplId:null, title:'小车 x-t 图 · 先加速后减速',         summary:'匀加速→上凹；匀减速→下凹至顶点；停止→水平。答案 D。', diff:'易', heat:60, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q03/index.html' },
  { id:'2023-gk1-q06', year:2023, paper:'gk1', no:'6',  module:'力学',     tplId:null, title:'F-a 图线 · 斜率与截距判 m、μ',         summary:'F=ma+μmg → 斜率=m, 纵截距=μmg。答案 BC。', diff:'中', heat:80, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q06/index.html' },
  { id:'2023-gk1-q07', year:2023, paper:'gk1', no:'7',  module:'电磁学',   tplId:null, title:'圆筒带电粒子碰撞 · 几何分析',           summary:'r=R√3 时正三角形内接 → 2 次碰撞 + v\'∥OA。答案 BD。', diff:'难', heat:140, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q07/index.html', paid:true },
  { id:'2023-gk1-q08', year:2023, paper:'gk1', no:'8',  module:'电磁学',   tplId:null, title:'玻璃管 · 磁体下落电磁感应',             summary:'上 5 匝密 + 下 3 匝疏，I_peak ∝ v_k 递增。答案 AD。', diff:'中', heat:90, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q08/index.html' },
  { id:'2023-gk1-q11', year:2023, paper:'gk1', no:'11', module:'力学',     tplId:null, title:'弹簧 · 平抛 · 反弹',                     summary:'v₀=√(2E_p/m)；d=4√(E_p·h/(mg))。', diff:'中', heat:120, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q11/index.html' },
  { id:'2023-gk1-q12', year:2023, paper:'gk1', no:'12', module:'电磁学',   tplId:null, title:'U 型导轨 · 弹性碰撞 + 电磁感应',         summary:'(1) v₀/2  (2) mv₀²  (3) 2mR/(B²L²)。', diff:'难', heat:180, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q12/index.html', paid:true },
  { id:'2023-gk1-q15', year:2023, paper:'gk1', no:'15', module:'光学',     tplId:null, title:'等腰棱镜 · 双色折射',                    summary:'甲在乙下方 → n_甲<n_乙；ACE 全证。', diff:'中', heat:90, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q15/index.html' },
  { id:'2023-gk1-q16', year:2023, paper:'gk1', no:'16', module:'振动波动', tplId:null, title:'两横波相向传播 · 干涉极大/极小',         summary:'P 沿 +x、Q 沿 -x 反相传播；λ=8m, v=4m/s → 极大 x=2,6 m, 极小 x=0,4,8 m。', diff:'中', heat:110, hasAnim:true, htmlPath:'2023_全国甲卷/questions/q16/index.html' },
  // ── 2023 全国乙卷 ──
  { id:'2023-gk2-q01', year:2023, paper:'gk2', no:'1',  module:'力学',     tplId:null, title:'排球上抛 + 空气阻力（f=k|v|）',          summary:'上升 t 短 / 被垫起瞬间 v₀ 最大 / 最高点 a=g / 下落变加速。答案 B。', diff:'中', heat:80, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q01/index.html' },
  { id:'2023-gk2-q02', year:2023, paper:'gk2', no:'2',  module:'力学',     tplId:null, title:'小车曲线运动 · 合力方向判断',            summary:'凹侧原则（曲线运动法向需求）+ 锐角原则（动能↑→F·v>0）→ 答案 D。', diff:'易', heat:70, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q02/index.html' },
  { id:'2023-gk2-q05', year:2023, paper:'gk2', no:'5',  module:'电磁学',   tplId:null, title:'带电粒子磁场+电场（速度选择器）· 比荷',  summary:'r=2a 几何 / v=2aqB/m 圆周 / v=E/B 速度选择器 / q/m = E/(2aB²)。答案 A。', diff:'中', heat:130, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q05/index.html', paid:true },
  { id:'2023-gk2-q06', year:2023, paper:'gk2', no:'6',  module:'电磁学',   tplId:null, title:'正电荷+负电小球 · 重力+库仑力轨迹（多选）',     summary:'电势能符号 W=qφ<0；A 错（先减后增）/ B 对（OP>ON→W_P>W_N）/ C 对（OM=ON→机械能等）/ D 错。答案 BC。', diff:'中', heat:110, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q06/index.html' },
  { id:'2023-gk2-q08', year:2023, paper:'gk2', no:'8',  module:'力学',     tplId:null, title:'木板+物块滑动摩擦 · 动能与摩擦热（多选）',       summary:'光滑桌面，相对位移 Δs=l；摩擦热 Q=fl；木板 E_M=f·s_M<fl（B 对）；物块 (1/2)mv₁²<(1/2)mv₀²-fl（D 对）。答案 BD。', diff:'中', heat:120, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q08/index.html' },
  { id:'2023-gk2-q11', year:2023, paper:'gk2', no:'11', module:'电磁学',   tplId:null, title:'等边三角形 · 3 点电荷电场叠加（计算）',           summary:'M 处场向下→C 正；A、B 水平相抵→|q_B|=q；N 处场向上 E_x=0→q_C=(3-√3)q/3。', diff:'难', heat:160, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q11/index.html', paid:true },
  { id:'2023-gk2-q12', year:2023, paper:'gk2', no:'12', module:'力学',     tplId:null, title:'圆管+圆盘+小球弹性碰撞 · 多次递推（计算）',       summary:'m=M/3 弹碰→v₀/2；最远 d=l；盘下移 2l/4l/6l/8l 累计 13l<20l→4 次碰撞退出。', diff:'难', heat:200, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q12/index.html', paid:true },
  { id:'2023-gk2-q13', year:2023, paper:'gk2', no:'13', module:'热学',     tplId:null, title:'理想气体内能 · 5 选项过程对比（多选）',           summary:'U=nC_vT 仅由 T 决定；A 等温-等温/C 等容↓+等压↑/D 等容↑+等压↓ 可使末 T=初 T。答案 ACD。', diff:'易', heat:80, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q13/index.html' },
  { id:'2023-gk2-q15', year:2023, paper:'gk2', no:'15', module:'振动波动', tplId:null, title:'简谐横波 · 波形+振动图（多选）',                   summary:'λ=4m, T=2s, v=2m/s 向左；P 路程 70cm；t=7s x=3 波峰。答案 ABE。', diff:'中', heat:90, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q15/index.html' },
  { id:'2023-gk2-q16', year:2023, paper:'gk2', no:'16', module:'光学',     tplId:null, title:'等腰直角棱镜 · 折射+反射几何（计算）',           summary:'n=√2 等腰直角；i=45°→r=30°；折射光与水平 15°，反射射向 A；AM=(3−√3)/3·AB。', diff:'中', heat:130, hasAnim:true, htmlPath:'2023_全国乙卷/questions/q16/index.html' },
  // ── 2023 新课标卷 ──
  { id:'2023-xgk1-q05', year:2023, paper:'xgk1', no:'5',  module:'电磁学',  tplId:null, title:'电子+α 粒子电磁场方向判断',                       summary:'α 直线打 a 受力平衡 v_α=E/B；电子 v_e>v_α 净力向右偏 b。E 向右 + B 向里。答案 C。', diff:'中', heat:120, hasAnim:true, htmlPath:'2023_新课标卷/questions/q05/index.html' },
  { id:'2023-xgk1-q06', year:2023, paper:'xgk1', no:'6',  module:'力学',    tplId:null, title:'两条形磁铁吸引 · 摩擦+动量',                       summary:'m_甲>m_乙 μ 同；a_i=F/m_i−μg → v_甲<v_乙；|p_甲|<|p_乙|；Σp=−μg(m₁−m₂)t 向左不为零。答案 BD。', diff:'中', heat:115, hasAnim:true, htmlPath:'2023_新课标卷/questions/q06/index.html' },
  // ── 2021 全国甲卷 ──
  { id:'2021-gk1-q01', year:2021, paper:'gk1', no:'1',  module:'力学',    tplId:null, title:'光滑长平板下滑时间随夹角变化',                    summary:'PQ 水平距离 L 固定；t(θ)=2√(L/g·sin2θ)；45° 最小，30°/60° 同值。30°→60° 先减后增。答案 D。', diff:'中', heat:140, hasAnim:true, htmlPath:'2021_全国甲卷/questions/q01/index.html' },
];

PROBLEMS.push(...REAL_PROBLEMS);

// ─── 题型 + 官方答案（PaperListV1 列表页用）───
// type: choice-single | choice-multi | experiment | calc
// answer: 字符串（选择题）或 [{sub,val},...]（实验/计算分小问）
const PROBLEM_META = {
  // 2024 全国甲卷
  '2024-gk1-q01': { type:'choice-single', answer:'C' },
  '2024-gk1-q02': { type:'choice-single', answer:'D' },
  '2024-gk1-q03': { type:'choice-single', answer:'D' },
  '2024-gk1-q04': { type:'choice-single', answer:'C' },
  '2024-gk1-q05': { type:'choice-single', answer:'B' },
  '2024-gk1-q06': { type:'choice-multi',  answer:'AC' },
  '2024-gk1-q07': { type:'choice-multi',  answer:'BD' },
  '2024-gk1-q08': { type:'choice-multi',  answer:'AC' },
  '2024-gk1-q09': { type:'experiment',    answer:[{sub:'(1)',val:'5.0 N'},{sub:'(2)',val:'失重'},{sub:'(3)',val:'1.0 m/s²'}] },
  '2024-gk1-q10': { type:'experiment',    answer:[{sub:'(1)',val:'b 端'},{sub:'(2)',val:'1.40 V'},{sub:'(3)',val:'17%'}] },
  '2024-gk1-q11': { type:'calc',          answer:[{sub:'v =',val:'20 m/s'},{sub:'x =',val:'680 m'}] },
  '2024-gk1-q12': { type:'calc',          answer:[{sub:'v =',val:'v₀/2'},{sub:'U_C =',val:'BLv₀/4'},{sub:'W =',val:'CU_C²'}] },
  // 2025 陕晋宁青卷
  '2025-xgk2-q01': { type:'choice-single', answer:'B' },
  '2025-xgk2-q02': { type:'choice-single', answer:'A' },
  '2025-xgk2-q03': { type:'choice-single', answer:'A' },
  '2025-xgk2-q04': { type:'choice-single', answer:'D' },
  '2025-xgk2-q06': { type:'choice-single', answer:'D' },
  '2025-xgk2-q07': { type:'choice-multi',  answer:'AD' },
  '2025-xgk2-q08': { type:'choice-multi',  answer:'BC' },
  '2025-xgk2-q09': { type:'choice-multi',  answer:'AC' },
  '2025-xgk2-q10': { type:'experiment',    answer:[{sub:'(1)',val:'一端垫高'},{sub:'(2)',val:'AC'},{sub:'(3)',val:'乙'}] },
  '2025-xgk2-q11': { type:'experiment',    answer:[{sub:'(1)',val:'B(②④③)'},{sub:'(2) R =',val:'U/I_g − R_g'},{sub:'(3)',val:'E:2-3, C:1-4, R:1-2'}] },
  '2025-xgk2-q12': { type:'calc',          answer:[{sub:'p₂ =',val:'p₁T₂V₁/(T₁V₂)'},{sub:'ΔU =',val:'Q − W′'}] },
  '2025-xgk2-q13': { type:'calc',          answer:[{sub:'e/m =',val:'2v₀/(B₀R)'},{sub:'S =',val:'πR²√(B₀²−B²)/B'}] },
  '2025-xgk2-q14': { type:'calc',          answer:[{sub:'v_P =',val:'v₀/3'},{sub:'s_B =',val:'v₀t₀/3 − r₀/6'},{sub:'t_F =',val:'2r₀/v₀'}] },
  // 2024 新课标卷
  '2024-xgk1-q01': { type:'choice-single', answer:'C' },
  '2024-xgk1-q02': { type:'choice-single', answer:'C' },
  '2024-xgk1-q03': { type:'choice-single', answer:'B' },
  '2024-xgk1-q04': { type:'choice-single', answer:'A' },
  '2024-xgk1-q05': { type:'choice-single', answer:'B' },
  '2024-xgk1-q06': { type:'choice-multi',  answer:'BC' },
  '2024-xgk1-q07': { type:'choice-multi',  answer:'BD' },
  '2024-xgk1-q08': { type:'choice-multi',  answer:'AD' },
  '2024-xgk1-q09': { type:'experiment',    answer:[{sub:'(1)',val:'m_a > m_b'},{sub:'(2)',val:'m₁OP = m₁OM + m₂ON'}] },
  '2024-xgk1-q11': { type:'calc',          answer:[{sub:'T_P =',val:'48 N'},{sub:'T_Q =',val:'64 N'},{sub:'W =',val:'−800 J'}] },
  '2024-xgk1-q12': { type:'calc',          answer:[{sub:'v₀ =',val:'4 m/s'},{sub:'t₁ ≈',val:'0.32 s'},{sub:'H ≈',val:'0.125 m'}] },
  '2024-xgk1-q13': { type:'calc',          answer:[{sub:'r =',val:'mv₀/(qB)'},{sub:'T =',val:'2πm/(qB)'},{sub:'E =',val:'v₀B'}] },
  // 2024 北京卷
  '2024-bj-q01': { type:'choice-single', answer:'B' },
  '2024-bj-q02': { type:'choice-single', answer:'B' },
  '2024-bj-q03': { type:'choice-single', answer:'D' },
  '2024-bj-q04': { type:'choice-single', answer:'A' },
  '2024-bj-q05': { type:'choice-single', answer:'B' },
  '2024-bj-q07': { type:'choice-single', answer:'C' },
  '2024-bj-q08': { type:'choice-single', answer:'C' },
  '2024-bj-q09': { type:'choice-single', answer:'D' },
  '2024-bj-q10': { type:'choice-single', answer:'D' },
  '2024-bj-q11': { type:'choice-single', answer:'C' },
  '2024-bj-q15': { type:'experiment',    answer:'n = sin(i)/sin(r)' },
  '2024-bj-q16': { type:'experiment',    answer:'BC' },
  '2024-bj-q18': { type:'experiment',    answer:[{sub:'(1)',val:'AC'},{sub:'(2)',val:'m₁OP = m₁OM + m₂ON'},{sub:'(3)',val:'ml₁ = −ml₂ + Ml₃'}] },
  '2024-bj-q19': { type:'calc',          answer:[{sub:'t =',val:'√(2h/g)'},{sub:'v =',val:'d√(g/2h)'},{sub:'Q =',val:'Sd√(g/2h)'}] },
  '2024-bj-q20': { type:'calc',          answer:[{sub:'I₀ =',val:'Q/(CR)'},{sub:'a₀ =',val:'BLQ/(mCR)'},{sub:'v-t',val:'单调增渐缓'}] },
  '2024-bj-q21': { type:'calc',          answer:[{sub:'(1) ρ',val:'ρ₀(r₀/r)³'},{sub:'(2a) ΔKE',val:'GMm·Δ(1/r)'},{sub:'(2b) H',val:'随 t 减'}] },
  '2024-bj-q22': { type:'calc',          answer:[{sub:'(1) a',val:'qE/M'},{sub:"(2) B'",val:'√(2mEd/q)/R'},{sub:'(3) F',val:'nk√(2qEdM)'}] },
  // 2025 全国卷
  '2025-gk1-q01': { type:'choice-single', answer:'B' },
  '2025-gk1-q02': { type:'choice-single', answer:'C' },
  '2025-gk1-q03': { type:'choice-single', answer:'B' },
  '2025-gk1-q04': { type:'choice-single', answer:'C' },
  '2025-gk1-q05': { type:'choice-single', answer:'A' },
  '2025-gk1-q06': { type:'choice-multi',  answer:'AD' },
  '2025-gk1-q07': { type:'choice-multi',  answer:'BD' },
  '2025-gk1-q08': { type:'choice-multi',  answer:'BC' },
  '2025-gk1-q11': { type:'calc',          answer:[{sub:'(1) U\'/U =',val:'1/2'},{sub:'(2) E\'/E =',val:'2'}] },
  '2025-gk1-q12': { type:'calc',          answer:[{sub:'(1) W =',val:'mgR'},{sub:'(2) v₀ =',val:'2√(2gR)'},{sub:'(2) h_BA =',val:'3R'},{sub:'(3) M =',val:'m/9'},{sub:'(4) M\' =',val:'m/2'}] },

  // 2023 全国甲卷
  '2023-gk1-q01': { type:'choice-single', answer:'B' },
  '2023-gk1-q03': { type:'choice-single', answer:'D' },
  '2023-gk1-q06': { type:'choice-multi',  answer:'BC' },
  '2023-gk1-q07': { type:'choice-multi',  answer:'BD' },
  '2023-gk1-q08': { type:'choice-multi',  answer:'AD' },
  '2023-gk1-q11': { type:'calc',          answer:[{sub:'(1) v₀ =',val:'√(2E_p/m)'},{sub:'(2) d =',val:'4√(E_p·h/(mg))'}] },
  '2023-gk1-q12': { type:'calc',          answer:[{sub:'(1) v_P =',val:'v₀/2'},{sub:'(2) Q_热 =',val:'m·v₀²'},{sub:'(3) t_Q =',val:'2mR/(B²L²)'}] },
  '2023-gk1-q15': { type:'choice-multi',  answer:'ACE' },
  '2023-gk1-q16': { type:'calc',          answer:[{sub:'(1) t=0 波形',val:'见图（P 虚线 / Q 实线，反相）'},{sub:'(2) 极大',val:'x = 2, 6 m'},{sub:'(2) 极小',val:'x = 0, 4, 8 m'}] },
  // 2023 全国乙卷
  '2023-gk2-q01': { type:'choice-single', answer:'B' },
  '2023-gk2-q02': { type:'choice-single', answer:'D' },
  '2023-gk2-q05': { type:'choice-single', answer:'A' },
  '2023-gk2-q06': { type:'choice-multi',  answer:'BC' },
  '2023-gk2-q08': { type:'choice-multi',  answer:'BD' },
  '2023-gk2-q11': { type:'calc',          answer:[{sub:'(1) |q_B|',val:'q'},{sub:'(1) 正负',val:'A、B、C 均为正电荷'},{sub:'(2) q_C',val:'(3 − √3)q / 3'}] },
  '2023-gk2-q12': { type:'calc',          answer:[{sub:'(1) v_球=v_盘',val:'(1/2)√(2gl)'},{sub:'(2) d_max',val:'l'},{sub:'(3) 碰撞次数',val:'4'}] },
  '2023-gk2-q13': { type:'choice-multi',  answer:'ACD' },
  '2023-gk2-q15': { type:'choice-multi',  answer:'ABE' },
  '2023-gk2-q16': { type:'calc',          answer:[{sub:'AM',val:'(3−√3)/3 · AB ≈ 0.423 AB'}] },
  // 2023 新课标卷
  '2023-xgk1-q05': { type:'choice-single', answer:'C' },
  '2023-xgk1-q06': { type:'choice-multi',  answer:'BD' },
  // 2021 全国甲卷
  '2021-gk1-q01': { type:'choice-single', answer:'D' },
};

// 按 year×paper 计数
function countsFor() {
  const m = {};
  PROBLEMS.forEach(p => {
    const k = `${p.year}-${p.paper}`;
    m[k] = (m[k] || 0) + 1;
  });
  return m;
}

Object.assign(window, { PAPERS, YEARS, PROBLEMS, PROBLEM_META, examCounts: countsFor() });
