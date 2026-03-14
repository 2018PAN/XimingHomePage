import { InlineCode } from "@/once-ui/components";

const createI18nContent = (t) => {
    const isZh = t("locale") === "zh";

    const person = {
        firstName: isZh ? '晰明' : 'Ximing',
        lastName: isZh ? '王' : 'Wang',
        get name() {
            return isZh ? `${this.lastName}${this.firstName}` : `${this.firstName} ${this.lastName}`;
        },
        role: isZh ? '慕尼黑工业大学 制图学硕士在读' : 'Student in Cartography M.Sc.',
        avatar: '/images/avatar.jpg',
        location: 'Europe/Berlin',
        languages: isZh ? ['英语', '中文'] : ['English', 'Chinese']
    }

    const newsletter = {
        display: false,
        title: <>Subscribe to {person.firstName}'s Newsletter</>,
        description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
    }

    const social = [
        {
            name: 'Bilibili',
            icon: 'bilibili',
            link: 'https://space.bilibili.com/146797437?spm_id_from=333.1007.0.0',
        },
        {
            name: isZh ? '邮件' : 'Email',
            icon: 'email',
            link: 'mailto:simonwangcn@qq.com',
        },
    ]

    const home = {
        label: isZh ? '首页' : 'Home',
        title: isZh ? `${person.name} 的个人主页` : `${person.name}'s Portfolio`,
        description: isZh ? `展示我的 GIS 和空间数据分析项目的个人网站。` : `Portfolio website showcasing my GIS and spatial analysis projects.`,
        headline: isZh ? <>空间数据分析师 & 制图师</> : <>Spatial Data Analyst & Cartographer</>,
        subline: isZh
            ? <>我是{person.firstName}，<InlineCode>TUM</InlineCode> Erasmus+ 制图学硕士项目在读。我专注于 GIS、空间数据分析，并将复杂的地理数据转化为直观的地图设计。目前正在寻找空间数据科学领域的博士机会和充满挑战的职位。</>
            : <>I'm Ximing, a Master's student in the Erasmus+ Cartography program at <InlineCode>TUM</InlineCode>. I specialize in GIS, spatial data analysis, and transforming complex geospatial data into insightful map designs. Currently seeking PhD opportunities and challenging roles in geospatial data science.</>
    }

    const about = {
        label: isZh ? '关于我' : 'About',
        title: isZh ? '关于我' : 'About me',
        description: isZh ? `认识来自 ${person.location} 的 ${person.role} ${person.name}` : `Meet ${person.name}, ${person.role} from ${person.location}`,
        tableOfContent: {
            display: true,
            subItems: false
        },
        avatar: {
            display: true
        },
        calendar: {
            display: false,
            link: 'https://cal.com'
        },
        intro: {
            display: true,
            title: isZh ? '个人简介' : 'Introduction',
            description: (
                <p style={{ lineHeight: '1.75', fontSize: '1.15rem' }}>
                    {isZh
                        ? '我是王晰明，慕尼黑工业大学 (TUM) Erasmus+ 制图学专业的硕士研究生。我专注于 GIS、空间数据分析，致力于将复杂的地理空间数据转化为富有洞察力的地图设计。目前，我正在积极寻找空间数据科学领域的博士机会及相关挑战性职位。'
                        : "I'm Ximing, a Master's student in the Erasmus+ Cartography program at TUM. I specialize in GIS, spatial data analysis, and transforming complex geospatial data into insightful map designs. Currently seeking PhD opportunities and challenging roles in geospatial data science."}
                </p>
            )
        },
        work: {
            display: false, // 你的经历被隐藏了，保持不变
            title: 'Work Experience',
            experiences: [{
                company: 'TUM', // 👈 随便填个词占位，用来骗过 SEO 引擎防报错
                timeframe: '',
                role: '',
                achievements: [],
                images: []
            }]
        },
        studies: {
            display: true,
            title: isZh ? '教育背景' : 'Education',
            institutions: [
                {
                    name: isZh ? '慕尼黑工业大学' : 'Technical University of Munich',
                    description: (
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '12px', marginBottom: '12px' }}>
                            <div style={{ flexShrink: 0, width: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <img src="/images/TUM.svg" alt="TUM Logo" style={{ width: '95%', height: 'auto', display: 'block', marginTop: '12px', marginBottom: '12px' }} />
                                <img src="/images/Carto.svg" alt="Carto Logo" style={{ width: '55%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ flex: 1, paddingTop: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <p style={{ fontWeight: '600', margin: '0', fontSize: '1.1rem', color: 'var(--neutral-on-background-strong)' }}>
                                        {isZh ? '制图学 理学硕士' : 'Master of Science in Cartography'}
                                    </p>
                                    <span style={{ fontSize: '1rem', color: 'var(--neutral-on-background-medium)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                        {isZh ? '2024 - 至今' : '2024 - Present'}
                                    </span>
                                </div>

                                <p style={{ margin: '0 12px 16px 0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', }}>
                                    {isZh
                                        ? 'Erasmus+ 联合硕士项目，专注于空间数据科学、Web 制图和地理可视化，由慕尼黑工大、维也纳工大、德累斯顿工大和特温特大学联合举办。'
                                        : 'Cartography M.Sc. is a four semester Master of Science Programme of four universities in Munich, Vienna, Dresden and Twente. It focusses on a broad education in cartography and geoinformatics.'}
                                </p>

                                <a href="https://cartographymaster.eu/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                                    {isZh ? '🌐 访问项目官网 ↗' : '🌐 Visit Official Program Website ↗'}
                                </a>
                            </div>
                        </div>
                    ),
                },
                {
                    name: isZh ? '中国石油大学（华东）' : 'China University of Petroleum (East China)',
                    description: (
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '12px', }}>
                            <div style={{ flexShrink: 0, width: '90px', display: 'flex', justifyContent: 'center' }}>
                                <img src="/images/upc.svg" alt="UPC Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <p style={{ fontWeight: '600', margin: '0', fontSize: '1.1rem', color: 'var(--neutral-on-background-strong)' }}>
                                        {isZh ? '地理信息科学 理学学士' : 'Bachelor of Science in Geographic Information Science'}
                                    </p>
                                    <span style={{ fontSize: '1rem', color: 'var(--neutral-on-background-medium)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                        2020 - 2024
                                    </span>
                                </div>

                                <p style={{ margin: '0 16px 16px 0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', }}>
                                    {isZh
                                        ? <>建立了扎实的空间分析、遥感和地理计算基础。荣获<strong>校级优秀毕业生</strong>荣誉。</>
                                        : <>Built a strong foundation in spatial analysis, remote sensing, and geocomputation. Graduated with the honor of <strong>University-Level Outstanding Graduate</strong>.</>}
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    name: isZh ? '萨尔茨堡大学' : 'University of Salzburg',
                    description: (
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '12px', }}>

                            <div style={{ flexShrink: 0, width: '90px', display: 'flex', justifyContent: 'center' }}>
                                <img src="/images/PLUS.png" alt="PLUS Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <p style={{ fontWeight: '600', margin: '0', fontSize: '1.1rem', color: 'var(--neutral-on-background-strong)' }}>
                                        {isZh ? '中奥欧暑期学校交换' : 'Chinese Austrian EU Summer School Exchange'}
                                    </p>
                                    <span style={{ fontSize: '1rem', color: 'var(--neutral-on-background-medium)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                        {isZh ? '2022年8月' : 'Aug 2022'}
                                    </span>
                                </div>

                                <p style={{ margin: '0 16px 16px 0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', }}>
                                    {isZh
                                        ? '由萨尔茨堡大学举办的中奥短期学术课程，拓宽了国际视野与跨文化交流能力。'
                                        : 'A short-term academic program hosted by Paris Lodron Universität Salzburg, broadening international perspectives and cross-cultural communication skills.'}
                                </p>
                            </div>
                        </div>
                    ),
                }
            ]
        },

        languages: {
            display: true,
            title: isZh ? '语言能力' : 'Languages',
            items: [
                { name: isZh ? '中文' : 'Chinese', level: isZh ? '母语' : 'Native' },
                { name: isZh ? '英语' : 'English', level: 'C1' },
                { name: isZh ? '德语' : 'German', level: 'B1' }
            ]
        },

        technical: {
            display: true, 
            title: isZh ? '专业技能' : 'Technical Skills',
            skills: [
                {
                    title: 'C / C++',
                    description: <>{isZh 
                        ? '主要用于算法竞赛，对数论与图论算法有深入的掌握和实践经验。' 
                        : 'Primarily used for algorithm competitions. Strong understanding of number theory and graph theory.'}</>,
                    images: []
                },
                {
                    title: 'Python',
                    description: <>{isZh 
                        ? '熟练掌握 Python，具有使用 Flask 进行 Web 开发以及数据科学应用的经验。' 
                        : 'Proficient in Python with experience in Flask for web development and data science applications.'}</>,
                    images: []
                },
                {
                    title: 'JavaScript & Web Dev',
                    description: <>{isZh 
                        ? '熟练运用 JavaScript、HTML、CSS，以及 React 和 Next.js 等框架开发动态网页。' 
                        : 'Skilled in JavaScript, HTML, CSS, and frameworks like Next.js and React, for creating dynamic web applications.'}</>,
                    images: []
                },
                {
                    title: 'SQL',
                    description: <>{isZh 
                        ? '熟练使用 SQL 进行高效的数据库管理、查询优化与数据处理。' 
                        : 'Adept at using SQL for database management and data manipulation.'}</>,
                    images: []
                },
                {
                    title: 'ArcGIS',
                    description: <>{isZh 
                        ? '熟练使用 ArcGIS，可进行复杂的地理空间数据分析与专业地图绘制。' 
                        : 'Proficient in ArcGIS for complex spatial data analysis and professional map creation.'}</>,
                    images: []
                },
                {
                    title: 'Adobe Creative Suite (PS, PR, AI)',
                    description: <>{isZh 
                        ? '熟练使用 Photoshop、Premiere 和 Illustrator 进行高品质的数据可视化设计与多媒体创作。' 
                        : 'Proficient in Adobe software for high-quality data visualization and multimedia creation.'}</>,
                    images: []
                },
                {
                    title: 'Git & GitHub',
                    description: <>{isZh 
                        ? '熟悉基于 Git 和 GitHub 的团队协同开发流程。' 
                        : 'Proficient in version control using Git and GitHub for collaborative software development.'}</>,
                    images: []
                },
                {
                    title: isZh ? 'Java & Android 开发' : 'Java & Android Development',
                    description: <>{isZh 
                        ? '了解 Java 面向对象编程，具备基础的 Android 应用开发能力，能够使用 Android Studio 完成常规的 UI 界面构建与功能实现。' 
                        : 'Familiar with Java object-oriented programming and basic Android app development. Able to use Android Studio for standard UI construction and feature implementation.'}</>,
                    images: []
                },
                {
                    title: 'MATLAB',
                    description: <>{isZh 
                        ? '能够使用 MATLAB 进行基础的数据处理、科学计算与算法验证。' 
                        : 'Capable of basic data processing and scientific computation using MATLAB.'}</>,
                    images: []
                }
            ]
        }
    }

    const blog = {
        label: t("blog.label"),
        title: t("blog.title"),
        description: t("blog.description", { name: person.name })
        // Create new blog posts by adding a new .mdx file to app/blog/posts
        // All posts will be listed on the /blog route
    }

    const work = {
        label: t("work.label"),
        title: t("work.title"),
        description: t("work.description", { name: person.name })
        // Create new project pages by adding a new .mdx file to app/blog/posts
        // All projects will be listed on the /home and /work routes
    }

    const gallery = {
        label: t("gallery.label"),
        title: t("gallery.title"),
        description: t("gallery.description", { name: person.name }),
        // Images from https://pexels.com
        images: [
            {
                src: '/images/gallery/img-01.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-02.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-03.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-04.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-05.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-06.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-07.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-08.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-09.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-10.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-11.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-12.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-13.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-14.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
        ]
    }
    return {
        person,
        social,
        newsletter,
        home,
        about,
        blog,
        work,
        gallery
    }
};

export { createI18nContent };
