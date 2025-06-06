import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getSortedPostsData } from '../../lib/posts';
import styles from '../../styles/index.module.css';

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return { props: { allPostsData } };
}

export default function BlogHome({ allPostsData }) {
    return (
        <Layout> {/* <== YOUR LAYOUT IS AUTOMATICALLY APPLIED! */}
            <Head>
                <title>Blog - Online Timer Pro</title>
                <meta name="description" content="Articles and guides on HIIT, meditation, and productivity." />
            </Head>
            <div className={styles.benefits}>
                <h1>Our Blog</h1>
                <p style={{ textAlign: 'center' }}>Tips, guides, and insights for your fitness and productivity goals.</p>
            </div>
            <ul className={styles.blogList}>
                {allPostsData.map(({ id, date, title, excerpt }) => (
                    <li key={id} className={styles.blogListItem}>
                        <Link href={`/blog/${id}`}>
                            <h2>{title}</h2>
                            <div className={styles.blogMeta}>
                                <span>By Online Timer Pro Team</span> | <span>{new Date(date).toLocaleDateString()}</span>
                            </div>
                            <p>{excerpt}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}