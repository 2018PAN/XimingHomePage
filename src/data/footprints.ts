// 去过的国家 (ISO Alpha-3 标准)
export const VISITED_COUNTRIES = [
  'CHN', 'TWN', 'HKG', 'MAC', // 中国
  'JPN', // 日本
  'DEU', // 德国
  'ITA', // 意大利
  'AUT', // 奥地利
  'NLD', // 荷兰
  'FRA', // 法国
  'SWE', // 瑞典
  'DNK', // 丹麦
  'CZE', // 捷克
  'VAT'  // 梵蒂冈
];

// 城市坐标库
const COORDS = {
  Yantai: [121.3914, 37.5393],
  Weihai: [122.1163, 37.5097],
  Taian: [117.0879, 36.1983],
  Shanghai: [121.4737, 31.2304],
  Datong: [113.0823, 40.0651],
  Hangzhou: [120.1551, 30.2741],
  Jinhua: [119.6495, 29.0795],
  Foshan: [113.1215, 23.0216],
  Guangzhou: [113.2644, 23.1291],
  Jinan: [117.0009, 36.6758],
  Beijing: [116.4074, 39.9042],
  Tianjin: [117.2008, 39.0842],
  Wuhan: [114.3055, 30.5928],
  Zhengzhou: [113.6253, 34.7466],
  XiAn: [108.9398, 34.3416],
  AlxaRightBanner: [101.6620, 39.2122],
  Zibo: [118.0559, 36.8135],
  Qingdao: [120.3826, 36.0671],
  Zaozhuang: [117.3223, 34.8084],
  Lanzhou: [103.8374, 36.0615],
  Baoding: [115.4645, 38.8739],
  Tokyo: [139.6917, 35.6895],
  Osaka: [135.5023, 34.6937],
  Kyoto: [135.7681, 35.0116],
  Vienna: [16.3738, 48.2082],
  Schladming: [13.6856, 47.3939],
  Rome: [12.4964, 41.9028],
  Paris: [2.3522, 48.8566],
  Florence: [11.2558, 43.7696],
  Venice: [12.3155, 45.4408],
  Munich: [11.5820, 48.1351],
  Dresden: [13.7373, 51.0504],
  Cologne: [6.9603, 50.9375],
  Berlin: [13.4050, 52.5200],
  Nuremberg: [11.0767, 49.4521],
  Amsterdam: [4.8952, 52.3702],
  TheHague: [4.3007, 52.0705],
  Prague: [14.4378, 50.0755],
  Copenhagen: [12.5683, 55.6761],
  Stockholm: [18.0686, 59.3293],
  Strasbourg: [7.7521, 48.5734],
  VaticanCity: [12.4534, 41.9029],
  Aachen: [6.0844,50.7756],
};

