export type Sample = {
  id: string;
  label: string;
  company: string;
  role: string;
  jd: string;
  resume: string;
};

export const samples: Sample[] = [
  {
    id: "product",
    label: "互联网产品经理",
    company: "星河科技",
    role: "产品经理",
    jd: `岗位：产品经理（内容增长方向）\n工作职责：\n1. 负责内容社区用户增长与留存，通过用户研究、竞品分析和数据分析发现机会；\n2. 独立完成需求分析、PRD、原型设计，推动研发、设计和运营跨部门协作并按期上线；\n3. 搭建核心指标体系，持续进行A/B测试和产品迭代。\n任职要求：\n本科及以上学历，有互联网产品或增长实习经历；熟练使用Axure、Figma、SQL；逻辑清晰，具备用户洞察、沟通协调和项目推进能力；对内容社区及年轻用户有热情。`,
    resume: `教育背景：华东大学 信息管理专业 本科 2023-2027\n星海内容社区｜产品实习生 2025.03-2025.08\n- 负责新用户兴趣选择流程优化，通过访谈12名用户与漏斗分析定位流失节点，输出PRD并协同设计、研发上线。\n- 设计A/B测试，首日内容点击率由31%提升至39%，7日留存提升4.2%。\n校园二手平台｜项目负责人\n- 使用Figma完成产品原型，组织5人团队完成需求调研与两轮迭代，覆盖校内800名用户。\n技能：Axure、Figma、SQL、Excel；英语CET-6。`,
  },
  {
    id: "data",
    label: "数据分析师",
    company: "远舟出行",
    role: "数据分析师",
    jd: `岗位：数据分析师（用户增长）\n工作职责：负责增长业务数据监控，搭建指标体系和可视化看板；通过SQL与Python完成专题分析、用户分群和渠道归因；与产品、运营协作设计实验并评估策略效果。\n要求：熟练掌握SQL，能够使用Python进行数据清洗和分析；熟悉Tableau或Power BI；理解A/B测试、统计学和常用增长指标；具备业务理解、逻辑表达和跨团队协作能力。有互联网分析实习经验优先。`,
    resume: `教育背景：南城大学 统计学 本科\n青鸟电商｜数据分析实习生\n- 使用SQL处理订单与用户行为数据，搭建周度经营报表，支持运营复盘。\n- 用Python清洗20万条活动数据，通过用户分群发现高潜人群，活动转化率提升8%。\n课程项目：外卖用户留存分析\n- 使用Power BI制作留存看板，完成队列分析并提出首单优惠优化建议。\n技能：SQL、Python、Excel、Power BI；统计学、回归分析。`,
  },
  {
    id: "frontend",
    label: "前端开发工程师",
    company: "云杉网络",
    role: "前端开发工程师",
    jd: `岗位：前端开发工程师\n负责Web端产品研发与性能优化，参与组件库和工程体系建设；与产品、设计、后端协作交付高质量功能。要求：计算机基础扎实，熟悉JavaScript、TypeScript、HTML、CSS；熟练使用React及其生态，了解Node.js、Webpack或Vite；理解浏览器原理、网络协议与前端性能优化；具备良好的代码规范和团队协作能力，有开源项目或大型项目经验优先。`,
    resume: `教育背景：北岭大学 软件工程 本科\n云端协作白板｜前端负责人\n- 基于React、TypeScript实现多人白板核心交互，封装18个通用组件。\n- 采用虚拟列表和资源懒加载优化首屏，LCP由3.1秒降至1.7秒。\n极光科技｜前端实习生\n- 参与运营平台研发，使用React Query统一请求状态，缺陷率下降20%。\n技能：JavaScript、TypeScript、React、Vite、Git、Node.js；了解HTTP与浏览器渲染机制。`,
  },
];

export type InterviewNote = {
  id: string;
  role: string;
  company: string;
  round: string;
  title: string;
  date: string;
  quality: number;
  questions: string[];
};

