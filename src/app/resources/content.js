import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Ximing1',
    lastName: 'Wang',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Student in Cartography M.Sc.',
    avatar: '/images/avatar.jpg',
    location: 'Europe/Berlin',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: ['English', 'Chinese']  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: false,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    // {
    //     name: 'GitHub',
    //     icon: 'github',
    //     link: 'https://github.com/once-ui-system/nextjs-starter',
    // },
    {
        name: 'Bilibili',
        icon: 'bilibili',
        link: 'https://space.bilibili.com/146797437?spm_id_from=333.1007.0.0',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:simonwangcn@qq.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my GIS and spatial analysis projects.`,
    headline: <>Spatial Data Analyst & Cartographer</>,
    subline: <>I'm Ximing, a Master's student in the Erasmus+ Cartography program at <InlineCode>TUM</InlineCode>. I specialize in GIS, spatial data analysis, and transforming complex geospatial data into insightful map designs. Currently seeking PhD opportunities and challenging roles in geospatial data science.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
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
        title: 'Introduction',
        description: (
            <p style={{ lineHeight: '1.75', fontSize: '1.15rem'}}>
                I'm Ximing, a Master's student in the Erasmus+ Cartography program at TUM. I specialize in GIS, spatial data analysis, and transforming complex geospatial data into insightful map designs. Currently seeking PhD opportunities and challenging roles in geospatial data science.
            </p>
        )
    },
    work: {
        display: false, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'FLY',
                timeframe: '2022 - Present',
                role: 'Senior Design Engineer',
                achievements: [
                    <>Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user engagement and 30% faster load times.</>,
                    <>Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Once UI Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'Creativ3',
                timeframe: '2018 - 2022',
                role: 'Lead Designer',
                achievements: [
                    <>Developed a design system that unified the brand across multiple platforms, improving design consistency by 40%.</>,
                    <>Led a cross-functional team to launch a new product line, contributing to a 15% increase in overall company revenue.</>
                ],
                images: []
            }
        ]
    },
    studies: {
        display: true,
        title: 'Education',
        institutions: [
            {
                name: 'Technical University of Munich & Partner Universities',
                description: (
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '12px', marginBottom: '12px' }}>

                        <div style={{
                            flexShrink: 0,
                            width: '90px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <img
                                src="/images/TUM.svg"
                                alt="TUM Logo"
                                style={{ width: '95%', height: 'auto', display: 'block',marginTop: '12px', marginBottom: '12px' }}
                            />
                            <img
                                src="/images/Carto.svg"
                                alt="Carto Logo"
                                style={{ width: '55%', height: 'auto', display: 'block' }}
                            />
                        </div>

                        <div style={{ flex: 1, paddingTop: '4px'}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <p style={{ fontWeight: '600', margin: '0', fontSize: '1.1rem', color: 'var(--neutral-on-background-strong)' }}>
                                    Master of Science in Cartography
                                </p>
                                <span style={{ fontSize: '1rem', color: 'var(--neutral-on-background-medium)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                    2024 - Present
                                </span>
                            </div>

                            <p style={{ margin: '0 12px 16px 0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', }}>
                                A highly competitive Erasmus+ program focusing on spatial data science, web mapping, and geovisualization, jointly hosted by TU Munich, TU Wien, TU Dresden, and University of Twente.
                            </p>

                            <a
                                href="https://cartographymaster.eu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'underline',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    color: 'var(--brand-primary)'
                                }}
                            >
                                Visit Official Program Website ↗
                            </a>
                        </div>
                    </div>
                ),
            },
            {
                name: 'China University of Petroleum (East China)',
                description: (
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '12px', }}>

                        <div style={{ flexShrink: 0, width: '90px', display: 'flex', justifyContent: 'center' }}>
                            <img
                                src="/images/upc.svg"
                                alt="UPC Logo"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <p style={{ fontWeight: '600', margin: '0', fontSize: '1.1rem', color: 'var(--neutral-on-background-strong)' }}>
                                    Bachelor of Science in Geographic Information Science
                                </p>
                                <span style={{ fontSize: '1rem', color: 'var(--neutral-on-background-medium)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                    2020 - 2024
                                </span>
                            </div>
                            
                            <p style={{ margin: '0 16px 16px 0', fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', }}>
                                Built a strong foundation in spatial analysis, remote sensing, and geocomputation. Graduated with the honor of <strong>University-Level Outstanding Graduate</strong>.
                            </p>
                        </div>
                    </div>
                ),
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            {
                title: 'Figma',
                description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/cover-02.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-03.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Next.js',
                description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    }
}

const blog = {
    label: 'Blog',
    title: 'Writing about design and tech...',
    description: `Read what ${person.name} has been up to recently`
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Work',
    title: 'My projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'My photo gallery',
    description: `A photo collection by ${person.name}`,
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

export { person, social, newsletter, home, about, blog, work, gallery };