// 城市与航线数据
export const myCityFootprints = {
  type: "FeatureCollection",
  features: [
    // 航线部分
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Yantai, COORDS.Beijing] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Beijing, COORDS.Munich] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Berlin, COORDS.Copenhagen] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Qingdao, COORDS.Osaka] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Osaka, COORDS.Tokyo] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Venice, COORDS.Vienna] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Rome, COORDS.Paris] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Yantai, COORDS.Wuhan] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Wuhan, COORDS.Guangzhou] }, properties: { type: "route" } }, 
    { type: "Feature", geometry: { type: "LineString", coordinates: [COORDS.Guangzhou, COORDS.Yantai] }, properties: { type: "route" } }, 

    // 中国城市
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Yantai }, properties: { type: "city", name_en: "Yantai", name_zh: "烟台" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Weihai }, properties: { type: "city", name_en: "Weihai", name_zh: "威海" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Zaozhuang }, properties: { type: "city", name_en: "Zaozhuang", name_zh: "枣庄" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Shanghai }, properties: { type: "city", name_en: "Shanghai", name_zh: "上海" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Hangzhou }, properties: { type: "city", name_en: "Hangzhou", name_zh: "杭州" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.AlxaRightBanner }, properties: { type: "city", name_en: "Alxa Right Banner", name_zh: "阿拉善右旗" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Jinhua }, properties: { type: "city", name_en: "Jinhua", name_zh: "金华" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Taian }, properties: { type: "city", name_en: "Taian", name_zh: "泰安" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Foshan }, properties: { type: "city", name_en: "Foshan", name_zh: "佛山" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Guangzhou }, properties: { type: "city", name_en: "Guangzhou", name_zh: "广州" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Jinan }, properties: { type: "city", name_en: "Jinan", name_zh: "济南" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Beijing }, properties: { type: "city", name_en: "Beijing", name_zh: "北京" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Tianjin }, properties: { type: "city", name_en: "Tianjin", name_zh: "天津" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Wuhan }, properties: { type: "city", name_en: "Wuhan", name_zh: "武汉" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Zhengzhou }, properties: { type: "city", name_en: "Zhengzhou", name_zh: "郑州" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.XiAn }, properties: { type: "city", name_en: "Xi'an", name_zh: "西安" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Zibo }, properties: { type: "city", name_en: "Zibo", name_zh: "淄博" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Qingdao }, properties: { type: "city", name_en: "Qingdao", name_zh: "青岛" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Lanzhou }, properties: { type: "city", name_en: "Lanzhou", name_zh: "兰州" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Baoding }, properties: { type: "city", name_en: "Baoding", name_zh: "保定" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Datong }, properties: { type: "city", name_en: "Datong", name_zh: "大同" } },

    // 日本城市
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Tokyo }, properties: { type: "city", name_en: "Tokyo", name_zh: "东京" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Osaka }, properties: { type: "city", name_en: "Osaka", name_zh: "大阪" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Kyoto }, properties: { type: "city", name_en: "Kyoto", name_zh: "京都" } },

    // 欧洲城市
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Vienna }, properties: { type: "city", name_en: "Vienna", name_zh: "维也纳" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Schladming }, properties: { type: "city", name_en: "Schladming", name_zh: "施拉德明" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Rome }, properties: { type: "city", name_en: "Rome", name_zh: "罗马" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Paris }, properties: { type: "city", name_en: "Paris", name_zh: "巴黎" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Florence }, properties: { type: "city", name_en: "Florence", name_zh: "佛罗伦萨" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Venice }, properties: { type: "city", name_en: "Venice", name_zh: "威尼斯" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Munich }, properties: { type: "city", name_en: "Munich", name_zh: "慕尼黑" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Dresden }, properties: { type: "city", name_en: "Dresden", name_zh: "德累斯顿" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Cologne }, properties: { type: "city", name_en: "Cologne", name_zh: "科隆" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Berlin }, properties: { type: "city", name_en: "Berlin", name_zh: "柏林" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Nuremberg }, properties: { type: "city", name_en: "Nuremberg", name_zh: "纽伦堡" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Amsterdam }, properties: { type: "city", name_en: "Amsterdam", name_zh: "阿姆斯特丹" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.TheHague }, properties: { type: "city", name_en: "The Hague", name_zh: "海牙" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Prague }, properties: { type: "city", name_en: "Prague", name_zh: "布拉格" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Copenhagen }, properties: { type: "city", name_en: "Copenhagen", name_zh: "哥本哈根" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Stockholm }, properties: { type: "city", name_en: "Stockholm", name_zh: "斯德哥尔摩" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Strasbourg }, properties: { type: "city", name_en: "Strasbourg", name_zh: "斯特拉斯堡" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.VaticanCity }, properties: { type: "city", name_en: "Vatican City", name_zh: "梵蒂冈城" } },
    { type: "Feature", geometry: { type: "Point", coordinates: COORDS.Aachen }, properties: { type: "city", name_en: "Aachen", name_zh: "亚琛" } },
  ]
};