const notes: Omit<InterviewNote, "id">[] = [
  { role: "产品经理", company: "头部内容平台", round: "业务一面", title: "内容产品秋招一面复盘", date: "2025-09", quality: 96, questions: ["如何定位新用户次日留存下降的原因？", "讲一个你主导推进并产生结果的项目", "如何设计内容推荐的核心指标体系？"] },
  { role: "产品经理", company: "本地生活平台", round: "业务二面", title: "增长产品二面问题整理", date: "2025-08", quality: 93, questions: ["如何判断一个增长实验是否值得上线？", "产品与研发对排期有分歧时怎么办？", "选择一个常用App提出改进方案"] },
  { role: "产品经理", company: "电商平台", round: "HR面", title: "产品岗秋招完整面经", date: "2025-09", quality: 91, questions: ["为什么选择产品经理？", "为什么投递我们公司？", "你的职业规划是什么？"] },
  { role: "产品经理", company: "短视频平台", round: "业务一面", title: "内容增长产品真实面试记录", date: "2025-07", quality: 95, questions: ["如何分析某内容品类播放量突然下降？", "介绍一次用户研究经历", "如何定义优质内容？"] },
  { role: "产品经理", company: "在线教育", round: "交叉面", title: "校招产品交叉面复盘", date: "2025-08", quality: 88, questions: ["从0到1设计一款校园求职产品", "如何做需求优先级排序？", "项目失败后你做了什么？"] },
  { role: "产品经理", company: "社交平台", round: "业务一面", title: "社区产品岗位面试题", date: "2025-09", quality: 92, questions: ["社区冷启动如何获得第一批用户？", "如何平衡内容质量与活跃度？", "你如何做竞品分析？"] },
  { role: "运营", company: "头部内容平台", round: "业务一面", title: "内容运营一面高频题", date: "2025-09", quality: 94, questions: ["如何策划一个校园热点话题？", "如何定义优质内容并提升供给？", "讲一次数据驱动的运营项目"] },
  { role: "运营", company: "电商平台", round: "业务二面", title: "用户运营校招复盘", date: "2025-08", quality: 91, questions: ["如何进行用户分层运营？", "召回沉默用户有哪些方法？", "活动效果不达预期如何复盘？"] },
  { role: "运营", company: "游戏公司", round: "业务一面", title: "社区运营岗位问题整理", date: "2025-07", quality: 87, questions: ["如何处理社区负面舆情？", "设计一个新游预约活动", "你关注哪些社区指标？"] },
  { role: "运营", company: "生活服务平台", round: "HR面", title: "运营秋招HR面记录", date: "2025-09", quality: 86, questions: ["为什么选择运营岗位？", "你最有成就感的经历是什么？", "如何看待重复性工作？"] },
  { role: "数据分析师", company: "电商平台", round: "业务一面", title: "数据分析秋招一面复盘", date: "2025-09", quality: 97, questions: ["GMV下降应该如何拆解分析？", "SQL窗口函数有哪些应用场景？", "如何设计A/B测试并判断显著性？"] },
  { role: "数据分析师", company: "出行平台", round: "业务二面", title: "增长分析业务面记录", date: "2025-08", quality: 95, questions: ["新客次月留存下降如何归因？", "如何搭建渠道质量评价体系？", "讲一个分析结论推动业务落地的例子"] },
  { role: "数据分析师", company: "内容平台", round: "业务一面", title: "商业分析一面题目", date: "2025-07", quality: 91, questions: ["如何衡量推荐策略的长期价值？", "异常指标监控应该如何搭建？", "均值和中位数应该如何选择？"] },
  { role: "数据分析师", company: "金融科技", round: "笔试+面试", title: "数据岗SQL与业务题复盘", date: "2025-09", quality: 93, questions: ["连续登录用户如何用SQL计算？", "漏斗每一层都下降说明什么？", "如何向非数据同学解释置信区间？"] },
  { role: "数据分析师", company: "在线教育", round: "HR面", title: "数据分析HR面问题", date: "2025-08", quality: 84, questions: ["为什么选择数据分析？", "你如何理解业务敏感度？", "职业规划是什么？"] },
  { role: "前端开发工程师", company: "云服务平台", round: "技术一面", title: "前端校招技术一面复盘", date: "2025-09", quality: 97, questions: ["React渲染和更新流程是怎样的？", "浏览器从输入URL到页面展示发生了什么？", "如何系统优化首屏性能？"] },
  { role: "前端开发工程师", company: "电商平台", round: "技术二面", title: "前端二面项目深挖", date: "2025-08", quality: 95, questions: ["你做过最复杂的前端项目是什么？", "如何设计一个可维护的组件库？", "线上白屏如何定位和止损？"] },
  { role: "前端开发工程师", company: "内容平台", round: "技术一面", title: "React方向秋招面经", date: "2025-09", quality: 94, questions: ["useEffect的执行时机和常见陷阱是什么？", "虚拟列表的实现原理是什么？", "TypeScript泛型解决了什么问题？"] },
  { role: "前端开发工程师", company: "协作办公平台", round: "交叉面", title: "大前端交叉面复盘", date: "2025-07", quality: 90, questions: ["前端如何保证多人协作数据一致性？", "你如何推动一次技术重构？", "需求频繁变化时如何控制质量？"] },
  { role: "前端开发工程师", company: "本地生活平台", round: "HR面", title: "研发岗HR面记录", date: "2025-08", quality: 84, questions: ["为什么选择前端方向？", "如何保持技术学习？", "你希望加入怎样的团队？"] },
  { role: "后端开发工程师", company: "电商平台", round: "技术一面", title: "Java后端秋招一面", date: "2025-09", quality: 96, questions: ["数据库索引失效有哪些场景？", "如何设计高并发秒杀系统？", "讲讲JVM内存模型"] },
  { role: "后端开发工程师", company: "云服务平台", round: "技术二面", title: "后端项目深挖复盘", date: "2025-08", quality: 94, questions: ["如何保证分布式事务一致性？", "缓存穿透和雪崩如何处理？", "线上接口变慢如何排查？"] },
  { role: "市场营销", company: "消费品牌", round: "业务一面", title: "品牌营销校招面试整理", date: "2025-08", quality: 88, questions: ["如何制定新品上市传播策略？", "怎样衡量一次品牌活动？", "分享一个你喜欢的营销案例"] },
  { role: "算法工程师", company: "内容平台", round: "技术一面", title: "推荐算法秋招面经", date: "2025-09", quality: 95, questions: ["推荐系统召回和排序如何配合？", "如何处理样本不均衡？", "离线指标提升线上没有变化怎么办？"] },
];

export const interviewNotes: InterviewNote[] = notes.map((note, index) => ({
  ...note,
  id: `XHS-${String(index + 1).padStart(3, "0")}`,
}));

export const skillDictionary = [
  "SQL", "Python", "Java", "JavaScript", "TypeScript", "React", "Vue", "Node.js", "Figma", "Axure",
  "Power BI", "Tableau", "Excel", "A/B测试", "数据分析", "用户研究", "竞品分析", "PRD", "原型设计",
  "项目推进", "跨部门协作", "用户增长", "指标体系", "性能优化", "组件库", "Git", "HTTP", "统计学",
];

